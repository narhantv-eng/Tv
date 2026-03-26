// games.js
import './games-data.js';
import './games-cards.js';

let gamesBuilt = false;

window.buildGamesRow = function() {
  const el = document.getElementById('rowGames');
  if (!el) return;
  el.innerHTML = '';
  window.GAMES_LIST.slice(0, 10).forEach(g => el.appendChild(window.makeGamePosterCard(g)));
};

window.buildGamesPage = function() {
  if (gamesBuilt) return;
  gamesBuilt = true;
  const bar = document.getElementById('gameGenreBar');
  if (!bar) return;
  bar.innerHTML = '';
  
  const allBtn = document.createElement('button');
  allBtn.className = 'gpill on';
  allBtn.textContent = '🌐 Бүгд';
  allBtn.onclick = () => { 
    bar.querySelectorAll('.gpill').forEach(p => p.classList.remove('on')); 
    allBtn.classList.add('on'); 
    renderGamesGrid(''); 
  };
  bar.appendChild(allBtn);

  if (window.GAME_SECTIONS) {
    window.GAME_SECTIONS.forEach((c) => {
      const pill = document.createElement('button');
      pill.className = 'gpill';
      pill.textContent = c.title;
      pill.onclick = () => { 
        bar.querySelectorAll('.gpill').forEach(p => p.classList.remove('on')); 
        pill.classList.add('on'); 
        renderGamesGrid(c.key); 
      };
      bar.appendChild(pill);
    });
  }
  
  renderGamesGrid('');
};

function renderGamesGrid(catKey) {
  const grid = document.getElementById('gamesGrid');
  if (!grid) return;
  
  grid.className = 'mgrid'; 
  grid.innerHTML = '';
  
  const items = !catKey 
    ? window.GAMES_LIST 
    : window.GAMES_LIST.filter(g => g.cat === catKey);

  items.forEach(g => {
    grid.appendChild(window.makeGamePosterCard(g));
  });
}

window.openGame = function(g) {
  if (!window.currentUser) { 
    window.openAuth('register'); 
    return window.toast('Тоглохын тулд бүртгүүлнэ үү 🔐'); 
  }
  document.getElementById('gmFrame').src = g.embed;
  document.getElementById('gameModal').classList.add('open');
};