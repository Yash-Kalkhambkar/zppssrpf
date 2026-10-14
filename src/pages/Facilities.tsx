import { School, Book, Monitor, Droplets, Baby, Swords, Shield, Car, Star } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTranslation } from '../hooks/useTranslation';

export function Facilities() {
  const { images } = useData();
  const { t } = useTranslation();

  return (
    <div className="pt-20 pb-20 md:pb-0 flex-grow bg-background flex flex-col items-center w-full">
      <main className="flex-grow flex flex-col items-center w-full py-8 md:py-16 px-4 md:px-10 max-w-7xl mx-auto space-y-8 md:space-y-16">
        <section className="w-full text-center space-y-4 max-w-3xl mb-4 md:mb-8">
          <h1 className="text-3xl md:text-5xl font-display-lg text-primary leading-tight">{t('facilities.title')}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">{t('facilities.subtitle')}</p>
        </section>

        <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden relative shadow-sm border border-outline-variant">
          <img 
            className="object-cover w-full h-full absolute inset-0" 
            src={images.facilityMain}
            alt="School Courtyard" 
          />
        </div>

        {/* Single column on mobile, 2-col on md, 3-col on lg */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 h-full">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shadow-sm">
              <School className="w-7 h-7 md:w-10 md:h-10" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Classrooms</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                9 well-maintained classrooms providing a comfortable learning space.
              </p>
              <p className="font-marathi text-sm text-on-surface-variant opacity-80 mt-2">९ सुसज्ज वर्गखोल्या</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 h-full">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shadow-sm">
              <Book className="w-7 h-7 md:w-10 md:h-10" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Library</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Library equipped with 170+ books for students.
              </p>
              <p className="font-marathi text-sm text-on-surface-variant opacity-80 mt-2">१७०+ पुस्तकांसह ग्रंथालय</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 h-full">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shadow-sm">
              <Monitor className="w-7 h-7 md:w-10 md:h-10" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Computer Learning</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Computers available for digital learning and literacy.
              </p>
              <p className="font-marathi text-sm text-on-surface-variant opacity-80 mt-2">संगणक शिक्षण सुविधा</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 h-full">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shadow-sm">
              <Droplets className="w-7 h-7 md:w-10 md:h-10" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Drinking Water</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Functional tap water providing clean drinking water.
              </p>
              <p className="font-marathi text-sm text-on-surface-variant opacity-80 mt-2">पिण्यासाठी शुद्ध नळाचे पाणी</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 h-full">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shadow-sm">
              <Baby className="w-7 h-7 md:w-10 md:h-10" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Sanitation</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Separate well-maintained Boys/Girls Toilets (2 each).
              </p>
              <p className="font-marathi text-sm text-on-surface-variant opacity-80 mt-2">मुले/मुलींसाठी स्वतंत्र स्वच्छतागृहे</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 h-full">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shadow-sm">
              <Swords className="w-7 h-7 md:w-10 md:h-10" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Playground</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Spacious playground for physical education and recreation.
              </p>
              <p className="font-marathi text-sm text-on-surface-variant opacity-80 mt-2">खेळाचे मैदान</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 h-full md:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shadow-sm">
              <Shield className="w-7 h-7 md:w-10 md:h-10" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Campus Security</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                The school premises are secured by a robust boundary wall ensuring safety for all students.
              </p>
              <p className="font-marathi text-sm text-on-surface-variant opacity-80 mt-2">संरक्षक भिंत सुरक्षा</p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 h-full md:col-span-2">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shadow-sm">
              <Car className="w-7 h-7 md:w-10 md:h-10" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Easy Accessibility</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                The school is easily approachable by all-weather roads, ensuring safe travel year-round.
              </p>
              <p className="font-marathi text-sm text-on-surface-variant opacity-80 mt-2">शाळा सर्व हवामानात अनुकूल रस्त्यांनी जोडलेली आहे.</p>
            </div>
          </div>
        </section>

        {/* Mid-day meal - full-width on mobile, side-by-side on desktop */}
        <section className="w-full mt-6 md:mt-12 bg-surface-container-lowest p-8 md:p-12 rounded-2xl border border-outline-variant flex flex-col md:flex-row gap-6 md:gap-10 items-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-secondary"></div>
          <div className="flex-1 space-y-4 md:space-y-5">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full font-label-md text-sm mb-2 shadow-sm border border-secondary/20">
              <Star className="w-4 h-4 fill-current" /> Special Feature
            </div>
            <h2 className="text-2xl md:text-4xl font-headline-lg text-primary">Mid-Day Meal Program</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">Nutritious mid-day meals are provided and freshly prepared on premises to ensure health and well-being of our students.</p>
            <p className="font-marathi text-[15px] text-on-surface-variant mt-2 opacity-90">शाळेच्या आवारातच पौष्टिक शालेय पोषण आहार तयार करून दिला जातो.</p>
          </div>
          <div className="w-full md:w-1/2 h-64 md:h-72 rounded-xl overflow-hidden relative shadow-sm border border-outline-variant">
            <img 
              className="object-cover w-full h-full absolute inset-0 hover:scale-105 transition-transform duration-700" 
              src={images.midDayMeal}
              alt="Mid-Day Meal" 
            />
          </div>
        </section>
      </main>
    </div>
  );
}
