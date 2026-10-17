package com.example.request;

import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String fullName;
    private String password;
    private String otp;
}