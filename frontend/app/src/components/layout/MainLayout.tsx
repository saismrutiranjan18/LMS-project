import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useUIStore, useAuthStore, useNotificationStore } from '@/store';

export default function MainLayout() {
  const { sidebarOpen } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <Sidebar />
      
      <main 
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pt-20 ${
          sidebarOpen ? 'ml-64' : 'ml-16'
        }`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
