'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/employees', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }

        const data = await response.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [router]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
          <div className="h-12 bg-gray-100 animate-pulse"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 border-b border-gray-100 bg-gray-50 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <Link 
          href="/employees/add" 
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {employees.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
                  No employees found. Create one to get started.
                </td>
              </tr>
            ) : (
              employees.map(employee => (
                <tr 
                  key={employee.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-blue-700 font-medium whitespace-nowrap">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-800 whitespace-nowrap">{employee.phone}</td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                    {employee.Department?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                    {employee.Role?.title || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <Link
                      href={`/employees/${employee.id}`}
                      className="text-indigo-600 hover:text-indigo-900 font-semibold transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="text-red-600 hover:text-red-800 font-semibold transition"
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
