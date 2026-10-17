package com.example.dto;

import java.time.Instant;

public class PendingUser {
    private String fullName;
    private String email;
    private String encodedPassword;
    private String otp;
    private Instant expiresAt;

    public PendingUser(String fullName, String email, String encodedPassword, String otp, Instant expiresAt) {
        this.fullName = fullName;
        this.email = email;
        this.encodedPassword = encodedPassword;
        this.otp = otp;
        this.expiresAt = expiresAt;
    }

    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getEncodedPassword() { return encodedPassword; }
    public String getOtp() { return otp; }
    public Instant getExpiresAt() { return expiresAt; }
}