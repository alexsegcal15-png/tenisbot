import { useState } from 'react';
import { ChevronDown, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import RiskBadge from './RiskBadge';
import PlayerProfile from './PlayerProfile';
import { riskConfig } from '@/lib/analysisEngine';

export default function MatchCard({ match }) {
  const [expanded, setExpanded] = useState(false);
  const config = riskConfig(match.risk_level);

  return (
    <div className={cn(
      "rounded-xl border transition-all duration-200 animate-fade-in",
      config.border,
      expanded ? "bg-card" : "bg-background hover:bg-card/60"
    )}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div className={cn("w-1 self-stretch rounded-full", config.dot)} />

        <div className="hidden sm:block w-32 flex-shrink-0">
          <div className="text-xs font-medium text-foreground truncate">{match.tournament_name}</div>
          <div className="text-[10px] text-muted-foreground truncate">{match.round || "—"}</div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-medium truncate",
              match.weaker_player === 1 ? "text-danger" : "text-foreground"
            )}>
              {match.player1_name}
            </span>
          </div>
          <div className="text-[10px] text-muted-foreground my-0.5">vs</div>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-medium truncate",
              match.weaker_player === 2 ? "text-danger" : "text-foreground"
            )}>
              {match.player2_name}
            </span>
          </div>
        </div>

        <div className="sm:hidden w-20 flex-shrink-0">
          <div className="text-[10px] text-muted-foreground truncate">{match.tournament_name}</div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="font-mono text-base font-bold text-foreground">{match.predicted_score}</div>
          <div className="text-[10px] text-muted-foreground">{match.estimated_total_games} juegos</div>
        </div>

        <div className="hidden md:block flex-shrink-0">
          <RiskBadge level={match.risk_level} size="sm" />
        </div>

        <div className="text-right flex-shrink-0 w-12">
          <div className="font-mono text-sm font-bold text-foreground">{match.confidence}%</div>
          <div className="text-[10px] text-muted-foreground">conf.</div>
        </div>

        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200",
          expanded && "rotate-180"
        )} />
      </button>

      {expanded && (
        <div className="border-t border-border p-4 space-y-4">
          <div className="flex items-start gap-2 rounded-lg bg-background border border-border p-3">
            <Target className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{match.analysis_summary}</p>
          </div>

          {match.estimated_total_games <= 16 && (
            <div className="flex items-center gap-2 rounded-lg bg-warning/5 border border-warning/20 p-3">
              <Zap className="w-4 h-4 text-warning flex-shrink-0" />
              <span className="text-xs text-warning font-medium">
                Predicción: {match.estimated_total_games} juegos o menos (≤16) — alta probabilidad de resultado desequilibrado
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <PlayerProfile
              player={match.player1_data}
              weakness={match.player1_weakness}
              isWeaker={match.weaker_player === 1}
            />
            <PlayerProfile
              player={match.player2_data}
              weakness={match.player2_weakness}
              isWeaker={match.weaker_player === 2}
            />
          </div>
        </div>
      )}
    </div>
  );
}
