import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

// Major Indian states and their districts
const INDIAN_LOCATIONS = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Dharwad'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode'],
  'Delhi': ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Mahbubnagar'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Alwar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Ratlam'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Rohtak', 'Hisar'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Puri', 'Sambalpur'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Bihar Sharif'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh'],
  'Assam': ['Guwahati', 'Dibrugarh', 'Jorhat', 'Silchar', 'Nagaon', 'Tezpur'],
  'Chhattisgarh': ['Raipur', 'Bilaspur', 'Durg', 'Bhilai', 'Korba', 'Rajnandgaon'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
};

export default function IndianAddressInput({ label, value, onChange, placeholder }) {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [showDistrictSuggestions, setShowDistrictSuggestions] = useState(false);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);

  // Parse existing address if provided
  useEffect(() => {
    if (value) {
      const parts = value.split(', ');
      if (parts.length >= 2) {
        const stateMatch = Object.keys(INDIAN_LOCATIONS).find(s => value.includes(s));
        if (stateMatch) {
          setState(stateMatch);
          const districtMatch = INDIAN_LOCATIONS[stateMatch].find(d => value.includes(d));
          if (districtMatch) {
            setDistrict(districtMatch);
          }
        }
      }
    }
  }, []);

  // Build full address when any field changes
  useEffect(() => {
    const addressParts = [
      streetAddress,
      area,
      district,
      state,
      pincode
    ].filter(Boolean);

    const fullAddress = addressParts.join(', ');
    if (fullAddress !== value) {
      onChange(fullAddress);
    }
  }, [state, district, area, pincode, streetAddress]);

  const handleStateInput = (e) => {
    const input = e.target.value;
    setState(input);

    if (input.length >= 0) {
      const filtered = Object.keys(INDIAN_LOCATIONS).filter(s =>
        s.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredStates(filtered);
      setShowStateSuggestions(true);
    } else {
      setShowStateSuggestions(false);
    }
  };

  const handleDistrictInput = (e) => {
    const input = e.target.value;
    setDistrict(input);

    if (state && INDIAN_LOCATIONS[state]) {
      const filtered = INDIAN_LOCATIONS[state].filter(d =>
        d.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredDistricts(filtered);
      setShowDistrictSuggestions(true);
    } else {
      setShowDistrictSuggestions(false);
    }
  };

  const selectState = (selectedState) => {
    setState(selectedState);
    setDistrict('');
    setShowStateSuggestions(false);
  };

  const selectDistrict = (selectedDistrict) => {
    setDistrict(selectedDistrict);
    setShowDistrictSuggestions(false);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <MapPin size={16} className="inline mr-1" />
        {label}
      </label>

      {/* Street Address */}
      <div>
        <input
          type="text"
          className="input"
          placeholder="Building/House number, Street name"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
        />
      </div>

      {/* Area/Locality */}
      <div>
        <input
          type="text"
          className="input"
          placeholder="Area, Locality, Landmark"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* State */}
        <div className="relative">
          <input
            type="text"
            className="input"
            placeholder="State *"
            value={state}
            onChange={handleStateInput}
            onFocus={() => {
              const filtered = Object.keys(INDIAN_LOCATIONS).filter(s =>
                s.toLowerCase().includes(state.toLowerCase())
              );
              setFilteredStates(filtered.length > 0 ? filtered : Object.keys(INDIAN_LOCATIONS));
              setShowStateSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowStateSuggestions(false), 200);
            }}
            required
          />
          {showStateSuggestions && filteredStates.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredStates.map((s) => (
                <div
                  key={s}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  onClick={() => selectState(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* District/City */}
        <div className="relative">
          <input
            type="text"
            className="input"
            placeholder="City/District *"
            value={district}
            onChange={handleDistrictInput}
            onFocus={() => {
              if (state && INDIAN_LOCATIONS[state]) {
                const filtered = INDIAN_LOCATIONS[state].filter(d =>
                  d.toLowerCase().includes(district.toLowerCase())
                );
                setFilteredDistricts(filtered.length > 0 ? filtered : INDIAN_LOCATIONS[state]);
                setShowDistrictSuggestions(true);
              }
            }}
            onBlur={() => {
              setTimeout(() => setShowDistrictSuggestions(false), 200);
            }}
            disabled={!state}
            required
          />
          {showDistrictSuggestions && filteredDistricts.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredDistricts.map((d) => (
                <div
                  key={d}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  onClick={() => selectDistrict(d)}
                >
                  {d}
                </div>
              ))}
            </div>
          )}
          {!state && (
            <p className="text-xs text-gray-500 mt-1">Select state first</p>
          )}
        </div>
      </div>

      {/* Pincode */}
      <div>
        <input
          type="text"
          className="input"
          placeholder="Pincode (6 digits)"
          value={pincode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
            setPincode(value);
          }}
          maxLength={6}
          pattern="[0-9]{6}"
        />
      </div>

      {/* Preview */}
      {(state || district || area || streetAddress) && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-gray-600 mb-1">Address Preview:</p>
          <p className="text-sm font-medium text-gray-800">
            {[streetAddress, area, district, state, pincode].filter(Boolean).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
