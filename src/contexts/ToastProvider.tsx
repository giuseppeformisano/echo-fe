import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Toast } from '../components/ui/Toast';

type ToastType = 'info' | 'success' | 'error';

interface ToastInfo {
  id: number;
  type?: ToastType;
  title: string;
  message: string;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastInfo, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showToast = useCallback((toast: Omit<ToastInfo, 'id'>) => {
    setToasts((prev) => [...prev, { ...toast, id: Date.now() }]);
  }, []);

  const hideToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toasts-wrapper">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

