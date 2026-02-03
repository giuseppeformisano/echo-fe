import React from 'react';
import ProfileDashboard from './ProfileDashboard';
import SearchingOverlay from './SearchingOverlay';
import type { Level } from './xpUtils';

interface DashboardViewProps {
  name: string;
  stats: { credits: number; xp: number; rank: string };
  levels: Level[];
  onSfogati: () => void;
  status: string;
  leaveQueue: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  name,
  stats,
  levels,
  onSfogati,
  status,
  leaveQueue,
}) => {
  return (
    <div className={`app-container ${status === 'searching' ? 'is-searching' : ''}`}>
      <ProfileDashboard
        name={name}
        stats={stats}
        levels={levels}
        onSfogati={onSfogati}
      />

      {status === 'searching' && <SearchingOverlay onCancel={leaveQueue} />}
    </div>
  );
};

export default DashboardView;