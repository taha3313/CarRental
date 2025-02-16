package com.example.backend.service.interfaces;


import com.example.backend.persistence.entities.Customer;
import java.util.List;
import java.util.Optional;

public interface ICustomer {
    List<Customer> getAllCustomers();
    Customer saveCustomer(Customer customer);

    Optional<Customer> getCustomerById(Long id);

    void deleteCustomer(Long id);
}

