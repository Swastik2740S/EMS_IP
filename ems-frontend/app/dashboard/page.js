'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '../components/StatCard';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import { UserIcon, UsersIcon, CalendarIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    let decoded;
    try {
      decoded = JSON.parse(atob(token.split('.')[1]));
      setRole(decoded.role);
    } catch (err) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const endpoint = decoded.role === 'employee'
          ? 'http://localhost:5000/api/dashboard/employee'
          : 'http://localhost:5000/api/dashboard/admin';
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (error) {
        setStats(null);
      }
    };

    fetchData();
  }, [router]);

  if (!stats) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4">
        {role === 'employee' ? 'My Dashboard' : 'Company Overview'}
      </h1>
      {role !== 'employee' ? (
        <AdminDashboard stats={stats} />
      ) : (
        <EmployeeDashboard stats={stats} />
      )}
    </div>
  );
}

// Admin/HR Dashboard
function AdminDashboard({ stats }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<UsersIcon className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Present Today"
          value={stats.presentToday}
          icon={<UserIcon className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Pending Leaves"
          value={stats.pendingLeaves}
          icon={<DocumentCheckIcon className="h-6 w-6 text-white" />}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Department Distribution</h2>
          <BarChart width={400} height={300} data={stats.departmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="employees" fill="#3B82F6" />
          </BarChart>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Leave Status Ratio</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={stats.leaveStatus}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {stats.leaveStatus.map((entry, index) => (
                <Cell key={index} fill={['#10B981', '#EF4444', '#F59E0B'][index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </>
  );
}

// Employee Dashboard
function EmployeeDashboard({ stats }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Attendance"
          value={`${stats.attendance.length} days`}
          icon={<CalendarIcon className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Approved Leaves"
          value={stats.totalLeaves}
          icon={<DocumentCheckIcon className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Upcoming Leaves"
          value={stats.upcomingLeaves}
          icon={<CalendarIcon className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Attendance Trend (Last 30 Days)</h2>
        <LineChart width={700} height={300} data={stats.attendance}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="hours" stroke="#8B5CF6" />
        </LineChart>
      </div>
    </>
  );
}
