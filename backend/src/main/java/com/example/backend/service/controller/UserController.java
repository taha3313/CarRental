package com.example.backend.service.controller;


import com.example.backend.persistence.dao.UserRepository;
import com.example.backend.persistence.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/admins")
    public List<User> getAllUsers() {
        return userRepository.findAll(); // Fetch all users from the database
    }
}
