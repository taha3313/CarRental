package com.example.backend.persistence.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String model;
    private int year;
    private double pricePerDay;

    @ManyToOne
    @JoinColumn(name = "brand_id")
    private Brand brand;
}
