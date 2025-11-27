import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { DollarSign, Settings, Bell, Shield, Save } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('pricing');
  const [pricingSettings, setPricingSettings] = useState({
    baseFare: 50,
    perKmRate: 12,
    surgeMultiplierMax: 2.5,
    minimumFare: 30,
    cargoSizeMultipliers: {
      XS: 1.0,
      S: 1.2,
      M: 1.5,
      L: 2.0,
      XL: 3.0
    },
    addOnCharges: {
      express: 50,
      insurance: 30,
      fragile: 20
    }
  });

  const [systemSettings, setSystemSettings] = useState({
    driverSearchRadius: 10,
    driverAssignmentTimeout: 60000,
    bookingCancellationFee: 20,
    driverCommission: 30,
    platformFee: 10,
    gstRate: 18,
    maxBookingsPerDriver: 5,
    autoAssignDrivers: true,
    allowDriverRejection: true,
    maintenanceMode: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      newBooking: true,
      bookingConfirmed: true,
      bookingCancelled: true,
      driverAssigned: true,
      deliveryCompleted: true,
      paymentReceived: true
    },
    smsNotifications: {
      newBooking: false,
      bookingConfirmed: true,
      driverAssigned: true,
      deliveryCompleted: true
    },
    pushNotifications: {
      newBooking: true,
      bookingStatusUpdate: true,
      driverLocationUpdate: false,
      chatMessages: true
    },
    adminAlerts: {
      newDriverRegistration: true,
      highValueBooking: true,
      systemErrors: true,
      lowDriverAvailability: true
    }
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPassword: true,
    twoFactorAuth: false,
    ipWhitelist: '',
    allowedDomains: '',
    apiRateLimit: 100,
    enableAuditLog: true
  });

  const handlePricingSave = () => {
    // TODO: Implement API call to save pricing settings
    toast.success('Pricing settings saved successfully!');
    console.log('Pricing Settings:', pricingSettings);
  };

  const handleSystemSave = () => {
    // TODO: Implement API call to save system settings
    toast.success('System settings saved successfully!');
    console.log('System Settings:', systemSettings);
  };

  const handleNotificationSave = () => {
    // TODO: Implement API call to save notification settings
    toast.success('Notification settings saved successfully!');
    console.log('Notification Settings:', notificationSettings);
  };

  const handleSecuritySave = () => {
    // TODO: Implement API call to save security settings
    toast.success('Security settings saved successfully!');
    console.log('Security Settings:', securitySettings);
  };

  const tabs = [
    { id: 'pricing', label: 'Pricing Rules', icon: DollarSign },
    { id: 'system', label: 'System Config', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600 mt-2">Manage system configuration and pricing rules</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors
                      ${activeTab === tab.id
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Pricing Rules Tab */}
        {activeTab === 'pricing' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Pricing Configuration</h2>

            <div className="space-y-6">
              {/* Basic Pricing */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Base Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Fare (₹)
                    </label>
                    <input
                      type="number"
                      value={pricingSettings.baseFare}
                      onChange={(e) => setPricingSettings({ ...pricingSettings, baseFare: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Per KM Rate (₹)
                    </label>
                    <input
                      type="number"
                      value={pricingSettings.perKmRate}
                      onChange={(e) => setPricingSettings({ ...pricingSettings, perKmRate: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Fare (₹)
                    </label>
                    <input
                      type="number"
                      value={pricingSettings.minimumFare}
                      onChange={(e) => setPricingSettings({ ...pricingSettings, minimumFare: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Surge Multiplier
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={pricingSettings.surgeMultiplierMax}
                      onChange={(e) => setPricingSettings({ ...pricingSettings, surgeMultiplierMax: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Cargo Size Multipliers */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Cargo Size Multipliers</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(pricingSettings.cargoSizeMultipliers).map(([size, multiplier]) => (
                    <div key={size}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {size}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={multiplier}
                        onChange={(e) => setPricingSettings({
                          ...pricingSettings,
                          cargoSizeMultipliers: {
                            ...pricingSettings.cargoSizeMultipliers,
                            [size]: Number(e.target.value)
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-on Charges */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add-on Charges (₹)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(pricingSettings.addOnCharges).map(([addon, charge]) => (
                    <div key={addon}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {addon}
                      </label>
                      <input
                        type="number"
                        value={charge}
                        onChange={(e) => setPricingSettings({
                          ...pricingSettings,
                          addOnCharges: {
                            ...pricingSettings.addOnCharges,
                            [addon]: Number(e.target.value)
                          }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handlePricingSave}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center space-x-2"
                >
                  <Save size={18} />
                  <span>Save Pricing Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* System Config Tab */}
        {activeTab === 'system' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">System Configuration</h2>

            <div className="space-y-8">
              {/* Driver Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Driver Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver Search Radius (km)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.driverSearchRadius}
                      onChange={(e) => setSystemSettings({ ...systemSettings, driverSearchRadius: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver Assignment Timeout (ms)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.driverAssignmentTimeout}
                      onChange={(e) => setSystemSettings({ ...systemSettings, driverAssignmentTimeout: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Bookings Per Driver
                    </label>
                    <input
                      type="number"
                      value={systemSettings.maxBookingsPerDriver}
                      onChange={(e) => setSystemSettings({ ...systemSettings, maxBookingsPerDriver: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Fees */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Fees</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Cancellation Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.bookingCancellationFee}
                      onChange={(e) => setSystemSettings({ ...systemSettings, bookingCancellationFee: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Driver Commission (%)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.driverCommission}
                      onChange={(e) => setSystemSettings({ ...systemSettings, driverCommission: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Fee (%)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.platformFee}
                      onChange={(e) => setSystemSettings({ ...systemSettings, platformFee: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Rate (%)
                    </label>
                    <input
                      type="number"
                      value={systemSettings.gstRate}
                      onChange={(e) => setSystemSettings({ ...systemSettings, gstRate: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* System Toggles */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">System Features</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Auto-Assign Drivers</span>
                      <p className="text-xs text-gray-500">Automatically assign nearest available driver to bookings</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemSettings.autoAssignDrivers}
                      onChange={(e) => setSystemSettings({ ...systemSettings, autoAssignDrivers: e.target.checked })}
                      className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Allow Driver Rejection</span>
                      <p className="text-xs text-gray-500">Drivers can reject assigned bookings</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemSettings.allowDriverRejection}
                      onChange={(e) => setSystemSettings({ ...systemSettings, allowDriverRejection: e.target.checked })}
                      className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Maintenance Mode</span>
                      <p className="text-xs text-gray-500">Disable new bookings for system maintenance</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                      className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSystemSave}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center space-x-2"
                >
                  <Save size={18} />
                  <span>Save System Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>

            <div className="space-y-8">
              {/* Email Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  {Object.entries(notificationSettings.emailNotifications).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: {
                            ...notificationSettings.emailNotifications,
                            [key]: e.target.checked
                          }
                        })}
                        className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* SMS Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">SMS Notifications</h3>
                <div className="space-y-3">
                  {Object.entries(notificationSettings.smsNotifications).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          smsNotifications: {
                            ...notificationSettings.smsNotifications,
                            [key]: e.target.checked
                          }
                        })}
                        className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Push Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Push Notifications</h3>
                <div className="space-y-3">
                  {Object.entries(notificationSettings.pushNotifications).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          pushNotifications: {
                            ...notificationSettings.pushNotifications,
                            [key]: e.target.checked
                          }
                        })}
                        className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Admin Alerts */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Alerts</h3>
                <div className="space-y-3">
                  {Object.entries(notificationSettings.adminAlerts).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          adminAlerts: {
                            ...notificationSettings.adminAlerts,
                            [key]: e.target.checked
                          }
                        })}
                        className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNotificationSave}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center space-x-2"
                >
                  <Save size={18} />
                  <span>Save Notification Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>

            <div className="space-y-8">
              {/* Authentication Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Authentication</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password Minimum Length
                    </label>
                    <input
                      type="number"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Rate Limit (requests/minute)
                    </label>
                    <input
                      type="number"
                      value={securitySettings.apiRateLimit}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, apiRateLimit: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Access Control */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Access Control</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IP Whitelist (comma-separated)
                    </label>
                    <textarea
                      value={securitySettings.ipWhitelist}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value })}
                      placeholder="192.168.1.1, 10.0.0.1"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to allow all IPs</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allowed Email Domains (comma-separated)
                    </label>
                    <textarea
                      value={securitySettings.allowedDomains}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, allowedDomains: e.target.value })}
                      placeholder="company.com, partner.com"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to allow all domains</p>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Features</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Require Strong Passwords</span>
                      <p className="text-xs text-gray-500">Must include uppercase, lowercase, numbers, and symbols</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.requireStrongPassword}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, requireStrongPassword: e.target.checked })}
                      className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
                      <p className="text-xs text-gray-500">Require 2FA for all admin accounts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
                      className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Enable Audit Log</span>
                      <p className="text-xs text-gray-500">Track all admin actions and changes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={securitySettings.enableAuditLog}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, enableAuditLog: e.target.checked })}
                      className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSecuritySave}
                  className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center space-x-2"
                >
                  <Save size={18} />
                  <span>Save Security Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
