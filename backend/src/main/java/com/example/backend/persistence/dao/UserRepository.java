package com.example.backend.persistence.dao;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.persistence.entities.User;


import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}

