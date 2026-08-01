import { apiPost } from '@/api/client';
import { analyzeMatch } from './analysisEngine';

export async function fetchTournaments(date) {
  const result = await apiPost('/tournaments', { date });
  return result.tournaments || [];
}

export async function fetchMatches(date, tournaments) {
  const result = await apiPost('/matches', { date, tournaments });
  return result.matches || [];
}

export async function fetchMatchAnalysis(match, date) {
  const result = await apiPost('/analyze', { match, date });
  return {
    player1: result.player1 || { name: match.player1_name, country: "", wta_ranking: 0, junior_ranking: 0, total_wins: 0, total_losses: 0, heavy_loss_count: 0, recent_results: [] },
    player2: result.player2 || { name: match.player2_name, country: "", wta_ranking: 0, junior_ranking: 0, total_wins: 0, total_losses: 0, heavy_loss_count: 0, recent_results: [] }
  };
}

export { analyzeMatch };
