'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditAttendance() {
  const { id } = useParams();
  const [form, setForm] = useState({ date: '', check_in: '', check_out: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetch(`http://localhost:5000/api/attendance/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => setForm({
        date: data.date || '',
        check_in: data.check_in || '',
        check_out: data.check_out || ''
      }))
      .catch(() => setError('Failed to load attendance record'));
  }, [id, router]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/attendance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to update');
      router.push('/attendance');
    } catch {
      setError('Failed to update attendance record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Attendance</h1>
        <Link href="/attendance" className="text-blue-600 hover:text-blue-800">
          Back to Attendance
        </Link>
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Check In</label>
          <input name="check_in" type="time" value={form.check_in} onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Check Out</label>
          <input name="check_out" type="time" value={form.check_out} onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3" />
        </div>
        <button type="submit"
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}>
          {loading ? 'Updating...' : 'Update Attendance'}
        </button>
      </form>
    </div>
  );
}
