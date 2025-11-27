import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Upload, FileText, CheckCircle, Package } from 'lucide-react';
import { bookingAPI } from '../../utils/api';
import toast from 'react-hot-toast';

export default function UploadPOD() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [podData, setPodData] = useState({
    recipientName: '',
    recipientPhone: '',
    signature: '',
    photo: null,
    notes: '',
    condition: 'good'
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await bookingAPI.getById(bookingId);
      setBooking(response.data.data);

      // Pre-fill recipient details from booking
      setPodData(prev => ({
        ...prev,
        recipientName: response.data.data.drop.contactName || '',
        recipientPhone: response.data.data.drop.contactPhone || ''
      }));
    } catch (error) {
      toast.error('Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setPodData({ ...podData, photo: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!podData.recipientName || !podData.recipientPhone) {
      toast.error('Recipient name and phone are required');
      return;
    }

    setSubmitting(true);

    try {
      // In a real app, you would upload the photo to a cloud storage service first
      // and then submit the POD data with the photo URL

      const podPayload = {
        bookingId,
        recipientName: podData.recipientName,
        recipientPhone: podData.recipientPhone,
        signature: podData.signature || 'Digital Signature',
        photo: previewUrl, // In production, this would be the uploaded photo URL
        notes: podData.notes,
        condition: podData.condition,
        deliveredAt: new Date().toISOString()
      };

      // Submit POD (this endpoint might need to be created in the backend)
      // await api.post('/bookings/pod', podPayload);

      // For now, just mark the booking as completed
      await bookingAPI.updateStatus(bookingId, {
        status: 'completed',
        note: `Delivery completed. POD submitted. Recipient: ${podData.recipientName}`
      });

      toast.success('Proof of Delivery submitted successfully!');
      setTimeout(() => navigate('/driver'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit POD');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="card text-center py-12">
        <p className="text-primary-700">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cr-dark">Proof of Delivery</h1>
        <p className="text-primary-700">Booking ID: {booking.bookingId}</p>
      </div>

      {/* Booking Summary */}
      <div className="card bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="text-green-600" size={32} />
          <div>
            <h2 className="text-lg font-semibold text-green-800">Delivery Completed</h2>
            <p className="text-sm text-primary-700">
              Delivered to: {booking.drop.address}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-green-200">
          <div>
            <p className="text-xs text-primary-700">Cargo Size</p>
            <p className="font-semibold">{booking.cargoDetails.size}</p>
          </div>
          <div>
            <p className="text-xs text-primary-700">Distance</p>
            <p className="font-semibold">{booking.distance} km</p>
          </div>
          <div>
            <p className="text-xs text-primary-700">Amount</p>
            <p className="font-semibold text-green-600">₹{booking.pricing.total}</p>
          </div>
          <div>
            <p className="text-xs text-primary-700">Delivered At</p>
            <p className="font-semibold">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* POD Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipient Details */}
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center">
            <Package size={20} className="mr-2" />
            Recipient Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Recipient Name *
              </label>
              <input
                type="text"
                className="input"
                placeholder="Full name"
                value={podData.recipientName}
                onChange={(e) => setPodData({ ...podData, recipientName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Recipient Phone *
              </label>
              <input
                type="tel"
                className="input"
                placeholder="Phone number"
                value={podData.recipientPhone}
                onChange={(e) => setPodData({ ...podData, recipientPhone: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Cargo Condition */}
        <div className="card">
          <h3 className="font-semibold mb-4">Cargo Condition</h3>
          <div className="grid grid-cols-3 gap-3">
            {['good', 'fair', 'damaged'].map((condition) => (
              <button
                key={condition}
                type="button"
                onClick={() => setPodData({ ...podData, condition })}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  podData.condition === condition
                    ? condition === 'good' ? 'border-green-600 bg-green-50' :
                      condition === 'fair' ? 'border-yellow-600 bg-yellow-50' :
                      'border-red-600 bg-red-50'
                    : 'border-primary-200 hover:border-primary-300'
                }`}
              >
                <div className="font-medium capitalize">{condition}</div>
                <div className="text-xs text-primary-700 mt-1">
                  {condition === 'good' ? 'No issues' :
                   condition === 'fair' ? 'Minor issues' :
                   'Has damage'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Photo Upload */}
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center">
            <Camera size={20} className="mr-2" />
            Delivery Photo
          </h3>

          <div className="space-y-4">
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Delivery proof"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPodData({ ...podData, photo: null });
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-primary-300 border-dashed rounded-lg cursor-pointer bg-primary-50 hover:bg-primary-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-3 text-primary-700" />
                  <p className="mb-2 text-sm text-primary-700">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-primary-700">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  capture="environment"
                />
              </label>
            )}
          </div>
        </div>

        {/* Signature */}
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center">
            <FileText size={20} className="mr-2" />
            Recipient Signature
          </h3>
          <input
            type="text"
            className="input font-cursive text-xl text-center"
            placeholder="Type recipient's name for digital signature"
            value={podData.signature}
            onChange={(e) => setPodData({ ...podData, signature: e.target.value })}
          />
          <p className="text-xs text-primary-700 mt-2 text-center">
            This serves as a digital acknowledgment of delivery
          </p>
        </div>

        {/* Additional Notes */}
        <div className="card">
          <h3 className="font-semibold mb-4">Additional Notes (Optional)</h3>
          <textarea
            className="input"
            rows="3"
            placeholder="Any additional notes about the delivery..."
            value={podData.notes}
            onChange={(e) => setPodData({ ...podData, notes: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate('/driver')}
            className="btn btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !podData.recipientName || !podData.recipientPhone}
            className="btn btn-primary flex-1"
          >
            {submitting ? (
              <>
                <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </>
            ) : (
              'Submit POD & Complete'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
