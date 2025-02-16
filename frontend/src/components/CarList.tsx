import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCars, deleteCar } from "../services/carService"; // Import carService
import { Car } from "../interfaces/Car"; // Import the Car interface

const CarList: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCars()
      .then((data) => {
        setCars(data);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          setError("Error fetching cars: " + error.message);
        } else {
          setError("An unknown error occurred.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await deleteCar(id);
        setCars(cars.filter((car) => car.id !== id));
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError("Error deleting car: " + error.message);
        } else {
          setError("An unknown error occurred while deleting.");
        }
      }
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Car List</h1>
      <Link
        to="/admin/cars/add"
        className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md mb-4 inline-block"
      >
        Add Car
      </Link>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Model</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Brand</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Year</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price/Day</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td className="px-4 py-2 text-sm text-gray-700">{car.id}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{car.model}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{car.brand.name}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{car.year}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{car.pricePerDay}</td>
                <td className="px-4 py-2 text-sm text-gray-700 space-x-2">
                  <Link
                    to={`/admin/cars/edit/${car.id}`}
                    className="px-3 py-1 text-white bg-yellow-600 hover:bg-yellow-700 rounded-md"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarList;
