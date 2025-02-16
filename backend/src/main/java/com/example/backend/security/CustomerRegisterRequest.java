package com.example.backend.security;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerRegisterRequest {
    private String name;
    private String email;
    private String phoneNumber;
    private String password;
}

