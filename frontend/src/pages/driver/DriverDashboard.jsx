import { useEffect, useState } from 'react';
import { Package, DollarSign, TrendingUp, Star } from 'lucide-react';
import { driverAPI, bookingAPI } from '../../utils/api';
import useAuthStore from '../../store/authStore';

export default function DriverDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [activeBookings, setActiveBookings] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchActiveBookings();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await driverAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const fetchActiveBookings = async () => {
    try {
      const response = await bookingAPI.getDriverBookings(user._id, {
        status: 'driver_assigned,picked_up,in_transit'
      });
      setActiveBookings(response.data.data);
    } catch (error) {
      console.error('Failed to fetch bookings');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cr-dark">Driver Dashboard</h1>
        <p className="text-primary-700 mt-2">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Total Deliveries</p>
              <p className="text-2xl font-bold">{stats?.totalDeliveries || 0}</p>
            </div>
            <Package size={32} className="text-cr-dark" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Completed</p>
              <p className="text-2xl font-bold">{stats?.completedDeliveries || 0}</p>
            </div>
            <TrendingUp size={32} className="text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Total Earnings</p>
              <p className="text-2xl font-bold">₹{stats?.totalEarnings || 0}</p>
            </div>
            <DollarSign size={32} className="text-cr-dark" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Rating</p>
              <p className="text-2xl font-bold">{stats?.rating?.average?.toFixed(1) || '0.0'}</p>
            </div>
            <Star size={32} className="text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-cr-dark mb-4">Active Deliveries</h2>
        {activeBookings.length === 0 ? (
          <p className="text-center text-primary-700 py-8">No active deliveries</p>
        ) : (
          <div className="space-y-3">
            {activeBookings.map((booking) => (
              <div key={booking._id} className="p-4 bg-primary-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">#{booking.bookingId}</p>
                    <p className="text-sm text-primary-700">{booking.pickup.address} → {booking.drop.address}</p>
                  </div>
                  <span className="badge badge-info">{booking.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
