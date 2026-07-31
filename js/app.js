document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (localStorage.getItem('tenisbot_auth') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('tenisbot_auth');
        window.location.href = 'index.html';
    });

    // Botón Check
    document.getElementById('checkBtn').addEventListener('click', function() {
        performSearch();
    });
});

function performSearch() {
    const dateFilter = document.getElementById('dateFilter').value;
    const tournamentFilter = document.getElementById('tournamentFilter').value.toLowerCase();
    const lossPercentage = parseInt(document.getElementById('lossPercentage').value);
    const sources = Array.from(document.querySelectorAll('.checkbox-group input:checked')).map(cb => cb.value);

    const resultsSection = document.getElementById('resultsSection');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsContainer = document.getElementById('resultsContainer');

    resultsSection.style.display = 'block';
    loadingIndicator.style.display = 'block';
    resultsContainer.innerHTML = '';

    // Simular búsqueda (en producción, conectar con backend)
    setTimeout(() => {
        loadingIndicator.style.display = 'none';
        const results = scraper.searchPlayers(dateFilter, tournamentFilter, lossPercentage, sources);
        displayResults(results);
    }, 2000);
}

function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');

    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No se encontraron jugadoras que cumplan los criterios.</div>';
        return;
    }

    results.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card';
        
        const lossPercent = ((player.losses / (player.wins + player.losses)) * 100).toFixed(1);
        
        card.innerHTML = `
            <span class="no-ranking">⚠️ Sin Ranking</span>
            <div class="player-name">${player.name}</div>
            <div class="player-stats">
                <div class="stat">🏆 Torneo: <span class="stat-value">${player.tournament}</span></div>
                <div class="stat">📅 Fecha: <span class="stat-value">${player.date}</span></div>
                <div class="stat">✅ Victorias: <span class="stat-value">${player.wins}</span></div>
                <div class="stat">❌ Derrotas: <span class="stat-value">${player.losses}</span></div>
                <div class="stat">📊 % Pérdidas: <span class="stat-value">${lossPercent}%</span></div>
                <div class="stat">🌐 Fuente: <span class="stat-value">${player.source}</span></div>
            </div>
        `;
        
        resultsContainer.appendChild(card);
    });
}
