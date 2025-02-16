import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCustomers, deleteCustomer } from "../services/customerService"; // Import customer service
import { Customer } from "../interfaces/Customer"; // Import the Customer interface

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch customers when the component mounts
  useEffect(() => {
    getAllCustomers()
      .then((response) => {
        setCustomers(response.data); // Extract the data from response
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          setError("Error fetching customers: " + error.message);
        } else {
          setError("An unknown error occurred.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle customer deletion
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        setCustomers(customers.filter((customer) => customer.id !== id)); // Remove deleted customer
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError("Error deleting customer: " + error.message);
        } else {
          setError("An unknown error occurred while deleting.");
        }
      }
    }
  };

  // Loading state
  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  // Error state
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">Customer List</h1>

      {/* Add Customer Link */}
      <Link
        to="/admin/customers/add"
        className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md mb-4 inline-block"
      >
        Add Customer
      </Link>

      {/* Customer Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Phone</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                  No customers available
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="border-b">
                  <td className="px-4 py-2 text-sm text-gray-800">{customer.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{customer.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{customer.email}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{customer.phoneNumber}</td>
                  <td className="px-4 py-2 text-sm space-x-2">
                    <Link
                      to={`/admin/customers/edit/${customer.id}`}
                      className="px-4 py-2 text-white bg-yellow-600 hover:bg-yellow-700 rounded-md"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;
