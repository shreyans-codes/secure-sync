package com.internevaluation.formfiller.Model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VerificationRequest {
    private String email;
    private String password;
    private String code;
}
