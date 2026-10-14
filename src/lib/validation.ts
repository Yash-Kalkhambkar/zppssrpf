import { z } from 'zod';

/**
 * Validation schemas for form inputs using Zod
 * Provides type-safe input validation and sanitization
 */

// Phone number validation (Indian format)
const phoneRegex = /^[+]?91[-\s]?[6-9]\d{9}$/;

// Email validation
const emailSchema = z.string()
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(100, 'Email must be less than 100 characters');

// Name validation (allows letters, spaces, and common name characters)
const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\u0900-\u097F\s.'-]+$/, 'Name contains invalid characters');

// Phone validation
const phoneSchema = z.string()
  .regex(phoneRegex, 'Invalid phone number format. Use +91-XXXXXXXXXX or 91XXXXXXXXXX');

// Address validation
const addressSchema = z.string()
  .min(10, 'Address must be at least 10 characters')
  .max(500, 'Address must be less than 500 characters');

// Grade validation
const gradeSchema = z.enum(['1', '2', '3', '4', '5', '6', '7'], {
  errorMap: () => ({ message: 'Please select a valid grade (1-7)' })
});

// Date validation (for date of birth)
const dateSchema = z.string()
  .refine((date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }, 'Invalid date')
  .refine((date) => {
    const d = new Date(date);
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 15); // Max 15 years old
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 4); // Min 4 years old
    return d >= maxDate && d <= minDate;
  }, 'Student must be between 4 and 15 years old');

/**
 * Admission form validation schema
 */
export const admissionSchema = z.object({
  studentFirstName: nameSchema,
  studentLastName: nameSchema,
  dateOfBirth: dateSchema,
  gradeApplying: gradeSchema,
  parentName: nameSchema,
  contactNumber: phoneSchema,
  address: addressSchema,
});

export type AdmissionFormData = z.infer<typeof admissionSchema>;

/**
 * Contact form validation schema
 */
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.enum(['general', 'admission', 'feedback', 'other'], {
    errorMap: () => ({ message: 'Please select a valid subject' })
  }),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Helper function to validate form data
 * Returns either the validated data or validation errors
 */
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
}
