package com.internevaluation.formfiller.Model;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUserRequest {
    private String email;
    private String password;
    private Role role;
    private boolean mfaEnabled;
}
