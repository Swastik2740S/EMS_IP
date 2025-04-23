'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Salaries() {
  const [salaries, setSalaries] = useState([]);
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Get user role from token
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setRole(decoded.role);
    } catch (error) {
      setError('Error verifying user role');
    }

    // Fetch salaries
    fetch('http://localhost:5000/api/salaries', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(setSalaries)
      .catch(() => setError('Failed to fetch salaries'));
  }, [router]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this salary record?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/salaries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete salary');
      
      // Remove deleted salary from state
      setSalaries(salaries.filter(salary => salary.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Salaries</h1>
        {role === 'admin' || role === 'hr' ? (
          <Link href="/salaries/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Salary
          </Link>
        ) : null}
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective From</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salaries.map(sal => (
              <tr key={sal.id}>
                <td className="px-6 py-4 whitespace-nowrap">{sal.Employee?.firstName} {sal.Employee?.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sal.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sal.effective_from}</td>
                <td className="px-6 py-4 whitespace-nowrap">{sal.effective_to || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/salaries/${sal.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                  {(role === 'admin' || role === 'hr') && (
                    <button 
                      onClick={() => handleDelete(sal.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
