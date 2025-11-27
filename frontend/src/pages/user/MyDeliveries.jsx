import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { bookingAPI } from '../../utils/api';
import useAuthStore from '../../store/authStore';

export default function MyDeliveries() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, [filter, currentPage]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {
        ...(filter !== 'all' ? { status: filter } : {}),
        page: currentPage,
        limit: itemsPerPage
      };
      const response = await bookingAPI.getUserBookings(user._id, params);
      setBookings(response.data.data);
      setTotalPages(response.data.totalPages || 1);
      setTotalBookings(response.data.total || response.data.data.length);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    driver_assigned: 'bg-primary-100 text-cr-dark',
    picked_up: 'bg-primary-100 text-cr-dark',
    in_transit: 'bg-primary-100 text-cr-dark',
    delivered: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-cr-dark">My Deliveries</h1>
        <Link to="/dashboard/new-booking" className="btn btn-primary">
          New Booking
        </Link>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['all', 'pending', 'in_transit', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              filter === status
                ? 'bg-cr-dark text-white'
                : 'bg-white text-primary-700 hover:bg-primary-50'
            }`}
          >
            {status.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-12">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No bookings found</p>
          <Link to="/dashboard/new-booking" className="btn btn-primary inline-block">
            Create First Booking
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="font-semibold text-lg">Booking #{booking.bookingId}</h3>
                  <span className={`badge ${statusColors[booking.status]}`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-600">₹{booking.pricing.total}</p>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-start space-x-2">
                  <MapPin size={18} className="mt-0.5 flex-shrink-0 text-cr-dark" />
                  <div>
                    <p className="text-xs text-primary-700 font-medium">From</p>
                    <p className="text-sm text-gray-800">{booking.pickup.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin size={18} className="mt-0.5 flex-shrink-0 text-cr-dark" />
                  <div>
                    <p className="text-xs text-primary-700 font-medium">To</p>
                    <p className="text-sm text-gray-800">{booking.drop.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock size={18} className="mt-0.5 flex-shrink-0 text-primary-700" />
                  <div>
                    <p className="text-xs text-primary-700 font-medium">Booked On</p>
                    <p className="text-sm text-gray-800">{new Date(booking.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-primary-700">{new Date(booking.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

              {/* Footer with Cargo Details and Track Button */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4 text-sm text-primary-700">
                  <div>
                    <span className="font-medium">Cargo Size:</span> {booking.cargoDetails.size}
                  </div>
                  <div>
                    <span className="font-medium">Distance:</span> {booking.distance} km
                  </div>
                </div>
                <Link
                  to={`/dashboard/tracking/${booking._id}`}
                  className="btn btn-primary"
                >
                  Track
                </Link>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card mt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-primary-700">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalBookings)} of {totalBookings} bookings
                </p>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary-100 text-cr-dark hover:bg-primary-200'
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {/* Page numbers */}
                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-lg font-medium ${
                              currentPage === page
                                ? 'bg-cr-dark text-white'
                                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return <span key={page} className="text-primary-700">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary-100 text-cr-dark hover:bg-primary-200'
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
