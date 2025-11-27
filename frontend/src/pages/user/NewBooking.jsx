import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Package, DollarSign, ArrowRight } from 'lucide-react';
import useBookingStore from '../../store/bookingStore';
import useAuthStore from '../../store/authStore';
import IndianAddressInput from '../../components/IndianAddressInput';
import toast from 'react-hot-toast';

export default function NewBooking() {
  const navigate = useNavigate();
  const { createBooking } = useBookingStore();
  const { user } = useAuthStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pickup: {
      address: '',
      coordinates: { coordinates: [77.5946, 12.9716] }, // Default: Bangalore
      contactName: user?.name || '',
      contactPhone: user?.phone || ''
    },
    drop: {
      address: '',
      coordinates: { coordinates: [77.6411, 12.9141] },
      contactName: '',
      contactPhone: ''
    },
    distance: 5,
    cargoDetails: {
      size: 'M',
      description: '',
      fragile: false
    },
    addOns: {
      express: false,
      insurance: false,
      fragile: false
    }
  });

  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargoSizes = [
    { value: 'XS', label: 'Extra Small', desc: 'Documents, Small items' },
    { value: 'S', label: 'Small', desc: 'Shoe box, Books' },
    { value: 'M', label: 'Medium', desc: 'Suitcase, Electronics' },
    { value: 'L', label: 'Large', desc: 'Furniture piece, Appliance' },
    { value: 'XL', label: 'Extra Large', desc: 'Multiple items, Bulk cargo' }
  ];

  const calculateEstimate = async () => {
    setLoading(true);
    try {
      const { estimatePrice } = useBookingStore.getState();
      const estimate = await estimatePrice({
        distance: formData.distance,
        cargoSize: formData.cargoDetails.size,
        addOns: formData.addOns
      });
      setPricing(estimate);
      setStep(3);
    } catch (error) {
      toast.error('Failed to calculate price');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const booking = await createBooking(formData);
      toast.success('Booking created successfully!');
      navigate(`/dashboard/tracking/${booking._id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-cr-dark mb-6">New Booking</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s ? 'bg-cr-dark text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={`w-20 h-1 ${step > s ? 'bg-cr-dark' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="card">
        {/* Step 1: Addresses */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-cr-dark flex items-center mb-4">
              <MapPin className="mr-2" /> Pickup & Drop Locations
            </h2>

            <IndianAddressInput
              label="Pickup Address"
              value={formData.pickup.address}
              onChange={(address) =>
                setFormData({
                  ...formData,
                  pickup: { ...formData.pickup, address }
                })
              }
              placeholder="Enter complete pickup address"
            />

            <div className="border-t pt-6">
              <IndianAddressInput
                label="Drop Address"
                value={formData.drop.address}
                onChange={(address) =>
                  setFormData({
                    ...formData,
                    drop: { ...formData.drop, address }
                  })
                }
                placeholder="Enter complete drop address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Estimated Distance (km)
              </label>
              <input
                type="number"
                className="input"
                min="1"
                value={formData.distance}
                onChange={(e) =>
                  setFormData({ ...formData, distance: parseFloat(e.target.value) })
                }
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!formData.pickup.address || !formData.drop.address}
              className="btn btn-primary w-full"
            >
              Next <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        )}

        {/* Step 2: Cargo Details */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-cr-dark flex items-center">
              <Package className="mr-2" /> Cargo Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-3">Cargo Size</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cargoSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        cargoDetails: { ...formData.cargoDetails, size: size.value }
                      })
                    }
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.cargoDetails.size === size.value
                        ? 'border-cr-dark bg-primary-50'
                        : 'border-primary-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="font-semibold">{size.label}</div>
                    <div className="text-sm text-gray-500">{size.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">Description</label>
              <textarea
                className="input"
                rows="3"
                placeholder="Describe your cargo"
                value={formData.cargoDetails.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cargoDetails: { ...formData.cargoDetails, description: e.target.value }
                  })
                }
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-primary-700">Add-ons</label>
              {[
                { key: 'express', label: 'Express Delivery (+₹50)' },
                { key: 'insurance', label: 'Insurance (5% of total)' },
                { key: 'fragile', label: 'Fragile Handling (+₹30)' }
              ].map((addon) => (
                <label key={addon.key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.addOns[addon.key]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        addOns: { ...formData.addOns, [addon.key]: e.target.checked }
                      })
                    }
                    className="w-5 h-5"
                  />
                  <span>{addon.label}</span>
                </label>
              ))}
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setStep(1)} className="btn btn-secondary flex-1">
                Back
              </button>
              <button onClick={calculateEstimate} disabled={loading} className="btn btn-primary flex-1">
                {loading ? 'Calculating...' : 'Get Estimate'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && pricing && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-cr-dark flex items-center">
              <DollarSign className="mr-2" /> Review & Confirm
            </h2>

            <div className="bg-primary-100 rounded-lg p-6">
              <div className="text-center">
                <p className="text-primary-700">Total Amount</p>
                <p className="text-4xl font-bold text-cr-dark">₹{pricing.total}</p>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Fare:</span>
                  <span>₹{pricing.baseFare}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance ({formData.distance} km):</span>
                  <span>₹{pricing.distanceFare}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cargo Size Multiplier ({formData.cargoDetails.size}):</span>
                  <span>{pricing.cargoSizeMultiplier}x</span>
                </div>
                <div className="flex justify-between">
                  <span>Surge Multiplier:</span>
                  <span>{pricing.surgeMultiplier}x</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-cr-dark mb-2">Route Summary</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Pickup:</span>
                  <p>{formData.pickup.address}</p>
                </div>
                <div>
                  <span className="text-gray-500">Drop:</span>
                  <p>{formData.drop.address}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button onClick={() => setStep(2)} className="btn btn-secondary flex-1">
                Back
              </button>
              <button onClick={handleSubmit} disabled={loading} className="btn btn-primary flex-1">
                {loading ? 'Creating Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
