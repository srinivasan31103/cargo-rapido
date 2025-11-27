import { useState, useEffect } from 'react';
import { User, Camera, FileText, Upload, Check, AlertCircle, Calendar, Shield, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { driverAPI } from '../../utils/api';
import useAuthStore from '../../store/authStore';

export default function DriverProfile() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContact: '',
    emergencyName: '',
    bloodGroup: '',
    dateOfBirth: ''
  });

  // Vehicle data
  const [vehicleData, setVehicleData] = useState({
    vehicleType: 'bike',
    vehicleNumber: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    insuranceNumber: '',
    insuranceExpiry: '',
    pucNumber: '',
    pucExpiry: ''
  });

  // Documents
  const [documents, setDocuments] = useState({
    drivingLicense: {
      number: '',
      expiry: '',
      file: null,
      verified: false,
      status: 'pending'
    },
    aadharCard: {
      number: '',
      file: null,
      verified: false,
      status: 'pending'
    },
    panCard: {
      number: '',
      file: null,
      verified: false,
      status: 'pending'
    },
    vehicleRC: {
      number: '',
      file: null,
      verified: false,
      status: 'pending'
    },
    insurance: {
      number: '',
      expiry: '',
      file: null,
      verified: false,
      status: 'pending'
    },
    profilePhoto: {
      file: null,
      verified: false,
      status: 'approved'
    }
  });

  useEffect(() => {
    fetchDriverProfile();
  }, []);

  const fetchDriverProfile = async () => {
    try {
      const response = await driverAPI.getProfile(user._id);
      const data = response.data.data;

      setProfileData(data.profile || profileData);
      setVehicleData(data.vehicle || vehicleData);
      setDocuments(data.documents || documents);
    } catch (error) {
      console.error('Failed to fetch profile');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await driverAPI.updateProfile(user._id, { profile: profileData });
      updateUser({ ...user, name: profileData.name, phone: profileData.phone });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleVehicleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await driverAPI.updateProfile(user._id, { vehicle: vehicleData });
      toast.success('Vehicle details updated successfully!');
    } catch (error) {
      toast.error('Failed to update vehicle details');
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (docType, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', docType);

    try {
      await driverAPI.uploadDocument(user._id, formData);
      setDocuments({
        ...documents,
        [docType]: {
          ...documents[docType],
          file: file.name,
          status: 'pending'
        }
      });
      toast.success('Document uploaded successfully! Verification pending.');
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  const getDocumentStatusColor = (status) => {
    const colors = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[status] || colors.pending;
  };

  const getDocumentStatusIcon = (status) => {
    if (status === 'approved') return <Check size={16} />;
    if (status === 'rejected') return <AlertCircle size={16} />;
    return <Upload size={16} />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cr-dark">Profile & Documents</h1>
        <p className="text-primary-700 mt-2">Manage your profile and upload verification documents</p>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'profile'
                ? 'text-cr-dark border-b-2 border-cr-dark'
                : 'text-primary-700 hover:text-cr-dark'
            }`}
          >
            <User size={18} className="inline mr-2" />
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('vehicle')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'vehicle'
                ? 'text-cr-dark border-b-2 border-cr-dark'
                : 'text-primary-700 hover:text-cr-dark'
            }`}
          >
            <Truck size={18} className="inline mr-2" />
            Vehicle Details
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'documents'
                ? 'text-cr-dark border-b-2 border-cr-dark'
                : 'text-primary-700 hover:text-cr-dark'
            }`}
          >
            <FileText size={18} className="inline mr-2" />
            Documents
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
            {/* Profile Photo */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                  {documents.profilePhoto.file ? (
                    <img src={URL.createObjectURL(documents.profilePhoto.file)} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                  ) : (
                    <User size={40} className="text-primary-700" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-cr-dark text-white p-2 rounded-full cursor-pointer hover:bg-primary-800">
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleDocumentUpload('profilePhoto', e.target.files[0])}
                  />
                </label>
              </div>
              <div>
                <h3 className="font-semibold text-cr-dark">{user?.name}</h3>
                <p className="text-sm text-primary-700">{user?.role}</p>
                <p className="text-xs text-primary-700 mt-1">Upload a professional photo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Blood Group</label>
                <select
                  value={profileData.bloodGroup}
                  onChange={(e) => setProfileData({ ...profileData, bloodGroup: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Address</label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">City</label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">State</label>
                <input
                  type="text"
                  value={profileData.state}
                  onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Pincode</label>
                <input
                  type="text"
                  pattern="[0-9]{6}"
                  value={profileData.pincode}
                  onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                  className="input-field"
                  placeholder="110001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Emergency Contact Name</label>
                <input
                  type="text"
                  value={profileData.emergencyName}
                  onChange={(e) => setProfileData({ ...profileData, emergencyName: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Emergency Contact Number</label>
                <input
                  type="tel"
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                  className="input-field"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {/* Vehicle Tab */}
        {activeTab === 'vehicle' && (
          <form onSubmit={handleVehicleUpdate} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Vehicle Type *</label>
                <select
                  required
                  value={vehicleData.vehicleType}
                  onChange={(e) => setVehicleData({ ...vehicleData, vehicleType: e.target.value })}
                  className="input-field"
                >
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="auto">Auto Rickshaw</option>
                  <option value="van">Van</option>
                  <option value="pickup">Pickup Truck</option>
                  <option value="truck">Truck</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Vehicle Number *</label>
                <input
                  type="text"
                  required
                  value={vehicleData.vehicleNumber}
                  onChange={(e) => setVehicleData({ ...vehicleData, vehicleNumber: e.target.value.toUpperCase() })}
                  className="input-field"
                  placeholder="DL01AB1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Vehicle Brand *</label>
                <input
                  type="text"
                  required
                  value={vehicleData.vehicleBrand}
                  onChange={(e) => setVehicleData({ ...vehicleData, vehicleBrand: e.target.value })}
                  className="input-field"
                  placeholder="Honda"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Vehicle Model *</label>
                <input
                  type="text"
                  required
                  value={vehicleData.vehicleModel}
                  onChange={(e) => setVehicleData({ ...vehicleData, vehicleModel: e.target.value })}
                  className="input-field"
                  placeholder="Activa 6G"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Year of Manufacture</label>
                <input
                  type="number"
                  min="2000"
                  max={new Date().getFullYear()}
                  value={vehicleData.vehicleYear}
                  onChange={(e) => setVehicleData({ ...vehicleData, vehicleYear: e.target.value })}
                  className="input-field"
                  placeholder="2023"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Vehicle Color</label>
                <input
                  type="text"
                  value={vehicleData.vehicleColor}
                  onChange={(e) => setVehicleData({ ...vehicleData, vehicleColor: e.target.value })}
                  className="input-field"
                  placeholder="Black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Insurance Number</label>
                <input
                  type="text"
                  value={vehicleData.insuranceNumber}
                  onChange={(e) => setVehicleData({ ...vehicleData, insuranceNumber: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">Insurance Expiry</label>
                <input
                  type="date"
                  value={vehicleData.insuranceExpiry}
                  onChange={(e) => setVehicleData({ ...vehicleData, insuranceExpiry: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">PUC Number</label>
                <input
                  type="text"
                  value={vehicleData.pucNumber}
                  onChange={(e) => setVehicleData({ ...vehicleData, pucNumber: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-2">PUC Expiry</label>
                <input
                  type="date"
                  value={vehicleData.pucExpiry}
                  onChange={(e) => setVehicleData({ ...vehicleData, pucExpiry: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : 'Save Vehicle Details'}
            </button>
          </form>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="p-6 space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900">Document Verification</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Upload clear, valid documents for verification. All documents are securely stored and verified within 24-48 hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Driving License */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-cr-dark flex items-center gap-2">
                    <FileText size={18} />
                    Driving License
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getDocumentStatusColor(documents.drivingLicense.status)}`}>
                    {getDocumentStatusIcon(documents.drivingLicense.status)}
                    {documents.drivingLicense.status}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="License Number"
                  value={documents.drivingLicense.number}
                  onChange={(e) => setDocuments({
                    ...documents,
                    drivingLicense: { ...documents.drivingLicense, number: e.target.value }
                  })}
                  className="input-field mb-2"
                />
                <input
                  type="date"
                  placeholder="Expiry Date"
                  value={documents.drivingLicense.expiry}
                  onChange={(e) => setDocuments({
                    ...documents,
                    drivingLicense: { ...documents.drivingLicense, expiry: e.target.value }
                  })}
                  className="input-field mb-2"
                />
                <label className="btn btn-outline w-full cursor-pointer">
                  <Upload size={18} className="mr-2" />
                  Upload Document
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleDocumentUpload('drivingLicense', e.target.files[0])}
                  />
                </label>
                {documents.drivingLicense.file && (
                  <p className="text-xs text-green-600 mt-2">✓ {documents.drivingLicense.file}</p>
                )}
              </div>

              {/* Aadhar Card */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-cr-dark flex items-center gap-2">
                    <FileText size={18} />
                    Aadhar Card
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getDocumentStatusColor(documents.aadharCard.status)}`}>
                    {getDocumentStatusIcon(documents.aadharCard.status)}
                    {documents.aadharCard.status}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Aadhar Number"
                  value={documents.aadharCard.number}
                  onChange={(e) => setDocuments({
                    ...documents,
                    aadharCard: { ...documents.aadharCard, number: e.target.value }
                  })}
                  className="input-field mb-2"
                  maxLength="12"
                />
                <label className="btn btn-outline w-full cursor-pointer">
                  <Upload size={18} className="mr-2" />
                  Upload Document
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleDocumentUpload('aadharCard', e.target.files[0])}
                  />
                </label>
                {documents.aadharCard.file && (
                  <p className="text-xs text-green-600 mt-2">✓ {documents.aadharCard.file}</p>
                )}
              </div>

              {/* PAN Card */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-cr-dark flex items-center gap-2">
                    <FileText size={18} />
                    PAN Card
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getDocumentStatusColor(documents.panCard.status)}`}>
                    {getDocumentStatusIcon(documents.panCard.status)}
                    {documents.panCard.status}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="PAN Number"
                  value={documents.panCard.number}
                  onChange={(e) => setDocuments({
                    ...documents,
                    panCard: { ...documents.panCard, number: e.target.value.toUpperCase() }
                  })}
                  className="input-field mb-2"
                  maxLength="10"
                />
                <label className="btn btn-outline w-full cursor-pointer">
                  <Upload size={18} className="mr-2" />
                  Upload Document
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleDocumentUpload('panCard', e.target.files[0])}
                  />
                </label>
                {documents.panCard.file && (
                  <p className="text-xs text-green-600 mt-2">✓ {documents.panCard.file}</p>
                )}
              </div>

              {/* Vehicle RC */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-cr-dark flex items-center gap-2">
                    <FileText size={18} />
                    Vehicle RC
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getDocumentStatusColor(documents.vehicleRC.status)}`}>
                    {getDocumentStatusIcon(documents.vehicleRC.status)}
                    {documents.vehicleRC.status}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="RC Number"
                  value={documents.vehicleRC.number}
                  onChange={(e) => setDocuments({
                    ...documents,
                    vehicleRC: { ...documents.vehicleRC, number: e.target.value }
                  })}
                  className="input-field mb-2"
                />
                <label className="btn btn-outline w-full cursor-pointer">
                  <Upload size={18} className="mr-2" />
                  Upload Document
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleDocumentUpload('vehicleRC', e.target.files[0])}
                  />
                </label>
                {documents.vehicleRC.file && (
                  <p className="text-xs text-green-600 mt-2">✓ {documents.vehicleRC.file}</p>
                )}
              </div>

              {/* Insurance */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-cr-dark flex items-center gap-2">
                    <FileText size={18} />
                    Vehicle Insurance
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getDocumentStatusColor(documents.insurance.status)}`}>
                    {getDocumentStatusIcon(documents.insurance.status)}
                    {documents.insurance.status}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Policy Number"
                  value={documents.insurance.number}
                  onChange={(e) => setDocuments({
                    ...documents,
                    insurance: { ...documents.insurance, number: e.target.value }
                  })}
                  className="input-field mb-2"
                />
                <input
                  type="date"
                  placeholder="Expiry Date"
                  value={documents.insurance.expiry}
                  onChange={(e) => setDocuments({
                    ...documents,
                    insurance: { ...documents.insurance, expiry: e.target.value }
                  })}
                  className="input-field mb-2"
                />
                <label className="btn btn-outline w-full cursor-pointer">
                  <Upload size={18} className="mr-2" />
                  Upload Document
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleDocumentUpload('insurance', e.target.files[0])}
                  />
                </label>
                {documents.insurance.file && (
                  <p className="text-xs text-green-600 mt-2">✓ {documents.insurance.file}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
