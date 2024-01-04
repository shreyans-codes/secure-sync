package com.internevaluation.formfiller.Controller;

import com.internevaluation.formfiller.Exceptions.CaptchaValidationException;
import com.internevaluation.formfiller.Exceptions.UserAlreadyExistsException;
import com.internevaluation.formfiller.Model.*;
import com.internevaluation.formfiller.Respository.UserRepository;
import com.internevaluation.formfiller.Service.*;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthenticationController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logInfo = LoggerFactory.getLogger(AuthenticationController.class);

    private static final Logger logError = LoggerFactory.getLogger(AuthenticationController.class);


    private final AuthenticationService authenticationService;
    @Autowired
    private CaptchaValidator validator;


    @Value("${frontend.url}")
    private String frontendUrl;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterUserRequest user, HttpServletRequest request)
             {
        try {
            // Pass the siteURL to the register method
            String siteURL = frontendUrl;
            var response = authenticationService.registerUser(user, siteURL);

            if (user.isMfaEnabled())
                return ResponseEntity.ok(response);

            if (response != null && response.getUser().isAccountNonExpired()) {
                // Registration was successful
                String verifyMessage = "Registration successful. Please check your email and verify your account.";
                logInfo.info("Registration successful for user: {}", user.getEmail());
                return ResponseEntity.ok(verifyMessage);
            } else {
                // Handle the case where registration or email sending failed
                logError.error("Registration failed for user: {}", user.getEmail());
                return ResponseEntity.badRequest().body("Registration failed");
            }
        } catch (UserAlreadyExistsException e) {
            logInfo.error("User already exists for user: {}", user.getEmail());
            return ResponseEntity.badRequest().body("User already exists in the system");
        } catch (Exception e) {
            logError.error("An unexpected error occurred during registration for user: {}", user.getEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error during registration");
        }
    }




    @GetMapping("/verify-email")
    public RedirectView verifyEmail(@RequestParam("code") String verificationCode) {
        try {
            boolean isVerificationSuccessful = authenticationService.verifyUser(verificationCode);

            if (isVerificationSuccessful) {
                logInfo.info("Email verification successful for verificationCode: {}", verificationCode);
                return new RedirectView(frontendUrl + "/signin");
            } else {
                logInfo.error("Email verification failed for verificationCode: {}", verificationCode);
                return new RedirectView(frontendUrl + "/verification_failure");
            }
        } catch (Exception e) {
            logInfo.error("An unexpected error occurred during email verification for code: {}", verificationCode, e);
            return new RedirectView(frontendUrl + "/verification_error");
        }
    }


//    private String getSiteURL(HttpServletRequest request) {
//        String siteURL = request.getRequestURL().toString();
//        return siteURL.replace(request.getServletPath(), "");
//    }


    @PostMapping("/login")
    public LoginResponseDTO loginUser(@RequestBody LoginRequestDTO user, @RequestParam("g-recaptcha-response") String captcha) {
        try {
            // Validate ReCAPTCHA
            if (validator.isValid(captcha)) {
                logInfo.info("ReCAPTCHA validation successful for user: {}", user.getEmail());
                // Call the authentication service to perform the login
                ResponseEntity<LoginResponseDTO> responseEntity = authenticationService.loginUser(user);

                // Unwrap the LoginResponseDTO from the ResponseEntity
                return responseEntity.getBody();
            } else {
                // Log ReCAPTCHA validation failure and throw a CaptchaValidationException
                logError.error("ReCAPTCHA validation failed for user: {}", user.getEmail());
                throw new CaptchaValidationException("CAPTCHA validation failed");
            }
        } catch (CaptchaValidationException e) {
            // Handle CaptchaValidationException
            // Log the error and throw it to return a meaningful response to the client
            logError.error("CAPTCHA validation failed for user: {}", user.getEmail(), e);
            throw e;
        } catch (Exception e) {
            // Handle unexpected exceptions
            // Log the error and throw it to return a meaningful response to the client
            logError.error("An unexpected error occurred during login for user: {}", user.getEmail(), e);
            throw new RuntimeException("Unexpected error during login");
        }
    }





    @PostMapping("/verify")
    public ResponseEntity<?> verifyCode(@RequestBody VerificationRequest verificationRequest) {
        try {
            logInfo.info("Code verification successful for user: {}", verificationRequest.getEmail());
            return ResponseEntity.ok(authenticationService.verifyCode(verificationRequest));
        }  catch (Exception e) {
            logError.error("An unexpected error occurred during code verification for user: {}", verificationRequest.getEmail(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error during code verification");
        }
    }



    @GetMapping("/getUsers/{userId}")
    public ResponseEntity<?> getAllUsers(@PathVariable("userId") String userId) {
        try {
            List<User> userList = authenticationService.getUsers(userId);
            List<UserDTO> userDTOList = new ArrayList<>();
            userList.forEach(user -> {
                if (!Objects.equals(user.getEmail(), "internation.cyraacs+admin@gmail.com")) {
                    userDTOList.add(new UserDTO(user.getUserId(), user.getEmail()));
                }
            });
            return ResponseEntity.ok(userDTOList);
        } catch (Exception e) {
            logInfo.error("An unexpected error occurred while fetching user data for userId: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error while fetching user data");
        }
    }

    @PostMapping("/generate-token")
    public ResponseEntity<String> generatePasswordResetToken(@RequestParam("email") String email) {
        // Find the user by email
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            // User found, generate token and send email
            User user = userOptional.get();
            userService.generatePasswordResetTokenAndSendEmail(user);
            return ResponseEntity.ok("Password reset token sent successfully");
        } else {
            // User not found
            return ResponseEntity.badRequest().body("User not found with the provided email");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam("token") String token, @RequestParam("newPassword") String newPassword) {
        if (userService.resetPassword(token, newPassword)) {
            return ResponseEntity.ok("Password reset successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired reset token");
        }
    }



}
