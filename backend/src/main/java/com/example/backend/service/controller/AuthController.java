package com.example.backend.service.controller;

import com.example.backend.persistence.dao.CustomerRepository;
import com.example.backend.persistence.dto.JwtResponse;
import com.example.backend.persistence.entities.Customer;
import com.example.backend.persistence.entities.User;
import com.example.backend.security.CustomUserDetailsService;
import com.example.backend.security.CustomerRegisterRequest;
import com.example.backend.security.LoginRequest;
import com.example.backend.security.RegisterRequest;
import com.example.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.backend.persistence.dao.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Authenticate user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // Retrieve the authenticated user (we assume this is a general user, not customer-specific)
            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            // Generate JWT token for the user
            String token = jwtUtil.generateToken(request.getUsername());

            // Create response including user data and role
            JwtResponse response = new JwtResponse(token,user, user.getUsername(), "admin");
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Authentication error: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(request.getRole());

        userRepository.save(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Client-side token removal assumed
        return ResponseEntity.ok("Logout successful");
    }

    @PostMapping("/customer-login")
    public ResponseEntity<?> customerLogin(@RequestBody LoginRequest request) {
        try {
            // Check if the customer exists by email
            Customer customer = customerRepository.findByEmail(request.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

            // Verify password
            if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
                throw new BadCredentialsException("Invalid email or password");
            }

            // Generate JWT token for the customer
            String token = jwtUtil.generateToken(customer.getEmail());

            // Respond with token, customer details, and role
            JwtResponse response = new JwtResponse(token, customer, customer.getEmail(), "customer");
            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login error: " + e.getMessage());
        }
    }

    @PostMapping("/customer-register")
    public ResponseEntity<?> registerCustomer(@RequestBody CustomerRegisterRequest request) {
        try {
            // Check if the customer already exists by email
            if (customerRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already registered");
            }

            // Create a new Customer object and encode the password
            Customer newCustomer = new Customer();
            newCustomer.setName(request.getName());
            newCustomer.setEmail(request.getEmail());
            newCustomer.setPhoneNumber(request.getPhoneNumber());
            newCustomer.setPassword(passwordEncoder.encode(request.getPassword()));  // Encode the password

            // Save the new customer in the database
            customerRepository.save(newCustomer);

            return ResponseEntity.status(HttpStatus.CREATED).body("Customer registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error registering customer: " + e.getMessage());
        }
    }
}
