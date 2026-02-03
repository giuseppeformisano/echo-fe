import React, { useState } from 'react';
import './SettingsPage.css';
import { supabase } from '../supabaseClient';
import { useToast } from '../contexts/ToastProvider';
import type { UserProfile } from '../useProfile';
import Button from './Button';

interface SettingsPageProps {
  profile: UserProfile | null;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ profile, onProfileUpdate, onBack }) => {
  const [username, setUsername] = useState(profile?.username || '');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', profile.id)
      .select()
      .single();

    setLoading(false);
    if (error) {
      showToast({ title: 'Errore', message: 'Impossibile aggiornare il profilo.' });
    } else {
      onProfileUpdate(data as UserProfile);
      showToast({ title: 'Successo', message: 'Profilo aggiornato correttamente.' });
    }
  };

  return (
    <div className="app-container">
      <div className="settings-outer-header">
        <button className="pd-stat-item settings-back-btn" onClick={onBack}>
          <span className="pd-stat-icon">⬅️</span>
          <div className="pd-stat-info">
            <span className="pd-label">Indietro</span>
            <span className="pd-stat-value">Dashboard</span>
          </div>
        </button>
      </div>

      <div className="settings-card">
        <header className="settings-header">
          <h1 className="settings-title">Impostazioni Profilo</h1>
        </header>

        <div className="settings-content">
          <div className="settings-field">
            <label htmlFor="username">Username</label>
            <input 
              id="username"
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Inserisci il tuo username"
            />
            <p className="settings-help">Questo è il nome che gli altri utenti vedranno durante le conversazioni.</p>
          </div>
          
          <Button onClick={handleSave} disabled={loading} className="settings-save-btn">
            {loading ? 'Salvataggio...' : 'Salva Modifiche'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;