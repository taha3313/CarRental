import React, { useEffect, useState } from 'react';
import { Invoice, getAllInvoices, createInvoice, deleteInvoice } from '../services/invoiceService';

const InvoiceComponent: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [dateIssued, setDateIssued] = useState('');

  const fetchInvoices = async () => {
    const response = await getAllInvoices();
    setInvoices(response.data);
  };

  const handleCreate = async () => {
    await createInvoice({ totalAmount, dateIssued });
    setTotalAmount(0);
    setDateIssued('');
    fetchInvoices();
  };

  const handleDelete = async (id: number) => {
    await deleteInvoice(id);
    fetchInvoices();
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div>
      <h2>Invoices</h2>
      <input
        type="number"
        placeholder="Total Amount"
        value={totalAmount}
        onChange={(e) => setTotalAmount(Number(e.target.value))}
      />
      <input
        type="date"
        placeholder="Date Issued"
        value={dateIssued}
        onChange={(e) => setDateIssued(e.target.value)}
      />
      <button onClick={handleCreate}>Create Invoice</button>
      <ul>
        {invoices.map((invoice) => (
          <li key={invoice.id}>
            ${invoice.totalAmount} - {invoice.dateIssued}
            <button onClick={() => handleDelete(invoice.id!)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoiceComponent;
