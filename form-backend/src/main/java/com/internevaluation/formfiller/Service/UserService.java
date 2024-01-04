package com.internevaluation.formfiller.Service;

import com.internevaluation.formfiller.Model.User;
import com.internevaluation.formfiller.Respository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Value("${frontend.url}")
    private String frontendUrl;


    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User readUserByUsername (String email) {
        return userRepository.findByEmail(email).orElseThrow(EntityNotFoundException::new);
    }

    public User readUserById (String id) {
        return userRepository.findByUserId(id).orElseThrow(EntityNotFoundException::new);
    }

    public void createUser(User user) {
//        User newUser = new User();
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if(existingUser.isPresent())
        {
            throw new RuntimeException("User already registered. Please use different username.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Username not found!"));
    }

    public void generatePasswordResetTokenAndSendEmail(User user) {
        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusHours(1); // Set the expiration time (e.g., 1 hour from now)

        user.setResetToken(token);
        user.setResetTokenExpiry(expiry);
        userRepository.save(user);

        String resetLink = frontendUrl+ "/reset-password?token=" + token; // Replace with your actual reset endpoint

        try {
            emailService.sendPasswordResetEmail(user, resetLink);
        } catch (MessagingException | UnsupportedEncodingException e) {
            // Handle email sending exceptions without printing the stack trace
            // Log the exception or take appropriate action based on your application's needs
            System.err.println("Error sending password reset email: " + e.getMessage());
        }
    }


    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOptional = userRepository.findByResetTokenAndResetTokenExpiryAfter(token, LocalDateTime.now());

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Reset the password and clear the reset token
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setResetTokenExpiry(null);

            userRepository.save(user);
            return true;
        }

        return false;
    }

}




