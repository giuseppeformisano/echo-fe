import React from "react";
import "./ProfileDashboard.css";
import { getRankData, type Level } from "../../../utils/xpUtils";
import { useProfile } from "../../../hooks/useProfile";
import { useAuth } from "../../../hooks/useAuth";

interface Stats {
  credits: number;
  xp: number;
  rank: string;
}

interface ProfileDashboardProps {
  name?: string;
  stats?: Stats;
  levels: Level[];
  onSfogati?: () => void;
  onAscolta?: () => void;
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({
  name = "Marco",
  stats = { credits: 3, xp: 150, rank: "Novizio" },
  levels,
  onSfogati,
  onAscolta,
}) => {
  const { session } = useAuth();
  const {
    userProfile
  } = useProfile(session);

  const rankData = getRankData(userProfile?.xp || 0, levels);
  
  const getFeedbackClass = (rating: number) => {
  if (rating === 0) return 'rating-none';
  if (rating < 2.5) return 'rating-low';      // 1.0 - 2.4
  if (rating < 3.5) return 'rating-fair';     // 2.5 - 3.4
  if (rating < 4.2) return 'rating-good';     // 3.5 - 4.1
  if (rating < 4.8) return 'rating-great';    // 4.2 - 4.7
  return 'rating-excellent';                  // 4.8 - 5.0
};

const getFeedbackIcon = (rating: number) => {
  if (rating === 0) return '🌱';   // Appena nato (nessun feedback)
  if (rating < 2.5) return '☁️';    // Nebbia (bisogna migliorare l'ascolto)
  if (rating < 3.5) return '🍵';    // Accogliente (ascolto base)
  if (rating < 4.2) return '🌿';    // In crescita (buon ascoltatore)
  if (rating < 4.8) return '✨';    // Brillante (ottimo impatto)
  return '💎';                      // Prezioso (ascoltatore d'eccellenza)
};

  const currentRating = userProfile?.rating_avg || 0;
  return (
    <div className="pd-container">
      <div className="pd-header">
        <div className="pd-stats">
          <div
            className={`pd-stat-item pd-rank rank-${rankData.rank.toLowerCase()}`}
          >
            <span className="pd-stat-icon">{rankData.icon}</span>
            <div className="pd-stat-info">
              <span className="pd-label">Grado</span>
              <span className="pd-stat-value">{rankData.rank}</span>
              <div
                className="pd-xp-progress"
                title={`${stats.xp} XP totali - ${rankData.xpToNext} XP al prossimo livello`}
              >
                <div
                  className="pd-xp-fill"
                  style={{ width: `${rankData.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="pd-stat-item pd-credits">
            <span className="pd-stat-icon pd-energy">⚡</span>
            <div className="pd-stat-info">
              <span className="pd-label">Crediti</span>
              <span className="pd-stat-value">{stats.credits}</span>
            </div>
          </div>
          <div className={`pd-stat-item pd-feedback ${getFeedbackClass(currentRating)}`}>
            <span className="pd-stat-icon">{getFeedbackIcon(currentRating)}</span>
            <div className="pd-stat-info">
              <span className="pd-label">Feedback</span>
              <span className="pd-stat-value">
                {currentRating > 0 ? currentRating.toFixed(1) : '—'}/5
              </span>
              <span className="pd-stat-reviews">
                {userProfile?.rating_count || 0} {userProfile?.rating_count === 1 ? 'recensione' : 'recensioni'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pd-welcome">
        <h1 className="pd-title">Ciao, {name}</h1>
        <p className="pd-sub">Come vuoi trascorrere il tuo tempo ora?</p>
      </div>

      <div className="pd-cards">
        <button
          className="pd-card"
          onClick={onSfogati}
          disabled={stats.credits === 0}
          title={stats.credits === 0 ? "Crediti insufficienti" : ""}
        >
          <div className="pd-emoji">🌿</div>
          <div className="pd-card-content">
            <h2 className="pd-card-title">Ho un peso</h2>
            <p className="pd-card-desc">
              Sfogati con un ascoltatore. Costa 1 credito.
            </p>
            {stats.credits === 0 && (
              <p className="pd-card-warning">⚠️ Crediti esauriti</p>
            )}
          </div>
        </button>

        <button className="pd-card" onClick={onAscolta}>
          <div className="pd-emoji">👂</div>
          <div className="pd-card-content">
            <h2 className="pd-card-title">Voglio ascoltare</h2>
            <p className="pd-card-desc">
              Guadagna XP e crediti. Aiuta qualcuno ora.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProfileDashboard;