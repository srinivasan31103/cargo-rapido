import { useState, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, Clock, Filter, Download, Search, Package, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { driverAPI, bookingAPI } from '../../utils/api';
import useAuthStore from '../../store/authStore';

export default function TripHistory() {
  const { user } = useAuthStore();
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: '30days',
    search: ''
  });
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalEarnings: 0,
    totalDistance: 0,
    averageRating: 0
  });

  useEffect(() => {
    fetchTripHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, trips]);

  const fetchTripHistory = async () => {
    setLoading(true);
    try {
      const response = await bookingAPI.getDriverBookings(user._id, { limit: 100 });
      const bookings = response.data.data || [];
      setTrips(bookings);
      calculateStats(bookings);
    } catch (error) {
      // Mock data fallback
      const mockTrips = [
        {
          _id: '1',
          bookingId: 'CR2024010001',
          pickup: { address: 'Connaught Place, New Delhi', coordinates: { lat: 28.6139, lng: 77.2090 } },
          drop: { address: 'Cyber Hub, Gurugram', coordinates: { lat: 28.4942, lng: 77.0891 } },
          status: 'completed',
          pricing: { total: 450, driverEarnings: 360 },
          distance: 18.5,
          duration: 45,
          createdAt: new Date('2024-01-15T10:30:00'),
          completedAt: new Date('2024-01-15T11:15:00'),
          customer: { name: 'Rahul Sharma', phone: '+91 98765 43210' },
          rating: { rating: 5, feedback: 'Excellent service!' }
        },
        {
          _id: '2',
          bookingId: 'CR2024010002',
          pickup: { address: 'DLF Phase 3, Gurugram', coordinates: { lat: 28.4942, lng: 77.0891 } },
          drop: { address: 'Nehru Place, New Delhi', coordinates: { lat: 28.5494, lng: 77.2501 } },
          status: 'completed',
          pricing: { total: 380, driverEarnings: 304 },
          distance: 15.2,
          duration: 38,
          createdAt: new Date('2024-01-15T14:00:00'),
          completedAt: new Date('2024-01-15T14:38:00'),
          customer: { name: 'Priya Patel', phone: '+91 98765 43211' },
          rating: { rating: 4, feedback: 'Good service' }
        },
        {
          _id: '3',
          bookingId: 'CR2024010003',
          pickup: { address: 'Saket, New Delhi', coordinates: { lat: 28.5244, lng: 77.2066 } },
          drop: { address: 'Greater Kailash, New Delhi', coordinates: { lat: 28.5494, lng: 77.2428 } },
          status: 'completed',
          pricing: { total: 250, driverEarnings: 200 },
          distance: 8.5,
          duration: 25,
          createdAt: new Date('2024-01-14T16:30:00'),
          completedAt: new Date('2024-01-14T16:55:00'),
          customer: { name: 'Amit Kumar', phone: '+91 98765 43212' },
          rating: { rating: 5, feedback: 'Very fast delivery' }
        },
        {
          _id: '4',
          bookingId: 'CR2024010004',
          pickup: { address: 'Dwarka, New Delhi', coordinates: { lat: 28.5921, lng: 77.0460 } },
          drop: { address: 'Janakpuri, New Delhi', coordinates: { lat: 28.6219, lng: 77.0834 } },
          status: 'cancelled',
          pricing: { total: 180, driverEarnings: 0 },
          distance: 7.2,
          duration: 0,
          createdAt: new Date('2024-01-14T09:00:00'),
          customer: { name: 'Sneha Verma', phone: '+91 98765 43213' }
        },
        {
          _id: '5',
          bookingId: 'CR2024010005',
          pickup: { address: 'Rohini, New Delhi', coordinates: { lat: 28.7495, lng: 77.0736 } },
          drop: { address: 'Pitampura, New Delhi', coordinates: { lat: 28.6971, lng: 77.1313 } },
          status: 'completed',
          pricing: { total: 320, driverEarnings: 256 },
          distance: 12.3,
          duration: 32,
          createdAt: new Date('2024-01-13T11:15:00'),
          completedAt: new Date('2024-01-13T11:47:00'),
          customer: { name: 'Rajesh Singh', phone: '+91 98765 43214' },
          rating: { rating: 5, feedback: 'Professional driver' }
        }
      ];
      setTrips(mockTrips);
      calculateStats(mockTrips);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookings) => {
    const completed = bookings.filter(b => b.status === 'completed');
    const totalEarnings = completed.reduce((sum, b) => sum + (b.pricing.driverEarnings || 0), 0);
    const totalDistance = completed.reduce((sum, b) => sum + (b.distance || 0), 0);
    const ratingsSum = completed.reduce((sum, b) => sum + (b.rating?.rating || 0), 0);
    const averageRating = completed.length > 0 ? ratingsSum / completed.length : 0;

    setStats({
      totalTrips: bookings.length,
      totalEarnings,
      totalDistance,
      averageRating
    });
  };

  const applyFilters = () => {
    let filtered = [...trips];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(trip => trip.status === filters.status);
    }

    // Date range filter
    const now = new Date();
    const dateRanges = {
      '7days': 7,
      '30days': 30,
      '90days': 90
    };

    if (filters.dateRange !== 'all' && dateRanges[filters.dateRange]) {
      const daysAgo = new Date(now.getTime() - dateRanges[filters.dateRange] * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(trip => new Date(trip.createdAt) >= daysAgo);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(trip =>
        trip.bookingId.toLowerCase().includes(searchLower) ||
        trip.pickup.address.toLowerCase().includes(searchLower) ||
        trip.drop.address.toLowerCase().includes(searchLower) ||
        trip.customer.name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTrips(filtered);
  };

  const handleExportCSV = () => {
    const headers = ['Booking ID', 'Date', 'From', 'To', 'Distance (km)', 'Duration (min)', 'Earnings', 'Status', 'Rating'];
    const rows = filteredTrips.map(trip => [
      trip.bookingId,
      new Date(trip.createdAt).toLocaleDateString('en-IN'),
      trip.pickup.address,
      trip.drop.address,
      trip.distance || 0,
      trip.duration || 0,
      trip.pricing.driverEarnings || 0,
      trip.status,
      trip.rating?.rating || 'N/A'
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trip-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Trip history exported successfully!');
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    driver_assigned: 'bg-blue-100 text-blue-700',
    in_transit: 'bg-purple-100 text-purple-700'
  };

  const statusText = {
    completed: 'Completed',
    cancelled: 'Cancelled',
    driver_assigned: 'Assigned',
    in_transit: 'In Transit'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cr-dark">Trip History</h1>
          <p className="text-primary-700 mt-2">View and manage all your completed trips</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="btn btn-outline flex items-center gap-2"
          disabled={filteredTrips.length === 0}
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Total Trips</p>
              <p className="text-2xl font-bold text-cr-dark">{stats.totalTrips}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Package size={24} className="text-cr-dark" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">₹{stats.totalEarnings.toFixed(0)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Total Distance</p>
              <p className="text-2xl font-bold text-cr-dark">{stats.totalDistance.toFixed(1)} km</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <MapPin size={24} className="text-cr-dark" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.averageRating.toFixed(1)} ⭐</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              <Filter size={16} className="inline mr-1" />
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input-field"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="in_transit">In Transit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="input-field"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-primary-700 mb-2">
              <Search size={16} className="inline mr-1" />
              Search
            </label>
            <input
              type="text"
              placeholder="Search by booking ID, location, customer..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Trip List */}
      <div className="card">
        <h2 className="text-xl font-semibold text-cr-dark mb-4">
          Trip List ({filteredTrips.length} {filteredTrips.length === 1 ? 'trip' : 'trips'})
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cr-dark mx-auto"></div>
            <p className="text-primary-700 mt-4">Loading trips...</p>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-primary-700 mb-4" />
            <h3 className="text-xl font-semibold text-cr-dark mb-2">No trips found</h3>
            <p className="text-primary-700">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTrips.map((trip) => (
              <div key={trip._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-cr-dark text-lg">#{trip.bookingId}</h3>
                    <p className="text-sm text-primary-700">
                      {new Date(trip.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[trip.status]}`}>
                    {statusText[trip.status]}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-primary-700 font-medium">Pickup</p>
                      <p className="text-sm text-cr-dark">{trip.pickup.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-primary-700 font-medium">Drop</p>
                      <p className="text-sm text-cr-dark">{trip.drop.address}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-primary-700 border-t border-gray-200 pt-3">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{trip.distance || 0} km</span>
                  </div>
                  {trip.duration > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{trip.duration} min</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <DollarSign size={16} />
                    <span>₹{trip.pricing.driverEarnings || 0}</span>
                  </div>
                  {trip.rating && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <span>⭐ {trip.rating.rating}</span>
                    </div>
                  )}
                  <div className="ml-auto text-cr-dark font-medium">
                    {trip.customer?.name || 'N/A'}
                  </div>
                </div>

                {trip.rating?.feedback && (
                  <div className="mt-3 bg-primary-50 rounded-lg p-3">
                    <p className="text-sm text-primary-700 italic">"{trip.rating.feedback}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
