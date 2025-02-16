package com.example.backend.service.impliments;

import com.example.backend.persistence.dao.RentalRepository;
import com.example.backend.persistence.entities.Rental;
import com.example.backend.service.interfaces.IRental;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RentalService implements IRental {

    private final RentalRepository rentalRepository;

    @Override
    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    @Override
    public Rental saveRental(Rental rental) {
        return rentalRepository.save(rental);
    }

    @Override
    public Optional<Rental> getRentalById(Long id) {
        return rentalRepository.findById(id);
    }

    @Override
    public void deleteRental(Long id) {
        rentalRepository.deleteById(id);
    }

    // Method to check car availability by carId and date range
    public List<Rental> isCarAvailable(Long carId, LocalDate start, LocalDate end) {
        return rentalRepository.findByCarIdAndDates(carId, start, end);
    }

}
