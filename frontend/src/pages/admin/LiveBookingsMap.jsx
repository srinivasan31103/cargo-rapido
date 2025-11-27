import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Package, Truck, MapPin, Clock, RefreshCw } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function LiveBookingsMap() {
  const [activeBookings, setActiveBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchActiveBookings();

    // Auto refresh every 10 seconds
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchActiveBookings();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [statusFilter, autoRefresh]);

  const fetchActiveBookings = async () => {
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const { data } = await api.get('/admin/live-bookings', { params });
      setActiveBookings(data.data || []);
    } catch (error) {
      console.error('Failed to fetch live bookings:', error);
      // Mock data for demonstration
      setActiveBookings([
        {
          _id: '1',
          bookingId: 'BK123456',
          status: 'in_transit',
          pickup: {
            address: 'New Delhi Railway Station, Delhi',
            coordinates: { coordinates: [77.2219, 28.6433] }
          },
          drop: {
            address: 'Connaught Place, Delhi',
            coordinates: { coordinates: [77.2167, 28.6280] }
          },
          driver: {
            name: 'Rajesh Kumar',
            phone: '+91 98765 43210',
            currentLocation: { coordinates: [77.2190, 28.6350] }
          },
          user: {
            name: 'Amit Sharma'
          },
          cargoDetails: {
            size: 'Medium'
          },
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          bookingId: 'BK123457',
          status: 'picked_up',
          pickup: {
            address: 'India Gate, Delhi',
            coordinates: { coordinates: [77.2295, 28.6129] }
          },
          drop: {
            address: 'Qutub Minar, Delhi',
            coordinates: { coordinates: [77.1855, 28.5244] }
          },
          driver: {
            name: 'Suresh Patel',
            phone: '+91 98765 43211',
            currentLocation: { coordinates: [77.2200, 28.6000] }
          },
          user: {
            name: 'Priya Singh'
          },
          cargoDetails: {
            size: 'Large'
          },
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          _id: '3',
          bookingId: 'BK123458',
          status: 'driver_assigned',
          pickup: {
            address: 'Lotus Temple, Delhi',
            coordinates: { coordinates: [77.2588, 28.5535] }
          },
          drop: {
            address: 'Red Fort, Delhi',
            coordinates: { coordinates: [77.2410, 28.6562] }
          },
          driver: {
            name: 'Vikram Singh',
            phone: '+91 98765 43212',
            currentLocation: { coordinates: [77.2500, 28.5700] }
          },
          user: {
            name: 'Deepak Verma'
          },
          cargoDetails: {
            size: 'Small'
          },
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', badge: 'bg-yellow-500' },
    driver_assigned: { bg: 'bg-blue-100', text: 'text-blue-800', badge: 'bg-blue-500' },
    picked_up: { bg: 'bg-purple-100', text: 'text-purple-800', badge: 'bg-purple-500' },
    in_transit: { bg: 'bg-orange-100', text: 'text-orange-800', badge: 'bg-orange-500' },
    reached_destination: { bg: 'bg-green-100', text: 'text-green-800', badge: 'bg-green-500' }
  };

  // Default center (Delhi)
  const defaultCenter = [28.6139, 77.2090];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cr-dark">Live Bookings Map</h1>
          <p className="text-primary-700 mt-2">Real-time tracking of active deliveries</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-primary-700">Auto Refresh:</label>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoRefresh ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoRefresh ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <button
            onClick={fetchActiveBookings}
            className="btn btn-primary flex items-center space-x-2"
          >
            <RefreshCw size={20} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-primary-700">Total Active</p>
          <p className="text-2xl font-bold text-cr-dark">{activeBookings.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-primary-700">In Transit</p>
          <p className="text-2xl font-bold text-orange-600">
            {activeBookings.filter(b => b.status === 'in_transit').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-primary-700">Picked Up</p>
          <p className="text-2xl font-bold text-purple-600">
            {activeBookings.filter(b => b.status === 'picked_up').length}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-primary-700">Driver Assigned</p>
          <p className="text-2xl font-bold text-blue-600">
            {activeBookings.filter(b => b.status === 'driver_assigned').length}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex space-x-2 overflow-x-auto">
          {['all', 'driver_assigned', 'picked_up', 'in_transit', 'reached_destination'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-cr-dark text-white'
                  : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              }`}
            >
              {status.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden h-[600px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="spinner"></div>
              </div>
            ) : activeBookings.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No active bookings to display</p>
                </div>
              </div>
            ) : (
              <MapContainer
                center={defaultCenter}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {activeBookings.map((booking) => (
                  <div key={booking._id}>
                    {/* Pickup Marker */}
                    <Marker
                      position={[
                        booking.pickup.coordinates.coordinates[1],
                        booking.pickup.coordinates.coordinates[0]
                      ]}
                    >
                      <Popup>
                        <div className="p-2">
                          <p className="font-semibold text-green-600">Pickup: {booking.bookingId}</p>
                          <p className="text-sm">{booking.pickup.address}</p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Drop Marker */}
                    <Marker
                      position={[
                        booking.drop.coordinates.coordinates[1],
                        booking.drop.coordinates.coordinates[0]
                      ]}
                    >
                      <Popup>
                        <div className="p-2">
                          <p className="font-semibold text-red-600">Drop: {booking.bookingId}</p>
                          <p className="text-sm">{booking.drop.address}</p>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Driver Location Marker */}
                    {booking.driver?.currentLocation && (
                      <Marker
                        position={[
                          booking.driver.currentLocation.coordinates[1],
                          booking.driver.currentLocation.coordinates[0]
                        ]}
                      >
                        <Popup>
                          <div className="p-2">
                            <p className="font-semibold text-blue-600">Driver: {booking.driver.name}</p>
                            <p className="text-sm">Booking: {booking.bookingId}</p>
                            <p className="text-sm">Status: {booking.status}</p>
                          </div>
                        </Popup>
                      </Marker>
                    )}

                    {/* Route Line */}
                    <Polyline
                      positions={[
                        [booking.pickup.coordinates.coordinates[1], booking.pickup.coordinates.coordinates[0]],
                        [booking.drop.coordinates.coordinates[1], booking.drop.coordinates.coordinates[0]]
                      ]}
                      color={statusColors[booking.status]?.badge || '#3B82F6'}
                      weight={3}
                      opacity={0.6}
                      dashArray="10, 10"
                    />
                  </div>
                ))}
              </MapContainer>
            )}
          </div>
        </div>

        {/* Active Bookings List */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-cr-dark mb-3">Active Bookings</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="spinner"></div>
              </div>
            ) : activeBookings.length === 0 ? (
              <p className="text-center text-primary-700 py-8">No active bookings</p>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto">
                {activeBookings.map((booking) => {
                  const statusColor = statusColors[booking.status] || statusColors.pending;
                  return (
                    <div
                      key={booking._id}
                      onClick={() => setSelectedBooking(booking)}
                      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedBooking?._id === booking._id
                          ? 'border-cr-dark bg-primary-50'
                          : 'border-primary-200 hover:border-primary-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-cr-dark">#{booking.bookingId}</p>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor.bg} ${statusColor.text}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start space-x-2">
                          <MapPin size={14} className="mt-0.5 text-green-600 flex-shrink-0" />
                          <p className="text-primary-700 line-clamp-1">{booking.pickup.address}</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <MapPin size={14} className="mt-0.5 text-red-600 flex-shrink-0" />
                          <p className="text-primary-700 line-clamp-1">{booking.drop.address}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Truck size={14} className="text-primary-700" />
                          <p className="text-primary-700">{booking.driver?.name}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={14} className="text-primary-700" />
                          <p className="text-primary-700">
                            {Math.floor((Date.now() - new Date(booking.createdAt)) / 60000)} mins ago
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="card">
        <h3 className="font-semibold text-cr-dark mb-3">Map Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(statusColors).map(([status, colors]) => (
            <div key={status} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${colors.badge}`}></div>
              <span className="text-sm text-primary-700">{status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
