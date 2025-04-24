'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (token && pathname !== '/login') {
      setIsAuthenticated(true);
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        setUserRole(tokenData.role);
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    } else if (!token && pathname !== '/login') {
      router.push('/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  // Don't show navigation on login page
  if (pathname === '/login') {
    return (
      <html lang="en">
        <body className="bg-gray-50">{children}</body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="bg-gray-100">
        <div className="min-h-screen flex flex-col md:flex-row">
          {/* Sidebar / Navigation */}
          <div className={`bg-gray-800 text-white ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
            <div className="p-4 flex items-center justify-between">
              <h1 className={`font-bold text-xl transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden md:block'}`}>
                EMS
              </h1>
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white focus:outline-none"
              >
                {sidebarOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
            
            <nav className="mt-8">
              <div className="px-4 mb-4">
                <p className={`text-gray-400 uppercase text-xs ${!sidebarOpen && 'hidden'}`}>Main</p>
              </div>
              <Link href="/dashboard" className={`flex items-center py-2 px-4 ${pathname === '/' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className={`ml-2 ${!sidebarOpen && 'hidden'}`}>Dashboard</span>
              </Link>

              {/* Only show these links for admin or hr */}
              {(userRole === 'admin' || userRole === 'hr') && (
                <>
                  <Link href="/employees" className={`flex items-center py-2 px-4 ${pathname.startsWith('/employees') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className={`ml-2 ${!sidebarOpen && 'hidden'}`}>Employees</span>
                  </Link>
                  <Link href="/departments" className={`flex items-center py-2 px-4 ${pathname.startsWith('/departments') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className={`ml-2 ${!sidebarOpen && 'hidden'}`}>Departments</span>
                  </Link>
                  <Link href="/roles" className={`flex items-center py-2 px-4 ${pathname.startsWith('/roles') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className={`ml-2 ${!sidebarOpen && 'hidden'}`}>Roles</span>
                  </Link>
                  <Link href="/salaries" className={`flex items-center py-2 px-4 ${pathname.startsWith('/salaries') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                    <span className={`ml-2 ${!sidebarOpen && 'hidden'}`}>Salaries</span>
                  </Link>
                </>
              )}

              {/* Attendance and Leave are visible for all roles */}
              <Link href="/attendance" className={`flex items-center py-2 px-4 ${pathname.startsWith('/attendance') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={`ml-2 ${!sidebarOpen && 'hidden'}`}>Attendance</span>
              </Link>
              <Link href="/leave" className={`flex items-center py-2 px-4 ${pathname.startsWith('/leave') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-5h6v5m-7-8h8a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V11a2 2 0 012-2zm2-4h4a2 2 0 012 2v2H7V7a2 2 0 012-2z" />
                </svg>
                <span className={`ml-2 ${!sidebarOpen && 'hidden'}`}>Leave</span>
              </Link>

              <div className="px-4 mt-8 mb-4">
                <p className={`text-gray-400 uppercase text-xs ${!sidebarOpen && 'hidden'}`}>User</p>
              </div>
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center py-2 px-4 hover:bg-gray-700 text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className={`ml-2 ${!sidebarOpen && 'hidden'}`}>Logout</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top navigation */}
            <div className="bg-white shadow-sm">
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center">
                  <h2 className="text-lg font-semibold">
                    {pathname === '/' ? 'Dashboard' : 
                     pathname.startsWith('/employees') ? 'Employee Management' :
                     pathname.startsWith('/departments') ? 'Department Management' :
                     pathname.startsWith('/roles') ? 'Role Management' :
                     pathname.startsWith('/salaries') ? 'Salary Management' : ''}
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  {userRole && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Page content */}
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
