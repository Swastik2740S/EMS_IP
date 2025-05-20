'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ApproveLeaveRequest() {
  const { id } = useParams();
  const router = useRouter();
  const [leave, setLeave] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');

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

    fetch(`http://localhost:5000/api/leave/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(setLeave)
      .catch(() => setError('Failed to fetch leave request'));
  }, [id, router]);

  const handleAction = async (status) => {
    setLoading(true);
    setError('');
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/leave/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update leave status');
      }
      setMessage(`Leave request ${status}.`);
      setLeave({ ...leave, status });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!leave) return <div className="p-8">Loading leave request...</div>;

  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Leave Request Details</h1>
        <Link href="/leave" className="text-blue-600 hover:text-blue-800">
          Back to Leave Requests
        </Link>
      </div>
      {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 mb-6">
        <p><span className="font-semibold">Employee:</span> {leave.Employee?.firstName} {leave.Employee?.lastName}</p>
        <p><span className="font-semibold">Type:</span> {leave.type}</p>
        <p><span className="font-semibold">Start Date:</span> {leave.start_date}</p>
        <p><span className="font-semibold">End Date:</span> {leave.end_date}</p>
        <p><span className="font-semibold">Reason:</span> {leave.reason || '-'}</p>
        <p><span className="font-semibold">Status:</span> <span className={
          leave.status === 'pending' ? 'text-yellow-600 font-semibold' :
          leave.status === 'approved' ? 'text-green-600 font-semibold' :
          'text-red-600 font-semibold'
        }>{leave.status}</span></p>
      </div>
      {role !== 'employee' && leave.status === 'pending' && (
        <div className="flex space-x-4">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={() => handleAction('approved')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Approve'}
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            onClick={() => handleAction('rejected')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Reject'}
          </button>
        </div>
      )}
    </div>
  );
}
