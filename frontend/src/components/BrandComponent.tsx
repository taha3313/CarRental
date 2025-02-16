import React, { useEffect, useState } from "react";
import { getAllBrands, createBrand, deleteBrand } from "../services/brandService";
import { Brand } from "../interfaces/Brand";

const BrandComponent: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [name, setName] = useState("");

  const fetchBrands = async () => {
    try {
      const response = await getAllBrands();
      if (Array.isArray(response.data)) {
        setBrands(response.data);
      } else {
        setBrands([]);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    }
  };

  const handleCreate = async () => {
    try {
      await createBrand({ name });
      setName("");
      fetchBrands();
    } catch (error) {
      console.error("Error creating brand:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBrand(id);
      fetchBrands();
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Brands</h2>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter brand name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Brand
        </button>
      </div>
      <ul className="divide-y divide-gray-200">
        {brands.length > 0 ? (
          brands.map((brand) => (
            <li
              key={brand.id}
              className="flex justify-between items-center py-3"
            >
              <span className="text-gray-700">{brand.name}</span>
              <button
                onClick={() => handleDelete(brand.id!)}
                className="text-white bg-red-500 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No brands available</li>
        )}
      </ul>
    </div>
  );
};

export default BrandComponent;
