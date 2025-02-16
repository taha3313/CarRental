package com.example.backend.service.impliments;


import com.example.backend.persistence.dao.BrandRepository;
import com.example.backend.persistence.entities.Brand;
import com.example.backend.service.interfaces.IBrand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BrandService implements IBrand {

    private final BrandRepository brandRepository;

    @Override
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    @Override
    public Brand saveBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    @Override
    public Optional<Brand> getBrandById(Long id) {
        return brandRepository.findById(id);
    }

    @Override
    public void deleteBrand(Long id) {
        brandRepository.deleteById(id);
    }
}
