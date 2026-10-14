import { ArrowRight, Megaphone, Users, History, Languages, DoorClosed, Monitor, Utensils, Goal, Star, LucideIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTranslation } from '../hooks/useTranslation';
import * as Icons from 'lucide-react';

interface HomeProps {
    navigate: (route: string) => void;
}

export function Home({ navigate }: HomeProps) {
  const { notices, highlights, images } = useData();
  const { t } = useTranslation();

  const getIcon = (iconName: string): LucideIcon => {
    const Icon = (Icons as any)[iconName];
    return Icon || Star;
  };

  return (
    <div className="pt-20 pb-20 md:pb-0">
      {/* Hero Section - mobile-first with responsive typography */}
      <section className="relative w-full min-h-screen flex items-center justify-center bg-surface-container-high overflow-hidden pb-12">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-40 mix-blend-multiply"
          style={{ backgroundImage: `url('${images.heroBg}')` }}
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-surface-container-lowest px-4 py-1.5 rounded-full border border-outline-variant mb-6 shadow-sm">
            <Megaphone className="text-secondary w-4 h-4 fill-secondary" />
            <span className="font-label-md text-label-md text-primary uppercase tracking-wider">
              Academic Year 2024-25
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-headline-lg-mobile md:font-display-lg text-primary max-w-5xl mb-6 leading-tight">
            {t('home.heroTitle')}
          </h1>
          <h2 className="font-headline-md text-headline-md text-on-surface-variant max-w-3xl mb-10 font-normal">
            {t('home.heroSubtitle')}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2 w-full sm:w-auto">
            <button 
              onClick={() => navigate('admission')}
              className="font-label-md text-label-md bg-secondary-container text-white px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary transition-all shadow-sm focus:ring-2 focus:ring-secondary-container focus:ring-offset-2 cursor-pointer w-full sm:w-auto"
            >
              {t('home.admissionButton')}
              <ArrowRight className="w-[18px] h-[18px]" />
            </button>
            <button 
              onClick={() => navigate('facilities')}
              className="font-label-md text-label-md bg-surface-container-lowest border border-outline-variant text-primary px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-bright transition-all shadow-sm focus:ring-2 focus:ring-secondary-container focus:ring-offset-2 cursor-pointer w-full sm:w-auto"
            >
              {t('home.facilitiesButton')}
            </button>
          </div>
        </div>
      </section>

      {/* Quick Stats Container - 2x2 grid on mobile, 4 columns on desktop */}
      <section className="w-full bg-surface py-8 border-b border-outline-variant relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant shadow-sm">
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-4 text-secondary-container">
                <Users className="w-7 h-7 fill-current" />
              </div>
              <span className="font-headline-md text-headline-md text-primary">{t('home.stats.grades')}</span>
              <span className="font-caption text-caption text-on-surface-variant mt-1">{t('home.stats.gradesLabel')}</span>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-4 text-secondary-container">
                <History className="w-7 h-7 fill-current" />
              </div>
              <span className="font-headline-md text-headline-md text-primary">{t('home.stats.established')}</span>
              <span className="font-caption text-caption text-on-surface-variant mt-1">{t('home.stats.establishedLabel')}</span>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-4 text-secondary-container">
                <Languages className="w-7 h-7 fill-current" />
              </div>
              <span className="font-headline-md text-headline-md text-primary">{t('home.stats.medium')}</span>
              <span className="font-caption text-caption text-on-surface-variant mt-1">{t('home.stats.mediumLabel')}</span>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-4 text-secondary-container">
                <DoorClosed className="w-7 h-7 fill-current" />
              </div>
              <span className="font-headline-md text-headline-md text-primary">{t('home.stats.classrooms')}</span>
              <span className="font-caption text-caption text-on-surface-variant mt-1">{t('home.stats.classroomsLabel')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - consistent mobile padding */}
      <section className="py-20 w-full bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex px-3 py-1.5 bg-surface-container-low text-secondary-container font-label-md text-label-md rounded border border-outline-variant w-fit shadow-sm">
              {t('home.about.badge')}
            </div>
            <h2 className="text-3xl md:text-5xl font-headline-lg-mobile md:font-headline-lg text-primary leading-tight">
              {t('home.about.title')}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {t('home.about.desc1')}
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {t('home.about.desc2')}
            </p>
            <button 
                onClick={() => navigate('achievements')}
                className="font-label-md text-label-md text-secondary-container hover:text-secondary flex items-center gap-2 w-fit mt-4 group cursor-pointer transition-colors"
            >
              {t('home.about.readMore')}
              <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="relative h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-sm border border-outline-variant p-2 bg-surface-container-lowest">
            <div 
              className="w-full h-full rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url('${images.aboutImg}')` }}
            />
          </div>
        </div>
      </section>

      {/* Notice Board & Highlights - horizontal scroll with snap on mobile */}
      <section className="py-8 md:py-16 w-full bg-surface-container-low border-y border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 md:px-10 space-y-8 md:space-y-16">
          
          {/* Notice Board - horizontal scroll on mobile */}
          <div className="flex flex-col">
            <h3 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-3">
              <Megaphone className="text-secondary-container w-6 h-6 fill-current" />
              {t('home.notices.title')}
            </h3>
            {/* Mobile: horizontal scroll with snap */}
            <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 pb-4">
              <div className="flex gap-4 w-max">
                {notices.slice(0, 5).map((notice) => (
                  <div key={notice.id} className="snap-start w-[85vw] max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:bg-surface-bright transition-colors cursor-pointer group flex-shrink-0 shadow-sm">
                    <div className="flex gap-4">
                      <div className={`${notice.active ? 'bg-secondary-container text-white' : 'bg-surface-variant text-on-surface-variant'} w-14 h-14 flex flex-col items-center justify-center flex-shrink-0 rounded-lg shadow-sm`}>
                        <span className="font-headline-md text-[18px] leading-none mb-1">{notice.day}</span>
                        <span className="font-caption text-[11px] uppercase tracking-wider leading-none">{notice.month}</span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="font-headline-md text-[16px] text-on-surface leading-snug group-hover:text-secondary-container transition-colors mb-1">{notice.title}</h4>
                        <span className="font-caption text-[13px] text-on-surface-variant leading-relaxed line-clamp-2">{notice.desc}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Desktop: vertical stack */}
            <div className="hidden md:block bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              {notices.slice(0, 5).map((notice, i) => (
                <div key={notice.id} className={`flex ${i !== notices.length - 1 ? 'border-b border-outline-variant' : ''} p-5 hover:bg-surface-bright transition-colors cursor-pointer group`}>
                  <div className={`${notice.active ? 'bg-secondary-container text-white' : 'bg-surface-variant text-on-surface-variant'} w-14 h-14 flex flex-col items-center justify-center flex-shrink-0 rounded-lg shadow-sm`}>
                    <span className="font-headline-md text-[18px] leading-none mb-1">{notice.day}</span>
                    <span className="font-caption text-[11px] uppercase tracking-wider leading-none">{notice.month}</span>
                  </div>
                  <div className="ml-5 flex flex-col justify-center">
                    <h4 className="font-headline-md text-[16px] text-on-surface leading-snug group-hover:text-secondary-container transition-colors mb-1">{notice.title}</h4>
                    <span className="font-caption text-[13px] text-on-surface-variant leading-relaxed line-clamp-2">{notice.desc}</span>
                  </div>
                </div>
              ))}
              <div className="p-4 text-center font-label-md text-label-md text-secondary-container bg-surface border-t border-outline-variant hover:bg-surface-bright transition-colors block cursor-pointer">
                {t('home.notices.viewAll')}
              </div>
            </div>
          </div>

          {/* Highlights - vertical stack on mobile, 2-col grid on tablet+ */}
          <div className="flex flex-col">
            <h3 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-3">
              <Goal className="text-secondary-container w-6 h-6 fill-current" />
              {t('home.highlights.title')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {highlights.map((h, i) => {
                const IconComponent = getIcon(h.icon);
                return (
                  <div key={h.id} className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow ${i === 0 ? 'border-t-4 border-t-secondary-container' : ''}`}>
                    <div className="z-10 relative">
                      <div className="w-14 h-14 bg-surface-container rounded-lg flex items-center justify-center text-secondary-container mb-6 shadow-sm">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <h4 className="font-headline-md text-[20px] text-primary mb-3 leading-tight">{h.title}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{h.desc}</p>
                    </div>
                    {i === 0 && (
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-surface-container-low rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}
