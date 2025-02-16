import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Brand } from "../interfaces/Brand";
import { Car } from "../interfaces/Car";
import { createCar, updateCar, getCarById } from "../services/carService";
import { getAllBrands } from "../services/brandService";

const CarForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // To get car ID from URL params
  const navigate = useNavigate();

  // Initial form data
  const [formData, setFormData] = useState<Car>({
    model: "",
    year: 0,
    pricePerDay: 0,
    brand: { id: 0, name: "" }, // Initialize brand
  });

  const [brands, setBrands] = useState<Brand[]>([]); // List of brands for the dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch car and brands when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch brands
        const brandsResponse = await getAllBrands();
        setBrands(brandsResponse.data);

        // Fetch car data if editing
        if (id) {
          const carData = await getCarById(Number(id));
          setFormData(carData);
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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // If the field is "brand", update the brand object
    if (name === "brand") {
      const selectedBrand = brands.find((brand) => brand.id === Number(value));
      setFormData((prev) => ({
        ...prev,
        brand: selectedBrand || { id: 0, name: "" },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "year" || name === "pricePerDay" ? Number(value) : value, // Convert numeric fields
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        // Update car if ID exists
        await updateCar(Number(id), formData);
      } else {
        // Create new car
        console.log("Submitting Car Data:", JSON.stringify(formData, null, 2));

        await createCar(formData); // Submit as is
      }
      navigate("/admin/cars"); // Redirect to car list page
    } catch (err) {
      console.error("Error saving car data:", err);
      setError("Error saving car data.");
    }
  };

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error state
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">{id ? "Edit Car" : "Add Car"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Brand</label>
          <select
            name="brand"
            value={formData.brand.id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Car Model</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Car Model"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Car Year</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Car Year"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price per Day</label>
          <input
            type="number"
            name="pricePerDay"
            value={formData.pricePerDay}
            onChange={handleChange}
            placeholder="Price per Day"
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/cars")}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;
