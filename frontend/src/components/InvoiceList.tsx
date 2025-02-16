import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllInvoices } from "../services/invoiceService";
import { Rental } from "../interfaces/Rental";
export interface Invoice {
  id?: number;            // Optional ID for the invoice
  rental: Rental;         // Link to the Rental entity
  totalAmount: number;    // Total amount for the invoice
  invoiceDate: string;    // Invoice date (ISO date string)
  penalty: number;           // penalty for the invoice (new field)
}
const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllInvoices()
      .then((response) => {
        setInvoices(response.data); // Access the data property of the Axios response
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          setError("Error fetching invoices: " + error.message);
        } else {
          setError("An unknown error occurred.");
        }
      })
      .finally(() => setLoading(false));
  }, []);
  

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Invoices</h1>
      <table className="min-w-full table-auto border-collapse bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Invoice ID</th>
            <th className="px-4 py-2 text-left">Customer</th>
            <th className="px-4 py-2 text-left">Rental ID</th>
            <th className="px-4 py-2 text-left">Total Amount</th>
            <th className="px-4 py-2 text-left">Date Issued</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b">
              <td className="px-4 py-2">{invoice.id}</td>
              <td className="px-4 py-2">{invoice.rental.customer.name}</td>
              <td className="px-4 py-2">{invoice.rental.id}</td>
              <td className="px-4 py-2">${invoice.totalAmount.toFixed(2)}</td>
              <td className="px-4 py-2">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
              <td className="px-4 py-2 flex items-center">
                <Link
                  to={`/admin/view/invoice/${invoice.id}`}
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md mr-4"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;
