package com.example.backend.service.interfaces;


import com.example.backend.persistence.entities.Car;

import java.util.List;
import java.util.Optional;

public interface ICar {
    List<Car> getAllCars();
    Car saveCar(Car car);

    Optional<Car> getCarById(Long id);

    void deleteCustomer(Long id);
}

