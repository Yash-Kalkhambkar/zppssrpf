import { Home, Users, Building, Mail, GraduationCap } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface MobileNavProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export function MobileNav({ currentRoute, navigate }: MobileNavProps) {
  const { t } = useTranslation();

  const navItems = [
    { label: t('common.home'), route: 'home', icon: Home },
    { label: t('common.about'), route: 'achievements', icon: Users },
    { label: t('common.facilities'), route: 'facilities', icon: Building },
    { label: t('common.contact'), route: 'contact', icon: Mail },
    { label: t('common.admission'), route: 'admission', icon: GraduationCap },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest border-t border-outline-variant shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.route;

          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
              }`}
              aria-label={item.label}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[11px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
