// src/services/brandService.ts

import axiosInstance from "./axiosInstance";
import { Brand } from "../interfaces/Brand";

export const getAllBrands = () => axiosInstance.get<Brand[]>("/brands");
export const getBrandById = (id: number) => axiosInstance.get<Brand>(`/brands/${id}`);
export const createBrand = (brand: Brand) => axiosInstance.post<Brand>("/brands", brand);
export const updateBrand = (id: number, brand: Brand) =>
  axiosInstance.put<Brand>(`/brands/${id}`, brand);
export const deleteBrand = (id: number) => axiosInstance.delete(`/brands/${id}`);
