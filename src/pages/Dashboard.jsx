import { useState } from 'react';
import { Calendar, Search, Loader2, AlertCircle, Filter, BarChart3, Zap } from 'lucide-react';
import { fetchTournaments, fetchMatches, fetchMatchAnalysis } from '@/lib/itfApi';
import { analyzeMatch } from '@/lib/analysisEngine';
import TournamentSelector from '@/components/TournamentSelector';
import MatchCard from '@/components/MatchCard';

export default function Dashboard() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournaments, setSelectedTournaments] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(false);
  const [tournamentSearch, setTournamentSearch] = useState("");

  const [matches, setMatches] = useState([]);
  const [phase, setPhase] = useState('idle');
  const [progress, setProgress] = useState({ current: 0, total: 0, currentMatch: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setTournaments([]);
    setSelectedTournaments([]);
    setMatches([]);
    setPhase('idle');

    if (date) {
      setLoadingTournaments(true);
      try {
        const tournamentsData = await fetchTournaments(date);
        setTournaments(tournamentsData);
      } catch (err) {
        setTournaments([]);
      } finally {
        setLoadingTournaments(false);
      }
    }
  };

  const handleCheck = async () => {
    setMatches([]);
    setPhase('fetching_matches');
    setErrorMessage('');

    try {
      const selectedTournamentObjects = tournaments.filter(t =>
        selectedTournaments.includes(t.name)
      );
      const matchesData = await fetchMatches(selectedDate, selectedTournamentObjects);

      if (!matchesData || matchesData.length === 0) {
        setPhase('complete');
        return;
      }

      setPhase('analyzing');

      const analyzedMatches = [];

      for (let i = 0; i < matchesData.length; i++) {
        const match = matchesData[i];
        setProgress({
          current: i,
          total: matchesData.length,
          currentMatch: `${match.player1_name} vs ${match.player2_name}`
        });

        try {
          const { player1, player2 } = await fetchMatchAnalysis(match, selectedDate);
          const analysis = analyzeMatch(player1, player2);
          analyzedMatches.push({
            ...match,
            match_date: selectedDate,
            player1_data: player1,
            player2_data: player2,
            ...analysis
          });
          setMatches([...analyzedMatches]);
        } catch (err) {
          console.error('Error analyzing match:', err);
        }
      }

      setProgress({ current: matchesData.length, total: matchesData.length, currentMatch: '' });
      setPhase('complete');
    } catch (err) {
      setErrorMessage(err.message || 'Error al buscar partidos');
      setPhase('error');
    }
  };

  const sortedMatches = [...matches].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.risk_level] - order[b.risk_level];
  });

  const highRiskCount = matches.filter(m => m.risk_level === 'high').length;
  const mediumRiskCount = matches.filter(m => m.risk_level === 'medium').length;
  const lowRiskCount = matches.filter(m => m.risk_level === 'low').length;

  const isLoading = phase === 'fetching_matches' || phase === 'analyzing';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm text-foreground">Panel de búsqueda</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Fecha del partido
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full h-10 rounded-md bg-background border border-border text-foreground px-3 focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Torneos
              {tournaments.length > 0 && (
                <span className="text-primary">({tournaments.length} disponibles)</span>
              )}
            </label>
            <TournamentSelector
              tournaments={tournaments}
              selected={selectedTournaments}
              onChange={setSelectedTournaments}
              loading={loadingTournaments}
              searchQuery={tournamentSearch}
              onSearchChange={setTournamentSearch}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            {selectedTournaments.length === 0
              ? "Se analizarán todos los torneos disponibles"
              : `${selectedTournaments.length} torneo(s) seleccionado(s)`}
          </div>
          <button
            onClick={handleCheck}
            disabled={isLoading || !selectedDate}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 h-10 rounded-md flex items-center justify-center gap-2 disabled:opacity-50 transition"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Check
              </>
            )}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="rounded-2xl border border-border bg-card p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <div>
              <div className="text-sm font-medium text-foreground">
                {phase === 'fetching_matches'
                  ? 'Buscando partidos programados...'
                  : `Analizando partido ${Math.min(progress.current + 1, progress.total)} de ${progress.total}`}
              </div>
              {phase === 'analyzing' && (
                <div className="text-xs text-muted-foreground mt-0.5">{progress.currentMatch}</div>
              )}
            </div>
          </div>
          {phase === 'analyzing' && (
            <div className="w-full h-1.5 rounded-full bg-background overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress.total > 0 ? ((progress.current / progress.total) * 100) : 0}%` }}
              />
            </div>
          )}
        </div>
      )}

      {phase === 'error' && (
        <div className="rounded-2xl border border-danger/30 bg-danger/5 p-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-danger">Error</div>
            <div className="text-xs text-muted-foreground mt-1">{errorMessage}</div>
          </div>
        </div>
      )}

      {phase === 'complete' && (
        <>
          {matches.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-foreground">{matches.length}</div>
                  <div className="text-[10px] text-muted-foreground">partidos analizados</div>
                </div>
                <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-danger" />
                    <span className="text-[10px] text-danger uppercase tracking-wide">Alto</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-danger">{highRiskCount}</div>
                  <div className="text-[10px] text-muted-foreground">resultados desequilibrados</div>
                </div>
                <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                    <span className="text-[10px] text-warning uppercase tracking-wide">Medio</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-warning">{mediumRiskCount}</div>
                  <div className="text-[10px] text-muted-foreground">riesgo moderado</div>
                </div>
                <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-[10px] text-success uppercase tracking-wide">Bajo</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-success">{lowRiskCount}</div>
                  <div className="text-[10px] text-muted-foreground">partidos equilibrados</div>
                </div>
              </div>

              <div className="space-y-2">
                {sortedMatches.map((match, i) => (
                  <MatchCard key={i} match={match} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mx-auto mb-3">
                <Zap className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">No se encontraron partidos</h3>
              <p className="text-xs text-muted-foreground">
                No hay partidos ITF femeninos programados para esta fecha en los torneos seleccionados.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
