/* eslint-disable @typescript-eslint/no-unused-vars */ 
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { cancelRental } from "../services/rentalService";
import { Rental } from "../interfaces/Rental";
import { useNavigate } from "react-router-dom";

const CustomerRentalsList: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await axiosInstance.get("/rentals/customer-rentals");
        setRentals(response.data);
      } catch (err) {
        setError("Error fetching rentals");
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  const handleCancelRental = async (id: number) => {
    if (window.confirm("Are you sure you want to cancel this rental?")) {
      try {
        await cancelRental(id);
        alert("Rental canceled successfully.");
        setRentals(rentals.filter((rental) => rental.id !== id)); // Refresh the list
      } catch (error) {
        console.error("Error canceling rental:", error);
        alert("Failed to cancel rental.");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Your Rentals</h1>
        <button
          onClick={() => navigate(`/rentals/add`)}
          className="px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded-md"
        >
          Create New Rental
        </button>
      </div>
      {rentals.length > 0 ? (
        <table className="min-w-full table-auto border-collapse bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Car</th>
              <th className="px-4 py-2 text-left">Start Date</th>
              <th className="px-4 py-2 text-left">End Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental: any) => (
              <tr key={rental.id} className="border-b">
                <td className="px-4 py-2">{rental.car.brand.name} {rental.car.model}</td>
                <td className="px-4 py-2">{rental.startDate}</td>
                <td className="px-4 py-2">{rental.endDate}</td>
                <td className="px-4 py-2 flex items-center">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => navigate(`/rentals/edit/${rental.id}`)}
                      className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCancelRental(rental.id)}
                      className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No rentals found</p>
      )}
    </div>
  );
};

export default CustomerRentalsList;
