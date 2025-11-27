import { useState, useEffect } from 'react';
import { Search, Mail, Phone, MapPin, Shield, Ban, Check, Eye, Edit, Trash2, X, Plus, UserPlus } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    password: '',
    walletBalance: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, filterRole, users]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mock data for demonstration
      setUsers([
        {
          _id: '1',
          name: 'Amit Sharma',
          email: 'amit.sharma@example.com',
          phone: '+91 98765 43210',
          role: 'user',
          isActive: true,
          wallet: { balance: 2500 },
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '2',
          name: 'Priya Singh',
          email: 'priya.singh@example.com',
          phone: '+91 98765 43211',
          role: 'user',
          isActive: true,
          wallet: { balance: 1800 },
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '3',
          name: 'Tech Solutions Ltd',
          email: 'contact@techsolutions.com',
          phone: '+91 98765 43212',
          role: 'business',
          isActive: true,
          wallet: { balance: 15000 },
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '4',
          name: 'Deepak Verma',
          email: 'deepak.v@example.com',
          phone: '+91 98765 43213',
          role: 'user',
          isActive: false,
          wallet: { balance: 500 },
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '5',
          name: 'Admin User',
          email: 'admin@cargorapido.com',
          phone: '+91 98765 43214',
          role: 'admin',
          isActive: true,
          wallet: { balance: 0 },
          createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '6',
          name: 'Logistics Inc',
          email: 'info@logistics.com',
          phone: '+91 98765 43215',
          role: 'business',
          isActive: true,
          wallet: { balance: 25000 },
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          _id: '7',
          name: 'Rahul Kumar',
          email: 'rahul.k@example.com',
          phone: '+91 98765 43216',
          role: 'user',
          isActive: true,
          wallet: { balance: 3200 },
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  };

  const handleCreate = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      password: '',
      walletBalance: 0
    });
    setShowCreateModal(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: '',
      walletBalance: user.wallet?.balance || 0
    });
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleToggleStatus = async (user) => {
    try {
      // await api.patch(`/admin/users/${user._id}/status`, { isActive: !user.isActive });
      const updatedUsers = users.map(u =>
        u._id === user._id ? { ...u, isActive: !u.isActive } : u
      );
      setUsers(updatedUsers);
      toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    try {
      // await api.post('/admin/users', formData);
      const newUser = {
        _id: Date.now().toString(),
        ...formData,
        wallet: { balance: formData.walletBalance },
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setUsers([newUser, ...users]);
      toast.success('User created successfully');
      setShowCreateModal(false);
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      // await api.patch(`/admin/users/${selectedUser._id}`, formData);
      const updatedUsers = users.map(u =>
        u._id === selectedUser._id
          ? { ...u, ...formData, wallet: { balance: formData.walletBalance } }
          : u
      );
      setUsers(updatedUsers);
      toast.success('User updated successfully');
      setShowEditModal(false);
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const confirmDelete = async () => {
    try {
      // await api.delete(`/admin/users/${selectedUser._id}`);
      setUsers(users.filter(u => u._id !== selectedUser._id));
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-cr-dark">User Management</h1>
        <div className="flex items-center space-x-3">
          <button onClick={handleCreate} className="btn btn-primary flex items-center space-x-2">
            <UserPlus size={20} />
            <span>Add User</span>
          </button>
          <button onClick={fetchUsers} className="btn btn-outline">Refresh</button>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="input-field">
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="business">Business</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-primary-700 text-sm">Total Users</p>
          <p className="text-2xl font-bold mt-1">{users.length}</p>
        </div>
        <div className="card">
          <p className="text-primary-700 text-sm">Active</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{users.filter(u => u.isActive).length}</p>
        </div>
        <div className="card">
          <p className="text-primary-700 text-sm">Business</p>
          <p className="text-2xl font-bold mt-1 text-cr-dark">{users.filter(u => u.role === 'business').length}</p>
        </div>
        <div className="card">
          <p className="text-primary-700 text-sm">Admins</p>
          <p className="text-2xl font-bold mt-1 text-cr-dark">{users.filter(u => u.role === 'admin').length}</p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-cr-dark border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-primary-700">Loading...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center py-8 text-primary-700">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Wallet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-cr-dark font-semibold">{user.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-primary-700">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-primary-100 text-cr-dark' :
                      user.role === 'business' ? 'bg-primary-100 text-cr-dark' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">₹{user.wallet?.balance?.toLocaleString('en-IN') || 0}</td>
                  <td className="px-6 py-4 text-sm text-primary-700">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(user)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-green-600 hover:text-green-800"
                        title="Edit User"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={user.isActive ? "text-orange-600 hover:text-orange-800" : "text-green-600 hover:text-green-800"}
                        title={user.isActive ? "Deactivate" : "Activate"}
                      >
                        {user.isActive ? <Ban size={18} /> : <Check size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete User"
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

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cr-dark">Create New User</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={submitCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter full name"
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
                  placeholder="user@example.com"
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
                  placeholder="Enter password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input-field"
                >
                  <option value="user">User</option>
                  <option value="business">Business</option>
                  <option value="admin">Admin</option>
                </select>
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

              <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cr-dark">User Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-cr-dark font-bold text-3xl">{selectedUser.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cr-dark">{selectedUser.name}</h3>
                  <p className="text-primary-700">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-primary-700">Phone</p>
                  <p className="font-semibold">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-primary-700">Role</p>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    selectedUser.role === 'admin' ? 'bg-primary-100 text-cr-dark' :
                    selectedUser.role === 'business' ? 'bg-primary-100 text-cr-dark' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedUser.role?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-primary-700">Status</p>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-primary-700">Wallet Balance</p>
                  <p className="font-semibold text-green-600">₹{selectedUser.wallet?.balance?.toLocaleString('en-IN') || 0}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-primary-700">Joined</p>
                  <p className="font-semibold">{new Date(selectedUser.createdAt).toLocaleDateString('en-IN', {
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

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cr-dark">Edit User</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={submitEdit} className="p-6 space-y-4">
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
                <label className="block text-sm font-medium text-primary-700 mb-2">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field"
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="input-field"
                >
                  <option value="user">User</option>
                  <option value="business">Business</option>
                  <option value="admin">Admin</option>
                </select>
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

              <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-cr-dark">Confirm Delete</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete user <span className="font-semibold">{selectedUser.name}</span>?
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
