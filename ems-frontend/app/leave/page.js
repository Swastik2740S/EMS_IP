'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LeaveList() {
  const [leaves, setLeaves] = useState([]);
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

    fetch('http://localhost:5000/api/leave', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(setLeaves)
      .catch(() => setError('Failed to fetch leave requests'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleApprove = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/leave/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update leave status');
      setLeaves(leaves.map(l => l.id === id ? { ...l, status } : l));
    } catch {
      setError('Failed to update leave status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this leave request?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/leave/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      setLeaves(leaves.filter(l => l.id !== id));
    } catch {
      setError('Failed to delete leave request');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading leave requests...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leave Requests</h1>
        {role === 'employee' && (
          <Link href="/leave/apply" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Apply for Leave
          </Link>
        )}
      </div>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              leaves.map(leave => (
                <tr key={leave.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {leave.Employee?.firstName} {leave.Employee?.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{leave.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{leave.start_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{leave.end_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{leave.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {role !== 'employee' && leave.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(leave.id, 'approved')}
                          className="text-green-600 hover:text-green-900 mr-2">Approve</button>
                        <button onClick={() => handleApprove(leave.id, 'rejected')}
                          className="text-red-600 hover:text-red-900 mr-2">Reject</button>
                      </>
                    )}
                    {(role === 'admin' || role === 'hr' || leave.status !== 'approved') && (
                      <button onClick={() => handleDelete(leave.id)}
                        className="text-red-600 hover:text-red-900">Delete</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
