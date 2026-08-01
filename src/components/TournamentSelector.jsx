import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TournamentSelector({
  tournaments,
  selected,
  onChange,
  loading,
  searchQuery,
  onSearchChange
}) {
  const filtered = tournaments.filter(t =>
    (t.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.location || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allSelected = tournaments.length > 0 && selected.length === tournaments.length;

  const toggleAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(tournaments.map(t => t.name));
    }
  };

  const toggleOne = (name) => {
    if (selected.includes(name)) {
      onChange(selected.filter(n => n !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-12 rounded-lg bg-card border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Selecciona una fecha para ver los torneos disponibles
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {selected.length} de {tournaments.length} seleccionados
        </span>
        <button onClick={toggleAll} className="text-xs text-primary hover:underline">
          {allSelected ? "Quitar selección" : "Seleccionar todos"}
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar torneo..."
          className="w-full pl-9 pr-3 h-9 rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring text-sm"
        />
      </div>

      <div className="h-48 rounded-lg border border-border bg-background overflow-y-auto">
        <div className="p-2 space-y-0.5">
          {filtered.map((tournament, i) => {
            const isSelected = selected.includes(tournament.name);
            return (
              <button
                key={i}
                onClick={() => toggleOne(tournament.name)}
                className={cn(
                  "w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors text-left",
                  isSelected ? "bg-primary/10" : "hover:bg-card"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0",
                  isSelected ? "bg-primary border-primary" : "border-border"
                )}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate">{tournament.name}</div>
                  {tournament.location && (
                    <div className="text-[10px] text-muted-foreground truncate">{tournament.location}</div>
                  )}
                </div>
                {tournament.level && (
                  <span className="text-[10px] font-mono text-muted-foreground bg-card border border-border rounded px-1.5 py-0.5">
                    {tournament.level}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
