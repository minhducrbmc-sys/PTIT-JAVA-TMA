package com.example.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor //Tự động sinh ra các hàm khởi tạo
public class AuthResponse {
    private String jwt;
    private String message;
}
