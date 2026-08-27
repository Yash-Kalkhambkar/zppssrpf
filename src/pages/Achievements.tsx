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
            {/* Center Line (Desktop) / Left Line (Mobile) */}
            <div className="absolute border-opacity-20 border-outline-variant h-full border md:left-1/2 left-[28px] transform md:-translate-x-1/2" />
            
            <div className="flex flex-col space-y-12 md:space-y-8">
              {timelineEvents.map((event) => (
                <div key={event.id} className={`flex flex-col md:flex-row items-start md:items-center w-full ${event.align === 'left' ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Empty space for desktop alternating layout */}
                  <div className="hidden md:block w-5/12" />
                  
                  {/* Year Node */}
                  <div className={`z-20 flex items-center justify-center shadow-md w-14 h-14 rounded-full flex-shrink-0 relative ${event.align === 'left' ? 'md:-ml-7' : 'md:-mr-7'} ${
                    event.highlight ? 'bg-secondary-container border-2 border-secondary' : 
                    event.align === 'right' ? 'bg-secondary' : 'bg-primary'
                  }`}>
                    <span className={`font-label-md text-label-md text-sm leading-none ${
                      event.highlight ? 'text-on-secondary-container' :
                      event.align === 'right' ? 'text-on-secondary' : 'text-on-primary'
                    }`}>
                      {event.year}
                    </span>
                  </div>
                  
                  {/* Content Card */}
                  <div className={`mt-4 md:mt-0 ml-14 md:ml-0 md:w-5/12 bg-surface-container-lowest rounded-2xl shadow-sm px-6 py-6 hover:shadow-md transition-shadow ${
                    event.highlight ? 'border-2 border-secondary relative' : 'border border-outline-variant'
                  }`}>
                    {event.highlight && (
                      <div className="absolute -top-3 -right-3 bg-secondary text-on-secondary p-2 rounded-full shadow-md">
                        <Award className="w-5 h-5 fill-current" />
                      </div>
                    )}
                    {event.highlight ? (
                      <div className="flex items-center gap-2 mb-3 pr-6">
                        <h3 className="font-headline-md text-headline-md text-primary">{event.title}</h3>
                      </div>
                    ) : (
                      <h3 className="mb-3 font-headline-md text-headline-md text-primary">{event.title}</h3>
                    )}
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed text-opacity-100">
                      {event.desc}
                    </p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
