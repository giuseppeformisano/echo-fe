import React from 'react';
import './ProfileDashboard.css';
import logo from '../assets/echo-logo.svg';
import { useToast } from '../contexts/ToastProvider';

interface Stats {
  credits: number;
  xp: number;
  rank: string;
}

interface ProfileDashboardProps {
  name?: string;
  stats?: Stats;
  onSfogati?: () => void;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
  name = 'Marco',
  stats = { credits: 3, xp: 150, rank: 'Novizio' },
  onSfogati,
}) => {
  const { showToast } = useToast();

  const handleAscoltaClick = () => {
    showToast({
      title: 'Funzione in Arrivo',
      message: 'La modalità ascoltatore non è ancora disponibile.',
    });
  };

  return (
    <div className="pd-container">
      <div className="pd-header">
        <img src={logo} className="pd-logo" alt="Echo logo" />
        <div className="pd-stats">
          <div className="pd-stat-item pd-rank">
            <span className="pd-stat-icon">🛡️</span>
            <div className="pd-stat-info">
              <span className="pd-label">Grado</span>
              <span className="pd-stat-value">{stats.rank}</span>
            </div>
          </div>
          <div className="pd-stat-item pd-credits">
            <span className="pd-stat-icon pd-energy">⚡</span>
            <div className="pd-stat-info">
              <span className="pd-label">Crediti</span>
              <span className="pd-stat-value">{stats.credits}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pd-welcome">
        <h1 className="pd-title">Ciao, {name}</h1>
        <p className="pd-sub">Come vuoi trascorrere il tuo tempo ora?</p>
      </div>

      <div className="pd-cards">
        <button className="pd-card pd-card-sfogati" onClick={onSfogati}>
          <div className="pd-emoji">🌿</div>
          <h2 className="pd-card-title">Ho un peso</h2>
          <p className="pd-card-desc">Sfogati con un ascoltatore. Costa 1 credito.</p>
        </button>

        <button className="pd-card pd-card-ascolta" onClick={handleAscoltaClick}>
          <div className="pd-emoji">👂</div>
          <h2 className="pd-card-title">Voglio ascoltare</h2>
          <p className="pd-card-desc">Guadagna XP e crediti. Aiuta qualcuno ora.</p>
        </button>
      </div>
    </div>
  );
};

export default ProfileDashboard;
