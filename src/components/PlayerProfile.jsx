import { cn } from '@/lib/utils';
import { TrendingDown, Trophy, Globe } from 'lucide-react';

export default function PlayerProfile({ player, weakness, isWeaker }) {
  const recentResults = (() => {
    try {
      return typeof player.recent_results === 'string'
        ? JSON.parse(player.recent_results)
        : (player.recent_results || []);
    } catch {
      return [];
    }
  })();

  const totalMatches = (player.total_wins || 0) + (player.total_losses || 0);
  const winRatio = totalMatches > 0 ? ((player.total_wins / totalMatches) * 100).toFixed(0) : 0;

  return (
    <div className={cn(
      "rounded-xl border p-4 space-y-3",
      isWeaker ? "border-danger/30 bg-danger/5" : "border-border bg-background"
    )}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-sm text-foreground">{player.name}</h4>
          {player.country && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Globe className="w-3 h-3" />
              {player.country}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className={cn(
            "text-2xl font-bold font-mono",
            weakness.score >= 60 ? "text-danger" : weakness.score >= 40 ? "text-warning" : "text-success"
          )}>
            {weakness.score}
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Weakness</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-card border border-border px-3 py-2">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">WTA</div>
          <div className="font-mono text-sm text-foreground">
            {player.wta_ranking > 0 ? `#${player.wta_ranking}` : "Sin ranking"}
          </div>
        </div>
        <div className="rounded-lg bg-card border border-border px-3 py-2">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Junior</div>
          <div className="font-mono text-sm text-foreground">
            {player.junior_ranking > 0 ? `#${player.junior_ranking}` : "Sin ranking"}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-card border border-border px-3 py-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            Victorias / Derrotas
          </span>
          <span className="font-mono text-xs text-muted-foreground">{winRatio}% V</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-success">{player.total_wins || 0}V</span>
          <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
            <div className="h-full bg-success/60" style={{ width: `${winRatio}%` }} />
          </div>
          <span className="font-mono text-sm text-danger">{player.total_losses || 0}D</span>
        </div>
      </div>

      {player.heavy_loss_count > 0 && (
        <div className="rounded-lg bg-danger/5 border border-danger/20 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-danger" />
            <span className="text-xs text-danger font-medium">
              {player.heavy_loss_count} derrotas abultadas (6-0, 6-1, 6-2)
            </span>
          </div>
        </div>
      )}

      {weakness.factors.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Factores de debilidad</div>
          {weakness.factors.map((factor, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{factor.criterion}</span>
              <span className="font-mono text-danger">+{factor.points}</span>
            </div>
          ))}
        </div>
      )}

      {recentResults.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Resultados recientes</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {recentResults.slice(0, 8).map((result, i) => (
              <div key={i} className="flex items-center justify-between text-xs gap-2">
                <span className={cn(
                  "w-4 text-center font-bold",
                  result.result === "win" ? "text-success" : "text-danger"
                )}>
                  {result.result === "win" ? "V" : "D"}
                </span>
                <span className="flex-1 truncate text-muted-foreground">{result.opponent || "N/A"}</span>
                <span className="font-mono text-foreground">{result.score || "N/A"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
