package com.example.backend.persistence.dao;


import com.example.backend.persistence.entities.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {}

