import React from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you are using react-router-dom for navigation

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/admin/login'); // Redirect to admin login page
  };

  const handleCustomerLogin = () => {
    navigate('/customer-login'); // Redirect to customer login page
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Welcome to Car Rental</h1>
      <p className="text-lg mb-6">Choose your login type</p>
      <div className="space-x-4">
        <button
          onClick={handleAdminLogin}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Login as Admin
        </button>
        <button
          onClick={handleCustomerLogin}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Login as Customer
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
