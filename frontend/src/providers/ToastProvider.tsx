import React, { createContext, useContext, useEffect } from 'react';
import toast, { Toaster, ToastPosition } from 'react-hot-toast';

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  loading: (message: string) => string;
  dismiss: (id?: string) => void;
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
  children: React.ReactNode;
  position?: ToastPosition;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right'
}) => {
  useEffect(() => {
    // Add a global click handler to dismiss toasts when clicked
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if the clicked element is inside a toast
      const toastElement = target.closest('[data-sonner-toast]') ||
                          target.closest('[data-testid="toast"]') ||
                          target.closest('[role="status"]') ||
                          target.closest('[role="alert"]') ||
                          target.closest('.toast') ||
                          target.closest('[class*="toast"]') ||
                          target.closest('[class*="sonner"]');
      
      if (toastElement) {
        event.preventDefault();
        event.stopPropagation();
        toast.dismiss();
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, []);
  const success = (message: string) => {
    return toast.success(message, {
      duration: 4000,
      position,
      style: {
        background: '#10b981',
        color: '#fff',
        fontWeight: '500',
        borderRadius: '0.5rem',
        padding: '12px 16px',
        fontSize: '14px',
        cursor: 'pointer',
        userSelect: 'none',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
    });
  };

  const error = (message: string) => {
    return toast.error(message, {
      duration: 2000,
      position,
      style: {
        background: '#ef4444',
        color: '#fff',
        fontWeight: '500',
        borderRadius: '0.5rem',
        padding: '12px 16px',
        fontSize: '14px',
        cursor: 'pointer',
        userSelect: 'none',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#ef4444',
      },
    });
  };

  const loading = (message: string) => {
    return toast.loading(message, {
      position,
      style: {
        background: '#3b82f6',
        color: '#fff',
        fontWeight: '500',
        borderRadius: '0.5rem',
        padding: '12px 16px',
        fontSize: '14px',
        cursor: 'pointer',
        userSelect: 'none',
      },
    });
  };

  const dismiss = (id?: string) => {
    toast.dismiss(id);
  };

  return (
    <ToastContext.Provider value={{ success, error, loading, dismiss }}>
      {children}
      <Toaster
        position={position}
        toastOptions={{
          style: {
            background: '#374151',
            color: '#fff',
            fontWeight: '500',
            borderRadius: '0.5rem',
            padding: '12px 16px',
            fontSize: '14px',
            cursor: 'pointer',
            userSelect: 'none',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
          loading: {
            iconTheme: {
              primary: '#fff',
              secondary: '#3b82f6',
            },
          },
        }}
        containerStyle={{
          cursor: 'pointer',
        }}
      />
    </ToastContext.Provider>
  );
};