import { Link } from 'react-router-dom';
import { Package, MapPin, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { bookingAPI } from '../../utils/api';
import useAuthStore from '../../store/authStore';

export default function Home() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    activeBookings: 0,
    completedBookings: 0,
    totalSpent: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await bookingAPI.getUserBookings(user._id, { limit: 100 });
      const bookings = response.data.data;

      const active = bookings.filter(b =>
        ['pending', 'driver_assigned', 'picked_up', 'in_transit'].includes(b.status)
      ).length;

      const completed = bookings.filter(b => b.status === 'completed').length;

      const spent = bookings
        .filter(b => b.payment.status === 'completed')
        .reduce((sum, b) => sum + b.pricing.total, 0);

      setStats({ activeBookings: active, completedBookings: completed, totalSpent: spent });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
        <p className="text-gray-500 mt-2">Ready to send your cargo?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/dashboard/new-booking"
          className="card hover:shadow-elegant-lg transition-shadow bg-gradient-dark text-cr-white"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Package size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">New Booking</h3>
              <p className="text-primary-200 text-sm">Book a delivery now</p>
            </div>
          </div>
        </Link>

        <Link
          to="/dashboard/deliveries"
          className="card hover:shadow-elegant-lg transition-shadow bg-gradient-to-br from-primary-700 to-primary-800 text-cr-white"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Track Deliveries</h3>
              <p className="text-primary-200 text-sm">View all bookings</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Active Bookings</p>
              <p className="text-2xl font-bold text-cr-dark">{stats.activeBookings}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Clock size={24} className="text-cr-dark" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Completed</p>
              <p className="text-2xl font-bold text-cr-dark">{stats.completedBookings}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <TrendingUp size={24} className="text-cr-dark" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Total Spent</p>
              <p className="text-2xl font-bold text-cr-dark">₹{stats.totalSpent.toFixed(0)}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <DollarSign size={24} className="text-cr-dark" />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="card">
        <h2 className="text-xl font-semibold text-cr-dark mb-4">Why Choose CargoRapido?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
              <Package size={20} className="text-cr-dark" />
            </div>
            <h3 className="font-semibold text-cr-dark mb-2">Fast Delivery</h3>
            <p className="text-sm text-primary-700">Get your cargo delivered in hours, not days</p>
          </div>
          <div>
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
              <MapPin size={20} className="text-cr-dark" />
            </div>
            <h3 className="font-semibold text-cr-dark mb-2">Live Tracking</h3>
            <p className="text-sm text-primary-700">Track your delivery in real-time on the map</p>
          </div>
          <div>
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
              <DollarSign size={20} className="text-cr-dark" />
            </div>
            <h3 className="font-semibold text-cr-dark mb-2">Transparent Pricing</h3>
            <p className="text-sm text-primary-700">No hidden charges, pay only what you see</p>
          </div>
        </div>
      </div>
    </div>
  );
}
