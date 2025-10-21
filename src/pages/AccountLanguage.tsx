import { Globe, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const AccountLanguage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const languages = [
    { code: 'en', name: t('accountLanguage.english'), native: 'English' },
    { code: 'hi', name: t('accountLanguage.hindi'), native: 'हिन्दी' },
    { code: 'te', name: t('accountLanguage.telugu'), native: 'తెలుగు' },
    { code: 'ta', name: t('accountLanguage.tamil'), native: 'தமிழ்' },
    { code: 'kn', name: t('accountLanguage.kannada'), native: 'ಕನ್ನಡ' },
    { code: 'ml', name: t('accountLanguage.malayalam'), native: 'മലയാളം' }
  ];

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
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
          <h1 className="text-base font-medium text-gray-900">{t('accountLanguage.selectLanguage')}</h1>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="mb-6 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-900">{t('accountLanguage.selectLanguage')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('accountLanguage.choosePreferred')}</p>
        </div>

      <div className="space-y-3">
        {languages.map((lang) => {
          const isSelected = currentLanguage === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center justify-between p-4 border rounded-lg transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe className={`h-5 w-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="text-left">
                  <p className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                    {lang.name}
                  </p>
                  <p className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                    {lang.native}
                  </p>
                </div>
              </div>
              {isSelected && (
                <Check className="h-5 w-5 text-blue-600" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>{t('accountLanguage.noteTitle')}</strong> {t('accountLanguage.noteDescription')}
        </p>
      </div>
      </div>
    </>
  );
};

export default AccountLanguage;
