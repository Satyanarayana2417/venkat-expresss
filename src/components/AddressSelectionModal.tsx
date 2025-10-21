import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MapPin, X, Loader2 } from 'lucide-react';
import { Address, getUserAddresses } from '@/lib/addressService';
import { toast } from 'sonner';

interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentAddress: Address | null;
  onAddressSelect: (address: Address) => void;
}

export const AddressSelectionModal = ({
  isOpen,
  onClose,
  userId,
  currentAddress,
  onAddressSelect,
}: AddressSelectionModalProps) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fetch user's saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const userAddresses = await getUserAddresses(userId);
        setAddresses(userAddresses);

        // Pre-select current address if available
        if (currentAddress && currentAddress.id) {
          setSelectedAddressId(currentAddress.id);
        } else if (userAddresses.length > 0 && userAddresses[0].id) {
          setSelectedAddressId(userAddresses[0].id);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Failed to load addresses');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen, userId, currentAddress]);

  const handleAddressSelection = () => {
    const selected = addresses.find((addr) => addr.id === selectedAddressId);
    if (selected) {
      onAddressSelect(selected);
      onClose();
      toast.success('Delivery address updated');
    }
  };

  const formatAddress = (addr: Address) => {
    return `${addr.flatBuilding}, ${addr.areaStreet}${addr.landmark ? ', ' + addr.landmark : ''}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-lg font-semibold">Select Delivery Address</span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Choose a delivery address from your saved addresses or use your current location
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-gray-600">Loading addresses...</span>
            </div>
          ) : addresses.length === 0 ? (
            <div className="py-8 text-center">
              <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 mb-4">No saved addresses found</p>
              <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  window.location.href = '/account/addresses';
                }}
              >
                Add New Address
              </Button>
            </div>
          ) : (
            <>
              {/* Saved Addresses List */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Saved Addresses</h3>
                <RadioGroup
                  value={selectedAddressId}
                  onValueChange={setSelectedAddressId}
                  className="space-y-3"
                >
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedAddressId === address.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => address.id && setSelectedAddressId(address.id)}
                    >
                      <RadioGroupItem value={address.id || ''} id={address.id} className="mt-1" />
                      <Label
                        htmlFor={address.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {address.fullName}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded uppercase">
                              {address.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.mobileNumber}
                          </p>
                          <p className="text-sm text-gray-700">
                            {formatAddress(address)}
                          </p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddressSelection}
                  disabled={!selectedAddressId}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Deliver Here
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
