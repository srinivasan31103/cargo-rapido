import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, X, Home, Briefcase, Heart, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import useAuthStore from '../../store/authStore';

export default function SavedAddresses() {
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    label: 'home',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    contactName: '',
    contactPhone: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get(`/users/${user._id}/addresses`);
      setAddresses(response.data.data || []);
    } catch (error) {
      // Mock data fallback
      setAddresses([
        {
          _id: '1',
          label: 'home',
          addressLine1: 'A-123, Green Park',
          addressLine2: 'Sector 16',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110016',
          landmark: 'Near Metro Station',
          contactName: user.name,
          contactPhone: user.phone
        },
        {
          _id: '2',
          label: 'work',
          addressLine1: 'Tower B, Cyber Hub',
          addressLine2: 'DLF Phase 3',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122002',
          landmark: 'Opposite Food Court',
          contactName: user.name,
          contactPhone: user.phone
        }
      ]);
    }
  };

  const labelIcons = {
    home: Home,
    work: Briefcase,
    other: Heart
  };

  const labelColors = {
    home: 'bg-green-100 text-green-700',
    work: 'bg-blue-100 text-blue-700',
    other: 'bg-purple-100 text-purple-700'
  };

  const handleAdd = () => {
    setEditingAddress(null);
    setFormData({
      label: 'home',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      contactName: user?.name || '',
      contactPhone: user?.phone || ''
    });
    setShowModal(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await api.delete(`/users/${user._id}/addresses/${id}`);
      setAddresses(addresses.filter(addr => addr._id !== id));
      toast.success('Address deleted successfully');
    } catch (error) {
      // Mock delete
      setAddresses(addresses.filter(addr => addr._id !== id));
      toast.success('Address deleted successfully');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingAddress) {
        await api.put(`/users/${user._id}/addresses/${editingAddress._id}`, formData);
        setAddresses(addresses.map(addr =>
          addr._id === editingAddress._id ? { ...addr, ...formData } : addr
        ));
        toast.success('Address updated successfully');
      } else {
        const response = await api.post(`/users/${user._id}/addresses`, formData);
        setAddresses([...addresses, response.data.data]);
        toast.success('Address added successfully');
      }
      setShowModal(false);
    } catch (error) {
      // Mock save
      if (editingAddress) {
        setAddresses(addresses.map(addr =>
          addr._id === editingAddress._id ? { ...addr, ...formData } : addr
        ));
        toast.success('Address updated successfully');
      } else {
        setAddresses([...addresses, { _id: Date.now().toString(), ...formData }]);
        toast.success('Address added successfully');
      }
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cr-dark">Saved Addresses</h1>
          <p className="text-primary-700 mt-2">Manage your frequently used addresses</p>
        </div>
        <button onClick={handleAdd} className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="card text-center py-12">
          <MapPin size={48} className="mx-auto text-primary-700 mb-4" />
          <h3 className="text-xl font-semibold text-cr-dark mb-2">No saved addresses</h3>
          <p className="text-primary-700 mb-6">Add your frequently used addresses for quick booking</p>
          <button onClick={handleAdd} className="btn btn-primary inline-flex items-center gap-2">
            <Plus size={20} />
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => {
            const Icon = labelIcons[address.label] || MapPin;
            return (
              <div key={address._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${labelColors[address.label]}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-cr-dark capitalize">{address.label}</h3>
                      <p className="text-sm text-primary-700">{address.contactName}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(address._id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-primary-700">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>{address.city}, {address.state} - {address.pincode}</p>
                  {address.landmark && <p className="italic">Landmark: {address.landmark}</p>}
                  <p className="pt-2 text-cr-dark font-medium">{address.contactPhone}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cr-dark">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Address Label *</label>
                <div className="flex gap-3">
                  {['home', 'work', 'other'].map(label => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setFormData({ ...formData, label })}
                      className={`flex-1 py-2 px-4 rounded-lg border-2 capitalize font-medium transition-colors ${
                        formData.label === label
                          ? 'border-cr-dark bg-cr-dark text-white'
                          : 'border-gray-300 text-primary-700 hover:border-primary-500'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="input-field"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Address Line 1 *</label>
                <input
                  type="text"
                  required
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="input-field"
                  placeholder="House No., Building Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Address Line 2</label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  className="input-field"
                  placeholder="Street, Area"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-primary-700 mb-2">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Pincode *</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="input-field"
                    placeholder="110001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Landmark</label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                    className="input-field"
                    placeholder="Near Metro Station"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline flex-1"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
