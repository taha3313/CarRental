// src/services/rentalService.ts

import axiosInstance from "./axiosInstance";
import { Rental } from "../interfaces/Rental";

export const getRentals = async (): Promise<Rental[]> => {
  const response = await axiosInstance.get("/rentals");
  return response.data;
};

export const getRentalById = async (id: number): Promise<Rental> => {
  const response = await axiosInstance.get(`/rentals/${id}`);
  return response.data;
};

export const createRental = async (rentalData: Rental): Promise<Rental> => {
  const response = await axiosInstance.post("/rentals", rentalData);
  return response.data;
};

export const updateRental = async (id: number, rentalData: Rental): Promise<Rental> => {
  const response = await axiosInstance.put(`/rentals/${id}`, rentalData);
  return response.data;
};

export const deleteRental = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/rentals/${id}`);
};
export const cancelRental = async (id: number): Promise<Rental> => {
  const response = await axiosInstance.patch(`/rentals/${id}/cancel`);
  return response.data;
};
export const markRentalAsInvoiced = async (id: number |null |undefined): Promise<Rental> => {
  const response = await axiosInstance.patch(`/rentals/invoice/${id}`);
  return response.data;
};