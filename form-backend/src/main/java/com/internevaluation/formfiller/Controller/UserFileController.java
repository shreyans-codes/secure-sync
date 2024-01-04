package com.internevaluation.formfiller.Controller;

import com.internevaluation.formfiller.Model.*;
import com.internevaluation.formfiller.Service.EmailService;
import com.internevaluation.formfiller.Service.StorageService;
import com.internevaluation.formfiller.Service.UserService;
import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;

import java.io.File;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/files")
@CrossOrigin("*")
public class UserFileController {


    private static final Logger logError = LoggerFactory.getLogger(AuthenticationController.class);


    @Autowired
    private StorageService storageService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;


    /**
     * API Endpoint: POST /upload/{userId}
     * Description: Uploads a file to the file system associated with a specific user.
     *
     * @param file   The file to be uploaded. Sent as a multipart form data parameter named "file".
     * @param userId The unique identifier of the user to whom the file is associated.
     * @return ResponseEntity<?>   HTTP response with the result of the file upload operation.
     * - HttpStatus.OK (200) if the file is successfully uploaded.
     * - HttpStatus.INTERNAL_SERVER_ERROR (500) if an unexpected error occurs.
     */
    @PostMapping("/upload/{userId}")
    public ResponseEntity<?> uploadFileToFIleSystem(@RequestParam("file") MultipartFile file, @RequestParam(name="artefactFile", required = false) MultipartFile artefactFile, @PathVariable("userId") String userId) {
        try {
            // Retrieve user information based on the provided userId
            User ownerUser = userService.readUserById(userId);

            // Send an email notification about the file creation to the user
            emailService.sendFileCreationEmail(ownerUser);
            String uploadFile;

            // Upload the file to the file system and get the result
            if (artefactFile == null || artefactFile.isEmpty())
                uploadFile = storageService.uploadFileToFileSystem(file, userId, null);
            else {
                uploadFile = storageService.uploadFileToFileSystem(file, userId, artefactFile);
            }

            // Return a successful response with the result of the file upload
            return ResponseEntity.status(HttpStatus.OK)
                    .body(uploadFile);
        } catch (IOException e) {
            // Handle exceptions related to file upload
            // Log the error and return an internal server error response with a specific error message
            logError.error("An error occurred during file upload for userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading the file. Please try again.");
        } catch (MessagingException e) {
            // Handle exceptions related to email notification
            // Log the error and return an internal server error response with a specific error message
            logError.error("Error sending file creation email notification for userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error sending email notification. Please try again.");
        } catch (Exception e) {
            // Handle other unexpected exceptions
            // Log the error and return an internal server error response with a generic error message
            logError.error("An unexpected error occurred during file upload for userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred during file upload.");
        }
    }


    @GetMapping(value = "/downloadFile/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        try {
            // Download the file bytes from the file system based on the provided fileId
            byte[] fileBytes = storageService.downloadFileFromFileSystem(fileId);
            FileData fileData = storageService.getFileDetails(fileId);

            if (fileBytes != null) {
                // Create a ByteArrayResource to represent the file
                ByteArrayResource resource = new ByteArrayResource(fileBytes);

                // Return a successful response with the file as a downloadable resource
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + fileData.getFileName())
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .contentLength(fileBytes.length)
                        .body(resource);
            } else {
                // Return a not found response if the file is not available
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            // Handle exceptions related to file download
            // Log the error and return an internal server error response with a specific error message
            logError.error("An error occurred while downloading the file for fileId: {}", fileId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ByteArrayResource("An unexpected error occurred while downloading the file.".getBytes()));
        } catch (Exception e) {
            // Handle other unexpected exceptions
            // Log the error and return an internal server error response with a generic error message
            logError.error("An unexpected error occurred during file download for fileId: {}", fileId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ByteArrayResource("An unexpected error occurred.".getBytes()));
        }
    }

    @GetMapping(value = "/downloadArtefact/{artefactId}")
    public ResponseEntity<Resource> downloadArtefact(@PathVariable Long artefactId) {
        try {
            // Download the file bytes from the file system based on the provided artefactId
            byte[] fileBytes = storageService.downloadArtefactFromFileSystem(artefactId);

            if (fileBytes != null) {
                // Create a ByteArrayResource to represent the file
                ByteArrayResource resource = new ByteArrayResource(fileBytes);

                // Return a successful response with the file as a downloadable resource
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + "artefact.ext")
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .contentLength(fileBytes.length)
                        .body(resource);
            } else {
                // Return a not found response if the file is not available
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            // Handle exceptions related to file download
            // Log the error and return an internal server error response with a specific error message
            logError.error("An error occurred while downloading the file for artefactId: {}", artefactId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ByteArrayResource("An unexpected error occurred while downloading the file.".getBytes()));
        } catch (Exception e) {
            // Handle other unexpected exceptions
            // Log the error and return an internal server error response with a generic error message
            logError.error("An unexpected error occurred during file download for artefactId: {}", artefactId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ByteArrayResource("An unexpected error occurred.".getBytes()));
        }
    }


    @GetMapping("/fetch/{userId}")
    public ResponseEntity<List<FileResponseDTO>> getAllFilesOfUser(@PathVariable("userId") String userId) {
        try {
            // Retrieve the list of file details for the provided userId
            List<FileResponseDTO> fileDetailsList = storageService.getAllFilesOfUser(userId);

            if (!fileDetailsList.isEmpty()) {
                // Return a successful response with the list of file details
                return ResponseEntity.ok(fileDetailsList);
            } else {
                // Return a not found response if there are no files for the user
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            // Handle unexpected exceptions
            // Log the error and return an internal server error response with an empty list
            logError.error("An unexpected error occurred while fetching files for userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }


    @GetMapping("/notVerified")
    public ResponseEntity<List<FileData>> getAllNotVerifiedFiles() {
        try {
            // Retrieve the list of not verified files
            List<FileData> notVerifiedFiles = storageService.getAllNotVerified();

            if (!notVerifiedFiles.isEmpty()) {
                // Return a successful response with the list of not verified files
                return ResponseEntity.ok(notVerifiedFiles);
            } else {
                // Return a no content response if there are no not verified files
                return ResponseEntity.noContent().build();
            }
        } catch (Exception e) {
            // Handle unexpected exceptions
            // Log the error and return an internal server error response with an empty list
            logError.error("An unexpected error occurred while fetching not verified files", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }


    @GetMapping("/pendingFiles")
    public ResponseEntity<List<FileData>> getAllPendingFiles() {
        try {
            // Retrieve the list of pending files
            List<FileData> pendingFiles = storageService.getAllPendingFiles();

            if (!pendingFiles.isEmpty()) {
                // Return a successful response with the list of pending files
                return ResponseEntity.ok(pendingFiles);
            } else {
                // Return a no content response if there are no pending files
                return ResponseEntity.noContent().build();
            }
        } catch (Exception e) {
            // Handle unexpected exceptions
            // Log the error and return an internal server error response with an empty list
            logError.error("An unexpected error occurred while fetching pending files", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }


    @PostMapping("/approve/{fileId}")
    public ResponseEntity<String> approveFile(@PathVariable("fileId") Long fileId) {
        try {
            // Verify and approve the file based on the provided fileId
            String result = storageService.verifyFile(fileId);

            if (result != null && !result.isEmpty()) {
                // Return a successful response with the result of file approval
                return ResponseEntity.ok(result);
            } else {
                // Return an internal server error response with a specific error message if the result is empty
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("An unexpected error occurred while approving the file.");
            }
        } catch (Exception e) {
            // Handle unexpected exceptions
            // Log the error and return an internal server error response with a specific error message
            logError.error("An unexpected error occurred while approving the file for fileId: {}", fileId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while approving the file.");
        }
    }


    @PostMapping("/reject/{fileId}")
    public ResponseEntity<String> rejectFile(@PathVariable("fileId") Long fileId, @RequestBody (required = false) String remarks) {
        try {
            // Reject the file based on the provided fileId
            String response = storageService.rejectFile(fileId, remarks);

            if (response != null && !response.isEmpty()) {
                // Return a successful response with the result of file rejection
                return ResponseEntity.ok(response);
            } else {
                // Return an internal server error response with a specific error message if the result is empty
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("An unexpected error occurred while rejecting the file.");
            }
        } catch (Exception e) {
            // Handle unexpected exceptions
            // Log the error and return an internal server error response with a specific error message
            logError.error("An unexpected error occurred while rejecting the file for fileId: {}", fileId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while rejecting the file.");
        }
    }


    @DeleteMapping("/delete/{fileId}")
    public ResponseEntity<String> deleteFile(@PathVariable("fileId") Long fileId) {
        try {

            String response = storageService.deleteFile(fileId);

            if (response != null && !response.isEmpty()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("An unexpected error occurred while deleting the file.");
            }
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred while deleting the file.");
        }
    }

    @PostMapping("/sendMailToSelectedUsers/{userId}")
    public ResponseEntity<?> sendMailToSelectedUsers(@PathVariable("userId") String userId, @RequestBody EmailRequestDTO emails) {
        try {
            // Extract recipient emails from the request
            List<String> recipientEmails = emails.getRecipientEmails();

            // Retrieve sender user information based on the provided userId
            User senderUser = userService.readUserById(userId);

            // Download the file from the file system based on the provided fileId
            byte[] fileToSend = storageService.downloadFileFromFileSystem(emails.getFileId());

            // Send the file to selected users via email
            emailService.sendFileToSelectedUsers(recipientEmails, senderUser, fileToSend);

            // Return a successful response if the email sending is successful
            return ResponseEntity.ok("File sent successfully");
        } catch (MessagingException | IOException e) {
            // Handle exceptions related to email sending or file downloading
            // Log the error and return an internal server error response with a specific error message
            logError.error("An unexpected error occurred during file sending to selected users", e);
            return ResponseEntity.internalServerError().body("Could not perform the operation");
        }
    }


    @PostMapping("/uploadToDropBox/{fileId}")
    public ResponseEntity<String> handleFileUpload(@PathVariable("fileId") Long fileId) {
        try {
            // Retrieve the file based on the provided fileId
            File receivedFile = storageService.getFileFromFileId(fileId);

            // Upload the file to Dropbox
            storageService.uploadToDropBox(receivedFile);

            // Return a successful response if the file upload to Dropbox is successful
            return ResponseEntity.ok("File uploaded successfully");
        } catch (Exception e) {
            // Handle unexpected exceptions
            // Log the error and return an internal server error response with a specific error message
            logError.error("An unexpected error occurred during file upload to Dropbox for fileId: {}", fileId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file");
        }
    }


}
