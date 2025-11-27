import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';

export default function BusinessDashboard() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    activeBookings: 0,
    totalSpent: 0,
    averageDeliveryTime: 0,
    successRate: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user bookings
      const bookingsRes = await api.get(`/bookings/user/${user._id}?limit=10`);
      const bookings = bookingsRes.data.data || [];
      setRecentBookings(bookings);

      // Calculate stats
      const totalBookings = bookingsRes.data.pagination?.total || 0;
      const completedBookings = bookings.filter(b => b.status === 'completed').length;
      const activeBookings = bookings.filter(b =>
        ['pending', 'driver_assigned', 'picked_up', 'in_transit'].includes(b.status)
      ).length;
      const totalSpent = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.pricing?.total || 0), 0);
      const successRate = totalBookings > 0 ? (completedBookings / totalBookings * 100).toFixed(1) : 0;

      setStats({
        totalBookings,
        completedBookings,
        activeBookings,
        totalSpent,
        averageDeliveryTime: 45, // Mock data
        successRate
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: '📦',
      color: 'bg-blue-500'
    },
    {
      title: 'Completed',
      value: stats.completedBookings,
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      title: 'Active Deliveries',
      value: stats.activeBookings,
      icon: '🚚',
      color: 'bg-yellow-500'
    },
    {
      title: 'Total Spent',
      value: `₹${stats.totalSpent.toLocaleString()}`,
      icon: '💰',
      color: 'bg-purple-500'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: '📊',
      color: 'bg-indigo-500'
    },
    {
      title: 'Avg Delivery Time',
      value: `${stats.averageDeliveryTime} min`,
      icon: '⏱️',
      color: 'bg-pink-500'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      driver_assigned: 'bg-blue-100 text-blue-800',
      picked_up: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
        </div>

        {/* Subscription Status */}
        {user?.subscriptionActive ? (
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Premium Business Account</h3>
                <p className="text-green-100 mt-1">
                  Active until {new Date(user.subscriptionExpiry).toLocaleDateString()}
                </p>
              </div>
              <div className="text-4xl">👑</div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Upgrade to Business Premium</h3>
                <p className="text-blue-100 mt-1">
                  Get bulk discounts, priority support, and advanced analytics
                </p>
              </div>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-3">
            <span className="text-2xl">📦</span>
            <span className="font-semibold">New Booking</span>
          </button>
          <button className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-3">
            <span className="text-2xl">📊</span>
            <span className="font-semibold">View Analytics</span>
          </button>
          <button className="bg-purple-600 text-white p-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-3">
            <span className="text-2xl">📄</span>
            <span className="font-semibold">Download Reports</span>
          </button>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No bookings yet</p>
              <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Create Your First Booking
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Booking ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">From → To</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {booking.bookingId}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        <div className="max-w-xs truncate">
                          {booking.pickup?.address} → {booking.drop?.address}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        ₹{booking.pricing?.total}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
