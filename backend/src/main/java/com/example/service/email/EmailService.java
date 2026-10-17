package com.example.service.email;

import jakarta.mail.MessagingException;
import org.springframework.web.multipart.MultipartFile;

public interface EmailService {

    void sendProjectInvitationEmail(
            String toEmail,
            String ownerName,
            String projectName,
            String description,
            String link
    ) throws MessagingException;

    void sendIssueFileSubmission(
            String toEmail,
            String senderName,
            String issueTitle,
            String message,
            MultipartFile file
    ) throws Exception;

    void sendOtpEmail(String toEmail) throws MessagingException;

    boolean verifyOtp(String email, String enteredOtp);
}