import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const handleToggle = () => {
    setLanguage(language === 'mr' ? 'en' : 'mr');
  };

  return (
    <button
      onClick={handleToggle}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container text-primary border border-outline-variant hover:bg-surface-container-high transition-colors min-h-[44px] cursor-pointer"
      aria-label={`Switch to ${language === 'mr' ? 'English' : 'Marathi'}`}
    >
      <Languages className="w-5 h-5" />
      <span className="font-label-md text-sm">
        {language === 'mr' ? 'En' : 'मर'}
      </span>
    </button>
  );
}
