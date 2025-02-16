package com.example.backend.persistence.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rental {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Car car;

    @ManyToOne
    private Customer customer;

    private LocalDate startDate;
    private LocalDate endDate;
    private float totalPrice;

    @Enumerated(EnumType.STRING)
    private RentalState state = RentalState.ACTIVE; // Default value set here

    public enum RentalState {
        CANCELED,
        ACTIVE,
        INVOICED
    }
}
