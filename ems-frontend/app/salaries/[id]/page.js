'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditSalary() {
  const { id } = useParams();
  const [form, setForm] = useState({ employee_id: '', amount: '', effective_from: '', effective_to: '' });
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        // Fetch salary record
        const salaryRes = await fetch(`http://localhost:5000/api/salaries/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!salaryRes.ok) throw new Error('Failed to fetch salary');
        const salaryData = await salaryRes.json();

        // Fetch employees for dropdown
        const employeesRes = await fetch('http://localhost:5000/api/employees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const employeesData = await employeesRes.json();

        setForm({
          employee_id: salaryData.employee_id,
          amount: salaryData.amount,
          effective_from: salaryData.effective_from.split('T')[0],
          effective_to: salaryData.effective_to?.split('T')[0] || ''
        });
        setEmployees(employeesData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/salaries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to update salary');
      router.push('/salaries');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Edit Salary</h1>
          <p className="text-gray-600">Update salary details below</p>
        </div>
        <Link href="/salaries" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Salaries
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">Employee</label>
          <select
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
            required
            disabled={loading}
          >
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">Effective From</label>
          <input
            type="date"
            name="effective_from"
            value={form.effective_from}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Effective To</label>
          <input
            type="date"
            name="effective_to"
            value={form.effective_to}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900"
            disabled={loading}
          />
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-3 justify-end mt-8">
          <button
            type="button"
            onClick={() => router.push('/salaries')}
            className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2.5 text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 transition-all flex items-center justify-center gap-2 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update Salary'
            )}
          </button>
        </div>
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </form>
    </div>
  );
}
