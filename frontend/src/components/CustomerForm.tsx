/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createCustomer, updateCustomer, getCustomerById } from "../services/customerService";
import { Customer } from "../interfaces/Customer";

const CustomerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // To get customer ID from URL params
  const navigate = useNavigate();

  // Initial form data
  const [formData, setFormData] = useState<Customer>({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch customer data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await getCustomerById(Number(id));
          setFormData(response.data);
        }
      } catch (err) {
        console.error("Error fetching customer data:", err);
        setError("Error fetching customer data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        // Update customer if ID exists
        await updateCustomer(Number(id), formData);
      } else {
        // Create new customer
        console.log("Submitting Customer Data:", JSON.stringify(formData, null, 2));
        await createCustomer(formData);
      }
      navigate("/admin/customers"); // Redirect to customer list page
    } catch (err) {
      console.error("Error saving customer data:", err);
      setError("Error saving customer data.");
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
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-semibold text-center mb-6">
        {id ? "Edit Customer" : "Add Customer"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Customer Name"
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/customers")}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
