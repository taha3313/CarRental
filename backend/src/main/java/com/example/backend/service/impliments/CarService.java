package com.example.backend.service.impliments;


import com.example.backend.persistence.dao.CarRepository;
import com.example.backend.persistence.entities.Car;
import com.example.backend.service.interfaces.ICar;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CarService implements ICar {

    private final CarRepository carRepository;

    @Override
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    @Override
    public Car saveCar(Car car) {
        return carRepository.save(car);
    }

    @Override
    public Optional<Car> getCarById(Long id) {
        return carRepository.findById(id);
    }

    @Override
    public void deleteCustomer(Long id) {
        carRepository.deleteById(id);
    }
}

