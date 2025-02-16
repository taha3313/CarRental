// src/interfaces/Car.ts
import { Brand } from "./Brand"; 

export interface Car {
    id?: number;
  model: string;
  year: number;
  pricePerDay: number;
  brand: Brand;
}
