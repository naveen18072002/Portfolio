package com.portfolio.server.service;

import com.portfolio.server.dto.*;
import com.portfolio.server.entity.PasswordResetOtp;
import com.portfolio.server.entity.User;
import com.portfolio.server.repository.PasswordResetOtpRepository;
import com.portfolio.server.repository.UserRepository;
import com.portfolio.server.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetOtpRepository otpRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByUsernameOrEmail(loginRequest.getUsername(), loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new LoginResponse(jwt, user.getUsername(), user.getEmail(), user.getRole());
    }

    public ApiResponse sendOtp(SendOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No admin user found with email: " + email));

        String otpCode = String.format("%06d", new SecureRandom().nextInt(900000) + 100000);
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);

        PasswordResetOtp otp = new PasswordResetOtp(email, otpCode, expiry);
        otpRepository.save(otp);

        emailService.sendOtpEmail(email, otpCode);

        return new ApiResponse(true, "Verification OTP code has been sent to " + email);
    }

    public ApiResponse verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String code = request.getOtpCode().trim();

        PasswordResetOtp otp = otpRepository.findTopByEmailAndOtpCodeOrderByCreatedAtDesc(email, code)
                .orElseThrow(() -> new RuntimeException("Invalid OTP code. Please check and try again."));

        if (otp.isExpired()) {
            throw new RuntimeException("OTP code has expired. Please request a new verification code.");
        }

        otp.setVerified(true);
        otpRepository.save(otp);

        return new ApiResponse(true, "OTP code verified successfully. You can now reset your password.");
    }

    public ApiResponse resetPassword(ResetPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New password and confirm password do not match.");
        }

        PasswordResetOtp otp = otpRepository.findTopByEmailAndVerifiedTrueOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new RuntimeException("Please verify your OTP code before resetting password."));

        if (otp.isExpired()) {
            throw new RuntimeException("OTP verification session expired. Please restart the process.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        otpRepository.deleteByEmail(email);

        return new ApiResponse(true, "Password reset successfully! You can now login with your new credentials.");
    }
}
