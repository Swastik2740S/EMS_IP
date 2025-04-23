'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AttendanceList() {
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
    // Get user role from token
    try {
      const data = JSON.parse(atob(token.split('.')[1]));
      setRole(data.role);
    } catch {}

    fetch('http://localhost:5000/api/attendance', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(setRecords)
      .catch(() => setError('Failed to fetch attendance records'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/attendance/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      setRecords(records.filter(r => r.id !== id));
    } catch {
      setError('Failed to delete attendance record');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading attendance...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance Records</h1>
        <Link href="/attendance/mark" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Mark Attendance
        </Link>
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
              {role !== 'employee' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.length === 0 ? (
              <tr>
                <td colSpan={role !== 'employee' ? 5 : 4} className="px-6 py-4 text-center text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              records.map(rec => (
                <tr key={rec.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rec.Employee?.firstName} {rec.Employee?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{rec.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{rec.check_in || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{rec.check_out || '-'}</td>
                  {role !== 'employee' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/attendance/${rec.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                      <button onClick={() => handleDelete(rec.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
