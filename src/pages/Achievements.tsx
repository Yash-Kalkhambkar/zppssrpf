import { Award } from 'lucide-react';
import { useData } from '../context/DataContext';

export function Achievements() {
  const { timelineEvents } = useData();

  return (
    <div className="pt-20 flex-grow bg-background">
      {/* Hero Section */}
      <section className="bg-surface-container py-16 md:py-24 px-6 md:px-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="font-display-lg text-[2.5rem] leading-tight md:text-display-lg text-primary mb-6">
            Our Journey of Excellence
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            Building a legacy of quality education and community empowerment in Solapur North since 1992.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-fixed opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-fixed opacity-30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-surface">
        <div className="max-w-5xl mx-auto">
          <div className="relative w-full">

            {/* Vertical center line */}
            <div className="absolute top-0 bottom-0 left-7 md:left-1/2 w-0.5 bg-outline-variant md:-translate-x-px" />

            <div className="flex flex-col gap-10 md:gap-12">
              {timelineEvents.map((event) => {
                const isLeft = event.align === 'left';
                return (
                  <div key={event.id} className="relative flex items-start md:items-center">

                    {/* ── MOBILE layout: node left, card right ── */}
                    {/* ── DESKTOP layout: alternating ── */}

                    {/* Left card slot (desktop only, shown when align=left) */}
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

                    {/* Year node — sits on the center line */}
                    <div className={`z-10 flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full shadow-md font-bold text-sm text-white ${
                      event.highlight ? 'bg-secondary' :
                      isLeft ? 'bg-primary' : 'bg-secondary'
                    }`}>
                      {event.year}
                    </div>

                    {/* Right card slot — mobile always shows here, desktop only when align=right */}
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
