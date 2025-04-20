'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/roles', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }

        const data = await response.json();
        setRoles(data);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [router]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/roles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to delete role');
      }

      setRoles(roles.filter(role => role.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete role');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading roles...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Roles</h1>
        <Link 
          href="/roles/add" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Role
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No roles found. Create one to get started.
                </td>
              </tr>
            ) : (
              roles.map(role => (
                <tr key={role.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{role.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{role.title}</td>
                  <td className="px-6 py-4">{role.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{role.salaryGrade}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/roles/${role.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
