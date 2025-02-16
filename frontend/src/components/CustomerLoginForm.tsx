/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import { useUser } from "../contexts/UserContext"; // Import the context

const CustomerLoginForm: React.FC = () => {
  const { setUser } = useUser(); // Context to store customer data
  const [email, setEmail] = useState(""); // Customer email
  const [password, setPassword] = useState(""); // Customer password
  const [error, setError] = useState(""); // Error state for login failures
  const navigate = useNavigate(); // Navigation after successful login

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send request to authenticate the customer
      const response = await axiosInstance.post("/auth/customer-login", {
        username: email,
        password,
      });

      // Extract token and role (assuming role is 'customer')
      const { user, token } = response.data;

      // Store token and role in localStorage and context
      localStorage.setItem("authToken", token);
      setUser({ id: user.id, name: email, role: "customer" });// Save role (typically 'customer')
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect customer to the rentals page
      navigate(`/rentals/${user.id}`);
    } catch (err) {
      setError("Invalid email or password"); // Show error if login fails
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Customer Login</h2>
        {error && (
          <p className="mt-4 text-sm text-center text-red-600 bg-red-100 p-2 rounded">
            {error}
          </p>
        )}
        <form onSubmit={handleLogin} className="mt-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded focus:outline-none focus:ring focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <a
            href="/customer-register"
            className="text-blue-500 hover:text-blue-700"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default CustomerLoginForm;
