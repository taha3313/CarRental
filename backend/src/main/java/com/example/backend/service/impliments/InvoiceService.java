package com.example.backend.service.impliments;

import com.example.backend.persistence.dao.InvoiceRepository;
import com.example.backend.persistence.entities.Invoice;
import com.example.backend.service.interfaces.IInvoice;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvoiceService implements IInvoice {

    private final InvoiceRepository invoiceRepository;

    @Override
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Override
    public Invoice saveInvoice(Invoice invoice) {
        return invoiceRepository.save(invoice);
    }

    @Override
    public Optional<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }

    @Override
    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
}
