package com.internevaluation.formfiller.Service;

import com.internevaluation.formfiller.Controller.AuthenticationController;
import com.internevaluation.formfiller.Model.*;
import com.internevaluation.formfiller.Respository.RoleRepository;
import com.internevaluation.formfiller.Respository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.management.relation.RoleNotFoundException;
import java.io.UnsupportedEncodingException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthenticationService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final MFAAuthenticationService mfaAuthenticationService;
    private final TokenService tokenService;

    private static final Logger logError = LoggerFactory.getLogger(AuthenticationController.class);


    @Autowired
    private JavaMailSender mailSender;

    public AuthenticationService(UserRepository userRepository, RoleRepository roleRepository,
            PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
            MFAAuthenticationService mfaAuthenticationService, TokenService tokenService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.mfaAuthenticationService = mfaAuthenticationService;
        this.tokenService = tokenService;
    }

    public RegisterResponseDTO registerUser(RegisterUserRequest user, String siteURL)
            throws RoleNotFoundException, MessagingException, UnsupportedEncodingException {
        User newUser = new User();
        RegisterResponseDTO responseDTO = new RegisterResponseDTO();
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        Role userRole = roleRepository.findByAuthority("USER")
                .orElseThrow(() -> new RoleNotFoundException("Role not found"));
        Set<Role> roleSet = new HashSet<>();
        roleSet.add(userRole);
        newUser.setPassword(encodedPassword);
        newUser.setAuthorities(roleSet);
        newUser.setEmail(user.getEmail());
        newUser.setMfaEnabled(user.isMfaEnabled());

        // Add email verification logic
        String randomCode = UUID.randomUUID().toString();
        newUser.setVerificationCode(randomCode);
        newUser.setEnabled(false);

        if (user.isMfaEnabled()) {
            newUser.setSecret(mfaAuthenticationService.generateNewSecret());
            responseDTO.setSecretImageUri(mfaAuthenticationService.generateQrCodeImageUri(newUser.getSecret()));
        }

        userRepository.save(newUser);

        // Send verification email
        sendVerificationEmail(newUser, siteURL);

        responseDTO.setUser(newUser);
        return responseDTO;
    }

    @Async
    public void sendVerificationEmail(User user, String siteURL)
            throws MessagingException, UnsupportedEncodingException {
        String toAddress = user.getEmail();
        String fromAddress = "internation@gmail.com"; // Update with your email address
        String senderName = "Internation"; // Update with your company name
        String subject = "Please verify your registration";

        // Construct the verification link with the generated random code
        String verifyURL = siteURL + "/api/auth/verify-email?code=" + user.getVerificationCode();

        String content = "Dear " + user.getEmail() + ",<br>"
                + "Please click the link below to verify your registration:<br>"
                + "<h3><a href=\"" + verifyURL + "\" target=\"_self\">VERIFY</a></h3>"
                + "Thank you,<br>"
                + senderName + ".";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        helper.setFrom(fromAddress, senderName);
        helper.setTo(toAddress);
        helper.setSubject(subject);

        helper.setText(content, true);

        mailSender.send(message);
    }

    public boolean verifyUser(String verificationCode) {
        // Retrieve the user by verification code from the database
        Optional<User> optionalUser = userRepository.findByVerificationCode(verificationCode);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Perform your verification logic
            if (!user.isEnabled()) {
                // Update user status to enabled
                user.setEnabled(true);
                userRepository.save(user);
                return true;
            }
        }

        return false;
    }

    public ResponseEntity<LoginResponseDTO> loginUser(LoginRequestDTO user) {
        try {
            // Retrieve the user based on the provided email
            User receivedUser = userRepository.findByEmail(user.getEmail())
                    .orElseThrow(() -> new EntityNotFoundException(
                            String.format("No user found with %s", user.getEmail())));

            // Authenticate the user using the provided email and password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

            // Check if the user is enabled
            if (!receivedUser.isEnabled()) {
                throw new EntityNotFoundException("User not found or not verified");
            }

            // Generate JWT token
            String token = tokenService.generateJwt(authentication);

            // Return the login response with the user and token
            LoginResponseDTO loginResponseDTO = new LoginResponseDTO(receivedUser, token);
            return ResponseEntity.ok(loginResponseDTO);
        } catch (EntityNotFoundException e) {
            // Handle the case where no user is found or the user is not enabled
            // Log the error and throw an exception with a specific message
            logError.error("Error during user login for email: {}", user.getEmail(), e);
            throw new RuntimeException("User not found or not verified");
        } catch (AuthenticationException e) {
            // Handle authentication exceptions
            // Log the error and throw an exception with a specific message
            logError.error("Error during user authentication for email: {}", user.getEmail(), e);
            throw new RuntimeException("Authentication failed");
        }
    }

    public ResponseEntity<?> verifyCode(VerificationRequest verificationRequest) {
        System.out.println(verificationRequest);
        try {
            User user = userRepository
                    .findByEmail(verificationRequest.getEmail()).orElseThrow(() -> new EntityNotFoundException(
                            String.format("No user found with %S", verificationRequest.getEmail())));
            System.out.println(user);
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(verificationRequest.getEmail(),
                            verificationRequest.getPassword()));
            if (mfaAuthenticationService.isOtpNotValid(user.getSecret(), verificationRequest.getCode())) {
                throw new BadCredentialsException("Code is not correct");
            }
            String token = tokenService.generateJwt(authentication);
            return ResponseEntity.ok(new LoginResponseDTO(user, token));
        } catch (AuthenticationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email not verified");
        }
    }

    public List<User> getUsers(String userId) {
        List<User> userList = userRepository.findAll();
        // Filter out the user with the provided userId
        List<User> filteredUsers = userList.stream()
                .filter(user -> !user.getUserId().equals(userId))
                .toList();

        return filteredUsers;
    }
}
