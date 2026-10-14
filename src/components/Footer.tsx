import { School, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

interface FooterProps {
  navigate?: (route: string) => void;
}

export function Footer({ navigate }: FooterProps) {
  return (
    <footer className="bg-primary dark:bg-primary-container text-on-primary dark:text-on-primary-container w-full mt-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 px-6 md:px-10 py-12 md:py-16 w-full max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <School className="w-7 h-7" />
            </div>
            <span className="font-headline-md text-headline-md text-on-primary dark:text-on-primary-container tracking-tight">
              ZPPS SRP CAMP
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-primary dark:text-on-primary-container opacity-80 max-w-xs mt-4 leading-relaxed">
            Providing quality education and fostering holistic development in Solapur North since 1992.
          </p>
          <div className="mt-8 pt-8 border-t border-white/20 md:border-none md:pt-12">
            <p className="font-body-md text-body-md text-[13px] opacity-60">
              © 2024 ZPPS SRP CAMP, Solapur North. All Rights Reserved.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:pl-12">
          <h4 className="font-label-md text-[13px] uppercase tracking-[0.15em] text-white/50 mb-4 font-bold">
            Important Links
          </h4>
          <nav className="flex flex-col gap-4">
            <a href="#" className="font-label-md text-label-md text-on-primary dark:text-on-primary-container opacity-80 hover:opacity-100 hover:translate-x-1 transition-all w-fit focus:ring-2 focus:ring-secondary-fixed focus:ring-offset-2">
              RTE Portal
            </a>
            <a href="#" className="font-label-md text-label-md text-on-primary dark:text-on-primary-container opacity-80 hover:opacity-100 hover:translate-x-1 transition-all w-fit focus:ring-2 focus:ring-secondary-fixed focus:ring-offset-2">
              Shala Darpan
            </a>
            <button 
              onClick={() => navigate?.('admin')}
              className="font-label-md text-label-md text-on-primary dark:text-on-primary-container opacity-80 hover:opacity-100 hover:translate-x-1 transition-all w-fit focus:ring-2 focus:ring-secondary-fixed focus:ring-offset-2 cursor-pointer text-left"
            >
              Staff Login
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-label-md text-[13px] uppercase tracking-[0.15em] text-white/50 mb-4 font-bold">
            Contact
          </h4>
          
          {/* Address */}
          <div className="flex items-start gap-3 opacity-80 bg-white/5 p-4 rounded-xl border border-white/10">
            <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
            <p className="font-body-md text-body-md text-[14px] leading-relaxed">
              ZPPS SRP CAMP,<br />
              Solapur North Block,<br />
              Solapur District, Maharashtra 413008
            </p>
          </div>
          
          {/* Phone */}
          <a 
            href="tel:+912172345678"
            className="flex items-center gap-3 opacity-80 hover:opacity-100 bg-white/5 p-4 rounded-xl border border-white/10 transition-all hover:bg-white/10 cursor-pointer"
          >
            <Phone className="w-5 h-5 shrink-0" />
            <span className="font-body-md text-body-md text-[14px]">
              +91 217 234 5678
            </span>
          </a>
          
          {/* Email */}
          <a 
            href="mailto:zpps.srp.camp@education.gov.in"
            className="flex items-center gap-3 opacity-80 hover:opacity-100 bg-white/5 p-4 rounded-xl border border-white/10 transition-all hover:bg-white/10 cursor-pointer break-all"
          >
            <Mail className="w-5 h-5 shrink-0" />
            <span className="font-body-md text-body-md text-[14px]">
              zpps.srp.camp@education.gov.in
            </span>
          </a>
          
          {/* WhatsApp */}
          <a 
            href="https://wa.me/912172345678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 opacity-80 hover:opacity-100 bg-white/5 p-4 rounded-xl border border-white/10 transition-all hover:bg-white/10 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            <span className="font-body-md text-body-md text-[14px]">
              WhatsApp Us
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
