import React from "react";
import "./ProfileDashboard.css";
import { getRankData, type Level } from "../../../utils/xpUtils";

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
  const rankData = getRankData(stats.xp, levels);

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