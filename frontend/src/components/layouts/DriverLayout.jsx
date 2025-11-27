import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Inbox, Navigation, Upload, DollarSign, LogOut, Menu, X, History, User } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import NotificationCenter from '../NotificationCenter';

export default function DriverLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/driver/login');
  };

  const handleAvailabilityToggle = async () => {
    try {
      setIsAvailable(!isAvailable);
      // TODO: API call to update driver availability
      // await driverAPI.updateAvailability(!isAvailable);
    } catch (error) {
      console.error('Failed to update availability:', error);
      setIsAvailable(!isAvailable); // Revert on error
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/driver', icon: LayoutDashboard },
    { name: 'Incoming Requests', href: '/driver/requests', icon: Inbox },
    { name: 'Trip History', href: '/driver/trips', icon: History },
    { name: 'Earnings', href: '/driver/earnings', icon: DollarSign },
    { name: 'Profile & Documents', href: '/driver/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-blue-600">CargoRapido</h1>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Driver</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">Driver ID: {user?._id?.slice(-6)}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <NotificationCenter />

            {/* Availability Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                {isAvailable ? 'Available' : 'Offline'}
              </span>
              <button
                onClick={handleAvailabilityToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAvailable ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAvailable ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              user?.status === 'online' ? 'bg-green-100 text-green-800' :
              user?.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {user?.status || 'offline'}
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
