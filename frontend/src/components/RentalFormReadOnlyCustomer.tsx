/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Rental } from "../interfaces/Rental";
import { Car } from "../interfaces/Car";
import { getCars } from "../services/carService";
import { checkCarAvailability } from "../services/availabilityService";
import { createRental, updateRental, getRentalById } from "../services/rentalService";

const RentalFormReadOnlyCustomer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");

  const initialFormData = storedUser
    ? {
        customer: {
          id: JSON.parse(storedUser).id,
          name: JSON.parse(storedUser).name,
          email: JSON.parse(storedUser).email,
          phoneNumber: JSON.parse(storedUser).phoneNumber,
        },
        car: { id: 0, model: "", pricePerDay: 0 },
        startDate: "",
        endDate: "",
        totalPrice: 0,
      }
    : {
        customer: { id: 0, name: "", email: "", phoneNumber: "" },
        car: { id: 0, model: "", pricePerDay: 0 },
        startDate: "",
        endDate: "",
        totalPrice: 0,
      };

  const [formData, setFormData] = useState<Rental>(initialFormData);

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [carError, setCarError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carsResponse = await getCars();
        setCars(carsResponse);

        if (id) {
          const rentalData = await getRentalById(Number(id));
          setFormData(rentalData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const calculateTotalPrice = () => {
    const { startDate, endDate, car } = formData;
    if (startDate && endDate && car.pricePerDay) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return days > 0 ? days * car.pricePerDay : 0;
    }
    return 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "car") {
      const selectedCar = cars.find((car) => car.id === Number(value));
      if (selectedCar) {
        setFormData((prev) => ({
          ...prev,
          car: {
            id: selectedCar.id || 0,
            model: selectedCar.model || "",
            pricePerDay: selectedCar.pricePerDay || 0,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    // Update the totalPrice whenever relevant fields change
    setFormData((prev) => ({
      ...prev,
      totalPrice: calculateTotalPrice(),
    }));
  }, [formData.startDate, formData.endDate, formData.car]);

  const validateForm = async () => {
    const { startDate, endDate, car } = formData;
    setDateError(null);
    setCarError(null);

    if (new Date(startDate) >= new Date(endDate)) {
      setDateError("Start date must be earlier than end date.");
      return false;
    }

    const isCarAvailable = await checkCarAvailability(
      id ? Number(id) : null,
      car.id,
      startDate,
      endDate
    );

    if (!isCarAvailable) {
      setCarError("The selected car is not available during this time.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    try {
      if (id) {
        await updateRental(Number(id), formData);
      } else {
        await createRental(formData);
      }
      navigate(`/rentals/${JSON.parse(storedUser).id}`);
    } catch (err) {
      console.error("Error saving rental data:", err);
      setError("Error saving rental data.");
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">{id ? "Edit Rental" : "Add Rental"}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer (Read-Only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
          <input
            type="text"
            value={`${formData.customer.name} (${formData.customer.email})`}
            readOnly
            className="w-full p-2 border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed"
          />
        </div>

        {/* Car Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Car</label>
          <select
            name="car"
            value={formData.car.id}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a Car</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.model} ({car.year})
              </option>
            ))}
          </select>
          {carError && <p className="text-red-500 text-sm">{carError}</p>}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Total Price (Read-Only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Price</label>
          <input
            type="number"
            name="totalPrice"
            value={formData.totalPrice}
            readOnly
            className="w-full p-2 border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed"
          />
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => navigate(`/rentals/${JSON.parse(storedUser).id}`)}
            className="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RentalFormReadOnlyCustomer;
