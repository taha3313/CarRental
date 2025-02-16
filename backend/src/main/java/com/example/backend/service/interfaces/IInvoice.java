package com.example.backend.service.interfaces;


import com.example.backend.persistence.entities.Invoice;
import java.util.List;
import java.util.Optional;

public interface IInvoice {
    List<Invoice> getAllInvoices();
    Invoice saveInvoice(Invoice invoice);

    Optional<Invoice> getInvoiceById(Long id);

    void deleteInvoice(Long id);
}

