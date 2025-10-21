import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Address } from '@/lib/addressService';

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => Promise<void>;
  addressType: 'home' | 'work';
  existingAddress?: Address | null;
  prefillData?: Partial<Address> | null; // Pre-fill data from geolocation
  inline?: boolean; // New prop for inline mode
}

// Indian states list
const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export const AddAddressModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  addressType,
  existingAddress,
  prefillData,
  inline = false 
}: AddAddressModalProps) => {
  const [formData, setFormData] = useState<Address>({
    fullName: '',
    mobileNumber: '',
    alternateMobile: '',
    flatBuilding: '',
    areaStreet: '',
    landmark: '',
    pincode: '',
    city: '',
    state: '',
    type: addressType,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingAddress) {
      setFormData(existingAddress);
    } else if (prefillData) {
      // Merge prefill data with default values
      setFormData({
        fullName: '',
        mobileNumber: '',
        alternateMobile: '',
        flatBuilding: prefillData.flatBuilding || '',
        areaStreet: prefillData.areaStreet || '',
        landmark: prefillData.landmark || '',
        pincode: prefillData.pincode || '',
        city: prefillData.city || '',
        state: prefillData.state || '',
        type: addressType,
      });
    } else {
      setFormData({
        fullName: '',
        mobileNumber: '',
        alternateMobile: '',
        flatBuilding: '',
        areaStreet: '',
        landmark: '',
        pincode: '',
        city: '',
        state: '',
        type: addressType,
      });
    }
  }, [existingAddress, prefillData, addressType]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
    }

    if (formData.alternateMobile && !/^\d{10}$/.test(formData.alternateMobile)) {
      newErrors.alternateMobile = 'Alternate mobile must be 10 digits';
    }

    if (!formData.flatBuilding.trim()) {
      newErrors.flatBuilding = 'Flat/Building is required';
    }

    if (!formData.areaStreet.trim()) {
      newErrors.areaStreet = 'Area/Street is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving address:', error);
      setErrors({ submit: 'Failed to save address. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof Address, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  // Inline mode - render form without modal wrapper
  if (inline) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Use Location Button */}
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" />
            Use my current location
          </button>

          {/* Name and Mobile - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Name*"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10-digit mobile number*"
                maxLength={10}
              />
              {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
            </div>
          </div>

          {/* Pincode and Locality - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pincode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Pincode*"
                maxLength={6}
              />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
            </div>

            <div>
              <input
                type="text"
                value={formData.flatBuilding}
                onChange={(e) => handleInputChange('flatBuilding', e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.flatBuilding ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Locality*"
              />
              {errors.flatBuilding && <p className="text-red-500 text-xs mt-1">{errors.flatBuilding}</p>}
            </div>
          </div>

          {/* Address (Area and Street) - Full Width */}
          <div>
            <textarea
              value={formData.areaStreet}
              onChange={(e) => handleInputChange('areaStreet', e.target.value)}
              className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.areaStreet ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Address (Area and Street)*"
              rows={3}
            />
            {errors.areaStreet && <p className="text-red-500 text-xs mt-1">{errors.areaStreet}</p>}
          </div>

          {/* City and State - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="City/District/Town*"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">--Select State--*</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
          </div>

          {/* Landmark (Optional) - Full Width */}
          <div>
            <input
              type="text"
              value={formData.landmark || ''}
              onChange={(e) => handleInputChange('landmark', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Landmark (Optional)"
            />
          </div>

          {/* Alternate Phone (Optional) - Full Width */}
          <div>
            <input
              type="tel"
              value={formData.alternateMobile || ''}
              onChange={(e) => handleInputChange('alternateMobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.alternateMobile ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Alternate Phone (Optional)"
              maxLength={10}
            />
            {errors.alternateMobile && <p className="text-red-500 text-xs mt-1">{errors.alternateMobile}</p>}
          </div>

          {/* Address Type - Radio Buttons */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Address Type</p>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="home"
                  checked={formData.type === 'home'}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Home</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="work"
                  checked={formData.type === 'work'}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Work</span>
              </label>
            </div>
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Footer with Save and Cancel */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isSubmitting ? 'SAVING...' : 'SAVE'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Modal mode - render with modal wrapper
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Blue Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-lg font-semibold tracking-wide">
            {existingAddress ? 'EDIT ADDRESS' : 'ADD ADDRESS'}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Use Location Button */}
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            <MapPin className="h-3.5 w-3.5" />
            Use my current location
          </button>

          {/* Name and Mobile - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Name*"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10-digit mobile number*"
                maxLength={10}
              />
              {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
            </div>
          </div>

          {/* Pincode and Locality - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pincode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Pincode*"
                maxLength={6}
              />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
            </div>

            <div>
              <input
                type="text"
                value={formData.flatBuilding}
                onChange={(e) => handleInputChange('flatBuilding', e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.flatBuilding ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Locality*"
              />
              {errors.flatBuilding && <p className="text-red-500 text-xs mt-1">{errors.flatBuilding}</p>}
            </div>
          </div>

          {/* Address (Area and Street) - Full Width */}
          <div>
            <textarea
              value={formData.areaStreet}
              onChange={(e) => handleInputChange('areaStreet', e.target.value)}
              className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.areaStreet ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Address (Area and Street)*"
              rows={3}
            />
            {errors.areaStreet && <p className="text-red-500 text-xs mt-1">{errors.areaStreet}</p>}
          </div>

          {/* City and State - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="City/District/Town*"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">--Select State--*</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
          </div>

          {/* Landmark (Optional) - Full Width */}
          <div>
            <input
              type="text"
              value={formData.landmark || ''}
              onChange={(e) => handleInputChange('landmark', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Landmark (Optional)"
            />
          </div>

          {/* Alternate Phone (Optional) - Full Width */}
          <div>
            <input
              type="tel"
              value={formData.alternateMobile || ''}
              onChange={(e) => handleInputChange('alternateMobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={`w-full px-4 py-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.alternateMobile ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Alternate Phone (Optional)"
              maxLength={10}
            />
            {errors.alternateMobile && <p className="text-red-500 text-xs mt-1">{errors.alternateMobile}</p>}
          </div>

          {/* Address Type - Radio Buttons */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Address Type</p>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="home"
                  checked={formData.type === 'home'}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Home</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="work"
                  checked={formData.type === 'work'}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Work</span>
              </label>
            </div>
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}
        </form>

        {/* Footer with Save and Cancel */}
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900 transition-colors"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isSubmitting ? 'SAVING...' : 'SAVE'}
          </button>
        </div>
      </div>
    </div>
  );
};
