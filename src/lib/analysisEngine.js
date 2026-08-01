export function calculateWeaknessScore(player) {
  let score = 0;
  const factors = [];

  if (!player.wta_ranking || player.wta_ranking === 0) {
    score += 30;
    factors.push({ criterion: "Sin ranking WTA", points: 30 });
  } else if (player.wta_ranking > 500) {
    score += 15;
    factors.push({ criterion: `Ranking WTA #${player.wta_ranking} (>500)`, points: 15 });
  } else if (player.wta_ranking > 300) {
    score += 8;
    factors.push({ criterion: `Ranking WTA #${player.wta_ranking} (>300)`, points: 8 });
  }

  if (!player.junior_ranking || player.junior_ranking === 0) {
    score += 15;
    factors.push({ criterion: "Sin ranking junior", points: 15 });
  } else if (player.junior_ranking > 1000) {
    score += 20;
    factors.push({ criterion: `Ranking junior #${player.junior_ranking} (>1000)`, points: 20 });
  } else if (player.junior_ranking > 500) {
    score += 10;
    factors.push({ criterion: `Ranking junior #${player.junior_ranking} (>500)`, points: 10 });
  }

  const total = (player.total_wins || 0) + (player.total_losses || 0);
  if (total > 0) {
    const ratio = player.total_wins / total;
    if (ratio < 0.25) {
      score += 25;
      factors.push({ criterion: `Ratio V/D ${(ratio * 100).toFixed(0)}% muy desfavorable`, points: 25 });
    } else if (ratio < 0.4) {
      score += 15;
      factors.push({ criterion: `Ratio V/D ${(ratio * 100).toFixed(0)}% desfavorable`, points: 15 });
    } else if (ratio < 0.5) {
      score += 8;
      factors.push({ criterion: `Ratio V/D ${(ratio * 100).toFixed(0)}% ligeramente desfavorable`, points: 8 });
    }
  }

  const heavyCount = player.heavy_loss_count || 0;
  if (heavyCount > 0 && total > 0) {
    const heavyRatio = heavyCount / total;
    if (heavyRatio > 0.3) {
      score += 25;
      factors.push({ criterion: `${heavyCount} derrotas abultadas (frecuencia alta)`, points: 25 });
    } else if (heavyRatio > 0.15) {
      score += 15;
      factors.push({ criterion: `${heavyCount} derrotas abultadas (frecuencia media)`, points: 15 });
    } else {
      score += 8;
      factors.push({ criterion: `${heavyCount} derrotas abultadas`, points: 8 });
    }
  }

  return { score: Math.min(score, 100), factors };
}

export function predictScore(weakness1, weakness2) {
  const difference = Math.abs(weakness1 - weakness2);
  const weakerScore = Math.max(weakness1, weakness2);

  if (difference >= 60 && weakerScore >= 70) return "6-0 6-1";
  if (difference >= 50 && weakerScore >= 60) return "6-1 6-1";
  if (difference >= 45) return "6-1 6-2";
  if (difference >= 35) return "6-2 6-2";
  if (difference >= 25) return "6-2 6-3";
  if (difference >= 15) return "6-3 6-3";
  return "6-4 6-4";
}

export function estimateTotalGames(score) {
  const sets = score.split(" ");
  let total = 0;
  for (const set of sets) {
    const [g1, g2] = set.split("-").map(Number);
    total += g1 + g2;
  }
  return total;
}

export function analyzeMatch(player1, player2) {
  const w1 = calculateWeaknessScore(player1);
  const w2 = calculateWeaknessScore(player2);

  const difference = Math.abs(w1.score - w2.score);
  const weakerPlayer = w1.score > w2.score ? 1 : 2;

  let riskLevel;
  let confidence;

  if (difference >= 40) {
    riskLevel = "high";
    confidence = Math.min(70 + difference * 0.5, 95);
  } else if (difference >= 20) {
    riskLevel = "medium";
    confidence = Math.min(50 + difference * 0.5, 75);
  } else {
    riskLevel = "low";
    confidence = Math.min(30 + difference * 0.3, 50);
  }

  const predictedScore = predictScore(w1.score, w2.score);
  const estimatedGames = estimateTotalGames(predictedScore);

  const weakerName = weakerPlayer === 1 ? player1.name : player2.name;
  const strongerName = weakerPlayer === 1 ? player2.name : player1.name;
  const weakerScoreVal = weakerPlayer === 1 ? w1.score : w2.score;
  const strongerScoreVal = weakerPlayer === 1 ? w2.score : w1.score;

  const summary =
    `Diferencia de nivel de ${difference} puntos. ` +
    `${weakerName} (${weakerScoreVal} pts) presenta un nivel significativamente inferior ` +
    `frente a ${strongerName} (${strongerScoreVal} pts). ` +
    `Probabilidad de resultado con ${estimatedGames} juegos o menos (≤16).`;

  return {
    risk_level: riskLevel,
    confidence: Math.round(confidence),
    predicted_score: predictedScore,
    estimated_total_games: estimatedGames,
    weaker_player: weakerPlayer,
    player1_weakness: w1,
    player2_weakness: w2,
    analysis_summary: summary
  };
}

export function riskConfig(level) {
  const configs = {
    high: { label: "Alto", bg: "bg-danger/10", text: "text-danger", border: "border-danger/30", dot: "bg-danger" },
    medium: { label: "Medio", bg: "bg-warning/10", text: "text-warning", border: "border-warning/30", dot: "bg-warning" },
    low: { label: "Bajo", bg: "bg-success/10", text: "text-success", border: "border-success/30", dot: "bg-success" }
  };
  return configs[level] || configs.low;
}
