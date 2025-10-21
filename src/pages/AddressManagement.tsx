import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Plus, MoreVertical, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddAddressModal } from '@/components/AddAddressModal';
import { 
  Address, 
  getAddressByType, 
  saveAddress, 
  deleteAddress 
} from '@/lib/addressService';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AddressManagement = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [homeAddress, setHomeAddress] = useState<Address | null>(null);
  const [workAddress, setWorkAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddressType, setEditingAddressType] = useState<'home' | 'work' | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false); // For inline form display
  const [prefillData, setPrefillData] = useState<Partial<Address> | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchAddresses();
    }
  }, [user, authLoading, navigate]);

  // Check for pre-fill data from geolocation
  useEffect(() => {
    const action = searchParams.get('action');
    const shouldPrefill = searchParams.get('prefill') === 'true';

    if (action === 'add' && shouldPrefill) {
      const storedData = sessionStorage.getItem('detectedAddress');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setPrefillData(parsedData);
          
          // Determine which type to add based on existing addresses
          const typeToAdd = !homeAddress ? 'home' : 'work';
          setEditingAddressType(typeToAdd);
          setShowAddressForm(true);

          // Clear sessionStorage after reading
          sessionStorage.removeItem('detectedAddress');
          
          // Clean up URL params
          setSearchParams({});

          // Show success toast
          toast({
            title: 'Address Detected',
            description: 'Your location has been detected. Please review and save the address.',
          });
        } catch (error) {
          console.error('Error parsing pre-fill data:', error);
          sessionStorage.removeItem('detectedAddress');
        }
      }
    }
  }, [searchParams, homeAddress, setSearchParams, toast]);

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [home, work] = await Promise.all([
        getAddressByType(user.uid, 'home'),
        getAddressByType(user.uid, 'work')
      ]);
      setHomeAddress(home);
      setWorkAddress(work);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load addresses. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = (type: 'home' | 'work') => {
    setEditingAddressType(type);
    setShowAddressForm(true); // Show inline form instead of modal
  };

  const handleEditAddress = (type: 'home' | 'work') => {
    setEditingAddressType(type);
    setShowAddressForm(true); // Show inline form instead of modal
  };

  const handleSaveAddress = async (address: Address) => {
    if (!user) return;

    try {
      await saveAddress(user.uid, address);
      toast({
        title: 'Success',
        description: `${address.type === 'home' ? 'Home' : 'Work'} address saved successfully!`,
      });
      await fetchAddresses();
      setShowAddressForm(false); // Hide inline form
      setEditingAddressType(null);
    } catch (error) {
      console.error('Error saving address:', error);
      throw error;
    }
  };

  const handleDeleteAddress = async (type: 'home' | 'work', addressId: string) => {
    if (!user) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete your ${type} address?`
    );

    if (!confirmed) return;

    try {
      setDeletingAddressId(addressId);
      await deleteAddress(user.uid, addressId);
      toast({
        title: 'Success',
        description: `${type === 'home' ? 'Home' : 'Work'} address deleted successfully!`,
      });
      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete address. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingAddressId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading addresses...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const existingAddress = editingAddressType === 'home' ? homeAddress : workAddress;

  // Combine addresses into an array for easier rendering
  const addresses = [
    homeAddress && { ...homeAddress, type: 'home' as const },
    workAddress && { ...workAddress, type: 'work' as const }
  ].filter(Boolean) as Address[];

  return (
    <>
      {/* Mobile Header - Only show on mobile */}
      <div className="md:hidden bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-base font-medium text-gray-900">Saved Addresses</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-[calc(100vh-4rem)] md:min-h-0 bg-white py-0 md:p-8">
        <div className="container mx-auto px-0 md:px-0 max-w-4xl space-y-6">
          {/* Title - Desktop Only */}
          <div className="hidden md:block px-0">
            <h1 className="text-lg font-semibold text-gray-900">Manage Addresses</h1>
          </div>

          {/* Add New Address Button */}
          <div className="px-4 md:px-0 pt-4 md:pt-0">
            {!showAddressForm && (
              <button
                onClick={() => {
                  // If both addresses exist, show info message
                  if (homeAddress && workAddress) {
                    toast({
                      title: 'Info',
                      description: 'You can only have one home and one work address. Please edit or delete an existing address.',
                    });
                    return;
                  }
                  // Determine which type to add
                  const typeToAdd = !homeAddress ? 'home' : 'work';
                  handleAddAddress(typeToAdd);
                }}
                className="w-full border-2 border-blue-600 rounded-lg py-3 px-4 text-blue-600 font-medium text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                ADD A NEW ADDRESS
              </button>
            )}
          </div>

          {/* Inline Address Form */}
          {showAddressForm && editingAddressType && (
            <div className="px-4 md:px-0">
              <AddAddressModal
                isOpen={true}
                onClose={() => {
                  setShowAddressForm(false);
                  setEditingAddressType(null);
                  setPrefillData(null);
                }}
                onSave={handleSaveAddress}
                addressType={editingAddressType}
                existingAddress={existingAddress}
                prefillData={prefillData}
                inline={true}
              />
            </div>
          )}

          {/* Address List */}
          <div className="space-y-4 px-4 md:px-0">
            {addresses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No saved addresses yet. Add your first address above.</p>
              </div>
            ) : (
              addresses.map((address) => (
                <div
                  key={address.id}
                  className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Name and Phone */}
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-base">
                          {address.fullName}
                        </h3>
                        <span className="text-gray-600 text-sm">
                          {address.mobileNumber}
                        </span>
                      </div>

                      {/* Full Address */}
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {address.flatBuilding}, {address.areaStreet}
                        {address.landmark && `, ${address.landmark}`}, {address.city}, {address.state} - <span className="font-medium">{address.pincode}</span>
                      </p>
                    </div>

                    {/* Three-dot Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => handleEditAddress(address.type)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => address.id && handleDeleteAddress(address.type, address.id)}
                          disabled={deletingAddressId === address.id}
                          className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deletingAddressId === address.id ? 'Deleting...' : 'Delete'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressManagement;
