/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext"; // Import the context
import axios from "axios"; // Import axios for API requests

const LoginForm: React.FC = () => {
  const { setUser } = useUser(); // Context for setting user data
  const [username, setUsername] = useState(""); // Admin username
  const [password, setPassword] = useState(""); // Admin password
  const [error, setError] = useState<string | null>(null); // For displaying login errors
  const navigate = useNavigate(); // To navigate after successful login

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Send request to authenticate the admin
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });

      // Extract user data, token, and role from the response
      const { token,user} = response.data;
      console.log(response.data);
  

      // Store token and user role in localStorage and context
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", user);
      setUser({ id:user.id,name: username, role:"admin" });  // Save user role as well

      // Redirect based on role (admin or customer)
        navigate("/admin/rentals"); // Navigate to the admin dashboard
    } catch (error) {
      setError("Invalid username or password."); // Display error message on failure
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>} {/* Show error message */}
      <div>
        <label className="block text-gray-700">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
