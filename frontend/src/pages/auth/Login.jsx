import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, User, UserCircle, Shield, Briefcase, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [selectedRole, setSelectedRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loginDriver, loading } = useAuthStore();
  const navigate = useNavigate();

  // Role configurations - Grayscale Design
  const roles = [
    {
      id: 'user',
      name: 'User',
      icon: User,
      color: 'gray',
      description: 'Book and track deliveries',
      demoEmail: 'testuser@example.com',
      bgGradient: 'from-cr-dark to-primary-900',        // Dark gradient for sidebar
      formGradient: 'from-cr-dark to-primary-900',      // Dark gradient for form icon
      lightBg: 'bg-primary-100',
      iconColor: 'text-primary-700'
    },
    {
      id: 'driver',
      name: 'Driver',
      icon: Truck,
      color: 'gray',
      description: 'Accept and complete deliveries',
      demoEmail: 'testdriver@example.com',
      bgGradient: 'from-cr-dark to-primary-900',        // Dark gradient for sidebar
      formGradient: 'from-cr-dark to-primary-900',      // Dark gradient for form icon
      lightBg: 'bg-primary-100',
      iconColor: 'text-primary-700'
    },
    {
      id: 'admin',
      name: 'Admin',
      icon: Shield,
      color: 'gray',
      description: 'Manage platform operations',
      demoEmail: 'admin@example.com',
      bgGradient: 'from-cr-dark to-primary-900',        // Dark gradient for sidebar
      formGradient: 'from-cr-dark to-primary-900',      // Dark gradient for form icon
      lightBg: 'bg-primary-100',
      iconColor: 'text-primary-700'
    },
    {
      id: 'business',
      name: 'Business',
      icon: Briefcase,
      color: 'gray',
      description: 'Enterprise logistics solutions',
      demoEmail: 'business@example.com',
      bgGradient: 'from-cr-dark to-primary-900',        // Dark gradient for sidebar
      formGradient: 'from-cr-dark to-primary-900',      // Dark gradient for form icon
      lightBg: 'bg-primary-100',
      iconColor: 'text-primary-700'
    }
  ];

  const selectedRoleConfig = roles.find(r => r.id === selectedRole);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use correct login function based on selected role
      if (selectedRole === 'driver') {
        await loginDriver(formData);
      } else {
        await login(formData);
      }

      toast.success(`Welcome back, ${selectedRoleConfig.name}!`);

      // Role-based navigation
      switch (selectedRole) {
        case 'driver':
          navigate('/driver');
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'business':
          navigate('/');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'Invalid credentials');
    }
  };

  const fillDemoCredentials = (role) => {
    const roleConfig = roles.find(r => r.id === role);
    setFormData({
      email: roleConfig.demoEmail,
      password: `${roleConfig.name}@1234`
    });
    setSelectedRole(role);
    toast.success(`Demo credentials loaded for ${roleConfig.name}`);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${selectedRoleConfig.bgGradient} flex items-center justify-center p-4 transition-all duration-500`}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden relative z-10">
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Role Selection */}
          <div className={`lg:w-2/5 bg-gradient-to-br ${selectedRoleConfig.bgGradient} p-8 text-white`}>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Truck size={36} className="text-white" />
                <h1 className="text-3xl font-bold">CargoRapido</h1>
              </div>
              <p className="text-white/80">Fast, Reliable, Everywhere</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold mb-4">Select Login Type</h2>
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <motion.button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-200 ${
                      isSelected
                        ? 'bg-white text-gray-900 shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <div className={`p-3 rounded-lg ${
                      isSelected
                        ? role.lightBg
                        : 'bg-white/30'
                    }`}>
                      <Icon size={24} className={isSelected ? role.iconColor : 'text-white'} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold">{role.name}</div>
                      <div className={`text-xs ${isSelected ? 'text-gray-600' : 'text-white/90'}`}>
                        {role.description}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-cr-dark"></div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Demo Credentials Info */}
            <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <h3 className="text-sm font-semibold mb-2">📝 Demo Credentials</h3>
              <p className="text-xs text-white/80 mb-3">
                Click role buttons below to auto-fill demo login
              </p>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => fillDemoCredentials(role.id)}
                    className="text-xs px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:w-3/5 p-8 lg:p-12">
            <div className="mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${selectedRoleConfig.formGradient} rounded-2xl mb-4 shadow-lg`}>
                {(() => {
                  const Icon = selectedRoleConfig.icon;
                  return <Icon size={32} className="text-white" />;
                })()}
              </div>
              <h2 className="text-3xl font-bold text-cr-dark">
                Welcome Back!
              </h2>
              <p className="text-primary-700 mt-2">
                Sign in as <span className="font-semibold text-cr-dark">{selectedRoleConfig.name}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  data-testid="email-input"
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-primary-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary-700 hover:text-cr-dark"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input pr-10"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    data-testid="password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600 hover:text-cr-dark"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-cr-dark border-gray-300 rounded focus:ring-primary-700 cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-primary-700 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`btn w-full bg-gradient-to-r ${selectedRoleConfig.formGradient} text-white hover:opacity-90 transition-all duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="spinner w-5 h-5 border-2 border-white border-t-transparent"></div>
                    Signing in...
                  </span>
                ) : (
                  `Sign In as ${selectedRoleConfig.name}`
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-primary-700">New to CargoRapido?</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  to="/register"
                  className="flex-1 text-center py-3 px-4 border-2 border-primary-300 rounded-lg text-cr-dark font-medium hover:bg-primary-50 transition-colors"
                >
                  Sign Up as User
                </Link>
                <Link
                  to="/driver/register"
                  className="flex-1 text-center py-3 px-4 border-2 border-primary-300 rounded-lg text-cr-dark font-medium hover:bg-primary-50 transition-colors"
                >
                  Join as Driver
                </Link>
              </div>

              {/* Quick Demo Access */}
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <p className="text-xs text-primary-700 text-center mb-2">
                  🚀 <strong>Quick Demo Access</strong>
                </p>
                <p className="text-xs text-primary-700 text-center">
                  All demo passwords: <code className="bg-primary-200 px-2 py-0.5 rounded">[Role]@1234</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
