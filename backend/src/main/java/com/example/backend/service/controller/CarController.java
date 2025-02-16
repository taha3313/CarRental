package com.example.backend.service.controller;

import com.example.backend.persistence.dao.CarRepository;
import com.example.backend.persistence.entities.Car;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    @Autowired
    private CarRepository carRepository;

    @GetMapping
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    @PostMapping
    public Car createCar(@RequestBody Car car) {
        return carRepository.save(car);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        Optional<Car> car = carRepository.findById(id);
        return car.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Car updateCar(@PathVariable Long id, @RequestBody Car car) {
        return carRepository.findById(id)
                .map(existing -> {
                    existing.setModel(car.getModel());
                    existing.setBrand(car.getBrand());
                    existing.setPricePerDay(car.getPricePerDay());
                    return carRepository.save(existing);
                }).orElseThrow(() -> new RuntimeException("Car not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteCar(@PathVariable Long id) {
        carRepository.deleteById(id);
    }
}
