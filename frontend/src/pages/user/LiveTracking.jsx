import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, User, Phone, Package, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { trackBooking, onDriverLocationUpdate, offEvent } from '../../utils/socket';
import { bookingAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import L from 'leaflet';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function LiveTracking() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
    trackBooking(bookingId);

    onDriverLocationUpdate((data) => {
      if (data.bookingId === bookingId) {
        setDriverLocation(data.location);
      }
    });

    return () => {
      offEvent('driver:locationUpdate');
    };
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await bookingAPI.getById(bookingId);
      setBooking(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch booking');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    driver_assigned: 'bg-primary-100 text-cr-dark',
    picked_up: 'bg-primary-100 text-cr-dark',
    in_transit: 'bg-primary-100 text-cr-dark',
    reached_destination: 'bg-green-100 text-green-800',
    delivered: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Booking not found</p>
        <Link to="/dashboard/deliveries" className="btn btn-primary mt-4">
          Go to My Deliveries
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cr-dark">Live Tracking</h1>
          <p className="text-primary-700">Booking ID: {booking.bookingId}</p>
        </div>
        <span className={`badge ${statusColors[booking.status]}`}>
          {booking.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="card p-0 overflow-hidden h-96">
            <MapContainer
              center={[
                booking.pickup.coordinates.coordinates[1],
                booking.pickup.coordinates.coordinates[0]
              ]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Pickup Marker */}
              <Marker
                position={[
                  booking.pickup.coordinates.coordinates[1],
                  booking.pickup.coordinates.coordinates[0]
                ]}
              >
                <Popup>
                  <div>
                    <p className="font-semibold">Pickup Location</p>
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
                  <div>
                    <p className="font-semibold">Drop Location</p>
                    <p className="text-sm">{booking.drop.address}</p>
                  </div>
                </Popup>
              </Marker>

              {/* Route Line */}
              <Polyline
                positions={[
                  [booking.pickup.coordinates.coordinates[1], booking.pickup.coordinates.coordinates[0]],
                  [booking.drop.coordinates.coordinates[1], booking.drop.coordinates.coordinates[0]]
                ]}
                color="blue"
                weight={3}
                opacity={0.7}
                dashArray="10, 10"
              />

              {/* Driver Location Marker (if available) */}
              {driverLocation && (
                <Marker position={[driverLocation.lat, driverLocation.lng]}>
                  <Popup>
                    <div>
                      <p className="font-semibold">Driver Location</p>
                      <p className="text-sm">Live location</p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Driver Info */}
          {booking.driver && (
            <div className="card">
              <h3 className="font-semibold text-cr-dark mb-3">Driver Details</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User size={16} className="text-primary-700" />
                  <span className="text-sm">{booking.driver.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-primary-700" />
                  <span className="text-sm">{booking.driver.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package size={16} className="text-primary-700" />
                  <span className="text-sm">
                    {booking.vehicle?.vehicleType} - {booking.vehicle?.vehicleNumber}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="card">
            <h3 className="font-semibold text-cr-dark mb-3">Status Timeline</h3>
            <div className="space-y-3">
              {booking.timeline.map((event, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-cr-dark mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {event.status.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-xs text-primary-700">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                    {event.note && <p className="text-xs text-primary-700 mt-1">{event.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="card">
            <h3 className="font-semibold text-cr-dark mb-3">Delivery Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-primary-700">Pickup</p>
                <p>{booking.pickup.address}</p>
              </div>
              <div>
                <p className="text-primary-700">Drop</p>
                <p>{booking.drop.address}</p>
              </div>
              <div>
                <p className="text-primary-700">Cargo Size</p>
                <p className="font-semibold">{booking.cargoDetails.size}</p>
              </div>
              <div>
                <p className="text-primary-700">Amount</p>
                <p className="font-semibold text-green-600">₹{booking.pricing.total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
