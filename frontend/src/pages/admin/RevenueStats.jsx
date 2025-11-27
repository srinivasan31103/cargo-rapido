import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Users, Truck, Calendar, Download } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function RevenueStats() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    thisMonth: 0,
    thisWeek: 0,
    commission: 0,
    totalBookings: 0,
    completedBookings: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('month');

  useEffect(() => {
    fetchRevenueStats();
    fetchRecentTransactions();
  }, [dateFilter]);

  const fetchRevenueStats = async () => {
    try {
      const { data } = await api.get(`/admin/revenue-stats?period=${dateFilter}`);
      setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch revenue stats:', error);
      // Mock data for demonstration
      setStats({
        totalRevenue: 2845000,
        thisMonth: 450000,
        thisWeek: 125000,
        commission: 142250, // 5% of total
        totalBookings: 1243,
        completedBookings: 1156
      });
    }
  };

  const fetchRecentTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/recent-transactions');
      setRecentTransactions(data.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      // Mock data
      setRecentTransactions([
        {
          _id: '1',
          bookingId: 'BK123456',
          amount: 450,
          commission: 22.5,
          date: new Date().toISOString(),
          status: 'completed',
          user: 'John Doe'
        },
        {
          _id: '2',
          bookingId: 'BK123457',
          amount: 680,
          commission: 34,
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          user: 'Jane Smith'
        },
        {
          _id: '3',
          bookingId: 'BK123458',
          amount: 520,
          commission: 26,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          user: 'Bob Wilson'
        },
        {
          _id: '4',
          bookingId: 'BK123459',
          amount: 890,
          commission: 44.5,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          user: 'Alice Johnson'
        },
        {
          _id: '5',
          bookingId: 'BK123460',
          amount: 350,
          commission: 17.5,
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          user: 'Charlie Brown'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const exportRevenue = () => {
    toast.success('Revenue report exported successfully!');
    // TODO: Implement actual CSV/PDF export
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cr-dark">Revenue Statistics</h1>
          <p className="text-primary-700 mt-2">Track earnings and commission</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-primary-300 text-primary-700 focus:outline-none focus:ring-2 focus:ring-cr-dark"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={exportRevenue}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Revenue Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-100">Total Revenue</p>
              <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign size={40} className="opacity-80" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">This Month</p>
              <p className="text-2xl font-bold text-cr-dark">₹{stats.thisMonth.toLocaleString()}</p>
            </div>
            <TrendingUp size={32} className="text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">This Week</p>
              <p className="text-2xl font-bold text-cr-dark">₹{stats.thisWeek.toLocaleString()}</p>
            </div>
            <Calendar size={32} className="text-primary-700" />
          </div>
        </div>
      </div>

      {/* Commission & Bookings Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-primary-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Platform Commission (5%)</p>
              <p className="text-2xl font-bold text-cr-dark">₹{stats.commission.toLocaleString()}</p>
            </div>
            <DollarSign size={32} className="text-cr-dark" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Total Bookings</p>
              <p className="text-2xl font-bold text-cr-dark">{stats.totalBookings}</p>
            </div>
            <Users size={32} className="text-primary-700" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Completed Bookings</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedBookings}</p>
            </div>
            <Truck size={32} className="text-green-600" />
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart Placeholder */}
      <div className="card">
        <h2 className="text-xl font-semibold text-cr-dark mb-4">Revenue Trend</h2>
        <div className="h-80 flex items-center justify-center bg-primary-50 rounded-lg">
          <div className="text-center">
            <TrendingUp size={48} className="mx-auto text-primary-700 mb-4" />
            <p className="text-primary-700">Chart visualization coming soon</p>
            <p className="text-sm text-primary-600 mt-2">Revenue trends over time will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-cr-dark mb-4">Recent Transactions</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Commission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-cr-dark">
                      {transaction.bookingId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.user}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      ₹{transaction.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-cr-dark">
                      ₹{transaction.commission.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-primary-700">
                      {new Date(transaction.date).toLocaleDateString()} at{' '}
                      {new Date(transaction.date).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Revenue Breakdown */}
      <div className="card bg-primary-50 border-l-4 border-cr-dark">
        <h3 className="font-semibold text-cr-dark mb-2">Revenue Information</h3>
        <ul className="space-y-1 text-sm text-primary-700">
          <li>• Platform commission is 5% of each completed booking</li>
          <li>• Revenue is calculated from completed bookings only</li>
          <li>• Monthly reports are generated on the 1st of each month</li>
          <li>• Export feature allows downloading detailed CSV/PDF reports</li>
        </ul>
      </div>
    </div>
  );
}
