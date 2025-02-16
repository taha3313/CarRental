package com.example.backend.persistence.dao;

import com.example.backend.persistence.entities.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {

    // Custom query method to check for overlapping rental dates
    @Query("SELECT r FROM Rental r WHERE r.car.id = :carId AND r.endDate >= :startDate AND r.startDate <= :endDate AND r.state <> 'CANCELED'")
    List<Rental> findByCarIdAndDates(@Param("carId") Long carId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);


    List<Rental> findByCustomerId(Long id);
}
