import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInvoiceById } from "../services/invoiceService"; // Assuming this function exists
import { Rental } from "../interfaces/Rental";

export interface Invoice {
  id?: number;            // Optional ID for the invoice
  rental: Rental;         // Link to the Rental entity
  totalAmount: number;    // Total amount for the invoice
  invoiceDate: string;    // Invoice date (ISO date string)
  penalty: number;        // penalty for the invoice (new field)
}

const InvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Use `id` instead of `rentalId`
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invoice ID is missing.");
      return;
    }

    getInvoiceById(Number(id))
      .then((response) => {
        setInvoice(response.data); // Access `data` from the AxiosResponse
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    window.print(); // Opens the print dialog
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!invoice) {
    return <div className="text-center text-red-500">No invoice available.</div>;
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Invoice Details</h1>
      <div className="border-t-2 border-gray-300 pt-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Rental Information</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="font-medium text-gray-600">Customer Name:</p>
            <p className="text-lg text-gray-800">{invoice.rental.customer.name}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Car Model:</p>
            <p className="text-lg text-gray-800">{invoice.rental.car.model}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Total Price:</p>
            <p className="text-lg text-gray-800">${invoice.rental.totalPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Start Date:</p>
            <p className="text-lg text-gray-800">{invoice.rental.startDate}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">End Date:</p>
            <p className="text-lg text-gray-800">{invoice.rental.endDate}</p>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-gray-300 pt-4">
        <h2 className="text-2xl font-semibold text-gray-700">Invoice Details</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="font-medium text-gray-600">Invoice Date:</p>
            <p className="text-lg text-gray-800">{invoice.invoiceDate}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Penalty:</p>
            <p className="text-lg text-gray-800">${invoice.penalty.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium text-gray-600">Total Amount:</p>
            <p className="text-lg font-bold text-gray-800">${invoice.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <button 
          onClick={handlePrint} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 print:hidden">
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
