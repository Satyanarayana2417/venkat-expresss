import { Bell, Mail, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AccountNotifications = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    sms: false,
    push: true,
    emailDigest: true
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
          <h1 className="text-base font-medium text-gray-900">Notification Settings</h1>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-6 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage how you receive updates from us</p>
        </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            Email Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Order Updates</p>
                <p className="text-sm text-gray-500">Receive updates about your orders</p>
              </div>
              <button
                onClick={() => toggleSetting('orderUpdates')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.orderUpdates ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.orderUpdates ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Promotions & Offers</p>
                <p className="text-sm text-gray-500">Get notified about special deals</p>
              </div>
              <button
                onClick={() => toggleSetting('promotions')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.promotions ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.promotions ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Newsletter</p>
                <p className="text-sm text-gray-500">Weekly product updates and tips</p>
              </div>
              <button
                onClick={() => toggleSetting('newsletter')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.newsletter ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.newsletter ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* SMS Notifications */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            SMS Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Order Status via SMS</p>
                <p className="text-sm text-gray-500">Get order updates on your phone</p>
              </div>
              <button
                onClick={() => toggleSetting('sms')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.sms ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.sms ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-600" />
            Push Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">App Notifications</p>
                <p className="text-sm text-gray-500">Receive push notifications in the app</p>
              </div>
              <button
                onClick={() => toggleSetting('push')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.push ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.push ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Preferences
        </button>
      </div>
      </div>
    </>
  );
};

export default AccountNotifications;
