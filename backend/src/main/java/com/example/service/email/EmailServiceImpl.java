package com.example.service.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    // Temporary storage for OTPs: email -> OtpData
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    private static class OtpData {
        String otp;
        long expiryTime;

        OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }

    @Override
    public void sendOtpEmail(String toEmail) throws MessagingException {
        // Generate random 6-digit OTP
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        // 5-minute expiration (300,000 ms)
        long expiryTime = System.currentTimeMillis() + (5 * 60 * 1000);
        otpStorage.put(toEmail, new OtpData(otp, expiryTime));

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String subject = "Your Account Verification Code (OTP)";
        String htmlContent = """
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 500px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #0f172a; margin-top: 0;">Verify Your Account</h2>
                <p>Use the verification code below to complete your registration:</p>
                <div style="background-color: #f1f5f9; padding: 14px; text-align: center; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #0f172a;">
                    %s
                </div>
                <p style="font-size: 13px; color: #64748b; margin-top: 16px;">This code will expire in 5 minutes. If you did not request this code, please ignore this email.</p>
            </div>
            """.formatted(otp);

        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        helper.setTo(toEmail);

        javaMailSender.send(mimeMessage);
    }

    @Override
    public boolean verifyOtp(String email, String enteredOtp) {
        OtpData data = otpStorage.get(email);
        if (data == null) {
            return false;
        }
        // Check expiration
        if (System.currentTimeMillis() > data.expiryTime) {
            otpStorage.remove(email);
            return false;
        }
        // Check code match
        if (data.otp.equals(enteredOtp)) {
            otpStorage.remove(email); // Invalidate once verified
            return true;
        }
        return false;
    }

    @Override
    public void sendProjectInvitationEmail(
            String toEmail,
            String ownerName,
            String projectName,
            String description,
            String link
    ) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String subject = "Invitation to join project: " + projectName;

        String htmlContent = """
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <p>You've been invited to join a project owned by <strong>%s</strong>.</p>
                <p><strong>Project name:</strong> %s</p>
                <p><strong>Description:</strong> %s</p>
                <p>
                    <a href="%s" style="display: inline-block; padding: 10px 18px; color: #ffffff; background-color: #dc2626; text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Click here to join the project
                    </a>
                </p>
                <p style="font-size: 12px; color: #777;">Or copy and paste this link in your browser:<br/>%s</p>
            </div>
            """.formatted(
                ownerName != null ? ownerName : "Project Owner",
                projectName != null ? projectName : "Untitled Project",
                description != null ? description : "No description provided",
                link,
                link
        );

        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        helper.setTo(toEmail);

        javaMailSender.send(mimeMessage);
    }

    @Override
    public void sendIssueFileSubmission(
            String toEmail,
            String senderName,
            String issueTitle,
            String message,
            MultipartFile file
    ) throws Exception {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject("Task Submission: " + issueTitle);

        String htmlBody = String.format(
                "<div style='font-family: Arial, sans-serif; line-height: 1.6;'>"
                        + "<h3>Task Submission Update</h3>"
                        + "<p><strong>%s</strong> has sent you a file submission for task: <strong>%s</strong>.</p>"
                        + "<blockquote style='background: #f9f9f9; padding: 10px; border-left: 3px solid #3b82f6;'>%s</blockquote>"
                        + "<p>The submitted file is attached to this email.</p>"
                        + "</div>",
                senderName,
                issueTitle,
                (message != null && !message.isBlank()) ? message : "No notes provided."
        );

        helper.setText(htmlBody, true);

        if (file != null && !file.isEmpty()) {
            String originalFilename = file.getOriginalFilename();
            String attachmentFilename = (originalFilename != null && !originalFilename.isBlank())
                    ? originalFilename
                    : "submission_file";

            ByteArrayResource resource = new ByteArrayResource(file.getBytes());
            helper.addAttachment(attachmentFilename, resource);
        }

        javaMailSender.send(mimeMessage);
    }
}