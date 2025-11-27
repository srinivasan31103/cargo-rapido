import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Home, Package, Map, Wallet, User, LogOut, Menu, X, HelpCircle, MapPin, Gift, BarChart3, Users } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import NotificationCenter from '../NotificationCenter';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Different navigation based on user role
  const userNavigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'New Booking', href: '/dashboard/new-booking', icon: Package },
    { name: 'My Deliveries', href: '/dashboard/deliveries', icon: Map },
    { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
    { name: 'Saved Addresses', href: '/dashboard/addresses', icon: MapPin },
    { name: 'Referral', href: '/dashboard/referral', icon: Gift },
    { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
    { name: 'Profile', href: '/dashboard/profile', icon: User }
  ];

  const businessNavigation = [
    { name: 'Dashboard', href: '/business', icon: Home },
    { name: 'New Booking', href: '/dashboard/new-booking', icon: Package },
    { name: 'My Deliveries', href: '/dashboard/deliveries', icon: Map },
    { name: 'Analytics', href: '/business/analytics', icon: BarChart3 },
    { name: 'Team', href: '/business/team', icon: Users },
    { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
    { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
    { name: 'Profile', href: '/dashboard/profile', icon: User }
  ];

  const navigation = user?.role === 'business' ? businessNavigation : userNavigation;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b">
            <h1 className="text-2xl font-bold text-blue-600">CargoRapido</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* User info */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
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

          {/* Logout */}
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

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <NotificationCenter />
            <div className="text-right">
              <p className="text-sm text-gray-500">Wallet Balance</p>
              <p className="font-semibold text-green-600">₹{user?.wallet?.balance || 0}</p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
