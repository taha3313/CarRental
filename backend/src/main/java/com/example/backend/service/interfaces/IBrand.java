package com.example.backend.service.interfaces;


import com.example.backend.persistence.entities.Brand;

import java.util.List;
import java.util.Optional;

public interface IBrand {
    List<Brand> getAllBrands();
    Brand saveBrand(Brand brand);
    Optional<Brand> getBrandById(Long id);
    void deleteBrand(Long id);
}

