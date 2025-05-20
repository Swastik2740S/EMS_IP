'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StatCard from '../components/StatCard';
import SalarySlip from '../components/SalarySlip';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import {
  UserIcon, UsersIcon, CalendarIcon, DocumentCheckIcon,
  BanknotesIcon, BuildingOfficeIcon, BriefcaseIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(function () {
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

    async function fetchData() {
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
    }

    fetchData();
  }, [router]);

  // Loading skeleton with animate-pulse
  if (!stats) {
    return (
      <div className="p-8 space-y-8">
        <div className="h-9 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(function(i) {
            return <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>;
          })}
        </div>
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  // Safely get firstName for greeting
  let firstName = stats.firstName || '';
  if (!firstName && stats.name) {
    firstName = stats.name.split(' ')[0];
  } else if (!firstName && stats.fullName) {
    firstName = stats.fullName.split(' ')[0];
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        {role === 'employee'
          ? firstName
            ? `Welcome back, ${firstName}`
            : 'My Dashboard'
          : 'Company Overview'}
      </h1>
      {role !== 'employee'
        ? <AdminDashboard stats={stats} />
        : <EmployeeDashboard stats={stats} />}
    </div>
  );
}

function AdminDashboard(props) {
  var stats = props.stats;
  return (
    <React.Fragment>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link href="/employees" className="transition-transform hover:-translate-y-1">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={<UsersIcon className="h-6 w-6 text-white" />}
            color="bg-gradient-to-br from-blue-500 to-blue-700"
          />
        </Link>
        <Link href="/attendance" className="transition-transform hover:-translate-y-1">
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            icon={<UserIcon className="h-6 w-6 text-white" />}
            color="bg-gradient-to-br from-green-500 to-green-700"
          />
        </Link>
        <Link href="/leave" className="transition-transform hover:-translate-y-1">
          <StatCard
            title="Pending Leaves"
            value={stats.pendingLeaves}
            icon={<DocumentCheckIcon className="h-6 w-6 text-white" />}
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
          />
        </Link>
        <Link href="/salaries" className="transition-transform hover:-translate-y-1">
          <StatCard
            title="Payroll"
            value={stats.totalPayroll ? `₹${stats.totalPayroll}` : 'View'}
            icon={<BanknotesIcon className="h-6 w-6 text-white" />}
            color="bg-gradient-to-br from-emerald-500 to-emerald-700"
          />
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Department Distribution</h2>
            <Link href="/departments" className="text-blue-600 hover:text-blue-700 text-sm">View All →</Link>
          </div>
          <BarChart width={500} height={300} data={Array.isArray(stats.departmentData) ? stats.departmentData : []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fill: '#6b7280' }} axisLine={{ stroke: '#d1d5db' }} />
            <YAxis tick={{ fill: '#6b7280' }} axisLine={{ stroke: '#d1d5db' }} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
            <Bar dataKey="employees" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Leave Status Ratio</h2>
            <Link href="/leave" className="text-blue-600 hover:text-blue-700 text-sm">View Details →</Link>
          </div>
          <PieChart width={500} height={300}>
            <Pie
              data={Array.isArray(stats.leaveStatus) ? stats.leaveStatus : []}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              paddingAngle={2}
              label
            >
              {(Array.isArray(stats.leaveStatus) ? stats.leaveStatus : []).map(function(entry, index) {
                return <Cell key={index} fill={['#10B981', '#EF4444', '#F59E0B'][index]} stroke="#fff" strokeWidth={2} />;
              })}
            </Pie>
            <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ paddingLeft: 20 }} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
          </PieChart>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-xl shadow p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
          <Link href="/activity" className="text-blue-600 hover:text-blue-700 text-sm">View All →</Link>
        </div>
        <div className="space-y-4">
          {Array.isArray(stats.recentActivity) && stats.recentActivity.length > 0 ? (
            stats.recentActivity.map(function(activity, index) {
              return (
                <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <BriefcaseIcon className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-500 text-sm">No recent activity.</div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

function EmployeeDashboard(props) {
  var stats = props.stats || {};

  // Safely get firstName and lastName (prefer separate fields, fallback to name/fullName split)
  let firstName = stats.firstName || '';
  let lastName = stats.lastName || '';
  if ((!firstName || !lastName) && stats.name) {
    const parts = stats.name.split(' ');
    firstName = parts[0] || '';
    lastName = parts.slice(1).join(' ') || '';
  } else if ((!firstName || !lastName) && stats.fullName) {
    const parts = stats.fullName.split(' ');
    firstName = parts[0] || '';
    lastName = parts.slice(1).join(' ') || '';
  }

  return (
    <React.Fragment>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/attendance" className="transition-transform hover:-translate-y-1">
          <StatCard
            title="Total Attendance"
            value={(Array.isArray(stats.attendance) ? stats.attendance.length : 0) + " days"}
            icon={<CalendarIcon className="h-6 w-6 text-white" />}
            color="bg-gradient-to-br from-purple-500 to-purple-700"
          />
        </Link>
        <Link href="/leave" className="transition-transform hover:-translate-y-1">
          <StatCard
            title="Approved Leaves"
            value={stats.totalLeaves}
            icon={<DocumentCheckIcon className="h-6 w-6 text-white" />}
            color="bg-gradient-to-br from-green-500 to-green-700"
          />
        </Link>
        <Link href="/leave" className="transition-transform hover:-translate-y-1">
          <StatCard
            title="Upcoming Leaves"
            value={stats.upcomingLeaves}
            icon={<CalendarIcon className="h-6 w-6 text-white" />}
            color="bg-gradient-to-br from-blue-500 to-blue-700"
          />
        </Link>
      </div>
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Attendance Trend (Last 30 Days)</h2>
        <LineChart width={700} height={300} data={Array.isArray(stats.attendance) ? stats.attendance : []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="hours" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
        </LineChart>
      </div>
      <SalarySlip 
        employee={{
          id: stats.employeeId || stats.id || 'N/A',
          firstName: firstName,
          lastName: lastName,
          position: stats.position || stats.role || 'N/A',
          department: stats.department || stats.Department?.name || 'N/A'
        }}
        salaryData={{
          basic: stats.salary?.basic || 0,
          hra: stats.salary?.hra || 0,
          allowances: stats.salary?.allowances || 0,
          tax: stats.salary?.tax || 0,
          pf: stats.salary?.pf || 0,
          loans: stats.salary?.loans || 0,
          total_deductions: stats.salary?.total_deductions || 0,
          net_pay: stats.salary?.net_pay || 0,
          payment_date: stats.salary?.payment_date || 'Pending'
        }}
      />
    </React.Fragment>
  );
}
