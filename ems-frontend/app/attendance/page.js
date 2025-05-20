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

    try {
      const data = JSON.parse(atob(token.split('.')[1]));
      setRole(data.role);
    } catch {}

    fetch('http://localhost:5000/api/attendance', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setRecords(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load attendance');
        setLoading(false);
      });
  }, [router]);

  const handleCheckIn = async () => {
    const token = localStorage.getItem('token');
    try {
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
    const token = localStorage.getItem('token');
    try {
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

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading attendance...</div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Attendance Records</h1>
        {role === 'employee' && (
          <div className="flex gap-4">
            <button 
              onClick={handleCheckIn}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Check In
            </button>
            <button 
              onClick={handleCheckOut}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Check Out
            </button>
          </div>
        )}
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
              {role !== 'employee' && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Employee</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Check In</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Check Out</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={role !== 'employee' ? 4 : 3} className="px-6 py-6 text-center text-gray-500">
                  No attendance records found
                </td>
              </tr>
            ) : (
              records.map(record => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  {role !== 'employee' && (
                    <td className="px-6 py-4 whitespace-nowrap text-blue-700 font-medium">
                      {record.Employee?.firstName} {record.Employee?.lastName}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{record.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{record.check_in || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{record.check_out || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
