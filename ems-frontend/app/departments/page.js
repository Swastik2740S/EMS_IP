'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchDepartments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/departments', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }

        const data = await response.json();
        setDepartments(data);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [router]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/departments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to delete department');
      }

      setDepartments(departments.filter(dept => dept.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete department');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading departments...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Departments</h1>
        <Link 
          href="/departments/add" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Department
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No departments found. Create one to get started.
                </td>
              </tr>
            ) : (
              departments.map(department => (
                <tr key={department.id}>
                  <td className="px-6 py-4 text-blue-700 whitespace-nowrap">{department.id}</td>
                  <td className="px-6 py-4 text-black whitespace-nowrap">{department.name}</td>
                  <td className="px-6 py-4 text-black">{department.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/departments/${department.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(department.id)}
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
