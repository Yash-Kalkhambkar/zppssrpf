import DOMPurify from 'dompurify';

/**
 * Sanitization utilities using DOMPurify
 * Prevents XSS attacks by cleaning user input
 */

/**
 * Sanitize HTML content
 * Removes potentially dangerous HTML/JS while preserving safe formatting
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize plain text
 * Strips all HTML tags, returning only text content
 */
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize user input for database storage
 * Removes HTML and trims whitespace
 */
export function sanitizeInput(input: string): string {
  const cleaned = sanitizeText(input);
  return cleaned.trim();
}

/**
 * Sanitize an object's string properties
 * Useful for sanitizing form data before processing
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = { ...obj };
  
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]) as any;
    }
  }
  
  return sanitized;
}
