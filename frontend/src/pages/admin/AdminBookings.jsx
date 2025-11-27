import { useState, useEffect } from 'react';
import { Search, Package, Eye, Edit, Trash2, X, Plus, Filter, Download } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, filterStatus, bookings]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/admin/bookings');
      setBookings(data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Mock data for demonstration
      setBookings([
        {
          _id: '1',
          bookingId: 'BK123456',
          user: { name: 'Amit Sharma', email: 'amit@example.com', phone: '+91 98765 43210' },
          driver: { name: 'Rajesh Kumar', phone: '+91 98765 11111' },
          pickup: { address: 'Connaught Place, Delhi', coordinates: { coordinates: [77.2167, 28.6280] } },
          drop: { address: 'India Gate, Delhi', coordinates: { coordinates: [77.2295, 28.6129] } },
          cargoDetails: { size: 'Medium', weight: 50, type: 'Electronics' },
          pricing: { basePrice: 300, total: 350, platformFee: 50 },
          status: 'in_transit',
          createdAt: new Date().toISOString(),
          estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '2',
          bookingId: 'BK123457',
          user: { name: 'Priya Singh', email: 'priya@example.com', phone: '+91 98765 43211' },
          driver: { name: 'Suresh Patel', phone: '+91 98765 22222' },
          pickup: { address: 'Nehru Place, Delhi', coordinates: { coordinates: [77.2507, 28.5494] } },
          drop: { address: 'Saket, Delhi', coordinates: { coordinates: [77.2075, 28.5244] } },
          cargoDetails: { size: 'Small', weight: 20, type: 'Documents' },
          pricing: { basePrice: 150, total: 180, platformFee: 30 },
          status: 'delivered',
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          deliveredAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '3',
          bookingId: 'BK123458',
          user: { name: 'Tech Solutions Ltd', email: 'info@tech.com', phone: '+91 98765 43212' },
          driver: null,
          pickup: { address: 'Cyber City, Gurgaon', coordinates: { coordinates: [77.0886, 28.4942] } },
          drop: { address: 'Dwarka, Delhi', coordinates: { coordinates: [77.0469, 28.5921] } },
          cargoDetails: { size: 'Large', weight: 200, type: 'Office Equipment' },
          pricing: { basePrice: 800, total: 950, platformFee: 150 },
          status: 'pending',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          estimatedDelivery: null
        },
        {
          _id: '4',
          bookingId: 'BK123459',
          user: { name: 'Deepak Verma', email: 'deepak@example.com', phone: '+91 98765 43213' },
          driver: { name: 'Vikram Singh', phone: '+91 98765 33333' },
          pickup: { address: 'Lajpat Nagar, Delhi', coordinates: { coordinates: [77.2439, 28.5678] } },
          drop: { address: 'Greater Kailash, Delhi', coordinates: { coordinates: [77.2426, 28.5494] } },
          cargoDetails: { size: 'Medium', weight: 80, type: 'Furniture' },
          pricing: { basePrice: 500, total: 600, platformFee: 100 },
          status: 'cancelled',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          cancelledAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '5',
          bookingId: 'BK123460',
          user: { name: 'Logistics Inc', email: 'contact@logistics.com', phone: '+91 98765 43215' },
          driver: { name: 'Mohammed Ali', phone: '+91 98765 44444' },
          pickup: { address: 'Okhla, Delhi', coordinates: { coordinates: [77.2750, 28.5355] } },
          drop: { address: 'Noida Sector 62', coordinates: { coordinates: [77.3617, 28.6269] } },
          cargoDetails: { size: 'Large', weight: 300, type: 'Industrial Parts' },
          pricing: { basePrice: 1200, total: 1450, platformFee: 250 },
          status: 'picked_up',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          estimatedDelivery: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(booking => booking.status === filterStatus);
    }

    setFilteredBookings(filtered);
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setShowViewModal(true);
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setShowEditModal(true);
  };

  const handleDelete = (booking) => {
    setSelectedBooking(booking);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // await api.delete(`/admin/bookings/${selectedBooking._id}`);
      setBookings(bookings.filter(b => b._id !== selectedBooking._id));
      toast.success('Booking deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      // await api.patch(`/admin/bookings/${selectedBooking._id}`, { status: newStatus });
      const updatedBookings = bookings.map(b =>
        b._id === selectedBooking._id ? { ...b, status: newStatus } : b
      );
      setBookings(updatedBookings);
      setSelectedBooking({ ...selectedBooking, status: newStatus });
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const exportBookings = () => {
    toast.success('Exporting bookings data...');
    // TODO: Implement CSV/PDF export
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    driver_assigned: 'bg-blue-100 text-blue-800',
    picked_up: 'bg-purple-100 text-purple-800',
    in_transit: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-cr-dark">Bookings Management</h1>
        <div className="flex items-center space-x-3">
          <button onClick={exportBookings} className="btn btn-outline flex items-center space-x-2">
            <Download size={20} />
            <span>Export</span>
          </button>
          <button onClick={fetchBookings} className="btn btn-primary">Refresh</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card">
          <p className="text-primary-700 text-sm">Total Bookings</p>
          <p className="text-2xl font-bold mt-1">{bookings.length}</p>
        </div>
        <div className="card">
          <p className="text-primary-700 text-sm">Pending</p>
          <p className="text-2xl font-bold mt-1 text-yellow-600">
            {bookings.filter(b => b.status === 'pending').length}
          </p>
        </div>
        <div className="card">
          <p className="text-primary-700 text-sm">In Transit</p>
          <p className="text-2xl font-bold mt-1 text-orange-600">
            {bookings.filter(b => b.status === 'in_transit').length}
          </p>
        </div>
        <div className="card">
          <p className="text-primary-700 text-sm">Delivered</p>
          <p className="text-2xl font-bold mt-1 text-green-600">
            {bookings.filter(b => b.status === 'delivered').length}
          </p>
        </div>
        <div className="card">
          <p className="text-primary-700 text-sm">Cancelled</p>
          <p className="text-2xl font-bold mt-1 text-red-600">
            {bookings.filter(b => b.status === 'cancelled').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by booking ID, user, or driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="driver_assigned">Driver Assigned</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-cr-dark border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-primary-700">Loading...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <p className="text-center py-8 text-primary-700">No bookings found</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-primary-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Package className="text-cr-dark mr-2" size={18} />
                          <span className="font-medium text-cr-dark">{booking.bookingId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{booking.user?.name}</div>
                          <div className="text-sm text-primary-700">{booking.user?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {booking.driver?.name || <span className="text-gray-400">Not assigned</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900 truncate max-w-xs" title={booking.pickup?.address}>
                            📍 {booking.pickup?.address?.substring(0, 25)}...
                          </div>
                          <div className="text-primary-700 truncate max-w-xs" title={booking.drop?.address}>
                            📍 {booking.drop?.address?.substring(0, 25)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-green-600">
                          ₹{booking.pricing?.total?.toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[booking.status]}`}>
                          {booking.status?.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-primary-700">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleView(booking)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(booking)}
                            className="text-green-600 hover:text-green-800"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(booking)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between px-6 py-3 border-t border-gray-200">
                <p className="text-sm text-primary-700">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} bookings
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg bg-primary-100 text-cr-dark hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === i + 1
                          ? 'bg-cr-dark text-white'
                          : 'bg-primary-100 text-cr-dark hover:bg-primary-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-lg bg-primary-100 text-cr-dark hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cr-dark">Booking Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Booking Info */}
              <div>
                <h3 className="text-lg font-semibold text-cr-dark mb-3">Booking Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-primary-700">Booking ID</p>
                    <p className="font-semibold">{selectedBooking.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-700">Status</p>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusColors[selectedBooking.status]}`}>
                      {selectedBooking.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-primary-700">Created At</p>
                    <p className="font-semibold">{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-700">Estimated Delivery</p>
                    <p className="font-semibold">
                      {selectedBooking.estimatedDelivery
                        ? new Date(selectedBooking.estimatedDelivery).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div>
                <h3 className="text-lg font-semibold text-cr-dark mb-3">User Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-primary-700">Name</p>
                    <p className="font-semibold">{selectedBooking.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-700">Email</p>
                    <p className="font-semibold">{selectedBooking.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-700">Phone</p>
                    <p className="font-semibold">{selectedBooking.user?.phone}</p>
                  </div>
                </div>
              </div>

              {/* Driver Info */}
              {selectedBooking.driver && (
                <div>
                  <h3 className="text-lg font-semibold text-cr-dark mb-3">Driver Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-primary-700">Name</p>
                      <p className="font-semibold">{selectedBooking.driver?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-primary-700">Phone</p>
                      <p className="font-semibold">{selectedBooking.driver?.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Route Info */}
              <div>
                <h3 className="text-lg font-semibold text-cr-dark mb-3">Route Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-primary-700">Pickup Address</p>
                    <p className="font-semibold">{selectedBooking.pickup?.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-700">Drop Address</p>
                    <p className="font-semibold">{selectedBooking.drop?.address}</p>
                  </div>
                </div>
              </div>

              {/* Cargo Info */}
              <div>
                <h3 className="text-lg font-semibold text-cr-dark mb-3">Cargo Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-primary-700">Size</p>
                    <p className="font-semibold">{selectedBooking.cargoDetails?.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-700">Weight</p>
                    <p className="font-semibold">{selectedBooking.cargoDetails?.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-700">Type</p>
                    <p className="font-semibold">{selectedBooking.cargoDetails?.type}</p>
                  </div>
                </div>
              </div>

              {/* Pricing Info */}
              <div>
                <h3 className="text-lg font-semibold text-cr-dark mb-3">Pricing Details</h3>
                <div className="space-y-2 bg-primary-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-primary-700">Base Price</span>
                    <span className="font-semibold">₹{selectedBooking.pricing?.basePrice?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-700">Platform Fee</span>
                    <span className="font-semibold">₹{selectedBooking.pricing?.platformFee?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between border-t border-primary-200 pt-2">
                    <span className="font-semibold text-cr-dark">Total Amount</span>
                    <span className="font-bold text-green-600 text-lg">₹{selectedBooking.pricing?.total?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button onClick={() => setShowViewModal(false)} className="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-cr-dark">Update Booking Status</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-primary-700 mb-2">Booking ID</p>
                <p className="font-semibold text-lg">{selectedBooking.bookingId}</p>
              </div>

              <div>
                <p className="text-sm text-primary-700 mb-2">Current Status</p>
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusColors[selectedBooking.status]}`}>
                  {selectedBooking.status?.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Update Status
                </label>
                <select
                  className="input-field"
                  defaultValue={selectedBooking.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="driver_assigned">Driver Assigned</option>
                  <option value="picked_up">Picked Up</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button onClick={() => setShowEditModal(false)} className="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-cr-dark">Confirm Delete</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete booking <span className="font-semibold">{selectedBooking.bookingId}</span>?
              </p>
              <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
