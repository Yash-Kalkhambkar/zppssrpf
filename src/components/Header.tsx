import React from 'react';
import { School, ArrowRight } from 'lucide-react';
import logo from '../../assets/zpps-logo.png';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageToggle } from './LanguageToggle';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export function Header({ currentRoute, navigate }: HeaderProps) {
  const { t } = useTranslation();

  const navItems = [
    { label: t('common.home'), route: 'home' },
    { label: t('common.about'), route: 'about' },
    { label: t('common.facilities'), route: 'facilities' },
    { label: t('common.contact'), route: 'contact' },
  ];

  // We map 'about' to 'achievements' page to show the timeline
  const handleNavClick = (e: React.MouseEvent, route: string) => {
    e.preventDefault();
    if (route === 'about') {
        navigate('achievements');
    } else {
        navigate(route);
    }
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-[#f4faff]/90 backdrop-blur-md border-b border-[#c6c5d4]/50 shadow-sm transition-all">
      <div className="flex justify-between items-center w-full px-6 md:px-10 max-w-7xl mx-auto h-20">
        {/* Logo - Different layouts for mobile and desktop */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('home')}
        >
          {/* Mobile: compact logo with bilingual text */}
          <div className="flex items-center gap-2 md:hidden">
            <img src={logo} alt="ZPPS SRP CAMP Logo" className="w-10 h-10 object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-bold text-primary tracking-tight">ZPPS SRP CAMP</span>
              <span className="text-[10px] text-primary/70" style={{ fontFamily: 'var(--font-marathi)' }}>
                जि.प.प्रा.शाळा एस.आर.पी. कॅम्प
              </span>
            </div>
          </div>
          {/* Desktop: logo image with text */}
          <div className="hidden md:flex items-center gap-3">
            <img src={logo} alt="ZPPS SRP CAMP Logo" className="w-12 h-12 object-contain bg-primary/5 p-1.5 rounded-xl group-hover:bg-primary/10 transition-colors" />
            <span className="text-[26px] font-serif font-bold text-primary tracking-tight pt-1">
              ZPPS SRP CAMP
            </span>
          </div>
        </div>

        {/* Mobile: Language Toggle only */}
        <div className="md:hidden">
          <LanguageToggle />
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = 
                (currentRoute === item.route) || 
                (currentRoute === 'achievements' && item.route === 'about');

            return (
              <a
                key={item.label}
                href="#"
                onClick={(e) => handleNavClick(e, item.route)}
                className={`font-semibold text-[15px] transition-colors ${
                  isActive
                    ? 'text-primary border-b-[3px] border-secondary pb-1'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <LanguageToggle />
          <button 
            onClick={() => navigate('admission')}
            className="font-bold text-[15px] bg-secondary-container text-white px-7 py-2.5 rounded-lg flex items-center gap-2 hover:bg-secondary transition-all shadow-sm focus:ring-2 focus:ring-secondary-container focus:ring-offset-2 cursor-pointer"
          >
            <span>{t('common.admission')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
