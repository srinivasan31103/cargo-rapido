import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-elegant flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <div className="text-9xl mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              🚚
            </motion.div>
          </div>

          {/* Error Code */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-8xl md:text-9xl font-bold bg-gradient-dark bg-clip-text text-transparent mb-6"
          >
            404
          </motion.h1>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-cr-dark mb-4">
              Oops! Lost in Transit
            </h2>
            <p className="text-xl text-primary-700 mb-8">
              The page you're looking for seems to have taken a wrong turn.
              <br />
              Don't worry, we'll help you get back on track!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
          >
            <button
              onClick={() => navigate('/')}
              className="bg-cr-dark text-cr-white px-8 py-4 rounded-lg hover:bg-accent-hover transition-all font-semibold text-lg shadow-elegant-lg hover:shadow-elegant-xl transform hover:-translate-y-0.5"
            >
              🏠 Go Home
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-cr-white text-cr-dark px-8 py-4 rounded-lg hover:bg-primary-50 transition-all font-semibold text-lg border-2 border-primary-300 shadow-elegant-lg"
            >
              ← Go Back
            </button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-cr-white rounded-2xl p-8 shadow-elegant-xl"
          >
            <h3 className="text-lg font-semibold text-cr-dark mb-4">
              Looking for something specific?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/login')}
                className="p-4 rounded-lg hover:bg-primary-100 transition-colors group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🔑</div>
                <div className="text-sm font-medium text-primary-700">Login</div>
              </button>
              <button
                onClick={() => navigate('/register')}
                className="p-4 rounded-lg hover:bg-primary-100 transition-colors group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📝</div>
                <div className="text-sm font-medium text-primary-700">Sign Up</div>
              </button>
              <button
                onClick={() => navigate('/driver/login')}
                className="p-4 rounded-lg hover:bg-primary-100 transition-colors group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🚗</div>
                <div className="text-sm font-medium text-primary-700">Driver Login</div>
              </button>
              <button
                onClick={() => navigate('/home')}
                className="p-4 rounded-lg hover:bg-primary-100 transition-colors group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">ℹ️</div>
                <div className="text-sm font-medium text-primary-700">About Us</div>
              </button>
            </div>
          </motion.div>

          {/* Fun Fact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-primary-700 text-sm"
          >
            💡 <strong>Did you know?</strong> We've successfully delivered over 50,000 packages!
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
