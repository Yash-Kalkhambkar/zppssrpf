import { useLanguage } from '../context/LanguageContext';
import { translations, Language } from '../i18n/translations';

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback: return the key itself if translation not found
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, language };
}
