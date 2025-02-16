package com.example.backend;

public class AvailabilityResponse {
    private boolean isAvailable;
    private String message;

    public AvailabilityResponse(boolean isAvailable, String message) {
        this.isAvailable = isAvailable;
        this.message = message;
    }

    // Getters and setters
    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
