import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CheckCircle2 } from 'lucide-react';

export function Admission() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      student_first_name: formData.get('studentFirstName'),
      student_last_name: formData.get('studentLastName'),
      dob: formData.get('dob'),
      grade_applying: formData.get('grade'),
      parent_name: formData.get('parentName'),
      contact_number: formData.get('contactNumber'),
      address: formData.get('address'),
    };

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('admissions').insert([data]);
        if (error) throw error;
      } else {
        // Mock success delay
        await new Promise(r => setTimeout(r, 1000));
      }
      setSuccess(true);
      e.currentTarget.reset();
    } catch (err) {
      alert('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-20 flex-grow bg-background flex flex-col">
        <main className="flex-grow w-full max-w-3xl mx-auto px-6 md:px-10 py-16">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-10 md:p-16 shadow-sm text-center">
            <div className="w-20 h-20 bg-secondary-container text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="font-headline-lg text-[2rem] text-primary mb-4">Application Received!</h2>
            <p className="font-body-lg text-on-surface-variant mb-8 max-w-lg mx-auto leading-relaxed">
              Thank you for applying to ZPPS SRP CAMP. We will review your application and contact you shortly.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="bg-primary text-white px-8 py-3.5 rounded-lg font-label-md hover:bg-primary/90 transition-colors shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
            >
              Submit Another Application
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="pt-20 flex-grow bg-background flex flex-col">
      <main className="flex-grow w-full max-w-4xl mx-auto px-6 md:px-10 py-16">
        <div className="mb-12 text-center">
          <h1 className="font-display-lg text-[2.5rem] leading-tight md:text-display-lg text-primary mb-4">Admission Form</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Please fill out the form below to apply for admission for the academic year 2024-25.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-12 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-6">
              <h3 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-4">Student Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="studentFirstName">First Name *</label>
                  <input name="studentFirstName" className="w-full border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none bg-surface-bright transition-all" id="studentFirstName" required type="text" placeholder="Enter student's first name" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="studentLastName">Last Name *</label>
                  <input name="studentLastName" className="w-full border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none bg-surface-bright transition-all" id="studentLastName" required type="text" placeholder="Enter student's last name" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="dob">Date of Birth *</label>
                  <input name="dob" className="w-full border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none bg-surface-bright transition-all text-on-surface-variant" id="dob" required type="date" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="grade">Grade Applying For *</label>
                  <select name="grade" className="w-full border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none bg-surface-bright transition-all text-on-surface-variant cursor-pointer" id="grade" required>
                    <option value="">Select Grade</option>
                    {[1, 2, 3, 4, 5, 6, 7].map(g => (
                      <option key={g} value={g}>Grade {g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-headline-md text-headline-md text-primary border-b border-outline-variant pb-4">Parent/Guardian Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="parentName">Full Name *</label>
                  <input name="parentName" className="w-full border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none bg-surface-bright transition-all" id="parentName" required type="text" placeholder="Enter parent's full name" />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="contactNumber">Contact Number *</label>
                  <input name="contactNumber" className="w-full border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none bg-surface-bright transition-all" id="contactNumber" required type="tel" placeholder="Enter contact number" />
                </div>
              </div>
              
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="address">Residential Address *</label>
                <textarea name="address" className="w-full border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none bg-surface-bright transition-all resize-none" id="address" required rows={4} placeholder="Enter complete residential address"></textarea>
              </div>
            </div>

            <div className="pt-4">
              <button 
                className="w-full sm:w-auto bg-primary text-on-primary font-label-md text-label-md px-10 py-4 rounded-lg hover:bg-primary/90 transition-colors shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
