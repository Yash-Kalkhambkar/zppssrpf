import React, { useState } from 'react';
import { School, ArrowRight, Menu, X } from 'lucide-react';
import { Sheet, SheetContent } from './ui/sheet';
import logo from '../../assets/zpps-logo.png';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export function Header({ currentRoute, navigate }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', route: 'home' },
    { label: 'About Us', route: 'about' },
    { label: 'Facilities', route: 'facilities' },
    { label: 'Contact', route: 'contact' },
  ];

  // We map 'about' to 'achievements' page to show the timeline
  const handleNavClick = (e: React.MouseEvent, route: string) => {
    e.preventDefault();
    if (route === 'about') {
        navigate('achievements');
    } else {
        navigate(route);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-[#f4faff]/90 backdrop-blur-md border-b border-[#c6c5d4]/50 shadow-sm transition-all">
      <div className="flex justify-between items-center w-full px-6 md:px-10 max-w-7xl mx-auto h-20">
        {/* Logo - Different layouts for mobile and desktop */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            navigate('home');
            setIsMobileMenuOpen(false);
          }}
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
          {/* Desktop: existing layout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="bg-primary/5 p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
              <School className="text-primary w-8 h-8 stroke-[1.5]" />
            </div>
            <span className="text-[26px] font-serif font-bold text-primary tracking-tight pt-1">
              ZPPS SRP CAMP
            </span>
          </div>
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

        <div className="hidden md:flex">
          <button 
            onClick={() => {
              navigate('admission');
              setIsMobileMenuOpen(false);
            }}
            className="font-bold text-[15px] bg-secondary-container text-white px-7 py-2.5 rounded-lg flex items-center gap-2 hover:bg-secondary transition-all shadow-sm focus:ring-2 focus:ring-secondary-container focus:ring-offset-2 cursor-pointer"
          >
            <span>Admission</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <button 
          className="md:hidden text-primary p-2 hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Sheet - slides from left */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} side="left">
        <SheetContent className="w-[280px] max-w-[85vw] bg-surface-container-lowest rounded-r-xl border-r border-outline-variant p-6 shadow-xl h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <img src={logo} alt="ZPPS SRP CAMP Logo" className="w-10 h-10 object-contain" />
              <div className="flex flex-col leading-tight">
                <span className="text-[15px] font-bold text-primary tracking-tight">ZPPS SRP CAMP</span>
                <span className="text-[10px] text-primary/70" style={{ fontFamily: 'var(--font-marathi)' }}>
                  जि.प.प्रा.शाळा एस.आर.पी. कॅम्प
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-on-surface-variant p-2 hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = 
                  (currentRoute === item.route) || 
                  (currentRoute === 'achievements' && item.route === 'about');

              return (
                <button
                  key={item.label}
                  onClick={(e) => handleNavClick(e, item.route)}
                  className={`font-semibold text-left text-lg px-4 py-3 rounded-lg transition-all cursor-pointer ${
                    isActive 
                      ? 'text-primary bg-primary/10 border-l-4 border-primary' 
                      : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button 
              onClick={() => {
                navigate('admission');
                setIsMobileMenuOpen(false);
              }}
              className="mt-4 font-bold text-lg bg-secondary-container text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary transition-all shadow-sm cursor-pointer"
            >
              <span>Admission</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
