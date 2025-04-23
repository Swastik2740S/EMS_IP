'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ApplyLeave() {
  const [form, setForm] = useState({
    type: 'vacation',
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply for leave');
      setMessage('Leave request submitted!');
      setForm({ type: 'vacation', start_date: '', end_date: '', reason: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Apply for Leave</h1>
        <Link href="/leave" className="text-blue-600 hover:text-blue-800">
          Back to Leave Requests
        </Link>
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
          <select name="type" value={form.type} onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3">
            <option value="vacation">Vacation</option>
            <option value="sick">Sick</option>
            <option value="personal">Personal</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
          <input type="date" name="start_date" value={form.start_date} onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
          <input type="date" name="end_date" value={form.end_date} onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3" required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Reason</label>
          <textarea name="reason" value={form.reason} onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3" rows={3} />
        </div>
        <button type="submit"
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}>
          {loading ? 'Submitting...' : 'Apply'}
        </button>
      </form>
    </div>
  );
}
