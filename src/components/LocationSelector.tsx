import { useState, useEffect } from 'react';
import { MapPin, Loader2, AlertCircle, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';
import {
  LocationData,
  getCurrentLocation,
  formatLocationForHeader,
  saveLocationToStorage,
  loadLocationFromStorage,
  hasAskedPermission,
  markPermissionAsked,
  getDefaultLocation,
  isGeolocationSupported,
  getLocationPermissionStatus,
} from '@/lib/locationService';

const countries = [
  { value: 'india', label: 'India', states: ['Telangana', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi'], cities: ['Hyderabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai'] },
  { value: 'usa', label: 'USA', states: ['New York', 'California', 'Illinois', 'Texas', 'Arizona'], cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] },
  { value: 'uk', label: 'UK', states: ['England', 'Scotland', 'Wales'], cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow'] },
  { value: 'uae', label: 'UAE', states: ['Dubai', 'Abu Dhabi', 'Sharjah'], cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'] },
];

interface LocationSelectorProps {
  isMobileOnly?: boolean;
}

export const LocationSelector = ({ isMobileOnly = false }: LocationSelectorProps = {}) => {
  const [location, setLocation] = useState<LocationData>(getDefaultLocation());
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('india');
  const [selectedState, setSelectedState] = useState('Telangana');
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = loadLocationFromStorage();
    if (savedLocation) {
      setLocation(savedLocation);
      console.log('Loaded saved location:', savedLocation);
    }
  }, []);

  // Listen for open dialog event from mobile header (only for mobile instance)
  useEffect(() => {
    if (!isMobileOnly) return; // Only mobile instance should listen to this event

    const handleOpenDialog = () => {
      setShowDialog(true);
    };

    window.addEventListener('openLocationDialog', handleOpenDialog);

    return () => {
      window.removeEventListener('openLocationDialog', handleOpenDialog);
    };
  }, [isMobileOnly]);

  // Show permission dialog if not asked before (only for desktop instance)
  useEffect(() => {
    if (isMobileOnly) return; // Only desktop instance should auto-show on first visit

    const checkPermission = async () => {
      if (hasAskedPermission()) {
        return;
      }

      // Check if geolocation is supported
      if (!isGeolocationSupported()) {
        console.log('Geolocation not supported');
        return;
      }

      // Check current permission status
      const permissionStatus = await getLocationPermissionStatus();
      
      if (permissionStatus.denied) {
        setPermissionDenied(true);
        return;
      }

      // Show dialog after a short delay
      const timer = setTimeout(() => {
        setShowDialog(true);
      }, 2000);

      return () => clearTimeout(timer);
    };

    checkPermission();
  }, [isMobileOnly]);

  /**
   * Request and fetch user's current location using geolocation
   */
  const requestLocation = async () => {
    setIsLoading(true);
    setError(null);
    setPermissionDenied(false);

    try {
      // Check if geolocation is supported
      if (!isGeolocationSupported()) {
        throw new Error('Geolocation is not supported by your browser. Please select location manually.');
      }

      // Request location
      toast.info('Requesting location access...');
      const locationData = await getCurrentLocation();

      // Update state
      setLocation(locationData);
      saveLocationToStorage(locationData);
      markPermissionAsked();

      // Notify other components about location update
      window.dispatchEvent(new Event('locationUpdated'));

      // Show success message
      const formatted = formatLocationForHeader(locationData);
      toast.success(`Location set to: ${formatted.line1}`);
      
      console.log('Location detected:', locationData);

      // Close dialog
      setShowDialog(false);
    } catch (err: any) {
      console.error('Error getting location:', err);
      
      // Handle specific errors
      if (err.code === 1) {
        // Permission denied
        setPermissionDenied(true);
        setError('Location access denied. Please select your location manually below.');
        markPermissionAsked();
        toast.error('Location access denied');
      } else if (err.code === 2) {
        // Position unavailable
        setError('Unable to determine your location. Please select manually.');
        toast.error('Location unavailable');
      } else if (err.code === 3) {
        // Timeout
        setError('Location request timed out. Please try again or select manually.');
        toast.error('Location request timed out');
      } else {
        setError(err.message || 'Unable to get location. Please select manually.');
        toast.error('Unable to get location');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle manual location selection
   */
  const handleManualSelection = () => {
    if (!selectedCity || !selectedState || !selectedCountry) {
      toast.error('Please select all location fields');
      return;
    }

    const country = countries.find(c => c.value === selectedCountry);
    
    const manualLocation: LocationData = {
      area: selectedCity,
      city: selectedCity,
      state: selectedState,
      country: country?.label || 'India',
      countryCode: selectedCountry.toUpperCase().substring(0, 2),
      latitude: 0,
      longitude: 0,
      formattedAddress: `${selectedCity}, ${selectedState}, ${country?.label || 'India'}`,
    };

    setLocation(manualLocation);
    saveLocationToStorage(manualLocation);
    markPermissionAsked();
    
    // Notify other components about location update
    window.dispatchEvent(new Event('locationUpdated'));
    
    toast.success(`Location set to: ${selectedCity}, ${selectedState}`);
    setShowDialog(false);
  };

  /**
   * Handle country change
   */
  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    const country = countries.find(c => c.value === value);
    if (country && country.states.length > 0) {
      setSelectedState(country.states[0]);
    }
    if (country && country.cities.length > 0) {
      setSelectedCity(country.cities[0]);
    }
  };

  /**
   * Handle state change
   */
  const handleStateChange = (value: string) => {
    setSelectedState(value);
  };

  /**
   * Format location for display in button
   */
  const getDisplayLocation = () => {
    return formatLocationForHeader(location);
  };

  const displayLoc = getDisplayLocation();

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200"
        aria-label="Change shipping location"
      >
        <div className="flex flex-col items-start">
          <span className="text-[10px] text-gray-700 font-semibold">Shipping From:</span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            {displayLoc.line1}
            {displayLoc.line2 && (
              <>
                <span className="text-gray-400">•</span>
                {displayLoc.line2}
              </>
            )}
          </span>
        </div>
        <svg 
          className="h-3.5 w-3.5 text-gray-600" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <Dialog open={showDialog} onOpenChange={(open) => setShowDialog(open)}>
        <DialogContent className="sm:max-w-md max-w-[90vw]" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2 text-base md:text-lg">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Select Your Location
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Help us show you accurate shipping information and delivery estimates by sharing your location.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Permission Denied Info */}
            {permissionDenied && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Location access was denied. You can enable it in your browser settings or select your location manually below.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-3">
              {/* Auto-detect Location Button */}
              {!permissionDenied && (
                <Button
                  onClick={requestLocation}
                  disabled={isLoading}
                  className="gradient-gold hover:shadow-gold w-full text-sm md:text-base"
                  size="default"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                      Detecting Location...
                    </>
                  ) : (
                    <>
                      <Navigation className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                      Use My Current Location
                    </>
                  )}
                </Button>
              )}
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {permissionDenied ? 'Select Manually' : 'Or select manually'}
                  </span>
                </div>
              </div>

              {/* Manual Selection Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs md:text-sm font-medium mb-1.5 block">Country</label>
                  <Select value={selectedCountry} onValueChange={handleCountryChange}>
                    <SelectTrigger className="h-9 md:h-10 text-sm">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value} className="text-sm">
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs md:text-sm font-medium mb-1.5 block">State / Province</label>
                  <Select value={selectedState} onValueChange={handleStateChange}>
                    <SelectTrigger className="h-9 md:h-10 text-sm">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries
                        .find(c => c.value === selectedCountry)
                        ?.states.map((state) => (
                          <SelectItem key={state} value={state} className="text-sm">
                            {state}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs md:text-sm font-medium mb-1.5 block">City</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="h-9 md:h-10 text-sm">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries
                        .find(c => c.value === selectedCountry)
                        ?.cities.map((city) => (
                          <SelectItem key={city} value={city} className="text-sm">
                            {city}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleManualSelection}
                  variant="outline"
                  className="w-full text-sm md:text-base"
                  size="default"
                  disabled={isLoading}
                >
                  <MapPin className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Confirm Location
                </Button>
              </div>

              {/* Info Text */}
              <p className="text-xs text-center text-muted-foreground">
                We only store approximate location (area, city, country) for shipping estimates.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
