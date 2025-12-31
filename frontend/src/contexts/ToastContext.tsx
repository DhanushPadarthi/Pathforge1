'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  variant: 'success' | 'danger' | 'warning' | 'info';
  timestamp: Date;
}

interface ToastContextType {
  showToast: (title: string, message: string, variant?: 'success' | 'danger' | 'warning' | 'info') => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    title: string,
    message: string,
    variant: 'success' | 'danger' | 'warning' | 'info' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = {
      id,
      title,
      message,
      variant,
      timestamp: new Date(),
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const showSuccess = (message: string) => {
    showToast('Success', message, 'success');
  };

  const showError = (message: string) => {
    showToast('Error', message, 'danger');
  };

  const showWarning = (message: string) => {
    showToast('Warning', message, 'warning');
  };

  const showInfo = (message: string) => {
    showToast('Info', message, 'info');
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            onClose={() => removeToast(toast.id)}
            bg={toast.variant}
            autohide
            delay={5000}
          >
            <Toast.Header>
              <strong className="me-auto">{toast.title}</strong>
              <small>{new Date(toast.timestamp).toLocaleTimeString()}</small>
            </Toast.Header>
            <Toast.Body className={toast.variant === 'danger' || toast.variant === 'success' ? 'text-white' : ''}>
              {toast.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};
