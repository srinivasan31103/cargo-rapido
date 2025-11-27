import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Package, Navigation, CheckCircle, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

export default function StartRide() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [pickupOtp, setPickupOtp] = useState('');
  const [dropOtp, setDropOtp] = useState('');

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await bookingAPI.getById(bookingId);
      setBooking(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus, note = '') => {
    setUpdating(true);
    try {
      const response = await bookingAPI.updateStatus(bookingId, {
        status: newStatus,
        note
      });
      setBooking(response.data.data);
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const verifyPickupOtp = async () => {
    if (pickupOtp !== booking.otp?.pickup) {
      toast.error('Invalid OTP');
      return;
    }
    await updateStatus('picked_up', 'Cargo picked up from sender');
  };

  const verifyDropOtp = async () => {
    if (dropOtp !== booking.otp?.drop) {
      toast.error('Invalid OTP');
      return;
    }
    await updateStatus('delivered', 'Cargo delivered to recipient');
    setTimeout(() => navigate('/driver/pod/' + bookingId), 1500);
  };

  const getNextAction = () => {
    switch (booking?.status) {
      case 'driver_assigned':
        return {
          label: 'Arrived at Pickup',
          action: () => updateStatus('driver_arrived', 'Driver reached pickup location'),
          color: 'blue'
        };
      case 'driver_arrived':
        return {
          label: 'Verify Pickup OTP',
          requiresOtp: true,
          otpType: 'pickup',
          action: verifyPickupOtp,
          color: 'purple'
        };
      case 'picked_up':
        return {
          label: 'Start Transit',
          action: () => updateStatus('in_transit', 'Cargo in transit'),
          color: 'indigo'
        };
      case 'in_transit':
        return {
          label: 'Reached Destination',
          action: () => updateStatus('reached_destination', 'Reached drop location'),
          color: 'orange'
        };
      case 'reached_destination':
        return {
          label: 'Verify Drop OTP',
          requiresOtp: true,
          otpType: 'drop',
          action: verifyDropOtp,
          color: 'green'
        };
      default:
        return null;
    }
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
      <div className="card text-center py-12">
        <p className="text-primary-700">Booking not found</p>
      </div>
    );
  }

  const nextAction = getNextAction();
  const isDelivered = booking.status === 'delivered' || booking.status === 'completed';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cr-dark">Active Ride</h1>
          <p className="text-primary-700">Booking ID: {booking.bookingId}</p>
        </div>
        <span className={`badge ${
          booking.status === 'driver_assigned' ? 'bg-primary-100 text-cr-dark' :
          booking.status === 'picked_up' ? 'bg-primary-100 text-cr-dark' :
          booking.status === 'in_transit' ? 'bg-primary-100 text-cr-dark' :
          booking.status === 'reached_destination' ? 'bg-orange-100 text-orange-800' :
          booking.status === 'delivered' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {booking.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
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
            </MapContainer>
          </div>
        </div>

        {/* Details & Actions */}
        <div className="space-y-4">
          {/* Pickup Details */}
          <div className="card">
            <h3 className="font-semibold mb-3 flex items-center">
              <MapPin size={18} className="mr-2 text-blue-500" />
              Pickup
            </h3>
            <p className="text-sm text-primary-700 mb-2">{booking.pickup.address}</p>
            {booking.pickup.contactName && (
              <div className="space-y-1">
                <p className="text-sm text-primary-700">Contact: {booking.pickup.contactName}</p>
                <a href={`tel:${booking.pickup.contactPhone}`} className="flex items-center text-sm text-cr-dark">
                  <Phone size={14} className="mr-1" />
                  {booking.pickup.contactPhone}
                </a>
              </div>
            )}
            {booking.pickup.instructions && (
              <p className="text-xs text-primary-700 mt-2 italic">{booking.pickup.instructions}</p>
            )}
          </div>

          {/* Drop Details */}
          <div className="card">
            <h3 className="font-semibold mb-3 flex items-center">
              <MapPin size={18} className="mr-2 text-green-500" />
              Drop
            </h3>
            <p className="text-sm text-primary-700 mb-2">{booking.drop.address}</p>
            {booking.drop.contactName && (
              <div className="space-y-1">
                <p className="text-sm text-primary-700">Contact: {booking.drop.contactName}</p>
                <a href={`tel:${booking.drop.contactPhone}`} className="flex items-center text-sm text-cr-dark">
                  <Phone size={14} className="mr-1" />
                  {booking.drop.contactPhone}
                </a>
              </div>
            )}
            {booking.drop.instructions && (
              <p className="text-xs text-primary-700 mt-2 italic">{booking.drop.instructions}</p>
            )}
          </div>

          {/* Cargo Details */}
          <div className="card">
            <h3 className="font-semibold mb-3 flex items-center">
              <Package size={18} className="mr-2 text-cr-dark" />
              Cargo
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-primary-700">Size:</span>
                <span className="font-medium">{booking.cargoDetails.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-700">Distance:</span>
                <span className="font-medium">{booking.distance} km</span>
              </div>
              {booking.cargoDetails.description && (
                <p className="text-primary-700 pt-2 border-t border-primary-200">{booking.cargoDetails.description}</p>
              )}
              {booking.cargoDetails.fragile && (
                <p className="text-orange-600 font-medium">⚠️ Fragile - Handle with care</p>
              )}
            </div>
          </div>

          {/* Next Action */}
          {!isDelivered && nextAction && (
            <div className="card bg-gradient-dark">
              <h3 className="font-semibold mb-3 flex items-center text-primary-200">
                <Clock size={18} className="mr-2" />
                Next Action
              </h3>

              {nextAction.requiresOtp && (
                <div className="space-y-3 mb-3">
                  <input
                    type="text"
                    placeholder={`Enter ${nextAction.otpType} OTP`}
                    className="input text-center text-lg font-mono tracking-wider"
                    value={nextAction.otpType === 'pickup' ? pickupOtp : dropOtp}
                    onChange={(e) => nextAction.otpType === 'pickup'
                      ? setPickupOtp(e.target.value)
                      : setDropOtp(e.target.value)
                    }
                    maxLength={6}
                  />
                  <p className="text-xs text-primary-200">Ask customer for the OTP before proceeding</p>
                </div>
              )}

              <button
                onClick={nextAction.action}
                disabled={updating || (nextAction.requiresOtp && !(nextAction.otpType === 'pickup' ? pickupOtp : dropOtp))}
                className={`btn w-full bg-${nextAction.color}-600 hover:bg-${nextAction.color}-700 text-white`}
              >
                {updating ? 'Updating...' : nextAction.label}
              </button>
            </div>
          )}

          {/* Navigation Button */}
          {!isDelivered && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${booking.drop.coordinates.coordinates[1]},${booking.drop.coordinates.coordinates[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary w-full flex items-center justify-center"
            >
              <Navigation size={18} className="mr-2" />
              Navigate to {booking.status === 'driver_assigned' || booking.status === 'driver_arrived' ? 'Pickup' : 'Drop'}
            </a>
          )}

          {/* Delivered Status */}
          {isDelivered && (
            <div className="card bg-green-50 text-center">
              <CheckCircle size={48} className="mx-auto text-green-600 mb-3" />
              <p className="text-lg font-semibold text-green-800">Delivery Completed!</p>
              <p className="text-sm text-gray-600 mt-2">Total Amount: ₹{booking.pricing.total}</p>
              <button
                onClick={() => navigate('/driver')}
                className="btn btn-primary w-full mt-4"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
