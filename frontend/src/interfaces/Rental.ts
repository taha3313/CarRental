/* eslint-disable @typescript-eslint/no-explicit-any */
import { Customer } from "./Customer";

export interface Rental {
    id?: number;
    customer: Customer;
    car: { id: number; model: string; pricePerDay: number }; // Car relationship
    startDate: string; // e.g., "2024-06-01"
    endDate: string;   // e.g., "2024-06-10"
    totalPrice: number;
    state?: any;
  }
  