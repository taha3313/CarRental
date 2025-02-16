package com.example.backend.persistence.dao;


import com.example.backend.persistence.entities.Car;
import org.springframework.data.jpa.repository.JpaRepository;


import com.example.backend.persistence.entities.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
}
