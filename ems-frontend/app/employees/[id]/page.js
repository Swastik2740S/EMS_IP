'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditEmployee() {
  const { id } = useParams();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    hireDate: '',
    DepartmentId: '',
    RoleId: ''
  });
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    const fetchData = async () => {
      try {
        const [empRes, deptRes, roleRes] = await Promise.all([
          fetch(`http://localhost:5000/api/employees/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/departments', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('http://localhost:5000/api/roles', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!empRes.ok || !deptRes.ok || !roleRes.ok) throw new Error('Failed to fetch data');
        const [emp, depts, roles] = await Promise.all([empRes.json(), deptRes.json(), roleRes.json()]);
        setForm({
          firstName: emp.firstName || '',
          lastName: emp.lastName || '',
          phone: emp.phone || '',
          hireDate: emp.hireDate ? emp.hireDate.split('T')[0] : '',
          DepartmentId: emp.DepartmentId || '',
          RoleId: emp.RoleId || ''
        });
        setDepartments(depts);
        setRoles(roles);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      }
    };
    fetchData();
  }, [id, router]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update employee');
      }
      router.push('/employees');
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Employee</h1>
        <Link href="/employees" className="text-blue-600 hover:text-blue-800">Back to Employees</Link>
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">First Name*</label>
            <input name="firstName" type="text" value={form.firstName} onChange={handleChange} className="shadow border rounded w-full py-2 px-3" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Last Name*</label>
            <input name="lastName" type="text" value={form.lastName} onChange={handleChange} className="shadow border rounded w-full py-2 px-3" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="shadow border rounded w-full py-2 px-3" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Hire Date</label>
            <input name="hireDate" type="date" value={form.hireDate} onChange={handleChange} className="shadow border rounded w-full py-2 px-3" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Department*</label>
            <select name="DepartmentId" value={form.DepartmentId} onChange={handleChange} className="shadow border rounded w-full py-2 px-3" required>
              <option value="">Select Department</option>
              {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Role*</label>
            <select name="RoleId" value={form.RoleId} onChange={handleChange} className="shadow border rounded w-full py-2 px-3" required>
              <option value="">Select Role</option>
              {roles.map(role => <option key={role.id} value={role.id}>{role.title}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6">
          <button type="submit" className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
            {loading ? 'Updating...' : 'Update Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
