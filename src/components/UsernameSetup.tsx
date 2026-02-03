import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useToast } from '../contexts/ToastProvider';
import Button from './Button';
import './UsernameSetup.css';

interface UsernameSetupProps {
  onUsernameSet: (username: string) => void;
}

const UsernameSetup: React.FC<UsernameSetupProps> = ({ onUsernameSet }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      showToast({ type: 'error', title: 'Attenzione', message: 'Inserisci un username valido.' });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Utente non autenticato');

      // Controllo se l'username esiste già
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', trimmedUsername)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingUser) {
        showToast({ type: 'error', title: 'Non disponibile', message: 'Questo username è già in uso. Scegline un altro.' });
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ username: trimmedUsername })
        .eq('id', user.id);

      if (error) throw error;

      showToast({ type: 'success', title: 'Benvenuto!', message: 'Username impostato con successo.' });
      onUsernameSet(trimmedUsername);
    } catch (error: any) {
      const msg = error.code === '23505' ? 'Questo username è già in uso.' : (error.message || 'Impossibile impostare l\'username.');
      showToast({ type: 'error', title: 'Errore', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="us-container">
      <div className="us-card">
        <h1 className="us-title">Benvenuto in <span className="us-echo-pulse">ECHO</span></h1>
        <p className="us-subtitle">Scegli un username per continuare.</p>
        
        <form onSubmit={handleSubmit} className="us-form">
          <div className="us-field">
            <input
              type="text"
              placeholder="Il tuo username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoFocus
              maxLength={20}
            />
          </div>
          <Button type="submit" disabled={loading} className="us-submit-btn">
            {loading ? 'Salvataggio...' : 'Inizia'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UsernameSetup;