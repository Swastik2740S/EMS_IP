'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditSalary() {
  const { id } = useParams();
  const [form, setForm] = useState({ 
    employee_id: '', 
    amount: '', 
    effective_from: '', 
    effective_to: '' 
  });
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch salary data and employees
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

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/salaries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Salary</h1>
        <Link href="/salaries" className="text-blue-600 hover:text-blue-800">
          Back to Salaries
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Employee</label>
          <select
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
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
          <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Effective From</label>
          <input
            type="date"
            name="effective_from"
            value={form.effective_from}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Effective To</label>
          <input
            type="date"
            name="effective_to"
            value={form.effective_to}
            onChange={handleChange}
            className="w-full border rounded p-2"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Salary'}
        </button>

        {error && <div className="mt-4 text-red-600">{error}</div>}
      </form>
    </div>
  );
}
