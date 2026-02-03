export interface Level {
  level_number: number;
  rank_name: string;
  min_xp_total: number;
  icon: string;
}

export const getRankData = (currentXp: number, levels: Level[]) => {
  if (!levels || levels.length === 0) {
    return { rank: "...", icon: "🌱", progress: 0, nextRank: "...", xpToNext: 0 };
  }

  // Trova il grado attuale (l'ultimo livello il cui minXp è <= xp attuale)
  const currentLevel = [...levels].reverse().find(l => currentXp >= l.min_xp_total) || levels[0];
  
  // Trova il prossimo grado
  const nextLevel = levels.find(l => l.min_xp_total > currentXp);

  let progress = 0;
  if (nextLevel) {
    const range = nextLevel.min_xp_total - currentLevel.min_xp_total;
    const gained = currentXp - currentLevel.min_xp_total;
    progress = (gained / range) * 100;
  } else {
    progress = 100; // Livello massimo raggiunto
  }

  return { 
    rank: currentLevel.rank_name, 
    icon: currentLevel.icon,
    progress: Math.min(progress, 100),
    nextRank: nextLevel ? nextLevel.rank_name : "Massimo",
    xpToNext: nextLevel ? nextLevel.min_xp_total - currentXp : 0
  };
};