import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { geminiSearch } from './gemini.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Auth middleware - checks password header against env var
function authMiddleware(req, res, next) {
  const password = req.headers['x-password'];
  if (password !== process.env.ACCESS_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  next();
}

// Login endpoint (no auth needed)
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ACCESS_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Contraseña incorrecta' });
  }
});

// API routes (protected)
app.post('/api/tournaments', authMiddleware, async (req, res) => {
  try {
    const { date } = req.body;
    const result = await geminiSearch(
      `Search for ITF Women's Circuit tennis tournaments (W15, W25, W35, W50, W60, W75, W100 categories) that have matches scheduled on ${date}. List each tournament with its name, city, country, and category level. Use sources like tennisexplorer.com, coretennis.net, and itftennis.com. Return as many tournaments as you can find.\n\nReturn as JSON with this structure: { "tournaments": [{ "name": "...", "location": "...", "level": "..." }] }`
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/matches', authMiddleware, async (req, res) => {
  try {
    const { date, tournaments } = req.body;
    const tournamentList = tournaments.length > 0
      ? tournaments.map(t => typeof t === 'string' ? t : t.name).join(", ")
      : "all ITF Women's Circuit tournaments";
    const result = await geminiSearch(
      `Search for ITF Women's Circuit tennis matches scheduled on ${date} in these tournaments: ${tournamentList}. For each match, provide the full names of both players, the tournament name, and the round (e.g., "Round of 16", "Quarterfinal", "Semifinal", "Final", "Round 1", "Round 2"). Use sources like tennisexplorer.com, coretennis.net, and itftennis.com. Return ALL matches found for that date.\n\nReturn as JSON with this structure: { "matches": [{ "player1_name": "...", "player2_name": "...", "tournament_name": "...", "round": "..." }] }`
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/analyze', authMiddleware, async (req, res) => {
  try {
    const { match, date } = req.body;
    const result = await geminiSearch(
      `I need detailed data about two female tennis players who are playing an ITF Women's Circuit match:\n\nMatch: ${match.player1_name} vs ${match.player2_name}\nTournament: ${match.tournament_name}\nDate: ${date}\n\nFor EACH player, search the web to find their tennis profile and statistics. Search on Google, tennisexplorer.com, coretennis.net, itftennis.com, and wtatennis.com.\n\nCRITICAL INSTRUCTIONS:\n- Search for EACH player individually and thoroughly.\n- Most ITF Women's Circuit players DO have a WTA ranking (typically between 100-1000) and/or an ITF Junior ranking.\n- If you cannot find a ranking immediately, try searching with different name variations (full name, with/without accents, with/without hyphens, maiden name).\n- Only use 0 for a ranking if you have searched thoroughly and confirmed the player has NO ranking at all.\n- Do NOT return 0 for all fields unless you truly cannot find any data about the player after exhaustive searching.\n\nFor EACH player, I need:\n1. wta_ranking: Current WTA singles ranking (a number like 285). Use 0 ONLY if the player has no WTA ranking.\n2. junior_ranking: ITF Junior ranking (a number). Use 0 ONLY if the player has no junior ranking.\n3. total_wins: Total career wins\n4. total_losses: Total career losses\n5. recent_results: Last 10 matches as an array, each with: opponent (string), score (string like "6-1 6-2"), result ("win" or "loss"), date (string)\n6. heavy_loss_count: Number of sets the player has lost with scores of 6-0, 6-1, or 6-2\n7. country: Country of origin\n8. name: Full name as found on the websites\n\nReturn data for BOTH players (player1 and player2).\n\nReturn as JSON with this structure: { "player1": { "name": "...", "country": "...", "wta_ranking": 0, "junior_ranking": 0, "total_wins": 0, "total_losses": 0, "recent_results": [{ "opponent": "...", "score": "...", "result": "win", "date": "..." }], "heavy_loss_count": 0 }, "player2": { ... same structure ... } }`
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
    root: path.join(__dirname, '..')
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ITF Scout running on http://localhost:${PORT}`);
});
