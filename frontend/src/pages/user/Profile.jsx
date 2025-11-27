import { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, X, Save } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.put('/auth/profile', formData);
      setUser(data.data);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
    });
    setEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-cr-dark">My Profile</h1>

      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-cr-dark flex items-center justify-center text-white text-3xl font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-cr-dark">{user?.name}</h2>
            <p className="text-primary-700">{user?.email}</p>
          </div>
        </div>

        {!editing ? (
          <>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-primary-700">
                <Mail size={20} className="text-cr-dark" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-700">
                <Phone size={20} className="text-cr-dark" />
                <span>{user?.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-700">
                <User size={20} className="text-cr-dark" />
                <span className="capitalize">{user?.role}</span>
              </div>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="btn btn-primary w-full mt-6 flex items-center justify-center gap-2"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Email (cannot be changed)
              </label>
              <input
                type="email"
                value={user?.email}
                className="input-field bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                className="input-field"
                required
                disabled={loading}
                placeholder="10-digit phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={user?.role}
                className="input-field bg-gray-100 cursor-not-allowed capitalize"
                disabled
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="btn btn-outline flex-1 flex items-center justify-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
