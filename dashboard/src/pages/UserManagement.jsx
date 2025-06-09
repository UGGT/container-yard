// src/pages/UserManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BackgroundWrapper from "../components/BackgroundWrapper";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5050/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <BackgroundWrapper>
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">👥 User Management</h2>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-t hover:bg-blue-50`}>
                <td className="px-4 py-2 font-medium">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'admin' ? 'bg-red-100 text-red-700' :
                    user.role === 'crane_operator' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs text-gray-500">{new Date(user.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </BackgroundWrapper>
  );
};

export default UserManagement;