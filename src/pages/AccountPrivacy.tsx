import { Shield, Lock, Eye, UserX, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountPrivacy = () => {
  const navigate = useNavigate();

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
          <h1 className="text-base font-medium text-gray-900">Privacy Center</h1>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-6 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-900">Privacy Center</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your privacy and data settings</p>
        </div>

      <div className="space-y-4">
        {/* Data Privacy */}
        <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Data Privacy</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Control how your personal data is used and shared
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Manage Settings →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Account Security</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Manage your password and two-factor authentication
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Update Security →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Activity History */}
        <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Eye className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Activity History</h3>
                <p className="text-sm text-gray-600 mb-3">
                  View and manage your browsing and purchase history
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View History →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Download Your Data */}
        <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Download className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Download Your Data</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Request a copy of all your data stored with us
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Request Download →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="border border-red-200 rounded-lg p-5 bg-red-50">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Delete Account</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Permanently delete your account and all associated data
                </p>
                <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Delete Account →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Your privacy matters:</strong> We are committed to protecting your personal information. 
          Read our <a href="/privacy-policy" className="underline hover:text-blue-700">Privacy Policy</a> to learn more.
        </p>
      </div>
      </div>
    </>
  );
};

export default AccountPrivacy;
