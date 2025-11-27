import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar, DollarSign, Package, Users, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';

export default function BusinessAnalytics() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('30days');
  const [analytics, setAnalytics] = useState({
    overview: {
      totalBookings: 0,
      totalSpent: 0,
      averageCost: 0,
      completionRate: 0
    },
    trends: {
      bookingsGrowth: 0,
      spendingGrowth: 0
    },
    breakdown: {
      byStatus: [],
      byVehicleType: [],
      byRoute: []
    },
    timeAnalysis: {
      hourlyDistribution: [],
      dailyDistribution: [],
      monthlyTrends: []
    }
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/analytics/business/${user._id}?range=${dateRange}`);
      setAnalytics(response.data.data);
    } catch (error) {
      // Mock data fallback
      setAnalytics({
        overview: {
          totalBookings: 245,
          totalSpent: 98750,
          averageCost: 403,
          completionRate: 94.3
        },
        trends: {
          bookingsGrowth: 12.5,
          spendingGrowth: 8.3
        },
        breakdown: {
          byStatus: [
            { status: 'Completed', count: 231, percentage: 94.3 },
            { status: 'Cancelled', count: 8, percentage: 3.3 },
            { status: 'In Progress', count: 6, percentage: 2.4 }
          ],
          byVehicleType: [
            { type: 'Bike', count: 120, amount: 36000, percentage: 49 },
            { type: 'Auto', count: 65, amount: 32500, percentage: 26.5 },
            { type: 'Van', count: 45, amount: 22500, percentage: 18.4 },
            { type: 'Truck', count: 15, amount: 7750, percentage: 6.1 }
          ],
          byRoute: [
            { from: 'Connaught Place', to: 'Cyber Hub', count: 45, amount: 18000 },
            { from: 'Nehru Place', to: 'DLF Phase 3', count: 38, amount: 15200 },
            { from: 'Saket', to: 'Greater Kailash', count: 32, amount: 9600 },
            { from: 'Dwarka', to: 'Janakpuri', count: 28, amount: 8400 },
            { from: 'Rohini', to: 'Pitampura', count: 25, amount: 8000 }
          ]
        },
        timeAnalysis: {
          hourlyDistribution: [
            { hour: '6-9 AM', count: 45 },
            { hour: '9-12 PM', count: 68 },
            { hour: '12-3 PM', count: 52 },
            { hour: '3-6 PM', count: 58 },
            { hour: '6-9 PM', count: 22 }
          ],
          dailyDistribution: [
            { day: 'Mon', count: 42 },
            { day: 'Tue', count: 38 },
            { day: 'Wed', count: 45 },
            { day: 'Thu', count: 48 },
            { day: 'Fri', count: 52 },
            { day: 'Sat', count: 12 },
            { day: 'Sun', count: 8 }
          ],
          monthlyTrends: [
            { month: 'Jan', bookings: 245, spending: 98750 },
            { month: 'Dec', bookings: 218, spending: 91200 },
            { month: 'Nov', bookings: 192, spending: 85400 },
            { month: 'Oct', bookings: 205, spending: 88900 }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange,
      ...analytics
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Report exported successfully!');
  };

  const getMaxValue = (data, key) => {
    return Math.max(...data.map(item => item[key]));
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-600 mt-2">Detailed insights into your delivery operations</p>
          </div>
          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
            <button
              onClick={handleExportReport}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download size={20} />
              Export Report
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package size={24} className="text-blue-600" />
              </div>
              {analytics.trends.bookingsGrowth > 0 ? (
                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <TrendingUp size={16} />
                  +{analytics.trends.bookingsGrowth}%
                </span>
              ) : (
                <span className="text-red-600 text-sm font-medium flex items-center gap-1">
                  <TrendingDown size={16} />
                  {analytics.trends.bookingsGrowth}%
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.overview.totalBookings}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign size={24} className="text-green-600" />
              </div>
              {analytics.trends.spendingGrowth > 0 ? (
                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <TrendingUp size={16} />
                  +{analytics.trends.spendingGrowth}%
                </span>
              ) : (
                <span className="text-red-600 text-sm font-medium flex items-center gap-1">
                  <TrendingDown size={16} />
                  {analytics.trends.spendingGrowth}%
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 font-medium">Total Spent</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">₹{analytics.overview.totalSpent.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <BarChart3 size={24} className="text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">Average Cost</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">₹{analytics.overview.averageCost}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp size={24} className="text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">Completion Rate</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.overview.completionRate}%</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Status Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Booking Status</h2>
            <div className="space-y-4">
              {analytics.breakdown.byStatus.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700 font-medium">{item.status}</span>
                    <span className="text-gray-900 font-semibold">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        item.status === 'Completed' ? 'bg-green-600' :
                        item.status === 'Cancelled' ? 'bg-red-600' :
                        'bg-blue-600'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Type Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Vehicle Type Distribution</h2>
            <div className="space-y-4">
              {analytics.breakdown.byVehicleType.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700 font-medium">{item.type}</span>
                    <span className="text-gray-900 font-semibold">{item.count} bookings · ₹{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-purple-600 h-3 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hourly Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Hourly Distribution</h2>
            <div className="space-y-3">
              {analytics.timeAnalysis.hourlyDistribution.map((item, index) => {
                const maxCount = getMaxValue(analytics.timeAnalysis.hourlyDistribution, 'count');
                const percentage = (item.count / maxCount) * 100;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 font-medium w-20">{item.hour}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 rounded-full flex items-center justify-end pr-3"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-white text-sm font-semibold">{item.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Daily Distribution</h2>
            <div className="space-y-3">
              {analytics.timeAnalysis.dailyDistribution.map((item, index) => {
                const maxCount = getMaxValue(analytics.timeAnalysis.dailyDistribution, 'count');
                const percentage = (item.count / maxCount) * 100;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-700 font-medium w-12">{item.day}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-8 rounded-full flex items-center justify-end pr-3"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-white text-sm font-semibold">{item.count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Routes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Top Routes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">From</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">To</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Bookings</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Avg Cost</th>
                </tr>
              </thead>
              <tbody>
                {analytics.breakdown.byRoute.map((route, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{route.from}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{route.to}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 font-semibold">{route.count}</td>
                    <td className="py-3 px-4 text-sm text-green-600 font-semibold">₹{route.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">₹{Math.round(route.amount / route.count)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Trends</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Month</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Bookings</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Spending</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Avg Cost</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Growth</th>
                </tr>
              </thead>
              <tbody>
                {analytics.timeAnalysis.monthlyTrends.map((month, index) => {
                  const prevMonth = analytics.timeAnalysis.monthlyTrends[index + 1];
                  const growth = prevMonth
                    ? (((month.bookings - prevMonth.bookings) / prevMonth.bookings) * 100).toFixed(1)
                    : 0;
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">{month.month}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{month.bookings}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">₹{month.spending.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">₹{Math.round(month.spending / month.bookings)}</td>
                      <td className="py-3 px-4 text-sm">
                        {growth > 0 ? (
                          <span className="text-green-600 font-medium flex items-center gap-1">
                            <TrendingUp size={16} />
                            +{growth}%
                          </span>
                        ) : growth < 0 ? (
                          <span className="text-red-600 font-medium flex items-center gap-1">
                            <TrendingDown size={16} />
                            {growth}%
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">🚀 Peak Hours</h3>
              <p className="text-sm text-blue-100">
                Most bookings occur between 9 AM - 12 PM. Consider offering off-peak discounts.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">📊 Top Performer</h3>
              <p className="text-sm text-blue-100">
                Bike deliveries account for 49% of all bookings. Most cost-effective option.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">💡 Opportunity</h3>
              <p className="text-sm text-blue-100">
                Weekend bookings are low. Consider promotions to increase weekend usage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
