import React from "react";
import ProfileDashboard from "./components/ProfileDashboard";
import type { Level } from "../../utils/xpUtils";
import SearchingOverlay from "./components/SearchingOverlay";

interface DashboardViewProps {
  name: string;
  stats: { credits: number; xp: number; rank: string };
  levels: Level[];
  onSfogati: () => void;
  onAscolta: () => void;
  status: string;
  leaveQueue: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  name,
  stats,
  levels,
  onSfogati,
  onAscolta,
  status,
  leaveQueue,
}) => {
  return (
    <div
      className={`app-container ${status === "searching" ? "is-searching" : ""}`}
    >
      <ProfileDashboard
        name={name}
        stats={stats}
        levels={levels}
        onSfogati={onSfogati}
        onAscolta={onAscolta}
      />

      {status === "searching" && <SearchingOverlay onCancel={leaveQueue} />}
    </div>
  );
};

export default DashboardView;