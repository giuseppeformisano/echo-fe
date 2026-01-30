import { useCallback, useEffect, useState } from 'react';

export interface ErrorMessage {
  id: string;
  message: string;
  timestamp: number;
}

function formatErrorMessage(arg: any): string {
  if (typeof arg === 'string') return arg;
  if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
  if (arg === null) return 'null';
  if (arg === undefined) return 'undefined';
  if (typeof arg === 'object') {
    try {
      return JSON.stringify(arg);
    } catch {
      return String(arg);
    }
  }
  return String(arg);
}

export function useErrorHandler() {
  const [errors, setErrors] = useState<ErrorMessage[]>([]);

  const addError = useCallback((message: string) => {
    const id = Date.now().toString() + Math.random();
    const newError: ErrorMessage = {
      id,
      message,
      timestamp: Date.now(),
    };

    setErrors((prevErrors) => [newError, ...prevErrors]);

    // Auto-remove dopo 8 secondi
    setTimeout(() => {
      setErrors((prevErrors) =>
        prevErrors.filter((error) => error.id !== id)
      );
    }, 8000);
  }, []);

  const removeError = useCallback((id: string) => {
    setErrors((prevErrors) => prevErrors.filter((error) => error.id !== id));
  }, []);

  useEffect(() => {
    // Intercetta console.error
    const originalError = console.error;
    console.error = (...args: any[]) => {
      originalError(...args);
      const message = args.map(formatErrorMessage).join(' ');
      if (message) addError(message);
    };

    // Intercetta console.warn
    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
      originalWarn(...args);
      const message = args.map(formatErrorMessage).join(' ');
      if (message) addError(message);
    };

    // Intercetta errori non gestiti
    const handleError = (event: ErrorEvent) => {
      addError(`${event.message} (${event.filename}:${event.lineno})`);
    };

    // Intercetta unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      const message = formatErrorMessage(event.reason);
      addError(`Unhandled rejection: ${message}`);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [addError]);

  return { errors, addError, removeError };
}
