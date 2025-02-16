package com.example.backend.service.interfaces;


import com.example.backend.persistence.entities.Rental;
import java.util.List;
import java.util.Optional;

public interface IRental {
    List<Rental> getAllRentals();
    Rental saveRental(Rental rental);

    Optional<Rental> getRentalById(Long id);

    void deleteRental(Long id);
}

