'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Salaries() {
  const [salaries, setSalaries] = useState([]);
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
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
      .then(data => {
        setSalaries(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch salaries');
        setLoading(false);
      });
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
      setSalaries(salaries.filter(salary => salary.id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-1/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <div className="h-12 bg-gray-100 animate-pulse"></div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 border-b border-gray-100 bg-gray-50 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Salaries</h1>
        {(role === 'admin' || role === 'hr') && (
          <Link href="/salaries/add" className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-lg shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Salary
          </Link>
        )}
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Effective From</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Effective To</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {salaries.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
                  No salary records found.
                </td>
              </tr>
            ) : (
              salaries.map(sal => (
                <tr key={sal.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-blue-700 font-medium whitespace-nowrap">{sal.Employee?.firstName} {sal.Employee?.lastName}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold whitespace-nowrap">{sal.amount}</td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{sal.effective_from}</td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{sal.effective_to || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <Link href={`/salaries/${sal.id}`} className="text-indigo-600 hover:text-indigo-900 font-semibold transition">Edit</Link>
                    {(role === 'admin' || role === 'hr') && (
                      <button 
                        onClick={() => handleDelete(sal.id)}
                        className="text-red-600 hover:text-red-800 font-semibold transition"
                      >
                        Delete
                      </button>
                    )}
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
