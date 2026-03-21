import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import viTranslations from './locales/vi/translation.json';
import enTranslations from './locales/en/translation.json';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: {
        translation: viTranslations
      },
      en: {
        translation: enTranslations
      }
    },
    lng: 'vi', // default language
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;