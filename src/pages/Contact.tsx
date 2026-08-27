import { MapPin, Phone, Mail, ArrowRight, Map, School } from 'lucide-react';
import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ContactProps {
  navigate: (route: string) => void;
}

export function Contact({ navigate }: ContactProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('contact_inquiries').insert([data]);
        if (error) throw error;
      } else {
        // Mock success delay
        await new Promise(r => setTimeout(r, 1000));
      }
      alert('Thank you for your message. We will get back to you soon.');
      e.currentTarget.reset();
    } catch (err) {
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 flex-grow bg-background flex flex-col">
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-10 py-16">
        {/* Page Header */}
        <div className="mb-12 md:mb-16">
          <h1 className="font-display-lg text-[2.5rem] leading-tight md:text-display-lg text-primary mb-4">Contact Us</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            We welcome inquiries from parents, community members, and prospective students. Please use the information below to reach out to our administration.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="md:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 lg:p-10 hover:shadow-md transition-shadow">
            <h2 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-6 mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="name">Full Name</label>
                  <input 
                    className="w-full border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all bg-surface-bright" 
                    id="name" name="name" placeholder="Enter your full name" type="text" required
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="email">Email Address</label>
                  <input 
                    className="w-full border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all bg-surface-bright" 
                    id="email" name="email" placeholder="Enter your email" type="email" required
                  />
                </div>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="subject">Subject</label>
                <select 
                  className="w-full border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all bg-surface-bright text-on-surface-variant cursor-pointer" 
                  id="subject" name="subject"
                >
                  <option>General Inquiry</option>
                  <option>Admission for Grade 1-7</option>
                  <option>Feedback</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="message">Message</label>
                <textarea 
                  className="w-full border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all bg-surface-bright resize-none" 
                  id="message" name="message" placeholder="How can we help you?" rows={5} required
                />
              </div>
              <button 
                className="bg-primary text-on-primary font-label-md text-label-md px-8 py-3.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>

          {/* Side Information Column */}
          <div className="md:col-span-5 flex flex-col gap-8">
            {/* Contact Details Card */}
            <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-8 hover:shadow-md transition-shadow">
              <h3 className="font-headline-md text-headline-md text-primary mb-8">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="text-secondary bg-secondary-fixed p-3 rounded-full shadow-sm">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface mb-1">School Address</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      ZPPS SRP CAMP<br/>
                      SRP Camp, Solapur North<br/>
                      Solapur District, Maharashtra 413008
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 border-t border-outline-variant pt-6">
                  <div className="text-secondary bg-secondary-fixed p-3 rounded-full shadow-sm">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface mb-1">Phone</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      +91 98765 43210
                    </p>
                    <p className="font-caption text-caption text-outline mt-1 block">Mon-Fri, 9:00 AM - 4:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 border-t border-outline-variant pt-6">
                  <div className="text-secondary bg-secondary-fixed p-3 rounded-full shadow-sm">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface mb-1">Email</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      admin@zppssrrcamp.edu.in
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admission Highlight Card */}
            <div className="bg-secondary text-on-secondary rounded-2xl p-8 hover:shadow-lg transition-shadow relative overflow-hidden flex flex-col items-start">
              <div className="absolute -right-4 -top-4 opacity-10">
                <School className="w-40 h-40" />
              </div>
              <div className="relative z-10 flex flex-col items-start">
                <span className="inline-block bg-white/20 backdrop-blur text-white font-caption text-caption px-4 py-1.5 rounded-full mb-4 shadow-sm border border-white/10">Notice</span>
                <h3 className="font-headline-md text-headline-md text-white mb-3">Admissions Open</h3>
                <p className="font-body-md text-body-md text-white/90 mb-6 leading-relaxed">
                  We are currently accepting admission inquiries for Grades 1 through 7 for the upcoming academic year.
                </p>
                <button 
                  onClick={() => navigate('admission')}
                  className="inline-flex items-center gap-2 font-label-md text-label-md bg-white text-secondary px-6 py-3 rounded-lg hover:bg-surface-bright transition-colors cursor-pointer shadow-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-secondary"
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Full Width Map Section */}
          <div className="md:col-span-12 mt-6">
            <div className="border border-outline-variant rounded-2xl overflow-hidden h-[400px] relative bg-surface-container-low shadow-sm">
              <div className="absolute inset-0 flex items-center justify-center flex-col text-outline z-10">
                <div className="bg-surface-container-lowest/80 backdrop-blur-sm p-6 rounded-2xl flex flex-col items-center border border-outline-variant/50 shadow-sm">
                  <Map className="w-12 h-12 mb-3 text-secondary" />
                  <span className="font-label-md text-label-md text-primary text-lg">Interactive Map Area</span>
                  <span className="font-caption text-on-surface-variant mt-1">Location loading...</span>
                </div>
              </div>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPMussjjLZ_CuUAeJWHrlg0fX2OhdFasF_kb0tuagz5w1sjO3Vd6T6nLbz9Sg14tvwJmfiWBJzaQEKxvaPVn1YMIREsdhQKulIBtWjr05BNzsZUAOkuGkVGEFZTbeXivT0vgaJrLZteVKPzCGfLp189QUO7oAKOSZwMb3mr7sYupXs4wPAo8eoK5zGHQmh1CzgbzRel2nEhrOS_yVYESbgCq9E8KuC9-zkQf8RQLddsfP75mBbAUwT"
                alt="Map Placeholder" 
                className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply pointer-events-none" 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
