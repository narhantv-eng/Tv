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
  
  window.GAME_CATS.forEach((c, i) => {
    const pill = document.createElement('button');
    pill.className = 'gpill' + (i === 0 ? ' on' : '');
    pill.textContent = c.label;
    pill.onclick = () => { 
      bar.querySelectorAll('.gpill').forEach(p => p.classList.remove('on')); 
      pill.classList.add('on'); 
      renderGamesGrid(c.key); 
    };
    bar.appendChild(pill);
  });
  renderGamesGrid('');
};

function renderGamesGrid(catKey) {
  const grid = document.getElementById('gamesGrid');
  if (!grid) return;
  
  // Киноны хуудастай яг ижилхэн Grid дизайн ашиглах
  grid.className = 'mgrid'; 
  grid.innerHTML = '';
  
  // Сонгосон ангиллаар шүүх
  const items = !catKey 
    ? window.GAMES_LIST 
    : window.GAMES_LIST.filter(g => g.cat === catKey);

  // Тоглоомуудыг кино шиг картаар харуулах
  items.forEach(g => {
    grid.appendChild(window.makeGamePosterCard(g));
  });
}

window.openGame = function(g) {
  if (!window.currentUser) { 
    window.openAuth('login'); 
    return window.toast('Тоглохын тулд нэвтэрнэ үү 🔐'); 
  }
  document.getElementById('gmFrame').src = g.embed;
  document.getElementById('gameModal').classList.add('open');
};
