// src/services/customerService.ts

import axiosInstance from "./axiosInstance";
import { Customer } from "../interfaces/Customer";

export const getAllCustomers = () => axiosInstance.get<Customer[]>("/customers");
export const getCustomerById = (id: number) =>
  axiosInstance.get<Customer>(`/customers/${id}`);
export const createCustomer = (customer: Customer) =>
  axiosInstance.post<Customer>("/customers", customer);
export const updateCustomer = (id: number, customer: Customer) =>
  axiosInstance.put<Customer>(`/customers/${id}`, customer);
export const deleteCustomer = (id: number) => axiosInstance.delete(`/customers/${id}`);
