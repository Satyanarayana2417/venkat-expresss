/**
 * Location Service for Venkat Express
 * Handles geo-tagging, reverse geocoding, and location management
 * Supports Google Maps API and multiple fallback services
 */

export interface LocationData {
  street?: string;        // Street name (optional)
  area: string;           // Neighborhood/Area name
  city: string;           // City name
  state: string;          // State/Province
  country: string;        // Country name
  countryCode: string;    // Country code (IN, US, etc.)
  latitude: number;       // Latitude
  longitude: number;      // Longitude
  postalCode?: string;    // Postal/ZIP code (optional)
  formattedAddress: string; // Full formatted address
}

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface LocationPermissionStatus {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
}

/**
 * Check if geolocation is supported by the browser
 */
export const isGeolocationSupported = (): boolean => {
  return 'geolocation' in navigator;
};

/**
 * Get current geolocation permission status
 */
export const getLocationPermissionStatus = async (): Promise<LocationPermissionStatus> => {
  if (!('permissions' in navigator)) {
    return { granted: false, denied: false, prompt: true };
  }

  try {
    const permission = await navigator.permissions.query({ name: 'geolocation' });
    return {
      granted: permission.state === 'granted',
      denied: permission.state === 'denied',
      prompt: permission.state === 'prompt',
    };
  } catch (error) {
    console.error('Error checking location permission:', error);
    return { granted: false, denied: false, prompt: true };
  }
};

/**
 * Request user's current geolocation
 */
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Reverse geocode using Google Maps API
 */
const reverseGeocodeWithGoogle = async (
  latitude: number,
  longitude: number
): Promise<LocationData> => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Maps API key not configured');
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error('Google Maps API request failed');
  }

  const data = await response.json();

  if (data.status !== 'OK' || !data.results || data.results.length === 0) {
    throw new Error('No results found from Google Maps');
  }

  const result = data.results[0];
  const addressComponents = result.address_components;

  // Extract location components
  const getComponent = (types: string[]) => {
    const component = addressComponents.find((c: any) =>
      types.some((type) => c.types.includes(type))
    );
    return component?.long_name || '';
  };

  const street = getComponent(['route']);
  const area = getComponent(['sublocality', 'neighborhood', 'locality']);
  const city = getComponent(['locality', 'administrative_area_level_2']);
  const state = getComponent(['administrative_area_level_1']);
  const country = getComponent(['country']);
  const countryCode = addressComponents.find((c: any) => c.types.includes('country'))?.short_name || '';
  const postalCode = getComponent(['postal_code']);

  // Debug: Log extracted components
  console.log('🗺️ Google Maps Geocoding Results:', {
    street,
    area,
    city,
    state,
    country,
    formattedAddress: result.formatted_address
  });

  return {
    street: street || undefined,
    area: area || city,
    city: city || area,
    state,
    country,
    countryCode,
    latitude,
    longitude,
    postalCode,
    formattedAddress: result.formatted_address,
  };
};

/**
 * Reverse geocode using BigDataCloud (Free alternative)
 */
const reverseGeocodeWithBigDataCloud = async (
  latitude: number,
  longitude: number
): Promise<LocationData> => {
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  );

  if (!response.ok) {
    throw new Error('BigDataCloud API request failed');
  }

  const data = await response.json();

  return {
    street: data.localityInfo?.administrative?.[6]?.name || undefined,
    area: data.locality || data.city || data.principalSubdivision || '',
    city: data.city || data.locality || '',
    state: data.principalSubdivision || '',
    country: data.countryName || '',
    countryCode: data.countryCode || '',
    latitude,
    longitude,
    postalCode: data.postcode || '',
    formattedAddress: `${data.locality || ''}, ${data.city || ''}, ${data.principalSubdivision || ''}, ${data.countryName || ''}`.replace(/^,\s*|,\s*$/g, ''),
  };
};

/**
 * Reverse geocode using OpenCage (Another free alternative)
 */
const reverseGeocodeWithOpenCage = async (
  latitude: number,
  longitude: number
): Promise<LocationData> => {
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=demo&language=en&pretty=1&no_annotations=1`
  );

  if (!response.ok) {
    throw new Error('OpenCage API request failed');
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('No results found from OpenCage');
  }

  const result = data.results[0];
  const components = result.components;

  return {
    street: components.road || components.street || undefined,
    area: components.neighbourhood || components.suburb || components.city || '',
    city: components.city || components.town || components.village || '',
    state: components.state || components.region || '',
    country: components.country || '',
    countryCode: components.country_code?.toUpperCase() || '',
    latitude,
    longitude,
    postalCode: components.postcode || '',
    formattedAddress: result.formatted || '',
  };
};

/**
 * Reverse geocode with automatic fallback
 * Tries Google Maps first, then falls back to free services
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<LocationData> => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Try Google Maps first if API key is available
  if (apiKey && apiKey !== 'your_google_maps_api_key_here' && apiKey.trim()) {
    try {
      console.log('Using Google Maps API for reverse geocoding');
      return await reverseGeocodeWithGoogle(latitude, longitude);
    } catch (error) {
      console.warn('Google Maps API failed, falling back to free services:', error);
    }
  }

  // Try BigDataCloud (most reliable free service)
  try {
    console.log('Using BigDataCloud for reverse geocoding');
    return await reverseGeocodeWithBigDataCloud(latitude, longitude);
  } catch (error) {
    console.warn('BigDataCloud failed, trying OpenCage:', error);
  }

  // Try OpenCage as last resort
  try {
    console.log('Using OpenCage for reverse geocoding');
    return await reverseGeocodeWithOpenCage(latitude, longitude);
  } catch (error) {
    console.error('All reverse geocoding services failed:', error);
    throw new Error('Unable to determine location. Please select manually.');
  }
};

/**
 * Get location from coordinates
 */
export const getLocationFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<LocationData> => {
  try {
    return await reverseGeocode(latitude, longitude);
  } catch (error) {
    console.error('Error getting location from coordinates:', error);
    throw error;
  }
};

/**
 * Get user's current location (coordinates + address)
 */
export const getCurrentLocation = async (): Promise<LocationData> => {
  try {
    // Get coordinates
    const position = await getCurrentPosition();
    
    // Reverse geocode to get address
    const location = await getLocationFromCoordinates(
      position.latitude,
      position.longitude
    );

    return location;
  } catch (error) {
    console.error('Error getting current location:', error);
    throw error;
  }
};

/**
 * Format location for display
 */
export const formatLocationDisplay = (location: LocationData): string => {
  const parts: string[] = [];

  if (location.area && location.area !== location.city) {
    parts.push(location.area);
  }
  if (location.city) {
    parts.push(location.city);
  }
  if (location.state) {
    parts.push(location.state);
  }
  if (location.country) {
    parts.push(location.country);
  }

  return parts.join(', ');
};

/**
 * Format location for header display (compact version with street-level detail)
 */
export const formatLocationForHeader = (location: LocationData): {
  line1: string;
  line2: string;
} => {
  // Debug: Log what we're receiving
  console.log('📍 Formatting location for header:', {
    street: location.street,
    area: location.area,
    city: location.city,
    state: location.state,
    country: location.country
  });

  // Line 1: Street, Area, and City (prioritize street-level detail)
  const line1Parts: string[] = [];
  
  // Add street name if available (highest priority)
  if (location.street) {
    line1Parts.push(location.street);
  }
  
  // Add area if it's different from city
  if (location.area && location.area !== location.city) {
    line1Parts.push(location.area);
  }
  
  // Add city
  if (location.city) {
    line1Parts.push(location.city);
  }
  
  // Fallback if no street or area
  const line1 = line1Parts.join(' • ') || location.city || 'Unknown Location';

  // Line 2: State and Country
  const line2Parts: string[] = [];
  if (location.state) {
    line2Parts.push(location.state);
  }
  if (location.country) {
    line2Parts.push(location.country);
  }
  const line2 = line2Parts.join(' • ') || location.country || 'Unknown';

  return { line1, line2 };
};

/**
 * Save location to localStorage
 */
export const saveLocationToStorage = (location: LocationData): void => {
  try {
    localStorage.setItem('userLocation', JSON.stringify(location));
    localStorage.setItem('locationTimestamp', Date.now().toString());
  } catch (error) {
    console.error('Error saving location to storage:', error);
  }
};

/**
 * Load location from localStorage
 */
export const loadLocationFromStorage = (): LocationData | null => {
  try {
    const locationStr = localStorage.getItem('userLocation');
    const timestamp = localStorage.getItem('locationTimestamp');

    if (!locationStr || !timestamp) {
      return null;
    }

    // Check if location is older than 7 days
    const age = Date.now() - parseInt(timestamp);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    if (age > maxAge) {
      clearLocationFromStorage();
      return null;
    }

    return JSON.parse(locationStr);
  } catch (error) {
    console.error('Error loading location from storage:', error);
    return null;
  }
};

/**
 * Clear location from localStorage
 */
export const clearLocationFromStorage = (): void => {
  try {
    localStorage.removeItem('userLocation');
    localStorage.removeItem('locationTimestamp');
    localStorage.removeItem('locationPermissionAsked');
  } catch (error) {
    console.error('Error clearing location from storage:', error);
  }
};

/**
 * Check if permission has been asked before
 */
export const hasAskedPermission = (): boolean => {
  return localStorage.getItem('locationPermissionAsked') === 'true';
};

/**
 * Mark that permission has been asked
 */
export const markPermissionAsked = (): void => {
  localStorage.setItem('locationPermissionAsked', 'true');
};

/**
 * Get default location (fallback)
 */
export const getDefaultLocation = (): LocationData => {
  return {
    street: undefined,
    area: 'Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    countryCode: 'IN',
    latitude: 17.385044,
    longitude: 78.486671,
    formattedAddress: 'Hyderabad, Telangana, India',
  };
};
