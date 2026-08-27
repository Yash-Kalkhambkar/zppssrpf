import { School, Book, Monitor, Droplets, Baby, Swords, Shield, Car, Star } from 'lucide-react';
import { useData } from '../context/DataContext';

export function Facilities() {
  const { images } = useData();

  return (
    <div className="pt-20 flex-grow flex flex-col items-center w-full bg-background">
      <main className="flex-grow flex flex-col items-center w-full py-16 px-6 md:px-10 max-w-7xl mx-auto space-y-16">
        <section className="w-full text-center space-y-4 max-w-3xl mb-8">
          <h1 className="font-display-lg text-[2.5rem] leading-tight md:text-display-lg text-primary">Our Facilities</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">We provide a safe, well-equipped, and supportive environment for students to learn and thrive.</p>
        </section>

        <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden relative shadow-sm border border-outline-variant">
          <img 
            className="object-cover w-full h-full absolute inset-0" 
            src={images.facilityMain}
            alt="School Courtyard" 
          />
        </div>

        <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 h-full">
            <div className="w-14 h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shadow-sm">
              <School className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Classrooms</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                9 well-maintained classrooms providing a comfortable learning space. <br/>
                <span className="text-sm opacity-80 mt-1 block">९ सुसज्ज वर्गखोल्या</span>
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 h-full">
            <div className="w-14 h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shadow-sm">
              <Book className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Library</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Library equipped with 170+ books for students. <br/>
                <span className="text-sm opacity-80 mt-1 block">१७०+ पुस्तकांसह ग्रंथालय</span>
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 h-full">
            <div className="w-14 h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shadow-sm">
              <Monitor className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Computer Learning</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Computers available for digital learning and literacy. <br/>
                <span className="text-sm opacity-80 mt-1 block">संगणक शिक्षण सुविधा</span>
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 h-full">
            <div className="w-14 h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shadow-sm">
              <Droplets className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Drinking Water</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Functional tap water providing clean drinking water. <br/>
                <span className="text-sm opacity-80 mt-1 block">पिण्यासाठी शुद्ध नळाचे पाणी</span>
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 h-full">
            <div className="w-14 h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shadow-sm">
              <Baby className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Sanitation</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Separate well-maintained Boys/Girls Toilets (2 each). <br/>
                <span className="text-sm opacity-80 mt-1 block">मुले/मुलींसाठी स्वतंत्र स्वच्छतागृहे</span>
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 h-full">
            <div className="w-14 h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shadow-sm">
              <Swords className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Playground</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Spacious playground for physical education and recreation. <br/>
                <span className="text-sm opacity-80 mt-1 block">खेळाचे मैदान</span>
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 lg:items-center lg:space-y-0 lg:space-x-8 h-full lg:flex-row lg:col-span-2">
            <div className="w-14 h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shrink-0 shadow-sm">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Campus Security</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                The school premises are secured by a robust boundary wall ensuring safety for all students. <br/>
                <span className="text-sm opacity-80 mt-1 block">संरक्षक भिंत सुरक्षा</span>
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant hover:shadow-md transition-shadow flex flex-col space-y-4 h-full">
            <div className="w-14 h-14 bg-surface-container rounded-lg flex items-center justify-center text-primary shadow-sm">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Easy Accessibility</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                The school is easily approachable by all-weather roads, ensuring safe travel year-round. <br/>
                <span className="text-sm opacity-80 mt-1 block">शाळा सर्व हवामानात अनुकूल रस्त्यांनी जोडलेली आहे.</span>
              </p>
            </div>
          </div>
        </section>

        <section className="w-full mt-12 bg-surface-container-lowest p-8 md:p-12 rounded-2xl border border-outline-variant flex flex-col md:flex-row gap-10 items-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-secondary"></div>
          <div className="flex-1 space-y-5">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full font-label-md text-sm mb-2 shadow-sm border border-secondary/20">
              <Star className="w-4 h-4 fill-current" /> Special Feature
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary">Mid-Day Meal Program</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">Nutritious mid-day meals are provided and freshly prepared on premises to ensure health and well-being of our students.</p>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 text-[15px] opacity-90">शाळेच्या आवारातच पौष्टिक शालेय पोषण आहार तयार करून दिला जातो.</p>
          </div>
          <div className="w-full md:w-1/2 h-72 rounded-xl overflow-hidden relative shadow-sm border border-outline-variant">
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
