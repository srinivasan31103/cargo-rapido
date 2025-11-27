import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function DriverLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loginDriver, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginDriver(formData);
      toast.success('Welcome back, Driver!');
      navigate('/driver');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-elegant flex items-center justify-center p-4">
      <div className="bg-cr-white rounded-2xl shadow-elegant-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Truck size={32} className="text-cr-dark" />
          </div>
          <h1 className="text-3xl font-bold text-cr-dark">Driver Login</h1>
          <p className="text-primary-700 mt-2">Sign in to start deliveries</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              className="input"
              placeholder="driver@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              className="input"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-success w-full">
            {loading ? 'Signing in...' : 'Sign In as Driver'}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center text-sm text-gray-600">
            New driver?{' '}
            <Link to="/driver/register" className="text-cr-dark hover:text-primary-800 font-medium">
              Register here
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-cr-white text-primary-700">Or</span>
            </div>
          </div>

          <Link to="/login" className="btn btn-secondary w-full">
            Login as User
          </Link>
        </div>
      </div>
    </div>
  );
}
