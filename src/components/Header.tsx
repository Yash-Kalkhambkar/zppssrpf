import React, { useState } from 'react';
import { School, ArrowRight, Menu, X } from 'lucide-react';

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
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            navigate('home');
            setIsMobileMenuOpen(false);
          }}
        >
          <div className="bg-primary/5 p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
            <School className="text-primary w-8 h-8 stroke-[1.5]" />
          </div>
          <span className="text-[26px] font-serif font-bold text-primary tracking-tight pt-1">
            ZPPS SRP CAMP
          </span>
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
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-surface border-b border-outline-variant shadow-lg py-4 px-6 flex flex-col gap-4">
          {navItems.map((item) => {
            const isActive = 
                (currentRoute === item.route) || 
                (currentRoute === 'achievements' && item.route === 'about');

            return (
              <a
                key={item.label}
                href="#"
                onClick={(e) => handleNavClick(e, item.route)}
                className={`font-semibold text-lg py-2 transition-colors ${
                  isActive ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {item.label}
              </a>
            );
          })}
          <button 
            onClick={() => {
              navigate('admission');
              setIsMobileMenuOpen(false);
            }}
            className="mt-2 font-bold text-lg bg-secondary-container text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary transition-all shadow-sm cursor-pointer"
          >
            <span>Admission</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
}
