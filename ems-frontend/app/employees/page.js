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

  if (loading) return <div className="p-8 text-center">Loading employees...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Link 
          href="/employees/add" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Employee
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No employees found. Create one to get started.
                </td>
              </tr>
            ) : (
              employees.map(employee => (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{employee.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.Department?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.Role?.title || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/employees/${employee.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(employee.id)}
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
