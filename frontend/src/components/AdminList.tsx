/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch users on component mount
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/admin/admins');
        console.log(response.data);
        setAdmins(response.data);
      } catch (err) {
        setError('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300">ID</th>
              <th className="px-4 py-2 border border-gray-300">Username</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="px-4 py-2 border border-gray-300">{admin.id}</td>
                <td className="px-4 py-2 border border-gray-300">{admin.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminList;
