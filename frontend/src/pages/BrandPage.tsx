import React from "react";
import BrandComponent from "../components/BrandComponent";

const BrandPage: React.FC = () => (
  <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Brands</h1>
    <div className="w-full max-w-4xl">
      <BrandComponent />
    </div>
  </div>
);

export default BrandPage;
