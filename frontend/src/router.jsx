import { createBrowserRouter, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import DriverLayout from './components/layouts/DriverLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DriverLogin from './pages/auth/DriverLogin';
import DriverRegister from './pages/auth/DriverRegister';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Public Pages
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';

// User Pages
import Home from './pages/user/Home';
import NewBooking from './pages/user/NewBooking';
import LiveTracking from './pages/user/LiveTracking';
import MyDeliveries from './pages/user/MyDeliveries';
import Wallet from './pages/user/Wallet';
import Profile from './pages/user/Profile';
import Support from './pages/user/Support';
import SavedAddresses from './pages/user/SavedAddresses';
import Referral from './pages/user/Referral';

// Driver Pages
import DriverDashboard from './pages/driver/DriverDashboard';
import IncomingRequests from './pages/driver/IncomingRequests';
import StartRide from './pages/driver/StartRide';
import UploadPOD from './pages/driver/UploadPOD';
import DriverEarnings from './pages/driver/DriverEarnings';
import TripHistory from './pages/driver/TripHistory';
import DriverProfile from './pages/driver/DriverProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDrivers from './pages/admin/AdminDrivers';
import AdminBookings from './pages/admin/AdminBookings';
import LiveBookingsMap from './pages/admin/LiveBookingsMap';
import RevenueStats from './pages/admin/RevenueStats';
import AdminSettings from './pages/admin/AdminSettings';

// Business Pages
import BusinessDashboard from './pages/business/BusinessDashboard';
import BusinessAnalytics from './pages/business/BusinessAnalytics';
import TeamManagement from './pages/business/TeamManagement';

// Root Redirect Component - sends users to appropriate dashboard
const RootRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Redirect to appropriate dashboard based on role
  switch (user?.role) {
    case 'driver':
      return <Navigate to="/driver" replace />;
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'user':
    case 'business':
      return <Navigate to="/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'driver') {
      return <Navigate to="/driver" replace />;
    } else if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  // Root Redirect
  {
    path: '/',
    element: <RootRedirect />
  },

  // Public Routes
  {
    path: '/home',
    element: <LandingPage />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/driver/login',
    element: <DriverLogin />
  },
  {
    path: '/driver/register',
    element: <DriverRegister />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/admin/login',
    element: <Login />
  },

  // User Routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['user', 'business']}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'new-booking', element: <NewBooking /> },
      { path: 'tracking/:bookingId', element: <LiveTracking /> },
      { path: 'deliveries', element: <MyDeliveries /> },
      { path: 'wallet', element: <Wallet /> },
      { path: 'profile', element: <Profile /> },
      { path: 'support', element: <Support /> },
      { path: 'addresses', element: <SavedAddresses /> },
      { path: 'referral', element: <Referral /> }
    ]
  },

  // Driver Routes
  {
    path: '/driver',
    element: (
      <ProtectedRoute allowedRoles={['driver']}>
        <DriverLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DriverDashboard /> },
      { path: 'requests', element: <IncomingRequests /> },
      { path: 'ride/:bookingId', element: <StartRide /> },
      { path: 'pod/:bookingId', element: <UploadPOD /> },
      { path: 'earnings', element: <DriverEarnings /> },
      { path: 'trips', element: <TripHistory /> },
      { path: 'profile', element: <DriverProfile /> }
    ]
  },

  // Admin Routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'drivers', element: <AdminDrivers /> },
      { path: 'bookings', element: <AdminBookings /> },
      { path: 'live-map', element: <LiveBookingsMap /> },
      { path: 'revenue', element: <RevenueStats /> },
      { path: 'settings', element: <AdminSettings /> }
    ]
  },

  // Business Routes
  {
    path: '/business',
    element: (
      <ProtectedRoute allowedRoles={['business']}>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <BusinessDashboard /> },
      { path: 'analytics', element: <BusinessAnalytics /> },
      { path: 'team', element: <TeamManagement /> }
    ]
  },

  // 404
  {
    path: '*',
    element: <NotFound />
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true
  }
});

export default router;
