import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

interface FormData {
  studentFirstName: string;
  studentLastName: string;
  dob: string;
  grade: string;
  parentName: string;
  contactNumber: string;
  address: string;
}

export function Admission() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    studentFirstName: '',
    studentLastName: '',
    dob: '',
    grade: '',
    parentName: '',
    contactNumber: '',
    address: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const totalSteps = 4;

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {};

    if (step === 1) {
      if (!formData.studentFirstName.trim()) newErrors.studentFirstName = 'Required';
      if (!formData.studentLastName.trim()) newErrors.studentLastName = 'Required';
      if (!formData.dob) newErrors.dob = 'Required';
      if (!formData.grade) newErrors.grade = 'Required';
    } else if (step === 2) {
      if (!formData.parentName.trim()) newErrors.parentName = 'Required';
      if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Required';
      else if (!/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ''))) {
        newErrors.contactNumber = 'Invalid phone number';
      }
    } else if (step === 3) {
      if (!formData.address.trim()) newErrors.address = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    const data = {
      student_first_name: formData.studentFirstName,
      student_last_name: formData.studentLastName,
      dob: formData.dob,
      grade_applying: formData.grade,
      parent_name: formData.parentName,
      contact_number: formData.contactNumber,
      address: formData.address,
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
      setCurrentStep(totalSteps);
    } catch (err) {
      alert('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setCurrentStep(1);
    setFormData({
      studentFirstName: '',
      studentLastName: '',
      dob: '',
      grade: '',
      parentName: '',
      contactNumber: '',
      address: '',
    });
    setErrors({});
  };

  if (success) {
    return (
      <div className="pt-20 flex-grow bg-background flex flex-col">
        <main className="flex-grow w-full max-w-3xl mx-auto px-4 md:px-10 py-8 md:py-16">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-16 shadow-sm text-center">
            <div className="w-20 h-20 bg-secondary-container text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-secondary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-headline-lg text-primary mb-4">Application Received!</h2>
            <p className="font-body-lg text-on-surface-variant mb-6 max-w-lg mx-auto leading-relaxed">
              Thank you for applying to ZPPS SRP CAMP. We will review your application and contact you shortly.
            </p>
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 mb-8 text-left max-w-lg mx-auto">
              <h3 className="font-headline-md text-lg text-primary mb-3">Next Steps:</h3>
              <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
                <li className="flex items-start gap-2">
                  <span className="text-secondary-container">•</span>
                  <span>We'll verify your application within 2-3 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary-container">•</span>
                  <span>You'll receive a confirmation call on {formData.contactNumber}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary-container">•</span>
                  <span>Visit the school with required documents after confirmation</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={resetForm}
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
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 md:px-10 py-8 md:py-16">
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-display-lg text-primary mb-4 leading-tight">Admission Form</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Please fill out the form below to apply for admission for the academic year 2024-25.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all ${
                    step < currentStep ? 'bg-secondary text-white' :
                    step === currentStep ? 'bg-primary text-white' :
                    'bg-surface-container text-on-surface-variant border-2 border-outline-variant'
                  }`}>
                    {step < currentStep ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : step}
                  </div>
                  <span className={`text-xs md:text-sm font-label-md mt-2 ${
                    step <= currentStep ? 'text-primary' : 'text-on-surface-variant'
                  }`}>
                    {step === 1 ? 'Student' : step === 2 ? 'Parent' : step === 3 ? 'Address' : 'Review'}
                  </span>
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    step < currentStep ? 'bg-secondary' : 'bg-outline-variant'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-12 shadow-sm">
          {/* Step 1: Student Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-headline-md text-primary border-b border-outline-variant pb-4">Student Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="studentFirstName">First Name *</label>
                  <input
                    value={formData.studentFirstName}
                    onChange={(e) => updateField('studentFirstName', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-4 text-lg font-body-md focus:ring-2 outline-none bg-surface-bright transition-all ${
                      errors.studentFirstName ? 'border-error focus:border-error focus:ring-error/50' : 'border-outline-variant focus:border-primary focus:ring-primary/50'
                    }`}
                    id="studentFirstName"
                    type="text"
                    placeholder="Enter student's first name"
                  />
                  {errors.studentFirstName && <p className="text-error text-sm mt-1">{errors.studentFirstName}</p>}
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="studentLastName">Last Name *</label>
                  <input
                    value={formData.studentLastName}
                    onChange={(e) => updateField('studentLastName', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-4 text-lg font-body-md focus:ring-2 outline-none bg-surface-bright transition-all ${
                      errors.studentLastName ? 'border-error focus:border-error focus:ring-error/50' : 'border-outline-variant focus:border-primary focus:ring-primary/50'
                    }`}
                    id="studentLastName"
                    type="text"
                    placeholder="Enter student's last name"
                  />
                  {errors.studentLastName && <p className="text-error text-sm mt-1">{errors.studentLastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="dob">Date of Birth *</label>
                  <input
                    value={formData.dob}
                    onChange={(e) => updateField('dob', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-4 text-lg font-body-md focus:ring-2 outline-none bg-surface-bright transition-all ${
                      errors.dob ? 'border-error focus:border-error focus:ring-error/50' : 'border-outline-variant focus:border-primary focus:ring-primary/50'
                    }`}
                    id="dob"
                    type="date"
                  />
                  {errors.dob && <p className="text-error text-sm mt-1">{errors.dob}</p>}
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="grade">Grade Applying For *</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => updateField('grade', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-4 text-lg font-body-md focus:ring-2 outline-none bg-surface-bright transition-all cursor-pointer ${
                      errors.grade ? 'border-error focus:border-error focus:ring-error/50' : 'border-outline-variant focus:border-primary focus:ring-primary/50'
                    }`}
                    id="grade"
                  >
                    <option value="">Select Grade</option>
                    {[1, 2, 3, 4, 5, 6, 7].map(g => (
                      <option key={g} value={g}>Grade {g}</option>
                    ))}
                  </select>
                  {errors.grade && <p className="text-error text-sm mt-1">{errors.grade}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Parent Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-headline-md text-primary border-b border-outline-variant pb-4">Parent/Guardian Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="parentName">Full Name *</label>
                  <input
                    value={formData.parentName}
                    onChange={(e) => updateField('parentName', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-4 text-lg font-body-md focus:ring-2 outline-none bg-surface-bright transition-all ${
                      errors.parentName ? 'border-error focus:border-error focus:ring-error/50' : 'border-outline-variant focus:border-primary focus:ring-primary/50'
                    }`}
                    id="parentName"
                    type="text"
                    placeholder="Enter parent's full name"
                  />
                  {errors.parentName && <p className="text-error text-sm mt-1">{errors.parentName}</p>}
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="contactNumber">Contact Number *</label>
                  <input
                    value={formData.contactNumber}
                    onChange={(e) => updateField('contactNumber', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-4 text-lg font-body-md focus:ring-2 outline-none bg-surface-bright transition-all ${
                      errors.contactNumber ? 'border-error focus:border-error focus:ring-error/50' : 'border-outline-variant focus:border-primary focus:ring-primary/50'
                    }`}
                    id="contactNumber"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                  />
                  {errors.contactNumber && <p className="text-error text-sm mt-1">{errors.contactNumber}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-headline-md text-primary border-b border-outline-variant pb-4">Residential Address</h3>
              
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="address">Complete Address *</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className={`w-full border rounded-lg px-4 py-4 text-lg font-body-md focus:ring-2 outline-none bg-surface-bright transition-all resize-none ${
                    errors.address ? 'border-error focus:border-error focus:ring-error/50' : 'border-outline-variant focus:border-primary focus:ring-primary/50'
                  }`}
                  id="address"
                  rows={6}
                  placeholder="Enter house number, street, area, landmark, city, and pincode"
                ></textarea>
                {errors.address && <p className="text-error text-sm mt-1">{errors.address}</p>}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-headline-md text-primary border-b border-outline-variant pb-4">Review & Submit</h3>
              
              <div className="space-y-6 bg-surface-container-low rounded-xl p-6">
                <div>
                  <h4 className="font-label-md text-sm text-on-surface-variant mb-2">Student Details</h4>
                  <p className="font-body-md text-on-surface">{formData.studentFirstName} {formData.studentLastName}</p>
                  <p className="font-body-md text-on-surface-variant text-sm">DOB: {formData.dob} • Grade: {formData.grade}</p>
                </div>

                <div className="border-t border-outline-variant pt-4">
                  <h4 className="font-label-md text-sm text-on-surface-variant mb-2">Parent/Guardian</h4>
                  <p className="font-body-md text-on-surface">{formData.parentName}</p>
                  <p className="font-body-md text-on-surface-variant text-sm">{formData.contactNumber}</p>
                </div>

                <div className="border-t border-outline-variant pt-4">
                  <h4 className="font-label-md text-sm text-on-surface-variant mb-2">Address</h4>
                  <p className="font-body-md text-on-surface whitespace-pre-line">{formData.address}</p>
                </div>
              </div>

              <p className="text-sm text-on-surface-variant italic">
                Please review all information carefully before submitting. You can use the Previous button to make changes.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-outline-variant">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="flex items-center gap-2 bg-surface-container text-primary px-6 py-3.5 rounded-lg font-label-md hover:bg-surface-container-high transition-colors shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer border border-outline-variant"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>
            )}
            
            <div className="flex-1"></div>

            {currentStep < 4 && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-lg font-label-md hover:bg-primary/90 transition-colors shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer ml-auto"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {currentStep === 4 && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-secondary text-white px-8 py-3.5 rounded-lg font-label-md hover:bg-secondary/90 transition-colors shadow-sm focus:ring-2 focus:ring-secondary focus:ring-offset-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed ml-auto"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
