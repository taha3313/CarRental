// src/services/carService.ts

import axiosInstance from "./axiosInstance";
import { Car } from "../interfaces/Car";

export const getCars = async (): Promise<Car[]> => {
  const response = await axiosInstance.get("/cars");
  return response.data;
};

export const getCarById = async (id: number): Promise<Car> => {
  const response = await axiosInstance.get(`/cars/${id}`);
  return response.data;
};

export const createCar = async (carData: Car): Promise<Car> => {
  const response = await axiosInstance.post("/cars", carData);
  return response.data;
};

export const updateCar = async (id: number, carData: Car): Promise<Car> => {
  const response = await axiosInstance.put(`/cars/${id}`, carData);
  return response.data;
};

export const deleteCar = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/cars/${id}`);
};
