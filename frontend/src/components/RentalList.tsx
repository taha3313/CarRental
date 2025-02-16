import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRentals, deleteRental } from "../services/rentalService";
import { Rental } from "../interfaces/Rental";

const RentalList: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRentals()
      .then((data) => {
        setRentals(data);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          setError("Error fetching rentals: " + error.message);
        } else {
          setError("An unknown error occurred.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this rental?")) {
      try {
        await deleteRental(id);
        setRentals(rentals.filter((rental) => rental.id !== id));
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError("Error deleting rental: " + error.message);
        } else {
          setError("An unknown error occurred while deleting.");
        }
      }
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "invoiced":
        return "bg-green-100 text-green-800"; // Green for invoiced
      case "canceled":
        return "bg-red-100 text-red-800"; // Red for canceled
      case "active":
        return "bg-blue-100 text-blue-800"; // Blue for active
      default:
        return "bg-gray-100 text-gray-800"; // Default gray if unknown status
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Rentals</h1>
      <Link
        to="/admin/rentals/add"
        className="mb-4 inline-block px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
      >
        Add Rental
      </Link>
      <table className="min-w-full table-auto border-collapse bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Customer</th>
            <th className="px-4 py-2 text-left">Car</th>
            <th className="px-4 py-2 text-left">Start Date</th>
            <th className="px-4 py-2 text-left">End Date</th>
            <th className="px-4 py-2 text-left">Total Price</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental) => (
            <tr key={rental.id} className="border-b">
              <td className="px-4 py-2">{rental.customer.name}</td>
              <td className="px-4 py-2">{rental.car.model}</td>
              <td className="px-4 py-2">{rental.startDate}</td>
              <td className="px-4 py-2">{rental.endDate}</td>
              <td className="px-4 py-2">{rental.totalPrice}</td>
              <td className={`px-4 py-2 font-medium rounded-full ${getStatusClass(rental.state)}`}>
                {rental.state.charAt(0).toUpperCase() + rental.state.slice(1)} {/* Capitalize first letter */}
              </td>
              <td className="px-4 py-2 flex items-center">
                {/* Show Edit and Delete buttons only for active rentals */}
                {rental.state.toLowerCase() === "active" && (
                  <>
                    <Link
                      to={`/admin/rentals/edit/${rental.id}`}
                      className="px-4 py-2 text-white bg-yellow-600 hover:bg-yellow-700 rounded-md mr-4"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/admin/invoice/${rental.id}`}
                      className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md mr-4 flex items-center"
                    >
                      <i className="fas fa-file-invoice mr-2"></i>Invoice
                    </Link>
                    <button
                      onClick={() => handleDelete(rental.id)}
                      className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RentalList;
