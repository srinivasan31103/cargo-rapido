import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-elegant flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-cr-white rounded-2xl shadow-elegant-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Mail className="text-cr-dark" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-cr-dark">Forgot Password?</h1>
            <p className="text-primary-700 mt-2">
              {!sent
                ? "No worries, we'll send you reset instructions"
                : 'Check your email for reset link'}
            </p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-primary-700 hover:text-cr-dark transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full">
                <CheckCircle className="text-cr-dark" size={40} />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-cr-dark">Email Sent!</h3>
                <p className="text-primary-700">
                  We've sent a password reset link to
                  <br />
                  <span className="font-medium text-cr-dark">{email}</span>
                </p>
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-sm text-primary-700">
                <p className="font-medium mb-1">Didn't receive the email?</p>
                <p>Check your spam folder or</p>
                <button
                  onClick={() => setSent(false)}
                  className="text-cr-dark hover:text-primary-800 font-medium mt-1"
                >
                  try another email address
                </button>
              </div>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-primary-700 hover:text-cr-dark transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          )}
        </div>

        {/* Demo Note */}
        <div className="mt-6 p-4 bg-primary-50 border border-primary-300 rounded-lg">
          <p className="text-sm text-primary-700 text-center">
            <strong>Demo Mode:</strong> In production, this would send an actual email
            with a password reset link.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
