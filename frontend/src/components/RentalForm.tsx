import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Rental } from "../interfaces/Rental";
import { Car } from "../interfaces/Car";
import { Customer } from "../interfaces/Customer";
import { getCars } from "../services/carService";
import { getAllCustomers } from "../services/customerService";
import { checkCarAvailability } from "../services/availabilityService";
import { createRental, updateRental, getRentalById } from "../services/rentalService";

const RentalForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Rental>({
    customer: { id: 0, name: "", email: "", phoneNumber: "" },
    car: {
      id: 0,
      model: "",
      pricePerDay: 0,
    },
    startDate: "",
    endDate: "",
    totalPrice: 0,
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
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
        const customersResponse = await getAllCustomers();
        setCustomers(customersResponse.data);

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

  useEffect(() => {
    if (formData.startDate && formData.endDate && formData.car.id) {
      const selectedCar = cars.find((car) => car.id === formData.car.id);
      if (selectedCar) {
        const daysBetween =
          new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime();
        const duration = daysBetween > 0 ? daysBetween / (1000 * 60 * 60 * 24) : 0;
        setFormData((prev) => ({
          ...prev,
          totalPrice: duration * selectedCar.pricePerDay,
        }));
      }
    }
  }, [formData.startDate, formData.endDate, formData.car.id, cars]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "car") {
      const selectedCar = cars.find((car) => car.id === Number(value));
      if (selectedCar) {
        setFormData((prev) => ({
          ...prev,
          car: { id: selectedCar.id || 0, model: selectedCar.model || "", pricePerDay: selectedCar.pricePerDay || 0 },
        }));
      }
    } else if (name === "customer") {
      const selectedCustomer = customers.find((customer) => customer.id === Number(value));
      if (selectedCustomer) {
        setFormData((prev) => ({
          ...prev,
          customer: { ...selectedCustomer },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = async () => {
    const { startDate, endDate, car } = formData;
    setDateError(null);
    setCarError(null);

    if (new Date(startDate) >= new Date(endDate)) {
      setDateError("Start date must be earlier than end date.");
      return false;
    }

    const isCarAvailable = await checkCarAvailability(
      id ? Number.parseInt(id, 10) : undefined,
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
        // Update rental with totalPrice included
        await updateRental(Number(id), formData);
      } else {
        // Create new rental with totalPrice included
        await createRental(formData);
      }
      navigate("/admin/rentals");
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
        {/* Customer Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
          <select
            name="customer"
            value={formData.customer.id}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.email})
              </option>
            ))}
          </select>
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

        {/* Total Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Price</label>
          <input
            type="number"
            name="totalPrice"
            value={formData.totalPrice}
            readOnly
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
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
            onClick={() => navigate("/admin/rentals")}
            className="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RentalForm;
