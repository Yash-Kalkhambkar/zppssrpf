import { Award } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTranslation } from '../hooks/useTranslation';

export function Achievements() {
  const { timelineEvents } = useData();
  const { t } = useTranslation();

  return (
    <div className="pt-20 pb-20 md:pb-0 flex-grow bg-background">
      {/* Hero Section */}
      <section className="bg-surface-container py-8 md:py-16 px-4 md:px-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-display-lg text-primary mb-4 md:mb-6 leading-tight">
            {t('achievements.title')}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            {t('achievements.subtitle')}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-fixed opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-fixed opacity-30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Timeline Section - mobile-first vertical layout */}
      <section className="py-8 md:py-16 px-4 md:px-10 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="relative w-full">

            {/* Vertical line - always on left side on mobile, center on desktop */}
            <div className="absolute top-0 bottom-0 left-7 md:left-1/2 w-0.5 bg-outline-variant md:-translate-x-px" />

            <div className="flex flex-col gap-8 md:gap-12">
              {timelineEvents.map((event) => {
                const isLeft = event.align === 'left';
                return (
                  <div key={event.id} className="relative flex items-start md:items-center">

                    {/* Desktop: Left card slot (shown when align=left) */}
                    <div className={`hidden md:flex md:w-5/12 md:justify-end md:pr-10 ${isLeft ? '' : 'invisible'}`}>
                      {isLeft && (
                        <div className={`rounded-2xl shadow-sm px-6 py-6 hover:shadow-md transition-shadow w-full ${
                          event.highlight ? 'border-2 border-secondary relative' : 'border border-outline-variant'
                        } bg-surface-container-lowest`}>
                          {event.highlight && (
                            <div className="absolute -top-3 -right-3 bg-secondary text-white p-2 rounded-full shadow-md">
                              <Award className="w-5 h-5 fill-current" />
                            </div>
                          )}
                          <div className={event.highlight ? 'pr-4' : ''}>
                            <h3 className="mb-2 font-headline-md text-headline-md text-primary">{event.title}</h3>
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{event.desc}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Year badge - larger on mobile (w-16 h-16), left-aligned */}
                    <div className={`z-10 flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full shadow-md font-bold text-sm text-white ${
                      event.highlight ? 'bg-secondary' :
                      isLeft ? 'bg-primary' : 'bg-secondary'
                    }`}>
                      {event.year}
                    </div>

                    {/* Card - mobile: always right of badge, desktop: right side only when align=right */}
                    <div className={`md:w-5/12 md:pl-10 pl-5 flex-1 ${isLeft ? 'md:invisible md:pointer-events-none' : ''}`}>
                      <div className={`rounded-2xl shadow-sm px-6 py-6 hover:shadow-md transition-shadow ${
                        event.highlight ? 'border-2 border-secondary relative' : 'border border-outline-variant'
                      } bg-surface-container-lowest`}>
                        {event.highlight && (
                          <div className="absolute -top-3 -right-3 bg-secondary text-white p-2 rounded-full shadow-md">
                            <Award className="w-5 h-5 fill-current" />
                          </div>
                        )}
                        <div className={event.highlight ? 'pr-4' : ''}>
                          <h3 className="mb-2 font-headline-md text-headline-md text-primary">{event.title}</h3>
                          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{event.desc}</p>
                        </div>
                      </div>
                    </div>

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
