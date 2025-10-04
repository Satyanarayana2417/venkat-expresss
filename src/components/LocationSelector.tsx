import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
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

interface LocationData {
  city: string;
  country: string;
}

const countries = [
  { value: 'india', label: 'India', cities: ['Hyderabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai'] },
  { value: 'usa', label: 'USA', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] },
  { value: 'uk', label: 'UK', cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow'] },
  { value: 'uae', label: 'UAE', cities: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'] },
];

export const LocationSelector = () => {
  const [location, setLocation] = useState<LocationData>({ city: 'Hyderabad', country: 'India' });
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('india');
  const [selectedCity, setSelectedCity] = useState('Hyderabad');

  useEffect(() => {
    const hasAskedPermission = localStorage.getItem('locationPermissionAsked');
    
    if (!hasAskedPermission) {
      const timer = setTimeout(() => {
        setShowDialog(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            const data = await response.json();
            setLocation({
              city: data.city || data.locality || 'Unknown',
              country: data.countryName || 'Unknown',
            });
            localStorage.setItem('locationPermissionAsked', 'true');
            setShowDialog(false);
          } catch (error) {
            console.error('Error fetching location:', error);
            showManualSelection();
          }
        },
        () => {
          showManualSelection();
        }
      );
    } else {
      showManualSelection();
    }
  };

  const showManualSelection = () => {
    localStorage.setItem('locationPermissionAsked', 'true');
    // Keep dialog open for manual selection
  };

  const handleManualSelection = () => {
    const country = countries.find(c => c.value === selectedCountry);
    setLocation({
      city: selectedCity,
      country: country?.label || 'India',
    });
    localStorage.setItem('locationPermissionAsked', 'true');
    setShowDialog(false);
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    const country = countries.find(c => c.value === value);
    if (country && country.cities.length > 0) {
      setSelectedCity(country.cities[0]);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Shipping From:</span>
        <button
          onClick={() => setShowDialog(true)}
          className="font-semibold hover:underline transition-all"
        >
          {location.city}, {location.country}
        </button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Select Your Location</DialogTitle>
            <DialogDescription>
              Help us show you accurate shipping information by sharing your location.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex flex-col gap-3">
              <Button
                onClick={requestLocation}
                className="gradient-gold hover:shadow-gold w-full"
                size="lg"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Use My Current Location
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or select manually</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Country</label>
                  <Select value={selectedCountry} onValueChange={handleCountryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">City</label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries
                        .find(c => c.value === selectedCountry)
                        ?.cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleManualSelection}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Confirm Location
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

