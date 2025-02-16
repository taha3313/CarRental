/* eslint-disable prefer-const */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRentalById, markRentalAsInvoiced } from "../services/rentalService";
import { Rental } from "../interfaces/Rental";
import { createInvoice } from "../services/invoiceService"; // Function to call the backend
import { useNavigate } from "react-router-dom";

export interface Invoice {
  id?: number;            // Optional ID for the invoice
  rental: Rental;         // Link to the Rental entity
  totalAmount: number;    // Total amount for the invoice
  invoiceDate: string;    // Invoice date (ISO date string)
  penalty: number;           // penalty for the invoice (new field)
}

const InvoiceForm: React.FC = () => {
  const { rentalId } = useParams<{ rentalId: string }>();
  const [rental, setRental] = useState<Rental | null>(null);
  const navigate = useNavigate();
  
  const [invoice, setInvoice] = useState<Invoice>({
    rental: {
      customer: {
        name: "",
        email: "",
        phoneNumber: ""
      },
      car: {
        id: 0,
        model: "",
        pricePerDay: 0
      },
      startDate: "",
      endDate: "",
      totalPrice: 0
    },
    totalAmount: 0,
    invoiceDate: new Date().toISOString().split("T")[0],
    penalty: 0, // Set default penalty to 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rentalId) {
      console.log("no ID");
      return;
    }

    getRentalById(Number(rentalId))
      .then((data) => {
        console.log("Rental data fetched:", data); // Log to check the fetched data
        setRental(data);
        setInvoice((prevInvoice) => ({
          ...prevInvoice,
          rental: data, // Set rental information in the invoice
          totalAmount: data.totalPrice, // Default invoice amount is the rental's total price
        }));
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          setError("Error fetching rental: " + error.message);
        } else {
          setError("An unknown error occurred.");
        }
      })
      .finally(() => setLoading(false));
  }, [rentalId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    setInvoice((prevInvoice) => {
      let updatedInvoice = {
        ...prevInvoice,
        [name]: numericValue, // Ensure number fields are parsed correctly
      };

      // If the penalty is updated, recalculate totalAmount
      if (name === "penalty") {
        updatedInvoice.totalAmount = prevInvoice.rental.totalPrice + numericValue;
      }

      return updatedInvoice;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      // Fetch the rental object again
      const rentalF = await getRentalById(Number(rentalId));
  
      // Create a new invoice object with the updated rental
      const updatedInvoice = {
        ...invoice,
        rental: rentalF, // Assign fetched rental to the invoice
      };
  
      console.log("Prepared invoice:", updatedInvoice);
  
      // Send the updated invoice data to the backend
      const response = await createInvoice(updatedInvoice);
      console.log("Invoice created successfully:", response);
  
      // Optionally, mark the rental as invoiced
      await markRentalAsInvoiced(Number(rentalId));
  
      navigate("/admin/rentals"); // Redirect after successful invoice creation
    } catch (err) {
      console.error("Error creating invoice:", err);
      setError("Error creating invoice.");
    }
  };
  
  
  

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!rental) {
    return <div className="text-center text-red-500">Rental not found.</div>;
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Invoice</h1>
      <div className="border-t-2 border-gray-300 pt-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Rental Details</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="font-medium text-gray-600">Customer Name:</p>
            <p className="text-lg text-gray-800">{rental.customer.name}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Car Model:</p>
            <p className="text-lg text-gray-800">{rental.car.model}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Total Price:</p>
            <p className="text-lg text-gray-800">${rental.totalPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Start Date:</p>
            <p className="text-lg text-gray-800">{rental.startDate}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">End Date:</p>
            <p className="text-lg text-gray-800">{rental.endDate}</p>
          </div>
        </div>
      </div>

      {/* Invoice Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-medium text-gray-700">Total Amount</label>
          <input
            type="number"
            name="totalAmount"
            value={invoice.totalAmount}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">Invoice Date</label>
          <input
            type="date"
            name="invoiceDate"
            value={invoice.invoiceDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">penalty</label>
          <input
            type="number"
            name="penalty"
            value={invoice.penalty}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Breakdown of total */}
        <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-300">
          <p className="font-medium text-gray-600">Total Price + penalty = Total Invoice</p>
          <div className="flex justify-between text-lg text-gray-800">
            <span>Total Price:</span>
            <span>${rental.totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg text-gray-800">
            <span>penalty:</span>
            <span>${invoice.penalty.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-800">
            <span>Total Invoice:</span>
            <span>${invoice.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md"
        >
          Generate Invoice
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;
