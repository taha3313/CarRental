package com.example.backend.security;

import com.example.backend.persistence.entities.Customer;
import com.example.backend.persistence.entities.User;
import com.example.backend.persistence.dao.CustomerRepository;
import com.example.backend.persistence.dao.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // Existing method for loading user by username
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Find the user by username (or email)
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("User not found with username: " + username); // Debug log
                    return new UsernameNotFoundException("User not found with username: " + username);
                });

        // Return a UserDetails implementation
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))) // Add "ROLE_" prefix for roles
                .build();
    }

    // New method for loading customer by email
    public UserDetails loadCustomerByEmail(String email) throws UsernameNotFoundException {
        // Find the customer by email
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("Customer not found with email: " + email); // Debug log
                    return new UsernameNotFoundException("Customer not found with email: " + email);
                });

        // Return a UserDetails implementation for customer
        return org.springframework.security.core.userdetails.User.builder()
                .username(customer.getEmail())
                .password(customer.getPassword())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"))) // Add "ROLE_CUSTOMER" for customer roles
                .build();
    }
}
