import { useCallback, useEffect } from 'react';
import { useToast } from '../contexts/ToastProvider';

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
  const { showToast } = useToast();

  const addError = useCallback(
    (message: string) => {
      showToast({
        type: 'error',
        title: 'Error',
        message,
      });
    },
    [showToast]
  );

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
}
