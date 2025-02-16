import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom"; 
import BrandPage from "./pages/BrandPage";

// Import CarForm and CarList
import CarForm from "./components/CarForm";
import CarList from "./components/CarList";
import RentalForm from "./components/RentalForm";
import RentalList from "./components/RentalList";
import CustomerForm from "./components/CustomerForm";
import CustomerList from "./components/CustomerList";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { useUser } from "./contexts/UserContext"; 
import CustomerLoginForm from "./components/CustomerLoginForm";
import CustomerRentalsList from "./components/CustomerRentalsList";
import CustomerRegisterForm from "./components/CustomerRegisterForm";
import RentalFormReadOnlyCustomer from "./components/RentalFormReadOnlyCustomer";
import InvoiceForm from "./components/InvoiceForm";
import WelcomePage from "./components/WelcomePage";
import AdminList from "./components/AdminList";
import InvoiceList from "./components/InvoiceList";
import InvoicePage from "./pages/InvoicePage";

const App: React.FC = () => {
  const { user, setUser } = useUser(); // Access user state from context
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");  // Remove token from localStorage
    setUser(null);  // Clear user from context
    navigate("/");  // Redirect to customer login page
  };

  return (
    <>
      {/* Navigation Menu */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo or Image */}
          <div className="flex items-center">
            <img
              src="src/assets/car-rent-icon.png" // Replace with your image URL
              alt="Logo"
              className="w-10 h-10 mr-4"
            />
            <span className="text-xl font-semibold">Car Rental</span>
          </div>

          {/* Navigation Links */}
          <ul className="flex space-x-6">

          {user?.role === "admin" && (
            <> 
            <li>
                <Link
                  to="/admin/brands"
                  className="hover:text-gray-200 transition duration-300"
                >
                  Brands
                </Link>
              </li><li>
                  <Link
                    to="/admin/cars"
                    className="hover:text-gray-200 transition duration-300"
                  >
                    Cars
                  </Link>
                </li><li>
                  <Link
                    to="/admin/customers"
                    className="hover:text-gray-200 transition duration-300"
                  >
                    Customers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/rentals"
                    className="hover:text-gray-200 transition duration-300"
                  >
                    Rentals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/invoices"
                    className="hover:text-gray-200 transition duration-300"
                  >
                    Invoices
                  </Link>
                </li></>
            )}
            {user?.role === "customer" && (
              <li>
                <Link
                  to={`/rentals/${user.id}`} // Use user.id for customer-specific rentals
                  className="hover:text-gray-200 transition duration-300"
                >
                  My Rentals
                </Link>
              </li>
            )}
          </ul>

          {/* User and Logout Links */}
          <ul className="flex space-x-6">
            {user ? (
              <>
                <li className="text-white">Welcome, {user.name}</li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-gray-200 transition duration-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    className="hover:text-gray-200 transition duration-300"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/customer-register"
                    className="hover:text-gray-200 transition duration-300"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-6">
          <Routes>
          <Route path="/"  element={<WelcomePage/>} />
            {/* Admin Routes */}
            {user?.role === "admin" && (
              <>
                <Route path="/admin/cars" element={<CarList />} />
                <Route path="/admin/cars/add" element={<CarForm />} />
                <Route path="/admin/cars/edit/:id" element={<CarForm />} />
                <Route path="/admin/rentals" element={<RentalList />} />
                <Route path="/admin/rentals/add" element={<RentalForm />} />
                <Route path="/admin/rentals/edit/:id" element={<RentalForm />} />
                <Route path="/admin/customers" element={<CustomerList />} />
                <Route path="/admin/customers/add" element={<CustomerForm />} />
                <Route path="/admin/customers/edit/:id" element={<CustomerForm />} />
                <Route path="admin/invoice/:rentalId" element={<InvoiceForm />} />
                <Route path="/admin/brands" element={<BrandPage />} />
                <Route path="/admin/admins" element={<AdminList />} />
                <Route path="/admin/invoices" element={<InvoiceList />} />
                <Route path="/admin/view/invoice/:id" element={<InvoicePage />}/>
                
              </>
            )}

            {/* Customer Routes */}
            {user?.role === "customer" && (
              <>
                <Route path="/rentals/:customerId" element={<CustomerRentalsList />} /> {/* Only customer can access their rentals */}
              </>
            )}

            {/* Authentication Routes */}
            <Route path="/customer-login" element={<CustomerLoginForm />} />
            <Route path="/customer-register" element={<CustomerRegisterForm />} />
            <Route path="/admin/login" element={<LoginForm />} />
            <Route path="/admin/register" element={<RegisterForm />} />
            <Route path="/rentals/add/" element={<RentalFormReadOnlyCustomer/>} />
            <Route path="/rentals/edit/:id" element={<RentalFormReadOnlyCustomer />} />
            
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
