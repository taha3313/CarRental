package com.example.backend.service.controller;

import com.example.backend.AvailabilityResponse;
import com.example.backend.persistence.dao.CarRepository;
import com.example.backend.persistence.dao.CustomerRepository;
import com.example.backend.persistence.dao.InvoiceRepository;
import com.example.backend.persistence.dao.RentalRepository;
import com.example.backend.persistence.entities.Customer;
import com.example.backend.persistence.entities.Invoice;
import com.example.backend.persistence.entities.Rental;
import com.example.backend.persistence.entities.Rental.RentalState;
import com.example.backend.service.impliments.RentalService;
import com.example.backend.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rentals")
public class RentalController {

    @Autowired
    private RentalRepository rentalRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CarRepository carRepository;

    private final RentalService rentalService;
    @Autowired
    private final InvoiceRepository invoiceRepository;

    public RentalController(RentalService rentalService, InvoiceRepository invoiceRepository) {
        this.rentalService = rentalService;
        this.invoiceRepository = invoiceRepository;
    }

    @GetMapping
    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    @GetMapping("/check-availability")
    public ResponseEntity<AvailabilityResponse> checkCarAvailability(@RequestParam Long carId,
                                                                     @RequestParam(name = "start") String startDateStr,
                                                                     @RequestParam(name = "end") String endDateStr,
                                                                     @RequestParam(name = "id", required = false) Long rentalId) {
        LocalDate startDate = LocalDate.parse(startDateStr);
        LocalDate endDate = LocalDate.parse(endDateStr);

        // Fetch rentals that overlap with the given dates and are not canceled
        List<Rental> rentals = rentalRepository.findByCarIdAndDates(carId, startDate, endDate)
                .stream()
                .filter(rental -> rental.getState() != RentalState.CANCELED) // Exclude canceled rentals
                .toList();

        // Filter out the rental with the provided ID if it exists (this is the current rental being edited)
        if (rentalId != null) {
            rentals = rentals.stream()
                    .filter(rental -> !rental.getId().equals(rentalId))
                    .toList();
        }

        // If no rentals overlap or the current rental is the only one, return available
        if (rentals.isEmpty()) {
            return ResponseEntity.ok().body(new AvailabilityResponse(true, "Car is available"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AvailabilityResponse(false, "The selected car is not available during this time"));
        }
    }



    @PostMapping
    public Rental createRental(@RequestBody Rental rental) {
        calculateTotalPrice(rental);
        return rentalRepository.save(rental);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rental> getRentalById(@PathVariable Long id) {
        System.out.println("id: "+id);
        Optional<Rental> rental = rentalRepository.findById(id);
        return rental.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @PutMapping("/{id}")
    public Rental updateRental(@PathVariable Long id, @RequestBody Rental rental) {
        return rentalRepository.findById(id)
                .map(existing -> {
                    existing.setCar(rental.getCar());
                    existing.setCustomer(rental.getCustomer());
                    existing.setStartDate(rental.getStartDate());
                    existing.setEndDate(rental.getEndDate());

                    calculateTotalPrice(existing);

                    return rentalRepository.save(existing);
                }).orElseThrow(() -> new RuntimeException("Rental not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteRental(@PathVariable Long id) {
        rentalRepository.deleteById(id);
    }

    private void calculateTotalPrice(Rental rental) {
        long daysBetween = ChronoUnit.DAYS.between(rental.getStartDate(), rental.getEndDate());
        rental.setTotalPrice((float) (daysBetween * rental.getCar().getPricePerDay()));
    }

    @GetMapping("/customer-rentals")
    public ResponseEntity<?> getCustomerRentals(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);

            if (!jwtUtil.validateToken(jwt)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            String email = jwtUtil.getUsernameFromToken(jwt);

            Customer customer = customerRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("Customer not found"));

            List<Rental> rentals = rentalRepository.findByCustomerId(customer.getId());

            return ResponseEntity.ok(rentals);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching rentals: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Rental> cancelRental(@PathVariable Long id) {
        Optional<Rental> rentalOptional = rentalService.getRentalById(id);

        if (rentalOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Rental rental = rentalOptional.get();
        rental.setState(RentalState.CANCELED);
        rentalService.saveRental(rental);

        return ResponseEntity.ok(rental);
    }
    @PatchMapping("/invoice/{id}")
    public ResponseEntity<Rental> markRentalAsInvoiced(@PathVariable Long id) {
        Optional<Rental> rentalOptional = rentalService.getRentalById(id);

        if (rentalOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Rental rental = rentalOptional.get();

        // Change the rental state to "INVOICED"
        rental.setState(RentalState.INVOICED);

        // Save the updated rental state
        rentalService.saveRental(rental);



        return ResponseEntity.ok(rental);
    }

    @PostMapping("/invoices")
    public ResponseEntity<Invoice> createInvoice(@RequestBody Rental rental) {
        Invoice invoice = new Invoice();
        invoice.setRental(rental);
        invoice.setTotalAmount(rental.getTotalPrice());
        invoice.setInvoiceDate(LocalDate.now());
        invoiceRepository.save(invoice);
        return ResponseEntity.status(HttpStatus.CREATED).body(invoice);
    }

}
