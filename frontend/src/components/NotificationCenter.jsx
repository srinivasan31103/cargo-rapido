import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Package, Truck, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { getSocket, offEvent } from '../utils/socket';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Listen for various notification events
    socket.on('booking:driverAssigned', (data) => {
      addNotification({
        type: 'success',
        title: 'Driver Assigned!',
        message: `Your booking #${data.bookingId.slice(-6)} has been assigned to a driver`,
        icon: Truck,
        timestamp: new Date()
      });
    });

    socket.on('booking:statusUpdate', (data) => {
      addNotification({
        type: 'info',
        title: 'Booking Updated',
        message: `Booking status changed to: ${data.status}`,
        icon: Package,
        timestamp: new Date()
      });
    });

    socket.on('delivery:completed', (data) => {
      addNotification({
        type: 'success',
        title: 'Delivery Completed!',
        message: 'Your package has been successfully delivered',
        icon: CheckCircle,
        timestamp: new Date()
      });
    });

    socket.on('booking:cancelled', (data) => {
      addNotification({
        type: 'warning',
        title: 'Booking Cancelled',
        message: data.reason || 'Your booking has been cancelled',
        icon: AlertCircle,
        timestamp: new Date()
      });
    });

    socket.on('driver:nearby', (data) => {
      addNotification({
        type: 'info',
        title: 'Driver Nearby',
        message: `Your driver is ${data.distance}km away`,
        icon: Truck,
        timestamp: new Date()
      });
    });

    return () => {
      offEvent('booking:driverAssigned');
      offEvent('booking:statusUpdate');
      offEvent('delivery:completed');
      offEvent('booking:cancelled');
      offEvent('driver:nearby');
    };
  }, []);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      ...notification
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Play sound
    playNotificationSound();

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png',
        badge: '/logo.png'
      });
    }

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 10000);
  };

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {
      // Ignore if sound fails to play
    });
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const notification = notifications.find((n) => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const typeConfig = {
    success: { bg: 'bg-green-50', border: 'border-green-500', icon: 'text-green-600' },
    error: { bg: 'bg-red-50', border: 'border-red-500', icon: 'text-red-600' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-500', icon: 'text-yellow-600' },
    info: { bg: 'bg-blue-50', border: 'border-blue-500', icon: 'text-blue-600' }
  };

  return (
    <>
      {/* Notification Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Bell size={24} className="text-gray-700" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </button>

        {/* Notification Panel */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-40"
              />

              {/* Panel */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <div className="flex items-center space-x-2">
                    <Bell size={20} />
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {notifications.length > 0 && (
                      <>
                        <button
                          onClick={markAllAsRead}
                          className="text-xs hover:bg-white/10 px-2 py-1 rounded transition-colors"
                        >
                          Mark all read
                        </button>
                        <button
                          onClick={clearAll}
                          className="text-xs hover:bg-white/10 px-2 py-1 rounded transition-colors"
                        >
                          Clear all
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="hover:bg-white/10 p-1 rounded transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell size={48} className="mx-auto mb-4 opacity-30" />
                      <p>No notifications yet</p>
                      <p className="text-sm mt-2">
                        We'll notify you about your bookings and deliveries
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {notifications.map((notification) => {
                        const config = typeConfig[notification.type];
                        const Icon = notification.icon;

                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                              !notification.read ? 'bg-blue-50/30' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`p-2 rounded-full ${config.bg} border-2 ${config.border}`}
                              >
                                <Icon size={20} className={config.icon} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-semibold text-gray-900 text-sm">
                                    {notification.title}
                                  </h4>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeNotification(notification.id);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 ml-2"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {formatDistanceToNow(notification.timestamp, {
                                    addSuffix: true
                                  })}
                                </p>
                              </div>

                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1" />
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notifications (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {notifications.slice(0, 3).map((notification) => {
            const config = typeConfig[notification.type];
            const Icon = notification.icon;

            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.8 }}
                transition={{ type: 'spring', damping: 20 }}
                className={`pointer-events-auto ${config.bg} border-2 ${config.border} rounded-lg shadow-lg p-4 w-80`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${config.icon}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NotificationCenter;
