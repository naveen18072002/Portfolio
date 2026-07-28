package com.portfolio.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otpCode) {
        System.out.println("==========================================");
        System.out.println("[OTP GENERATED] Target Email: " + toEmail + " | Verification Code: " + otpCode);
        System.out.println("==========================================");

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject("Portfolio Admin Password Reset OTP");
                message.setText("Hello Admin,\n\nYour 6-digit password reset verification code is:\n\n"
                        + otpCode + "\n\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.");
                mailSender.send(message);
                System.out.println("OTP email dispatched successfully via SMTP to: " + toEmail);
            } catch (Exception e) {
                System.err.println("Could not send email via SMTP: " + e.getMessage());
                if (e.getCause() != null) {
                    System.err.println("Root Cause: " + e.getCause().getMessage());
                }
            }
        }
    }

    public void sendContactNotificationEmail(String adminEmail, String senderName, String senderEmail, String contactMessage) {
        System.out.println("==========================================");
        System.out.println("[NEW CONTACT MESSAGE RECEIVED]");
        System.out.println("From: " + senderName + " <" + senderEmail + ">");
        System.out.println("Message: " + contactMessage);
        System.out.println("==========================================");

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(adminEmail);
                message.setSubject("New Portfolio Contact Message from " + senderName);
                message.setText("Hello Admin,\n\nYou have received a new contact message on your portfolio:\n\n"
                        + "Name: " + senderName + "\n"
                        + "Email: " + senderEmail + "\n"
                        + "Message:\n" + contactMessage + "\n\n"
                        + "This message has also been saved to your database.");
                mailSender.send(message);
                System.out.println("Contact notification email sent successfully to admin: " + adminEmail);
            } catch (Exception e) {
                System.err.println("Could not send contact notification email via SMTP: " + e.getMessage());
            }
        }
    }
}
