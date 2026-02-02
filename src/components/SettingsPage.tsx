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
      <div className="settings-card">
      <header className="settings-header">
        <Button variant="secondary" onClick={onBack}>← Indietro</Button>
        <h1>Impostazioni Profilo</h1>
      </header>
      <div className="settings-content">
        <div className="settings-field">
          <label>Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Inserisci il tuo username"
          />
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Salvataggio...' : 'Salva Modifiche'}
        </Button>
      </div>
      </div>
    </div>
  );
};

export default SettingsPage;