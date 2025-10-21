import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Mail, Phone, Calendar, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ProfileData {
  username: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: any;
  firstName?: string;
  lastName?: string;
  gender?: 'male' | 'female' | '';
}

const AccountProfile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Separate editing states for each section
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '' as 'male' | 'female' | '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.error('Please log in to view your profile');
      navigate('/login');
      return;
    }

    fetchProfile();
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as ProfileData;
        setProfile(data);
        
        // Parse username into firstName and lastName if needed
        const nameParts = data.username?.split(' ') || ['', ''];
        setFormData({
          firstName: data.firstName || nameParts[0] || '',
          lastName: data.lastName || nameParts.slice(1).join(' ') || '',
          gender: data.gender || '',
          email: data.email || user.email || '',
          phone: data.phone || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePersonal = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const username = `${formData.firstName} ${formData.lastName}`.trim();
      await updateDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        username: username
      });
      
      toast.success('Personal information updated successfully');
      setEditingPersonal(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update personal information');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmail = async () => {
    // Email cannot be changed directly through Firestore
    // This would require re-authentication and Firebase Auth update
    toast.info('Email changes require verification. Feature coming soon.');
    setEditingEmail(false);
  };

  const handleSavePhone = async () => {
    if (!user) return;

    try {
      setSaving(true);
      await updateDoc(doc(db, 'users', user.uid), {
        phone: formData.phone
      });
      
      toast.success('Phone number updated successfully');
      setEditingPhone(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating phone:', error);
      toast.error('Failed to update phone number');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Header with Back Button */}
      <div className="md:hidden bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate('/account')} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-medium text-gray-900">Profile Information</h1>
        </div>
      </div>

      {/* Mobile View - New Sectioned Design */}
      <div className="md:hidden p-4">
        <div className="space-y-4">
          
          {/* Personal Information Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Personal Information</h2>
              {!editingPersonal ? (
                <button
                  onClick={() => setEditingPersonal(true)}
                  className="text-sm font-medium text-blue-600"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingPersonal(false);
                      const nameParts = profile?.username?.split(' ') || ['', ''];
                      setFormData(prev => ({
                        ...prev,
                        firstName: profile?.firstName || nameParts[0] || '',
                        lastName: profile?.lastName || nameParts.slice(1).join(' ') || '',
                        gender: profile?.gender || ''
                      }));
                    }}
                    className="text-sm font-medium text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePersonal}
                    disabled={saving}
                    className="text-sm font-medium text-blue-600 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-4 space-y-4">
              {/* First Name and Last Name */}
              <div className="space-y-3">
                <div>
                  {editingPersonal ? (
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="First name"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                      {formData.firstName || profile?.username?.split(' ')[0] || 'Not provided'}
                    </div>
                  )}
                </div>
                <div>
                  {editingPersonal ? (
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Last name"
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                      {formData.lastName || profile?.username?.split(' ').slice(1).join(' ') || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Your Gender</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender-mobile"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={(e) => editingPersonal && setFormData({ ...formData, gender: e.target.value as 'male' })}
                      disabled={!editingPersonal}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender-mobile"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) => editingPersonal && setFormData({ ...formData, gender: e.target.value as 'female' })}
                      disabled={!editingPersonal}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Female</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Email Address Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Email Address</h2>
              <button
                onClick={() => setEditingEmail(!editingEmail)}
                className="text-sm font-medium text-blue-600"
              >
                Edit
              </button>
            </div>
            
            <div className="p-4">
              {editingEmail ? (
                <div className="space-y-3">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Email address"
                  />
                  <p className="text-xs text-gray-500">
                    Note: Changing email requires verification
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingEmail(false);
                        setFormData(prev => ({ ...prev, email: profile?.email || user?.email || '' }));
                      }}
                      className="text-sm font-medium text-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEmail}
                      className="text-sm font-medium text-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                  {profile?.email || user?.email || 'Not provided'}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Number Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Mobile Number</h2>
              {!editingPhone ? (
                <button
                  onClick={() => setEditingPhone(true)}
                  className="text-sm font-medium text-blue-600"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingPhone(false);
                      setFormData(prev => ({ ...prev, phone: profile?.phone || '' }));
                    }}
                    className="text-sm font-medium text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePhone}
                    disabled={saving}
                    className="text-sm font-medium text-blue-600 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-4">
              {editingPhone ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="+91 XXXXXXXXXX"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                  {profile?.phone || 'Not provided'}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Desktop View - New Sectioned Design */}
      <div className="hidden md:block p-8">
        <div className="max-w-3xl space-y-6">
          
          {/* Personal Information Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Personal Information</h2>
              {!editingPersonal ? (
                <button
                  onClick={() => setEditingPersonal(true)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingPersonal(false);
                      const nameParts = profile?.username?.split(' ') || ['', ''];
                      setFormData(prev => ({
                        ...prev,
                        firstName: profile?.firstName || nameParts[0] || '',
                        lastName: profile?.lastName || nameParts.slice(1).join(' ') || '',
                        gender: profile?.gender || ''
                      }));
                    }}
                    className="text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePersonal}
                    disabled={saving}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-6 space-y-6">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {editingPersonal ? (
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="First name"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                      {formData.firstName || profile?.username?.split(' ')[0] || 'Not provided'}
                    </div>
                  )}
                </div>
                <div>
                  {editingPersonal ? (
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Last name"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                      {formData.lastName || profile?.username?.split(' ').slice(1).join(' ') || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Your Gender</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={(e) => editingPersonal && setFormData({ ...formData, gender: e.target.value as 'male' })}
                      disabled={!editingPersonal}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Male</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) => editingPersonal && setFormData({ ...formData, gender: e.target.value as 'female' })}
                      disabled={!editingPersonal}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Female</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Email Address Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Email Address</h2>
              <button
                onClick={() => setEditingEmail(!editingEmail)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Edit
              </button>
            </div>
            
            <div className="p-6">
              {editingEmail ? (
                <div className="space-y-3">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Email address"
                  />
                  <p className="text-xs text-gray-500">
                    Note: Changing email requires verification
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingEmail(false);
                        setFormData(prev => ({ ...prev, email: profile?.email || user?.email || '' }));
                      }}
                      className="text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEmail}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                  {profile?.email || user?.email || 'Not provided'}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Number Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Mobile Number</h2>
              {!editingPhone ? (
                <button
                  onClick={() => setEditingPhone(true)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingPhone(false);
                      setFormData(prev => ({ ...prev, phone: profile?.phone || '' }));
                    }}
                    className="text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePhone}
                    disabled={saving}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-6">
              {editingPhone ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="+91 XXXXXXXXXX"
                />
              ) : (
                <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                  {profile?.phone || 'Not provided'}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AccountProfile;
