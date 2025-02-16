// src/services/invoiceService.ts

import axiosInstance from "./axiosInstance";
import { Rental } from "../interfaces/Rental";

export interface Invoice {
  id?: number;            // Optional ID for the invoice
  rental: Rental;         // Link to the Rental entity
  penalty: number;        // Penalty for the invoice
  totalAmount: number;    // Total amount for the invoice
  invoiceDate: string;    // Invoice date (ISO date string)
}

// Fetch all invoices
export const getAllInvoices = () => axiosInstance.get<Invoice[]>("/invoices");

// Fetch a specific invoice by ID
export const getInvoiceById = (id: number) => axiosInstance.get<Invoice>(`/invoices/${id}`);

// Create a new invoice
export const createInvoice = (invoice: Invoice) => axiosInstance.post<Invoice>("/invoices", invoice);


// Delete an invoice by ID
export const deleteInvoice = (id: number) => axiosInstance.delete(`/invoices/${id}`);
