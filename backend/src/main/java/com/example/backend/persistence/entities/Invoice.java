package com.example.backend.persistence.entities;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Rental rental;

    private double penalty;
    private double totalAmount;
    private LocalDate invoiceDate;
}

