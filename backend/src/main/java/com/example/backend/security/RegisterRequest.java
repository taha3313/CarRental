package com.example.backend.security;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    // Getters and setters
    private String username;
    private String password;
    private String role;


}
