package com.portfolio.server.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otpCode) {
        log.info("[OTP GENERATED] Target Email: {} | Verification Code: {}", toEmail, otpCode);

        if (!isMailSenderAvailable()) {
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Portfolio Admin Password Reset OTP");
            message.setText("Hello Admin,\n\nYour 6-digit password reset verification code is:\n\n"
                    + otpCode + "\n\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.");
            mailSender.send(message);
            log.info("OTP email dispatched successfully via SMTP to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email via SMTP to: {}. Reason: {}", toEmail, e.getMessage(), e);
            logRootCause(e);
        }
    }

    public void sendContactNotificationEmail(String adminEmail, String senderName, String senderEmail, String senderMobile, String contactMessage) {
        log.info("[NEW CONTACT MESSAGE RECEIVED] From: {} <{}> | Mobile: {} | Message: {}", senderName, senderEmail, senderMobile, contactMessage);

        if (!isMailSenderAvailable()) {
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(adminEmail);
            message.setSubject("New Portfolio Contact Message from " + senderName);
            message.setText("Hello Admin,\n\nYou have received a new contact message on your portfolio:\n\n"
                    + "Name: " + senderName + "\n"
                    + "Email: " + senderEmail + "\n"
                    + "Mobile: " + (senderMobile != null && !senderMobile.isBlank() ? senderMobile : "Not provided") + "\n"
                    + "Message:\n" + contactMessage + "\n\n"
                    + "This message has also been saved to your database.");
            mailSender.send(message);
            log.info("Contact notification email sent successfully to admin: {}", adminEmail);
        } catch (Exception e) {
            log.error("Failed to send contact notification email via SMTP to admin: {}. Reason: {}", adminEmail, e.getMessage(), e);
            logRootCause(e);
        }
    }

    public void sendReplyEmail(String toEmail, String recipientName, String replyBody, String originalMessage) {
        log.info("[REPLY SENT FROM DASHBOARD] To: {} <{}>", recipientName, toEmail);

        if (!isMailSenderAvailable()) {
            return;
        }

        try {
            String recipient = recipientName != null && !recipientName.isBlank() ? recipientName : "there";
            String trimmedReply = replyBody != null ? replyBody.trim() : "";

            // Only prepend our own greeting if the reply doesn't already start with one
            String lower = trimmedReply.toLowerCase();
            boolean hasOwnGreeting = lower.startsWith("hi") || lower.startsWith("hello") || lower.startsWith("hey");
            String bodyContent = hasOwnGreeting
                    ? trimmedReply
                    : "Hi " + recipient + ",\n\n" + trimmedReply;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Re: Your message on the Portfolio Website");
            message.setText(bodyContent + "\n\n"
                    + "----------------------------------------\n"
                    + "In response to your message:\n\n" + originalMessage + "\n"
                    + "----------------------------------------\n\n"
                    + "Best regards.");
            mailSender.send(message);
            log.info("Reply email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send reply email via SMTP to: {}. Reason: {}", toEmail, e.getMessage(), e);
            logRootCause(e);
        }
    }

    private boolean isMailSenderAvailable() {
        if (mailSender == null) {
            log.error("JavaMailSender bean is NOT available - email skipped entirely. "
                    + "Check that MAIL_USERNAME and MAIL_PASSWORD environment variables are set and valid.");
            return false;
        }
        return true;
    }

    private void logRootCause(Throwable e) {
        Throwable root = e;
        while (root.getCause() != null && root.getCause() != root) {
            root = root.getCause();
        }
        if (root != e) {
            log.error("Mail failure root cause [{}]: {}", root.getClass().getName(), root.getMessage());
        }
    }
}
