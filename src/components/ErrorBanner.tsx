import './ErrorBanner.css';
import type { ErrorMessage } from '../hooks/useErrorHandler';

interface ErrorBannerProps {
  errors: ErrorMessage[];
  onRemoveError: (id: string) => void;
}

export function ErrorBanner({ errors, onRemoveError }: ErrorBannerProps) {
  if (errors.length === 0) return null;

  return (
    <div className="error-banner-container">
      {errors.map((error) => (
        <div key={error.id} className="error-banner">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error.message}</span>
          </div>
          <button
            className="error-close"
            onClick={() => onRemoveError(error.id)}
            aria-label="Chiudi errore"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
