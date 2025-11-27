import { useState } from 'react';
import { Select, NativeSelect, GroupedSelect } from './Select';

/**
 * Select Component Examples
 * This file demonstrates various use cases of the custom Select components
 */

const SelectExamples = () => {
  const [basicValue, setBasicValue] = useState('');
  const [cargoType, setCargoType] = useState('');
  const [deliveryType, setDeliveryType] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [city, setCity] = useState('');

  // Example 1: Basic options
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Example 2: Options with icons and descriptions
  const cargoOptions = [
    {
      value: 'electronics',
      label: 'Electronics',
      icon: '📱',
      description: 'Phones, laptops, gadgets'
    },
    {
      value: 'furniture',
      label: 'Furniture',
      icon: '🪑',
      description: 'Tables, chairs, beds'
    },
    {
      value: 'documents',
      label: 'Documents',
      icon: '📄',
      description: 'Papers, files, contracts'
    },
    {
      value: 'food',
      label: 'Food Items',
      icon: '🍕',
      description: 'Perishable goods'
    },
    {
      value: 'clothing',
      label: 'Clothing',
      icon: '👕',
      description: 'Apparel, textiles'
    },
    {
      value: 'books',
      label: 'Books',
      icon: '📚',
      description: 'Educational materials'
    },
    {
      value: 'general',
      label: 'General Cargo',
      icon: '📦',
      description: 'Miscellaneous items'
    }
  ];

  // Example 3: Delivery type options
  const deliveryOptions = [
    {
      value: 'express',
      label: 'Express Delivery',
      icon: '⚡',
      description: 'Within 2 hours - Premium'
    },
    {
      value: 'standard',
      label: 'Standard Delivery',
      icon: '🚚',
      description: 'Same day delivery'
    },
    {
      value: 'scheduled',
      label: 'Scheduled',
      icon: '📅',
      description: 'Pick a date and time'
    }
  ];

  // Example 4: Vehicle type options
  const vehicleOptions = [
    {
      value: 'bike',
      label: 'Bike',
      icon: '🏍️',
      description: 'Up to 20kg - Fast & economical'
    },
    {
      value: 'auto',
      label: 'Auto Rickshaw',
      icon: '🛺',
      description: 'Up to 50kg - Compact cargo'
    },
    {
      value: 'mini-truck',
      label: 'Mini Truck',
      icon: '🚐',
      description: 'Up to 500kg - Small furniture'
    },
    {
      value: 'truck',
      label: 'Truck',
      icon: '🚛',
      description: 'Up to 2000kg - Large items'
    }
  ];

  // Example 5: Grouped options
  const cityGroups = [
    {
      label: 'Popular Cities',
      options: [
        { value: 'mumbai', label: 'Mumbai' },
        { value: 'delhi', label: 'Delhi' },
        { value: 'bangalore', label: 'Bangalore' }
      ]
    },
    {
      label: 'Other Cities',
      options: [
        { value: 'pune', label: 'Pune' },
        { value: 'chennai', label: 'Chennai' },
        { value: 'hyderabad', label: 'Hyderabad' },
        { value: 'kolkata', label: 'Kolkata' },
        { value: 'ahmedabad', label: 'Ahmedabad' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Select Component Examples
          </h1>
          <p className="text-gray-600">
            Modern, accessible, and beautifully animated select components
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Example 1: Basic Select */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              1. Basic Select
            </h2>
            <Select
              name="status"
              label="Booking Status"
              value={basicValue}
              onChange={(e) => setBasicValue(e.target.value)}
              options={statusOptions}
              placeholder="Choose status"
              required
            />
            {basicValue && (
              <p className="mt-2 text-sm text-gray-500">
                Selected: <span className="font-medium text-blue-600">{basicValue}</span>
              </p>
            )}
          </div>

          {/* Example 2: Select with Icons */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              2. Select with Icons & Descriptions
            </h2>
            <Select
              name="cargoType"
              label="Cargo Type"
              value={cargoType}
              onChange={(e) => setCargoType(e.target.value)}
              options={cargoOptions}
              placeholder="Select cargo type"
              required
            />
            {cargoType && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  Selected cargo: <span className="font-semibold">{cargoType}</span>
                </p>
              </div>
            )}
          </div>

          {/* Example 3: Delivery Type */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              3. Delivery Type Selection
            </h2>
            <Select
              name="deliveryType"
              label="Delivery Speed"
              value={deliveryType}
              onChange={(e) => setDeliveryType(e.target.value)}
              options={deliveryOptions}
              placeholder="Choose delivery speed"
            />
            {deliveryType === 'express' && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚡ <strong>Express delivery selected</strong> - Additional charges apply
                </p>
              </div>
            )}
          </div>

          {/* Example 4: Vehicle Selection */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              4. Vehicle Type Selection
            </h2>
            <Select
              name="vehicleType"
              label="Choose Vehicle"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              options={vehicleOptions}
              placeholder="Select vehicle type"
            />
            {vehicleType && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ Vehicle selected: <strong>{vehicleType}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Example 5: Grouped Select */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              5. Grouped Select
            </h2>
            <GroupedSelect
              name="city"
              label="Select City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              groups={cityGroups}
              placeholder="Choose your city"
            />
          </div>

          {/* Example 6: Native Select (Fallback) */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              6. Native Select (Styled)
            </h2>
            <NativeSelect
              name="nativeStatus"
              label="Status (Native)"
              value={basicValue}
              onChange={(e) => setBasicValue(e.target.value)}
              options={statusOptions}
              placeholder="Select status"
            />
            <p className="mt-2 text-xs text-gray-500">
              Uses native HTML select with custom styling
            </p>
          </div>

          {/* Example 7: Disabled State */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              7. Disabled State
            </h2>
            <Select
              name="disabled"
              label="Disabled Select"
              value="locked"
              onChange={() => {}}
              options={[
                { value: 'locked', label: 'This is locked' },
                { value: 'cant-select', label: 'Cannot select this' }
              ]}
              disabled
            />
          </div>

          {/* Example 8: Error State */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              8. Error State
            </h2>
            <Select
              name="error"
              label="Select with Error"
              value=""
              onChange={() => {}}
              options={statusOptions}
              placeholder="Required field"
              error="This field is required"
              required
            />
          </div>
        </div>

        {/* Usage Code Examples */}
        <div className="mt-12 card">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Usage Examples</h2>

          <div className="space-y-6">
            {/* Example 1 Code */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Basic Usage:</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { Select } from './components/Select';

const [value, setValue] = useState('');

<Select
  name="status"
  label="Status"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  options={[
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ]}
  placeholder="Select status"
  required
/>`}
              </pre>
            </div>

            {/* Example 2 Code */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">With Icons & Descriptions:</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<Select
  name="cargo"
  label="Cargo Type"
  value={cargoType}
  onChange={(e) => setCargoType(e.target.value)}
  options={[
    {
      value: 'electronics',
      label: 'Electronics',
      icon: '📱',
      description: 'Phones, laptops, gadgets'
    },
    {
      value: 'furniture',
      label: 'Furniture',
      icon: '🪑',
      description: 'Tables, chairs, beds'
    }
  ]}
  placeholder="Select cargo type"
/>`}
              </pre>
            </div>

            {/* Example 3 Code */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Grouped Select:</h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { GroupedSelect } from './components/Select';

<GroupedSelect
  name="city"
  label="Select City"
  value={city}
  onChange={(e) => setCity(e.target.value)}
  groups={[
    {
      label: 'Popular Cities',
      options: [
        { value: 'mumbai', label: 'Mumbai' },
        { value: 'delhi', label: 'Delhi' }
      ]
    },
    {
      label: 'Other Cities',
      options: [
        { value: 'pune', label: 'Pune' },
        { value: 'chennai', label: 'Chennai' }
      ]
    }
  ]}
/>`}
              </pre>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-8 card bg-gradient-to-br from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">✨ Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-700">Smooth animations with Framer Motion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-700">Icons and descriptions support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-700">Searchable dropdown (5+ options)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-700">Grouped options support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-700">Error and validation states</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-700">Keyboard navigation (Escape, Enter)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-700">Accessible (ARIA labels)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-700">Disabled state support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-700">Click outside to close</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-700">Native select fallback option</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-700">Custom scrollbar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span className="text-gray-700">Fully responsive</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SelectExamples;
