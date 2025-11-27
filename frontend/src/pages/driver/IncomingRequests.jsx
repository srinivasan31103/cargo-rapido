import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { MapPin, Package, Clock, DollarSign, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

export default function IncomingRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(null);

  useEffect(() => {
    fetchPendingBookings();

    // Refresh every 10 seconds
    const interval = setInterval(fetchPendingBookings, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const response = await api.get('/driver-assignment/pending-bookings');
      setRequests(response.data.data);
    } catch (error) {
      console.error('Failed to fetch pending bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (bookingId) => {
    setAccepting(bookingId);
    try {
      const response = await api.post(`/driver-assignment/bookings/${bookingId}/accept`);
      toast.success('Booking accepted successfully!');

      // Navigate to start ride page
      navigate(`/driver/ride/${bookingId}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to accept booking';
      toast.error(message);

      // Refresh to remove if already taken
      fetchPendingBookings();
    } finally {
      setAccepting(null);
    }
  };

  const calculateDistance = (pickup) => {
    // This would calculate distance from driver's current location to pickup
    // For now, just show the total booking distance
    return 'Nearby';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cr-dark">Incoming Requests</h1>
          <p className="text-primary-700 mt-1">Available delivery requests near you</p>
        </div>
        <button
          onClick={fetchPendingBookings}
          className="btn btn-secondary"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="card text-center py-12">
          <Package size={48} className="mx-auto text-primary-700 mb-4" />
          <p className="text-primary-700 text-lg font-medium mb-2">No Available Requests</p>
          <p className="text-sm text-primary-700">
            New delivery requests will appear here automatically
          </p>
          <p className="text-xs text-primary-700 mt-4">
            Make sure you're status is "Online" to receive bookings
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {requests.map((booking) => (
            <div
              key={booking._id}
              className="card hover:shadow-xl transition-all border-2 border-transparent hover:border-primary-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Package className="text-cr-dark" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-cr-dark">
                      Booking #{booking.bookingId || booking._id.slice(-6)}
                    </p>
                    <p className="text-xs text-primary-700">
                      {new Date(booking.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{booking.pricing.total}
                  </p>
                  <p className="text-xs text-primary-700">{booking.distance} km</p>
                </div>
              </div>

              {/* Route Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start space-x-2">
                  <MapPin size={18} className="mt-0.5 flex-shrink-0 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-xs text-primary-700 font-medium">Pickup</p>
                    <p className="text-sm text-cr-dark">
                      {booking.pickup.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <MapPin size={18} className="mt-0.5 flex-shrink-0 text-green-500" />
                  <div className="flex-1">
                    <p className="text-xs text-primary-700 font-medium">Drop</p>
                    <p className="text-sm text-cr-dark">
                      {booking.drop.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cargo Info */}
              <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-primary-50 rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-primary-700">Size</p>
                  <p className="font-semibold text-cr-dark">
                    {booking.cargoDetails.size}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-primary-700">Distance</p>
                  <p className="font-semibold text-cr-dark">
                    {booking.distance} km
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-primary-700">Waiting</p>
                  <p className="font-semibold text-cr-dark">
                    {Math.floor((Date.now() - new Date(booking.createdAt)) / 60000)}m
                  </p>
                </div>
              </div>

              {/* User Info */}
              {booking.user && (
                <div className="mb-4 p-3 bg-primary-50 rounded-lg">
                  <p className="text-xs text-primary-700 mb-1">Customer</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-cr-dark">{booking.user.name}</p>
                    <p className="text-sm text-primary-700">{booking.user.phone}</p>
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              {(booking.pickup.instructions || booking.cargoDetails.fragile) && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-xs font-medium text-orange-800 mb-1">
                    ⚠️ Special Instructions
                  </p>
                  {booking.cargoDetails.fragile && (
                    <p className="text-sm text-orange-700">• Handle with care (Fragile)</p>
                  )}
                  {booking.pickup.instructions && (
                    <p className="text-sm text-primary-700">• {booking.pickup.instructions}</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${booking.pickup.coordinates.coordinates[1]},${booking.pickup.coordinates.coordinates[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary flex-1 text-center"
                >
                  <Navigation size={18} className="inline mr-2" />
                  Directions
                </a>
                <button
                  onClick={() => handleAccept(booking._id)}
                  disabled={accepting === booking._id}
                  className="btn btn-primary flex-1"
                >
                  {accepting === booking._id ? (
                    <>
                      <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Accepting...
                    </>
                  ) : (
                    'Accept Booking'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Footer */}
      <div className="card bg-primary-50 border border-primary-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <Clock className="text-cr-dark" size={16} />
          </div>
          <div>
            <p className="font-medium text-cr-dark mb-1">How it works</p>
            <ul className="text-sm text-primary-700 space-y-1">
              <li>• Bookings are shown based on your current location</li>
              <li>• Click "Accept Booking" to take the delivery</li>
              <li>• First driver to accept gets the booking</li>
              <li>• List refreshes automatically every 10 seconds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
