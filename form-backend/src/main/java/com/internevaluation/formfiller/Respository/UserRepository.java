package com.internevaluation.formfiller.Respository;

import com.internevaluation.formfiller.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByUserId(String userId);

    Optional<User> findByEmail(String email);

    Optional<User> findByVerificationCode(String verificationCode);

    Optional<User> findByResetTokenAndResetTokenExpiryAfter(String resetToken, LocalDateTime resetTokenExpiry);
}

