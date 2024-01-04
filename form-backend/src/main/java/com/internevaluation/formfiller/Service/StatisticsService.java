package com.internevaluation.formfiller.Service;

import com.internevaluation.formfiller.Model.StatisticsDTO;
import com.internevaluation.formfiller.Model.StatisticsEntity;
import com.internevaluation.formfiller.Respository.FileDataRepository;
import com.internevaluation.formfiller.Respository.StatisticsRepository;
import com.internevaluation.formfiller.Respository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class StatisticsService {

    private final StatisticsRepository statisticsRepository;
    private final UserRepository userRepository;
    private final FileDataRepository fileDataRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    public StatisticsService(StatisticsRepository statisticsRepository, UserRepository userRepository, FileDataRepository fileDataRepository) {
        this.statisticsRepository = statisticsRepository;
        this.userRepository = userRepository;
        this.fileDataRepository = fileDataRepository;
    }

    public StatisticsEntity updateCounts() {
        try {// Count users
            long noUsers = userRepository.count();

            // Count files
            long noFiles = fileDataRepository.countExistingFiles();

            // Count approved files
            long noApproved = fileDataRepository.countByStatusApproved();

            // Count pending files
            long noPending = fileDataRepository.countByStatusPending();

            // Count rejected files
            long noRejected = fileDataRepository.countByStatusRejected();


            StatisticsEntity statisticsEntity = statisticsRepository.findById(1L).orElse(new StatisticsEntity());

            statisticsEntity.setNoUsers(noUsers);
            statisticsEntity.setNoFiles(noFiles);
            statisticsEntity.setNoApproved(noApproved);
            statisticsEntity.setNoPending(noPending);
            statisticsEntity.setNoRejected(noRejected);

            // Save or update the entity in the database
            statisticsRepository.save(statisticsEntity);
            StatisticsEntity updatedEntity = statisticsRepository.save(statisticsEntity);

            return updatedEntity;
        }
        catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            throw new RuntimeException("Error updating counts: " + e.getMessage());
        }
    }

    @Scheduled(fixedRate = 300000) // 5 minutes in milliseconds
    public void sendStatisticsEmail() {
        try {
            StatisticsEntity updatedEntity = updateCounts();

            // Create the content for the email
            String content = buildStatisticsEmailContent(updatedEntity);

            // Send email to admin
            emailService.sendStatisticsUpdate("internation.cyraacs+admin@gmail.com", "Statistics Update", content);
        } catch (Exception e) {
            System.err.println("Error occurred while sending statistics email: " + e.getMessage());

        }
    }

    private String buildStatisticsEmailContent(StatisticsEntity statisticsEntity) {
        StringBuilder content = new StringBuilder();

        content.append("<p><strong>Statistics Update</strong></p>");
        content.append("<p>Number of Users: ").append(statisticsEntity.getNoUsers()).append("</p>");
        content.append("<p>Number of Files: ").append(statisticsEntity.getNoFiles()).append("</p>");
        content.append("<p>Number of Approved Files: ").append(statisticsEntity.getNoApproved()).append("</p>");
        content.append("<p>Number of Pending Files: ").append(statisticsEntity.getNoPending()).append("</p>");
        content.append("<p>Number of Rejected Files: ").append(statisticsEntity.getNoRejected()).append("</p>");

        // Add any additional statistics as needed

        content.append("<hr />");
        content.append("<p>Thank you,</p>");
        content.append("<p>The Internation Team</p>");
        content.append("<p>CyRAACS, Bangalore</p>");

        return content.toString();
    }

}
