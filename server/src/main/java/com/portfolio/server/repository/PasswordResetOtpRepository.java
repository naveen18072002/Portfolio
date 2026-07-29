package com.portfolio.server.repository;

import com.portfolio.server.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {

    Optional<PasswordResetOtp> findTopByEmailAndOtpCodeOrderByCreatedAtDesc(String email, String otpCode);

    Optional<PasswordResetOtp> findTopByEmailAndVerifiedTrueOrderByCreatedAtDesc(String email);

    List<PasswordResetOtp> findByEmail(String email);

    void deleteByEmail(String email);
}
