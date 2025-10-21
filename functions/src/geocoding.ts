import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Cloud Function: Reverse Geocoding with Google Maps API
 * 
 * Purpose: Securely convert latitude/longitude to detailed address
 * Security: API key stored in Firebase Functions config (not exposed to frontend)
 * Method: HTTPS callable function (requires authentication)
 */

interface GeocodeRequest {
  latitude: number;
  longitude: number;
}

interface AddressComponents {
  streetNumber: string;
  route: string;
  sublocality: string;
  locality: string;
  administrativeAreaLevel1: string;
  administrativeAreaLevel2: string;
  country: string;
  postalCode: string;
  formattedAddress: string;
}

export const reverseGeocode = functions.https.onCall(async (data: GeocodeRequest, context: functions.https.CallableContext) => {
  // 🔐 Security: Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to use this service.'
    );
  }

  const { latitude, longitude } = data;

  // Validate input
  if (!latitude || !longitude) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Latitude and longitude are required.'
    );
  }

  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Latitude and longitude must be numbers.'
    );
  }

  // Validate coordinate ranges
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid coordinate values.'
    );
  }

  try {
    // 🔐 Get API key from Firebase Functions config
    // Set this with: firebase functions:config:set google.maps_api_key="YOUR_API_KEY"
    const apiKey = functions.config().google?.maps_api_key;

    if (!apiKey) {
      console.error('Google Maps API key not configured');
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Service configuration error. Please contact support.'
      );
    }

    // Call Google Maps Geocoding API
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    
    console.log(`Geocoding request for: ${latitude}, ${longitude}`);
    
    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
    });

    if (response.data.status !== 'OK') {
      console.error('Geocoding API error:', response.data.status, response.data.error_message);
      
      if (response.data.status === 'ZERO_RESULTS') {
        throw new functions.https.HttpsError(
          'not-found',
          'No address found for these coordinates.'
        );
      }
      
      throw new functions.https.HttpsError(
        'internal',
        `Geocoding service error: ${response.data.status}`
      );
    }

    // Parse the first (most accurate) result
    const result = response.data.results[0];
    
    if (!result) {
      throw new functions.https.HttpsError(
        'not-found',
        'No address found for these coordinates.'
      );
    }

    // Extract address components
    const addressComponents: AddressComponents = {
      streetNumber: '',
      route: '',
      sublocality: '',
      locality: '',
      administrativeAreaLevel1: '',
      administrativeAreaLevel2: '',
      country: '',
      postalCode: '',
      formattedAddress: result.formatted_address || '',
    };

    // Parse address components from Google response
    result.address_components?.forEach((component: any) => {
      const types = component.types;

      if (types.includes('street_number')) {
        addressComponents.streetNumber = component.long_name;
      }
      if (types.includes('route')) {
        addressComponents.route = component.long_name;
      }
      if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
        addressComponents.sublocality = component.long_name;
      }
      if (types.includes('locality')) {
        addressComponents.locality = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        addressComponents.administrativeAreaLevel1 = component.long_name;
      }
      if (types.includes('administrative_area_level_2')) {
        addressComponents.administrativeAreaLevel2 = component.long_name;
      }
      if (types.includes('country')) {
        addressComponents.country = component.long_name;
      }
      if (types.includes('postal_code')) {
        addressComponents.postalCode = component.long_name;
      }
    });

    // Build structured address for frontend
    const structuredAddress = {
      // For form fields
      flatBuilding: addressComponents.streetNumber,
      areaStreet: addressComponents.route || addressComponents.sublocality,
      landmark: addressComponents.sublocality || addressComponents.administrativeAreaLevel2,
      city: addressComponents.locality || addressComponents.administrativeAreaLevel2,
      state: addressComponents.administrativeAreaLevel1,
      pincode: addressComponents.postalCode,
      country: addressComponents.country,
      
      // Full formatted address
      formattedAddress: addressComponents.formattedAddress,
      
      // Raw components for advanced usage
      components: addressComponents,
      
      // Original coordinates
      coordinates: {
        latitude,
        longitude,
      },
    };

    console.log(`Successfully geocoded: ${addressComponents.formattedAddress}`);

    return {
      success: true,
      address: structuredAddress,
    };

  } catch (error: any) {
    console.error('Geocoding error:', error);

    // Handle axios/network errors
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new functions.https.HttpsError(
        'deadline-exceeded',
        'Geocoding service timed out. Please try again.'
      );
    }

    if (error.response) {
      throw new functions.https.HttpsError(
        'internal',
        'Geocoding service returned an error.'
      );
    }

    // Re-throw HttpsError if already one
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    // Generic error
    throw new functions.https.HttpsError(
      'internal',
      'An unexpected error occurred while geocoding.'
    );
  }
});

/**
 * Alternative HTTP endpoint (if you prefer REST over callable functions)
 * 
 * Usage: POST https://YOUR-PROJECT.cloudfunctions.net/reverseGeocodeHTTP
 * Body: { "latitude": 17.385, "longitude": 78.4867 }
 * Headers: { "Authorization": "Bearer <firebase-id-token>" }
 */
export const reverseGeocodeHTTP = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Verify Firebase ID token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const idToken = authHeader.split('Bearer ')[1];
    await admin.auth().verifyIdToken(idToken);

    // Get coordinates from request body
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      res.status(400).json({ error: 'Latitude and longitude are required' });
      return;
    }

    // Get API key from config
    const apiKey = functions.config().google?.maps_api_key;
    if (!apiKey) {
      res.status(500).json({ error: 'Service configuration error' });
      return;
    }

    // Call Google Maps API
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    const response = await axios.get(url, { timeout: 10000 });

    if (response.data.status !== 'OK') {
      res.status(400).json({
        error: `Geocoding failed: ${response.data.status}`,
      });
      return;
    }

    // Parse result (same logic as callable function)
    const result = response.data.results[0];
    
    // ... (same parsing logic as above)
    
    res.status(200).json({
      success: true,
      address: result.formatted_address,
      components: result.address_components,
    });

  } catch (error: any) {
    console.error('HTTP Geocoding error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});
