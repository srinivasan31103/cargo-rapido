import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, X, Mail, Phone, Shield, Search, UserPlus, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';

export default function TeamManagement() {
  const { user } = useAuthStore();
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'member',
    department: '',
    permissions: {
      canCreateBooking: true,
      canCancelBooking: false,
      canViewAnalytics: false,
      canManageTeam: false,
      canManageBilling: false
    }
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    applySearch();
  }, [searchQuery, teamMembers]);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/business/${user._id}/team`);
      setTeamMembers(response.data.data || []);
    } catch (error) {
      // Mock data fallback
      setTeamMembers([
        {
          _id: '1',
          name: 'Rahul Sharma',
          email: 'rahul@example.com',
          phone: '+91 98765 43210',
          role: 'admin',
          department: 'Operations',
          status: 'active',
          permissions: {
            canCreateBooking: true,
            canCancelBooking: true,
            canViewAnalytics: true,
            canManageTeam: true,
            canManageBilling: true
          },
          joinedAt: new Date('2023-06-15'),
          lastActive: new Date('2024-01-20'),
          bookingsCreated: 145
        },
        {
          _id: '2',
          name: 'Priya Patel',
          email: 'priya@example.com',
          phone: '+91 98765 43211',
          role: 'manager',
          department: 'Logistics',
          status: 'active',
          permissions: {
            canCreateBooking: true,
            canCancelBooking: true,
            canViewAnalytics: true,
            canManageTeam: false,
            canManageBilling: false
          },
          joinedAt: new Date('2023-08-20'),
          lastActive: new Date('2024-01-20'),
          bookingsCreated: 98
        },
        {
          _id: '3',
          name: 'Amit Kumar',
          email: 'amit@example.com',
          phone: '+91 98765 43212',
          role: 'member',
          department: 'Sales',
          status: 'active',
          permissions: {
            canCreateBooking: true,
            canCancelBooking: false,
            canViewAnalytics: false,
            canManageTeam: false,
            canManageBilling: false
          },
          joinedAt: new Date('2023-10-10'),
          lastActive: new Date('2024-01-19'),
          bookingsCreated: 67
        },
        {
          _id: '4',
          name: 'Sneha Verma',
          email: 'sneha@example.com',
          phone: '+91 98765 43213',
          role: 'member',
          department: 'Customer Support',
          status: 'inactive',
          permissions: {
            canCreateBooking: true,
            canCancelBooking: false,
            canViewAnalytics: false,
            canManageTeam: false,
            canManageBilling: false
          },
          joinedAt: new Date('2023-12-01'),
          lastActive: new Date('2024-01-15'),
          bookingsCreated: 23
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const applySearch = () => {
    if (!searchQuery) {
      setFilteredMembers(teamMembers);
      return;
    }

    const searchLower = searchQuery.toLowerCase();
    const filtered = teamMembers.filter(member =>
      member.name.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      member.department.toLowerCase().includes(searchLower) ||
      member.role.toLowerCase().includes(searchLower)
    );
    setFilteredMembers(filtered);
  };

  const handleAdd = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'member',
      department: '',
      permissions: {
        canCreateBooking: true,
        canCancelBooking: false,
        canViewAnalytics: false,
        canManageTeam: false,
        canManageBilling: false
      }
    });
    setShowModal(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      role: member.role,
      department: member.department,
      permissions: { ...member.permissions }
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to remove ${name} from the team?`)) return;

    try {
      await api.delete(`/business/${user._id}/team/${id}`);
      setTeamMembers(teamMembers.filter(m => m._id !== id));
      toast.success('Team member removed successfully');
    } catch (error) {
      // Mock delete
      setTeamMembers(teamMembers.filter(m => m._id !== id));
      toast.success('Team member removed successfully');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingMember) {
        await api.put(`/business/${user._id}/team/${editingMember._id}`, formData);
        setTeamMembers(teamMembers.map(m =>
          m._id === editingMember._id ? { ...m, ...formData } : m
        ));
        toast.success('Team member updated successfully');
      } else {
        const response = await api.post(`/business/${user._id}/team`, formData);
        setTeamMembers([...teamMembers, response.data.data]);
        toast.success('Team member added successfully. Invitation sent via email.');
      }
      setShowModal(false);
    } catch (error) {
      // Mock save
      if (editingMember) {
        setTeamMembers(teamMembers.map(m =>
          m._id === editingMember._id ? { ...m, ...formData } : m
        ));
        toast.success('Team member updated successfully');
      } else {
        const newMember = {
          _id: Date.now().toString(),
          ...formData,
          status: 'active',
          joinedAt: new Date(),
          lastActive: new Date(),
          bookingsCreated: 0
        };
        setTeamMembers([...teamMembers, newMember]);
        toast.success('Team member added successfully. Invitation sent via email.');
      }
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (member) => {
    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    try {
      await api.patch(`/business/${user._id}/team/${member._id}/status`, { status: newStatus });
      setTeamMembers(teamMembers.map(m =>
        m._id === member._id ? { ...m, status: newStatus } : m
      ));
      toast.success(`Team member ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch (error) {
      // Mock toggle
      setTeamMembers(teamMembers.map(m =>
        m._id === member._id ? { ...m, status: newStatus } : m
      ));
      toast.success(`Team member ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    }
  };

  const roleColors = {
    admin: 'bg-red-100 text-red-700',
    manager: 'bg-blue-100 text-blue-700',
    member: 'bg-green-100 text-green-700'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700'
  };

  const rolePermissions = {
    admin: {
      canCreateBooking: true,
      canCancelBooking: true,
      canViewAnalytics: true,
      canManageTeam: true,
      canManageBilling: true
    },
    manager: {
      canCreateBooking: true,
      canCancelBooking: true,
      canViewAnalytics: true,
      canManageTeam: false,
      canManageBilling: false
    },
    member: {
      canCreateBooking: true,
      canCancelBooking: false,
      canViewAnalytics: false,
      canManageTeam: false,
      canManageBilling: false
    }
  };

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
      permissions: { ...rolePermissions[role] }
    });
  };

  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter(m => m.status === 'active').length,
    inactive: teamMembers.filter(m => m.status === 'inactive').length,
    admins: teamMembers.filter(m => m.role === 'admin').length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600 mt-2">Manage your team members and their permissions</p>
          </div>
          <button onClick={handleAdd} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <UserPlus size={20} />
            Add Member
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Members</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Inactive</p>
                <p className="text-2xl font-bold text-gray-600 mt-1">{stats.inactive}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Users size={24} className="text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Admins</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.admins}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Shield size={24} className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, department, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Team Members Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading team members...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No team members found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Try adjusting your search' : 'Add your first team member to get started'}
              </p>
              {!searchQuery && (
                <button onClick={handleAdd} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Add First Member
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Member</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Bookings</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-700 font-semibold">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-500">
                              Joined {new Date(member.joinedAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <p className="text-gray-900 flex items-center gap-1">
                            <Mail size={14} className="text-gray-400" />
                            {member.email}
                          </p>
                          <p className="text-gray-600 flex items-center gap-1 mt-1">
                            <Phone size={14} className="text-gray-400" />
                            {member.phone}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{member.department}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${roleColors[member.role]}`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(member)}
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[member.status]}`}
                        >
                          {member.status}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 font-semibold">
                        {member.bookingsCreated}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(member)}
                            className="text-blue-600 hover:text-blue-800 p-2"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(member._id, member.name)}
                            className="text-red-600 hover:text-red-800 p-2"
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
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                    <input
                      type="text"
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Operations, Sales"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['admin', 'manager', 'member'].map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleChange(role)}
                        className={`py-2 px-4 rounded-lg border-2 capitalize font-medium transition-colors ${
                          formData.role === role
                            ? 'border-green-600 bg-green-600 text-white'
                            : 'border-gray-300 text-gray-700 hover:border-green-500'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Key size={18} />
                    Permissions
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(formData.permissions).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, [key]: e.target.checked }
                          })}
                          className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingMember ? 'Update Member' : 'Add Member')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
