package com.internevaluation.formfiller.Service;


import com.dropbox.core.DbxException;
import com.dropbox.core.DbxRequestConfig;
import com.dropbox.core.v2.DbxClientV2;
import com.dropbox.core.v2.files.WriteMode;
import com.internevaluation.formfiller.Config.DropBoxConfig;
import com.internevaluation.formfiller.Controller.AuthenticationController;
import com.internevaluation.formfiller.Model.ArtefactFile;
import com.internevaluation.formfiller.Model.FileData;
import com.internevaluation.formfiller.Model.FileResponseDTO;
import com.internevaluation.formfiller.Model.User;
import com.internevaluation.formfiller.Respository.ArtefactRepository;
import com.internevaluation.formfiller.Respository.FileDataRepository;
import com.internevaluation.formfiller.Respository.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class StorageService {

    private static final Logger logError = LoggerFactory.getLogger(AuthenticationController.class);


    @Autowired
    private FileDataRepository fileDataRepository;
    @Autowired
    private ArtefactRepository artefactRepository;
    @Value("${directory.path}")
    private String directoryPath;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DropBoxConfig dropboxConfig;

    private EmailService emailService;

    public StorageService(EmailService emailService) {
        this.emailService = emailService;
    }

    public String uploadFileToFileSystem(MultipartFile file, String userId, MultipartFile artefactFile) throws IOException {

        User user = userRepository.findByUserId(userId).orElseThrow(() -> new RuntimeException("User not found"));
        final String FOLDER_PATH = String.format("C:/Users/%s/Desktop/MyFiles/", directoryPath);
        final String ARTEFACT_PATH = String.format("C:/Users/%s/Desktop/MyFiles/artefact/", directoryPath);

        String filePath = FOLDER_PATH + file.getOriginalFilename();
        FileData fileData;
        if (artefactFile != null) {
            String artefactPath = ARTEFACT_PATH + artefactFile.getOriginalFilename();
            ArtefactFile artefactData = ArtefactFile.builder()
                    .artefactPath(artefactPath).build();
            artefactData = artefactRepository.save(artefactData);
            artefactFile.transferTo(new File(artefactPath));
            fileData = FileData.builder()
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .user(user)
                    .filePath(filePath)
                    .hasArtefact(true)
                    .artefact(artefactData)
                    .build();
        } else {
            fileData = FileData.builder()
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .user(user)
                    .hasArtefact(false)
                    .artefact(null)
                    .filePath(filePath)
                    .build();

        }


        // Save file data to the database
        fileData = fileDataRepository.save(fileData);

        // Transfer the file to the file system
        file.transferTo(new File(filePath));

        if (fileData != null) {
            return "File uploaded successfully: " + filePath;
        }

        return null;
    }


    public byte[] downloadFileFromFileSystem(Long fileId) throws IOException {
        Optional<FileData> fileData = fileDataRepository.findById(fileId);

        if (fileData.isPresent()) {
            String filePath = fileData.get().getFilePath();
            return Files.readAllBytes(new File(filePath).toPath());
        }
        return null;
    }

    public byte[] downloadArtefactFromFileSystem(Long artefactId) throws IOException {
        Optional<ArtefactFile> artefactFile = artefactRepository.findById(artefactId);

        if (artefactFile.isPresent()) {
            String filePath = artefactFile.get().getArtefactPath();
            return Files.readAllBytes(new File(filePath).toPath());
        }
        return null;
    }

    public File getFileFromFileId(Long fileId) throws IOException {
        Optional<FileData> fileData = fileDataRepository.findById(fileId);
        if (fileData.isPresent()) {
            String filePath = fileData.get().getFilePath();
            Path path = Paths.get(filePath);
            return path.toFile();
        }
        return null;
    }

    public FileData getFileDetails(Long fileId) throws IOException {
        Optional<FileData> fileData = fileDataRepository.findById(fileId);
        return fileData.orElse(null);
    }


    public String verifyFile(Long fileId) {
        Optional<FileData> optionalFileData = fileDataRepository.findById(fileId);

        if (optionalFileData.isPresent()) {
            FileData fileData = optionalFileData.get();
            try {
                emailService.sendFileAcceptedEmail(fileData.getUser(), fileData.getFileName());
            } catch (MessagingException | UnsupportedEncodingException e) {
                throw new ResponseStatusException(HttpStatusCode.valueOf(404));
            }

            fileData.setStatus("Approved");
            fileData.setIsVerified(true);
            fileDataRepository.save(fileData);
            return "File verified successfully.";
        } else {
            return "File not found.";
        }
    }

    public String rejectFile(Long fileId, String remarks) {
        Optional<FileData> optionalFileData = fileDataRepository.findById(fileId);

        if (optionalFileData.isPresent()) {
            FileData fileData = optionalFileData.get();
            try {
                emailService.sendFileRejectedEmail(fileData.getUser(), remarks, fileData.getFileName());
            } catch (MessagingException | UnsupportedEncodingException e) {
                throw new ResponseStatusException(HttpStatusCode.valueOf(404));
            }

            // Update the file status to "rejected"
            fileData.setStatus("Rejected");
            fileData.setIsVerified(false);
            fileData.setRemarks(remarks);
            fileData.setRejectionDate(LocalDateTime.now());

            fileDataRepository.save(fileData);

            return "File rejected successfully.";

        } else {
            return "File not found.";
        }
    }


    public List<FileResponseDTO> getAllFilesOfUser(String userId) {
        List<FileData> allFiles = fileDataRepository.findByUserUserId(userId);
        return allFiles.stream()
                .filter(FileData::getIsExists) // Filter files where isExists is true
                .map(fileData -> new FileResponseDTO(fileData.getFileId(),fileData.getFileName(),fileData.getStatus(),fileData.getIsVerified(), fileData.getUser().getUserId(), fileData.getArtefact(), fileData.getRemarks()))
                .collect(Collectors.toList());
    }

    public List<FileData> getAllNotVerified() {
        List<FileData> notVerifiedFiles = fileDataRepository.findByIsVerifiedFalse();

        if (notVerifiedFiles == null || notVerifiedFiles.isEmpty()) {

            return Collections.emptyList();
        }

        return notVerifiedFiles;
    }

    public List<FileData> getAllPendingFiles() {
        List<FileData> pendingFiles = fileDataRepository.findByStatus("Pending");

        if (pendingFiles == null || pendingFiles.isEmpty()) {

            return Collections.emptyList();
        }

        return pendingFiles;
    }



    public String deleteFile(Long fileId) {
        Optional<FileData> optionalFileData = fileDataRepository.findById(fileId);

        if (optionalFileData.isPresent()) {
            FileData fileData = optionalFileData.get();

            // Delete the file from the file system
            if (deleteFileFromSystem(fileData.getFilePath())) {
                // Check for artifact and delete if present
                if (fileData.getArtefact() != null && fileData.getArtefact().getArtefactPath() != null) {
                    if (deleteArtefactFileFromSystem(fileData.getArtefact().getArtefactPath())) {
                        fileData.getArtefact().setArtefactPath(null);
                    } else {
                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting artifact file from the file system.");
                    }
                }
                // Update the entity in the database
                fileData.setFilePath(null);
                fileData.setIsExists(false);
                fileDataRepository.save(fileData);

                // Optionally, send an email after successful deletion
                try {
                    emailService.sendFileDeletedEmail(fileData.getUser(), fileData.getFileName());
                } catch (MessagingException | UnsupportedEncodingException e) {
                    // Log or handle the exception as needed
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error sending email");
                }

                return "File deleted successfully.";
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error deleting file from the file system.");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found.");
        }
    }


    private boolean deleteFileFromSystem(String filePath) {
        try {
            Files.delete(Paths.get(filePath));
            return true;
        } catch (IOException e) {
            // Log the exception
            logError.error("Error deleting file: " + filePath, e);
            return false;
        }
    }

    private boolean deleteArtefactFileFromSystem(String artefactPath) {
        try {
            Files.delete(Paths.get(artefactPath));
            return true;
        } catch (IOException e) {
            // Log the exception
            logError.error("Error deleting artefact: " + artefactPath, e);
            return false;
        }
    }

    // Scheduled executor service to run tasks periodically
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    @PostConstruct
    public void scheduleFileCleanup() {
        // Schedule the cleanup task to run every day
        scheduler.scheduleAtFixedRate(this::cleanupFiles, 0, 1, TimeUnit.DAYS);
    }

    private void cleanupFiles() {
        LocalDateTime sevenDaysAgo = LocalDateTime.from(Instant.now().minus(Duration.ofDays(7)));
        //Date oneDayAgo = Date.from(Instant.now().minus(Duration.ofDays(1)));
        //Date threeDaysAgo = Date.from(Instant.now().minus(Duration.ofDays(3)));


        //List<FileData> approvedFiles = fileDataRepository.findByStatusAndCreationDate("Approved", sevenDaysAgo);
        List<FileData> rejectedFiles = fileDataRepository.findByStatusAndRejectionDate("Rejected", sevenDaysAgo);
        //List<FileData> pendingFiles = fileDataRepository.findByStatusAndCreationDate("Pending", threeDaysAgo);

        //cleanupFilesByStatus(approvedFiles);
        cleanupFilesByStatus(rejectedFiles);
        //cleanupFilesByStatus(pendingFiles);
    }

    private void cleanupFilesByStatus(List<FileData> files) {
        for (FileData fileData : files) {
            deleteFile(fileData.getFileId());
        }
    }


    public void uploadToDropBox(File file) {
        String accessToken = dropboxConfig.getAccessToken();

        // Setting up Dropbox client
        DbxRequestConfig config = new DbxRequestConfig("spring-boot-dropbox-demo");
        DbxClientV2 client = new DbxClientV2(config, accessToken);

        // Upload the file
        try (InputStream inputStream = new FileInputStream(file)) {
            client.files().uploadBuilder("/apps/internation/" + file.getName())
                    .withMode(WriteMode.ADD)
                    .withAutorename(true)
                    .withClientModified(new java.util.Date())
                    .uploadAndFinish(inputStream);

            System.out.println("File uploaded successfully to Dropbox.");
        } catch (IOException e) {
            // Log the error
            logError.error("Error reading the file: " + e.getMessage(), e);
            // Handle or rethrow the exception as needed
            throw new RuntimeException("Error reading the file", e);
        } catch (DbxException e) {
            // Log the error
            logError.error("Error uploading file to Dropbox: " + e.getMessage(), e);
            // Handle or rethrow the exception as needed
            throw new RuntimeException("Error uploading file to Dropbox", e);
        }
    }


}
