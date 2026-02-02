import React from 'react';
import ProfileDashboard from './ProfileDashboard';
import SearchingOverlay from './SearchingOverlay';

interface DashboardViewProps {
  name: string;
  stats: { credits: number; xp: number; rank: string };
  onSfogati: () => void;
  status: string;
  leaveQueue: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  name,
  stats,
  onSfogati,
  status,
  leaveQueue,
}) => {
  return (
    <div className={`app-container ${status === 'searching' ? 'is-searching' : ''}`}>
      <ProfileDashboard
        name={name}
        stats={stats}
        onSfogati={onSfogati}
      />

      {status === 'searching' && <SearchingOverlay onCancel={leaveQueue} />}
    </div>
  );
};

export default DashboardView;