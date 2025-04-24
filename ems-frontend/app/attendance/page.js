'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Get user role
    try {
      const data = JSON.parse(atob(token.split('.')[1]));
      setRole(data.role);
    } catch {}

    // Load attendance
    fetch('http://localhost:5000/api/attendance', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(setRecords)
      .catch(() => setError('Failed to load attendance'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/attendance/check-in', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRecords([data, ...records]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/attendance/check-out', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRecords(records.map(r => r.id === data.id ? data : r));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading attendance...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance Records</h1>
        {role === 'employee' && (
          <div className="flex gap-4">
            <button 
              onClick={handleCheckIn}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Check In
            </button>
            <button 
              onClick={handleCheckOut}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Check Out
            </button>
          </div>
        )}
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {role !== 'employee' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No attendance records found
                </td>
              </tr>
            ) : (
              records.map(record => (
                <tr key={record.id}>
                  {role !== 'employee' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.Employee?.firstName} {record.Employee?.lastName}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.check_in || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{record.check_out || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
