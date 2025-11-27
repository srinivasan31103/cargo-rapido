import { useState, useEffect } from 'react';
import { Search, Truck, Star, MapPin, Phone, Mail, Eye, Edit, Trash2, X, UserPlus, Check, XCircle, CheckCircle } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    licenseNumber: '',
    licenseExpiry: '',
    vehicleNumber: '',
    vehicleType: '',
    address: '',
    city: '',
    walletBalance: 0
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    filterDrivers();
  }, [searchTerm, filterStatus, drivers]);

  const fetchDrivers = async () => {
    try {
      const { data } = await api.get('/drivers/all');
      setDrivers(data.data || []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      // Mock data for demonstration
      setDrivers([
        {
          _id: '1',
          name: 'Rajesh Kumar',
          email: 'rajesh.k@cargorapido.com',
          phone: '+91 98765 43210',
          licenseNumber: 'DL1420110012345',
          licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          vehicleDetails: { number: 'DL 01 AB 1234', type: 'Tata Ace' },
          status: 'online',
          rating: { average: 4.8, count: 156 },
          totalTrips: 156,
          wallet: { balance: 12500 },
          address: { city: 'New Delhi', street: '123 Main St' },
          isApproved: true,
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '2',
          name: 'Suresh Patel',
          email: 'suresh.p@cargorapido.com',
          phone: '+91 98765 43211',
          licenseNumber: 'DL1420110012346',
          licenseExpiry: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString(),
          vehicleDetails: { number: 'DL 02 CD 5678', type: 'Mahindra Pickup' },
          status: 'busy',
          rating: { average: 4.6, count: 132 },
          totalTrips: 132,
          wallet: { balance: 8900 },
          address: { city: 'Gurgaon', street: '456 Park Ave' },
          isApproved: true,
          createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '3',
          name: 'Vikram Singh',
          email: 'vikram.s@cargorapido.com',
          phone: '+91 98765 43212',
          licenseNumber: 'DL1420110012347',
          licenseExpiry: new Date(Date.now() + 450 * 24 * 60 * 60 * 1000).toISOString(),
          vehicleDetails: { number: 'DL 03 EF 9012', type: 'Tata 407' },
          status: 'online',
          rating: { average: 4.9, count: 203 },
          totalTrips: 203,
          wallet: { balance: 18750 },
          address: { city: 'Noida', street: '789 Oak Rd' },
          isApproved: true,
          createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '4',
          name: 'Mohammed Ali',
          email: 'mohammed.a@cargorapido.com',
          phone: '+91 98765 43213',
          licenseNumber: 'DL1420110012348',
          licenseExpiry: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000).toISOString(),
          vehicleDetails: { number: 'DL 04 GH 3456', type: 'Ashok Leyland Dost' },
          status: 'offline',
          rating: { average: 4.5, count: 89 },
          totalTrips: 89,
          wallet: { balance: 5600 },
          address: { city: 'Delhi', street: '321 Elm St' },
          isApproved: true,
          createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '5',
          name: 'Ramesh Yadav',
          email: 'ramesh.y@cargorapido.com',
          phone: '+91 98765 43214',
          licenseNumber: 'DL1420110012349',
          licenseExpiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          vehicleDetails: { number: 'DL 05 IJ 7890', type: 'Piaggio Porter' },
          status: 'online',
          rating: { average: 4.7, count: 178 },
          totalTrips: 178,
          wallet: { balance: 14200 },
          address: { city: 'Faridabad', street: '654 Pine Ln' },
          isApproved: true,
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '6',
          name: 'Sanjay Verma',
          email: 'sanjay.v@cargorapido.com',
          phone: '+91 98765 43215',
          licenseNumber: 'DL1420110012350',
          licenseExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          vehicleDetails: { number: 'DL 06 KL 2345', type: 'Force Tempo' },
          status: 'offline',
          rating: { average: 4.4, count: 95 },
          totalTrips: 95,
          wallet: { balance: 7800 },
          address: { city: 'Ghaziabad', street: '987 Maple Dr' },
          isApproved: false,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterDrivers = () => {
    let filtered = drivers;

    if (searchTerm) {
      filtered = filtered.filter(driver =>
        driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.phone?.includes(searchTerm) ||
        driver.licenseNumber?.includes(searchTerm)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(driver => driver.status === filterStatus);
    }

    setFilteredDrivers(filtered);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      licenseNumber: '',
      licenseExpiry: '',
      vehicleNumber: '',
      vehicleType: '',
      address: '',
      city: '',
      walletBalance: 0
    });
    setShowCreateModal(true);
  };

  const handleView = (driver) => {
    setSelectedDriver(driver);
    setShowViewModal(true);
  };

  const handleEdit = (driver) => {
    setSelectedDriver(driver);
    setFormData({
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      password: '',
      licenseNumber: driver.licenseNumber,
      licenseExpiry: driver.licenseExpiry ? new Date(driver.licenseExpiry).toISOString().split('T')[0] : '',
      vehicleNumber: driver.vehicleDetails?.number || '',
      vehicleType: driver.vehicleDetails?.type || '',
      address: driver.address?.street || '',
      city: driver.address?.city || '',
      walletBalance: driver.wallet?.balance || 0
    });
    setShowEditModal(true);
  };

  const handleDelete = (driver) => {
    setSelectedDriver(driver);
    setShowDeleteModal(true);
  };

  const handleApprove = (driver) => {
    setSelectedDriver(driver);
    setShowApproveModal(true);
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    try {
      // await api.post('/admin/drivers', formData);
      const newDriver = {
        _id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry,
        vehicleDetails: { number: formData.vehicleNumber, type: formData.vehicleType },
        status: 'offline',
        rating: { average: 0, count: 0 },
        totalTrips: 0,
        wallet: { balance: formData.walletBalance },
        address: { street: formData.address, city: formData.city },
        isApproved: false,
        createdAt: new Date().toISOString()
      };
      setDrivers([newDriver, ...drivers]);
      toast.success('Driver created successfully');
      setShowCreateModal(false);
    } catch (error) {
      toast.error('Failed to create driver');
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      // await api.patch(`/admin/drivers/${selectedDriver._id}`, formData);
      const updatedDrivers = drivers.map(d =>
        d._id === selectedDriver._id
          ? {
              ...d,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              licenseNumber: formData.licenseNumber,
              licenseExpiry: formData.licenseExpiry,
              vehicleDetails: { number: formData.vehicleNumber, type: formData.vehicleType },
              address: { street: formData.address, city: formData.city },
              wallet: { ...d.wallet, balance: formData.walletBalance }
            }
          : d
      );
      setDrivers(updatedDrivers);
      toast.success('Driver updated successfully');
      setShowEditModal(false);
    } catch (error) {
      toast.error('Failed to update driver');
    }
  };

  const confirmDelete = async () => {
    try {
      // await api.delete(`/admin/drivers/${selectedDriver._id}`);
      setDrivers(drivers.filter(d => d._id !== selectedDriver._id));
      toast.success('Driver deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to delete driver');
    }
  };

  const confirmApprove = async (approved) => {
    try {
      // await api.patch(`/admin/drivers/${selectedDriver._id}/approve`, { approved });
      const updatedDrivers = drivers.map(d =>
        d._id === selectedDriver._id ? { ...d, isApproved: approved } : d
      );
      setDrivers(updatedDrivers);
      toast.success(`Driver ${approved ? 'approved' : 'rejected'} successfully`);
      setShowApproveModal(false);
    } catch (error) {
      toast.error('Failed to update driver approval status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-cr-dark">Driver Management</h1>
        <div className="flex items-center space-x-3">
          <button onClick={handleCreate} className="btn btn-primary flex items-center space-x-2">
            <UserPlus size={20} />
            <span>Add Driver</span>
          </button>
          <button onClick={fetchDrivers} className="btn btn-outline">Refresh</button>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field">
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="busy">Busy</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card">
          <p className="text-primary-700 text-sm">Total Drivers</p>
          <p className="text-2xl font-bold mt-1">{drivers.length}</p>
        </div>
        <div className="card">
          <p className="text-primary-700 text-sm">Online</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{drivers.filter(d => d.status === 'online').length}</p>
        </div>
        <div className="card">
          <p className="text-primary-700 text-sm">Busy</p>
          <p className="text-2xl font-bold mt-1 text-cr-dark">{drivers.filter(d => d.status === 'busy').length}</p>
        </div>
        <div className="card">
          <p className="text-primary-700 text-sm">Offline</p>
          <p className="text-2xl font-bold mt-1 text-primary-700">{drivers.filter(d => d.status === 'offline').length}</p>
        </div>
        <div className="card">
          <p className="text-primary-700 text-sm">Pending Approval</p>
          <p className="text-2xl font-bold mt-1 text-yellow-600">{drivers.filter(d => !d.isApproved).length}</p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-cr-dark border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-primary-700">Loading...</p>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <p className="text-center py-8 text-primary-700">No drivers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">License</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Vehicle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Approval</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Trips</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Wallet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDrivers.map((driver) => (
                <tr key={driver._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <Truck className="text-cr-dark" size={20} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                        <div className="text-sm text-primary-700">{driver.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{driver.phone}</div>
                    {driver.address?.city && (
                      <div className="text-sm text-primary-700 flex items-center gap-1 mt-1">
                        <MapPin size={12} />
                        {driver.address.city}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{driver.licenseNumber}</div>
                    <div className="text-sm text-primary-700">
                      Exp: {new Date(driver.licenseExpiry).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{driver.vehicleDetails?.number || 'N/A'}</div>
                    <div className="text-sm text-primary-700">{driver.vehicleDetails?.type || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      driver.status === 'online' ? 'bg-green-100 text-green-800' :
                      driver.status === 'busy' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {driver.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      driver.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {driver.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm">
                      <Star className="text-yellow-400 fill-yellow-400 mr-1" size={16} />
                      <span className="font-medium">
                        {typeof driver.rating === 'number'
                          ? driver.rating.toFixed(1)
                          : driver.rating?.average?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{driver.totalTrips || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₹{driver.wallet?.balance?.toLocaleString('en-IN') || 0}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(driver)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(driver)}
                        className="text-green-600 hover:text-green-800"
                        title="Edit Driver"
                      >
                        <Edit size={18} />
                      </button>
                      {!driver.isApproved && (
                        <button
                          onClick={() => handleApprove(driver)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Approve/Reject"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(driver)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Driver"
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
        )}
      </div>

      {/* Create Driver Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cr-dark">Add New Driver</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={submitCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">License Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="input-field"
                    placeholder="DL1420110012345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">License Expiry *</label>
                  <input
                    type="date"
                    required
                    value={formData.licenseExpiry}
                    onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Vehicle Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    className="input-field"
                    placeholder="DL 01 AB 1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Vehicle Type *</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Tata Ace">Tata Ace</option>
                    <option value="Mahindra Pickup">Mahindra Pickup</option>
                    <option value="Tata 407">Tata 407</option>
                    <option value="Ashok Leyland Dost">Ashok Leyland Dost</option>
                    <option value="Piaggio Porter">Piaggio Porter</option>
                    <option value="Force Tempo">Force Tempo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="input-field"
                    placeholder="New Delhi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Initial Wallet Balance</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.walletBalance}
                    onChange={(e) => setFormData({ ...formData, walletBalance: Number(e.target.value) })}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Driver Modal */}
      {showViewModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cr-dark">Driver Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                  <Truck className="text-cr-dark" size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cr-dark">{selectedDriver.name}</h3>
                  <p className="text-primary-700">{selectedDriver.email}</p>
                  <div className="flex items-center mt-1">
                    <Star className="text-yellow-400 fill-yellow-400 mr-1" size={16} />
                    <span className="font-semibold">
                      {typeof selectedDriver.rating === 'number'
                        ? selectedDriver.rating.toFixed(1)
                        : selectedDriver.rating?.average?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="text-sm text-primary-700 ml-1">
                      ({selectedDriver.rating?.count || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-primary-700">Phone</p>
                  <p className="font-semibold">{selectedDriver.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-700">City</p>
                  <p className="font-semibold">{selectedDriver.address?.city}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-700">License Number</p>
                  <p className="font-semibold">{selectedDriver.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-700">License Expiry</p>
                  <p className="font-semibold">{new Date(selectedDriver.licenseExpiry).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-700">Vehicle Number</p>
                  <p className="font-semibold">{selectedDriver.vehicleDetails?.number}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-700">Vehicle Type</p>
                  <p className="font-semibold">{selectedDriver.vehicleDetails?.type}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-700">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedDriver.status === 'online' ? 'bg-green-100 text-green-800' :
                    selectedDriver.status === 'busy' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedDriver.status?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-primary-700">Approval Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedDriver.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedDriver.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-primary-700">Total Trips</p>
                  <p className="font-semibold text-cr-dark">{selectedDriver.totalTrips}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-700">Wallet Balance</p>
                  <p className="font-semibold text-green-600">₹{selectedDriver.wallet?.balance?.toLocaleString('en-IN')}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-primary-700">Joined</p>
                  <p className="font-semibold">{new Date(selectedDriver.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button onClick={() => setShowViewModal(false)} className="btn btn-outline">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Driver Modal */}
      {showEditModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cr-dark">Edit Driver</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={submitEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">New Password (optional)</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-field"
                    placeholder="Leave blank to keep current"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">License Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">License Expiry *</label>
                  <input
                    type="date"
                    required
                    value={formData.licenseExpiry}
                    onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Vehicle Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Vehicle Type *</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Tata Ace">Tata Ace</option>
                    <option value="Mahindra Pickup">Mahindra Pickup</option>
                    <option value="Tata 407">Tata 407</option>
                    <option value="Ashok Leyland Dost">Ashok Leyland Dost</option>
                    <option value="Piaggio Porter">Piaggio Porter</option>
                    <option value="Force Tempo">Force Tempo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Wallet Balance</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.walletBalance}
                    onChange={(e) => setFormData({ ...formData, walletBalance: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-cr-dark">Confirm Delete</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete driver <span className="font-semibold">{selectedDriver.name}</span>?
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

      {/* Approve/Reject Modal */}
      {showApproveModal && selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-cr-dark">Driver Approval</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Review driver <span className="font-semibold">{selectedDriver.name}</span>
              </p>
              <div className="bg-primary-50 p-4 rounded-lg space-y-2 text-sm">
                <p><span className="font-medium">License:</span> {selectedDriver.licenseNumber}</p>
                <p><span className="font-medium">Vehicle:</span> {selectedDriver.vehicleDetails?.type} - {selectedDriver.vehicleDetails?.number}</p>
                <p><span className="font-medium">City:</span> {selectedDriver.address?.city}</p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button onClick={() => setShowApproveModal(false)} className="btn btn-outline">
                Cancel
              </button>
              <button
                onClick={() => confirmApprove(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <XCircle size={18} />
                <span>Reject</span>
              </button>
              <button
                onClick={() => confirmApprove(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <CheckCircle size={18} />
                <span>Approve</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
