import React, { useState } from 'react';
import logo from '../assets/echo-logo.svg';
import Button from './Button';
import { supabase } from '../supabaseClient';
import { useToast } from '../contexts/ToastProvider';
import './LoginPage.css';

interface LoginPageProps {
  onGoogleLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onGoogleLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isRegistering) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        showToast({ type: 'error', title: 'Errore Registrazione', message: error.message });
      } else {
        showToast({ type: 'success', title: 'Registrazione', message: 'Controlla la tua email per confermare l\'account!' });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        const message = error.message === 'Invalid login credentials' 
          ? 'Utente non trovato o password errata.' 
          : error.message;
        showToast({ type: 'error', title: 'Errore Login', message });
      }
    }
    setLoading(false);
  };

  return (
    <div className="lp-container">
      <div className="lp-content">
        <div className="lp-header">
          <img src={logo} className="lp-logo" alt="Echo logo" />
          <p className="lp-subtitle">Uno spazio sicuro per sfogarsi o ascoltare.</p>
        </div>

        <form className="lp-form" onSubmit={handleSubmit}>
          <div className="lp-field">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="lp-field">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="lp-submit-btn">
            {loading ? 'Caricamento...' : (isRegistering ? 'Registrati' : 'Accedi')}
          </Button>
        </form>

        <div className="lp-divider">
          <span>oppure</span>
        </div>

        <Button onClick={onGoogleLogin} className="lp-google-btn" variant="secondary">
          <span className="lp-google-icon">
            <svg viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </span>
          <span className="lp-btn-text">Continua con Google</span>
        </Button>

        <button className="lp-toggle-mode" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
        </button>

        <p className="lp-footer">Creando un account, accetti i nostri Termini di Servizio.</p>
      </div>
    </div>
  );
};

export default LoginPage;
