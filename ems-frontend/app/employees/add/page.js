'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddEmployee() {
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
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch departments and roles for dropdowns
    const fetchData = async () => {
      try {
        const [deptResponse, roleResponse] = await Promise.all([
          fetch('http://localhost:5000/api/departments', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5000/api/roles', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!deptResponse.ok || !roleResponse.ok) {
          throw new Error('Failed to fetch required data');
        }

        const [deptData, roleData] = await Promise.all([
          deptResponse.json(),
          roleResponse.json()
        ]);

        setDepartments(deptData);
        setRoles(roleData);
      } catch (err) {
        setError(err.message || 'Failed to load required data');
      }
    };

    fetchData();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First name and last name are required');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create employee');
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
        <h1 className="text-2xl font-bold">Add Employee</h1>
        <Link
          href="/employees"
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Employees
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
              First Name*
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
              Last Name*
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hireDate">
              Hire Date
            </label>
            <input
              id="hireDate"
              name="hireDate"
              type="date"
              value={form.hireDate}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="DepartmentId">
              Department*
            </label>
            <select
              id="DepartmentId"
              name="DepartmentId"
              value={form.DepartmentId}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="RoleId">
              Role*
            </label>
            <select
              id="RoleId"
              name="RoleId"
              value={form.RoleId}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Employee'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/employees')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
