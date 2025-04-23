'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddSalary() {
  const [form, setForm] = useState({ employee_id: '', amount: '', effective_from: '', effective_to: '' });
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/employees', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(setEmployees)
      .catch(() => setEmployees([]));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/salaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to add salary');
      router.push('/salaries');
    } catch {
      setError('Failed to add salary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add Salary</h1>
        <Link href="/salaries" className="text-blue-600 hover:text-blue-800">Back to Salaries</Link>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Employee</label>
          <select name="employee_id" value={form.employee_id} onChange={handleChange} className="w-full border rounded p-2" required>
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
          <input type="number" name="amount" value={form.amount} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Effective From</label>
          <input type="date" name="effective_from" value={form.effective_from} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Effective To</label>
          <input type="date" name="effective_to" value={form.effective_to} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <button type="submit" className={`bg-blue-600 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
          {loading ? 'Adding...' : 'Add Salary'}
        </button>
      </form>
    </div>
  );
}
