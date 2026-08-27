import { ArrowRight, Megaphone, Users, History, Languages, DoorClosed, ChevronDown, Monitor, Utensils, Goal, Star, LucideIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import * as Icons from 'lucide-react';

interface HomeProps {
    navigate: (route: string) => void;
}

export function Home({ navigate }: HomeProps) {
  const { notices, highlights, images } = useData();

  const getIcon = (iconName: string): LucideIcon => {
    const Icon = (Icons as any)[iconName];
    return Icon || Star;
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center bg-surface-container-high overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-40 mix-blend-multiply"
          style={{ backgroundImage: `url('${images.heroBg}')` }}
        />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-surface-container-lowest px-4 py-1.5 rounded-full border border-outline-variant mb-6 shadow-sm">
            <Megaphone className="text-secondary w-4 h-4 fill-secondary" />
            <span className="font-label-md text-label-md text-primary uppercase tracking-wider">
              Academic Year 2024-25
            </span>
          </div>
          <h1 className="font-headline-lg-mobile text-[2.5rem] leading-tight md:font-display-lg md:text-display-lg text-primary max-w-5xl mb-6">
            ZPPS SRP CAMP: संस्कार आणि शिक्षणाचे माहेरघर
          </h1>
          <h2 className="font-headline-md text-headline-md text-on-surface-variant max-w-3xl mb-10 font-normal">
            जि. प. प्रा. शाळा एसआरपी कॅम्प, सोलापूर उत्तर
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2 w-full sm:w-auto">
            <button 
              onClick={() => navigate('admission')}
              className="font-label-md text-label-md bg-secondary-container text-white px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary transition-all shadow-sm focus:ring-2 focus:ring-secondary-container focus:ring-offset-2 cursor-pointer w-full sm:w-auto"
            >
              Admission Open / प्रवेश सुरू
              <ArrowRight className="w-[18px] h-[18px]" />
            </button>
            <button 
              onClick={() => navigate('facilities')}
              className="font-label-md text-label-md bg-surface-container-lowest border border-outline-variant text-primary px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-bright transition-all shadow-sm focus:ring-2 focus:ring-secondary-container focus:ring-offset-2 cursor-pointer w-full sm:w-auto"
            >
              View Facilities
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary opacity-60 animate-bounce">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* Quick Stats Container */}
      <section className="w-full bg-surface py-8 border-b border-outline-variant relative z-20 -mt-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant shadow-sm">
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-4 text-secondary-container">
                <Users className="w-7 h-7 fill-current" />
              </div>
              <span className="font-headline-md text-headline-md text-primary">Grades 1-7</span>
              <span className="font-caption text-caption text-on-surface-variant mt-1">Primary Education</span>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-4 text-secondary-container">
                <History className="w-7 h-7 fill-current" />
              </div>
              <span className="font-headline-md text-headline-md text-primary">1992</span>
              <span className="font-caption text-caption text-on-surface-variant mt-1">Year Established</span>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-4 text-secondary-container">
                <Languages className="w-7 h-7 fill-current" />
              </div>
              <span className="font-headline-md text-headline-md text-primary">Marathi</span>
              <span className="font-caption text-caption text-on-surface-variant mt-1">Medium of Instruction</span>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mb-4 text-secondary-container">
                <DoorClosed className="w-7 h-7 fill-current" />
              </div>
              <span className="font-headline-md text-headline-md text-primary">9</span>
              <span className="font-caption text-caption text-on-surface-variant mt-1">Classrooms</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 w-full bg-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex px-3 py-1.5 bg-surface-container-low text-secondary-container font-label-md text-label-md rounded border border-outline-variant w-fit shadow-sm">
              About Our Institution
            </div>
            <h2 className="font-headline-lg-mobile text-[2rem] leading-tight md:font-headline-lg md:text-headline-lg text-primary">
              Empowering the Future in Solapur North
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              ZPPS SRP CAMP is a distinguished local body managed educational institution nestled in the urban heart of Solapur North. Since our establishment, we have been dedicated to providing accessible, high-quality education through the Marathi medium.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              We believe in a holistic approach to student development, ensuring our campus is not just a place of academic rigor, but a nurturing community where young minds can thrive safely and confidently.
            </p>
            <button 
                onClick={() => navigate('achievements')}
                className="font-label-md text-label-md text-secondary-container hover:text-secondary flex items-center gap-2 w-fit mt-4 group cursor-pointer transition-colors"
            >
              Read Full History
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

      {/* Notice Board & Highlights */}
      <section className="py-20 w-full bg-surface-container-low border-y border-outline-variant">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Notice Board */}
          <div className="lg:col-span-4 flex flex-col">
            <h3 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-3">
              <Megaphone className="text-secondary-container w-6 h-6 fill-current" />
              Notice Board
            </h3>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col overflow-hidden shadow-sm">
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
                View All Notices
              </div>
            </div>
          </div>

          {/* Highlights Bento */}
          <div className="lg:col-span-8 flex flex-col">
            <h3 className="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-3">
              <Goal className="text-secondary-container w-6 h-6 fill-current" />
              Campus Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {highlights.map((h, i) => {
                const IconComponent = getIcon(h.icon);
                return (
                  <div key={h.id} className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow ${i === 0 ? 'border-t-4 border-t-secondary-container md:col-span-2 lg:col-span-1' : ''}`}>
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
