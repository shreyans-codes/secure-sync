package com.internevaluation.formfiller.Service;
import java.io.UnsupportedEncodingException;
import java.util.List;

import com.internevaluation.formfiller.Respository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.internevaluation.formfiller.Model.User;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Async
    public void sendFileCreationEmail(User user)
            throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = "internation@gmail.com"; // Update with your email address
        String senderName = "Internation Team"; // Update with your company name
        String subject = "Internation: File created from your account";

        String content = "<p><strong>Dear " + user.getEmail() + ",</strong></p>\r\n" + //
                "<p>A file was created from your account.</p>\r\n" + //
                "<p>This file will still need to be approved by the <strong>admin.</strong></p>\r\n" + //
                "<p><strong>If it wasn't created by you, contact <a title=\"internation.cyraacs+admin@gmail.com\" href=\"mailto:internation+admin@gmail.com\" target=\"_blank\"><em>internation+admin@gmail.com</em></a></strong></p>" +
                "</span></p>\n" +
                "<p>&nbsp;</p>\n" +
                "<p>&nbsp;</p>\n" +
                "<hr />\n" +
                "<p>&nbsp;</p>\n" +
                "<p>The Internation Team</p>\n" +
                "<p>CyRAACS,</p>\n" +
                "<p>Bangalore</p>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        helper.setText(content, true);

        mailSender.send(message);
    }

    @Async
    public void sendFileAcceptedEmail(User user, String fileName)
            throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = "internation@gmail.com";
        String senderName = "Internation Team";
        String subject = "Internation: File approved by the admin";

        String content = "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\"><strong>Dear " + user.getEmail() + ",</strong></span></p>\n" +
                "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\">Congratulations! Your file " + fileName + " has been approved by <strong>admin.&nbsp;</strong></span></p>\n" +
                "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\"><strong>For more information, contact <a title=\"internation.cyraacs+admin@gmail.com\" href=\"mailto:internation+admin@gmail.com\" target=\"_blank\"><em>internation+admin@gmail.com</em></a></strong></span></p>" +
                "</span></p>\n" +
                "<p>&nbsp;</p>\n" +
                "<p>&nbsp;</p>\n" +
                "<hr />\n" +
                "<p>&nbsp;</p>\n" +
                "<p>The Internation Team</p>\n" +
                "<p>CyRAACS,</p>\n" +
                "<p>Bangalore</p>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        helper.setText(content, true);

        mailSender.send(message);
    }

    @Async
    public void sendFileRejectedEmail(User user, String remarks, String fileName) throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = "internation@gmail.com";
        String senderName = "Internation Team";
        String subject = "Internation: File rejected by the admin";

        // Include the remarks in the email content
        String content = "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\"><strong>Dear " + user.getEmail() + ",</strong></span></p>\n" +
                "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\">Your file <strong>" + fileName + "</strong> has been <strong><span style=\"color: #ff0000;\">rejected</span> </strong>by <strong>admin.&nbsp;</strong></span></p>\n" +
                "<strong><span style=\"color: #008000;\">Remarks: </span></strong>" + remarks +
                "<p>&nbsp;</p>\n" +
                "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\">For more information, contact <em><a href=\"mailto:internation.cyraacs+admin@gmail.com\">internation+admin@gmail.com</a></em></span></p>\n" +
                "<p>&nbsp;</p>\n" +
                "<p><strong>Note:</strong> Your rejected file will be deleted in 7 days. Please download the file to your local system if needed.</p>\n" +
                "<p>&nbsp;</p>\n" +
                "<hr />\n" +
                "<p>&nbsp;</p>\n" +
                "<p>The Internation Team</p>\n" +
                "<p>CyRAACS,</p>\n" +
                "<p>Bangalore</p>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        helper.setText(content, true);

        mailSender.send(message);
    }


    @Async
    public void sendFileDeletedEmail(User user, String fileName)
            throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = "internation@gmail.com";
        String senderName = "Internation Team";
        String subject = "Internation: File deleted successfully";

        String content = "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\"><strong>Dear " + user.getEmail() + ",</strong></span></p>\n" +
                "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\">Your file <strong>" + fileName + "</strong> has been <strong><span style=\"color: #008000;\">deleted</span></strong> successfully.</span></p>\n" +
                "<p style=\"margin-left: 30px;\">&nbsp;</p>\n" +
                "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\"><strong>For more information, contact <em><a href=\"mailto:internation.cyraacs+admin@gmail.com\">internation+admin@gmail.com</a></em></strong></span></p>\n" +
                "<p>&nbsp;</p>\n" +
                "<p>&nbsp;</p>\n" +
                "<hr />\n" +
                "<p>&nbsp;</p>\n" +
                "<p>The Internation Team</p>\n" +
                "<p>CyRAACS,</p>\n" +
                "<p>Bangalore</p>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        helper.setText(content, true);

        mailSender.send(message);
    }

    @Async
    public void sendFileToSelectedUsers(List<String> emails, User user, byte[] file)
            throws MessagingException, UnsupportedEncodingException {
        String fromAddress = user.getEmail();
        String senderName = "Internation Team";
        String subject = "Internation: A file has been shared with you";

        String content = "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\"><strong>Dear Internation User,</strong></span></p>\n" +
                "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\"><strong>" + user.getEmail() + "&nbsp;</strong>has shared the attached file with you.</span></p>\n" +
                "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\">The file was generated using our application and shall be accessible to you.</span></p>\n" +
                "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\">For more information, kindly contact us at <a title=\"Send Mail\" href=\"mailto:internation.cyraacs+admin@gmail.com\" target=\"_blank\"><em><strong>internation+admin@gmail.com</strong></em></a>.</span></p>\n" +
                "<p>&nbsp;</p>\n" +
                "<hr />\n" +
                "<p>&nbsp;</p>\n" +
                "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\">The Internation Team,</span></p>\n" +
                "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\">CyRAACS</span></p>\n" +
                "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\">Bangalore</span></p>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);


        helper.setFrom(fromAddress, senderName);
        helper.setTo(emails.toArray(new String[0]));
        helper.setSubject(subject);

        helper.setText(content, true);

        InputStreamSource inputStreamSource = new ByteArrayResource(file);
        helper.addAttachment("Internation File.pdf", inputStreamSource);
        mailSender.send(message);
    }

    @Async
    public void sendStatisticsUpdate(String toAddress, String subject, String content)
            throws MessagingException, UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        String fromAddress = "internation@gmail.com";
        String senderName = "Internation Team";

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);
        helper.setText(content, true);

        mailSender.send(message);
    }


    @Async
    public void sendPasswordResetEmail(User user, String resetLink)
            throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = "internation@gmail.com";
        String senderName = "Internation Team";
        String subject = "Internation: Password Reset";

        String content = "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\"><strong>Dear " + user.getEmail() + ",</strong></span></p>\n" +
                "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\">You have requested to reset your password. Click the link below to reset it:</span></p>\n" +
                "<p><a href=\"" + resetLink + "\">Reset Password</a></p>\n" +
                "<p style=\"margin-left: 30px;\">&nbsp;</p>\n" +
                "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\"><strong>If you did not request a password reset, please ignore this email.</strong></span></p>\n" +
                "<p style=\"margin-left: 30px;\">&nbsp;</p>\n" +
                "<p><span style=\"font-family: helvetica, arial, sans-serif; font-size: medium;\"><strong>For more information, contact <em><a href=\"mailto:internation.cyraacs+admin@gmail.com\">internation+admin@gmail.com</a></em></strong></span></p>\n" +
                "<p>&nbsp;</p>\n" +
                "<p>&nbsp;</p>\n" +
                "<hr />\n" +
                "<p>&nbsp;</p>\n" +
                "<p>The Internation Team</p>\n" +
                "<p>CyRAACS,</p>\n" +
                "<p>Bangalore</p>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        helper.setText(content, true);

        mailSender.send(message);
    }


}
