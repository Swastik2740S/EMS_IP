'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MarkAttendance() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMark = async (type) => {
    setLoading(true);
    setError('');
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type }) // type: 'check_in' or 'check_out'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to mark attendance');
      setMessage(data.message || 'Attendance marked!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mark Attendance</h1>
        <Link href="/attendance" className="text-blue-600 hover:text-blue-800">
          Back to Attendance
        </Link>
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}
      <div className="flex space-x-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => handleMark('check_in')}
          disabled={loading}
        >
          {loading ? 'Marking...' : 'Check In'}
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => handleMark('check_out')}
          disabled={loading}
        >
          {loading ? 'Marking...' : 'Check Out'}
        </button>
      </div>
    </div>
  );
}
