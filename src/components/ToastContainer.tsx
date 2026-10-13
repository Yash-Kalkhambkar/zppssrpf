import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { Toast } from '../hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg p-4 min-w-[300px] max-w-md flex items-start gap-3 animate-in slide-in-from-right-full duration-300"
          role={toast.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {toast.type === 'success' && (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          )}
          
          <p className="flex-grow font-body-md text-on-surface">
            {toast.message}
          </p>
          
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-on-surface-variant hover:text-on-surface transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
