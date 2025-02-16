package com.example.backend.service.controller;

import com.example.backend.persistence.dao.BrandRepository;
import com.example.backend.persistence.entities.Brand;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    @Autowired
    private BrandRepository brandRepository;

    @GetMapping
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    @PostMapping
    public Brand createBrand(@RequestBody Brand brand) {
        return brandRepository.save(brand);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable Long id) {
        Optional<Brand> brand = brandRepository.findById(id);
        return brand.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Brand updateBrand(@PathVariable Long id, @RequestBody Brand updatedBrand) {
        return brandRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedBrand.getName());
                    return brandRepository.save(existing);
                }).orElseThrow(() -> new RuntimeException("Brand not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteBrand(@PathVariable Long id) {
        brandRepository.deleteById(id);
    }
}
