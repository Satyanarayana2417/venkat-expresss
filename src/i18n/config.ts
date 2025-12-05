import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en.json';
import hi from './locales/hi.json';
import te from './locales/te.json';
import ta from './locales/ta.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';

// Valid language codes
const VALID_LANGUAGES = ['en', 'hi', 'te', 'ta', 'kn', 'ml'];

// Get saved language from localStorage or default to 'en'
const getSavedLanguage = (): string => {
  if (typeof window !== 'undefined') {
    try {
      const savedLang = localStorage.getItem('userLanguage');
      // Validate that the saved language is a valid option
      if (savedLang && VALID_LANGUAGES.includes(savedLang)) {
        return savedLang;
      }
      // Clear invalid language data
      if (savedLang) {
        console.warn('Invalid language in localStorage, resetting to default');
        localStorage.removeItem('userLanguage');
      }
    } catch (error) {
      console.error('Error reading language from localStorage:', error);
      // Clear potentially corrupted data
      try {
        localStorage.removeItem('userLanguage');
      } catch (e) {
        // localStorage might be completely inaccessible
      }
    }
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      te: { translation: te },
      ta: { translation: ta },
      kn: { translation: kn },
      ml: { translation: ml },
    },
    lng: getSavedLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

// Save language preference whenever it changes
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userLanguage', lng);
  }
});

export default i18n;