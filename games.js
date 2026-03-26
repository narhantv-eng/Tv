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

  // 1. Хуучин байсан дээд талын товчнуудыг (Genre Bar) нуух/устгах
  const bar = document.getElementById('gameGenreBar');
  if (bar) bar.style.display = 'none';
  
  const container = document.getElementById('gamesGrid');
  if (!container) return;
  
  // 2. Grid биш, мөрүүд (rows) орох тул class-ийг цэвэрлэнэ
  container.className = ''; 
  container.innerHTML = '';

  // 3. Ангилал тус бүрээр мөр үүсгэх
  window.GAME_SECTIONS.forEach((sec, idx) => {
    const items = window.GAMES_LIST.filter(g => g.cat === sec.key);
    if (items.length === 0) return;

    // --- МӨР ҮҮСГЭХ (Кино шиг) ---
    const section = document.createElement('section');
    section.className = 'sec';
    section.innerHTML = `
      <div class="sec-head">
        <div class="sec-title">${sec.title}</div>
      </div>
      <div class="row-wrap">
        <button class="scroll-btn left" onclick="scrollRow('${sec.id}', -600)">❮</button>
        <div class="scroll-row" id="${sec.id}"></div>
        <button class="scroll-btn right" onclick="scrollRow('${sec.id}', 600)">❯</button>
      </div>
    `;
    container.appendChild(section);

    // --- ТОГЛООМУУДЫГ МӨР РҮҮ ХИЙХ ---
    const rowEl = document.getElementById(sec.id);
    items.forEach(g => {
      rowEl.appendChild(window.makeGamePosterCard(g));
    });

    // --- МӨР ХООРОНД ЗАРЫН БАННЕР ОРУУЛАХ ---
    // Хамгийн сүүлийн мөрний доор зар гаргахгүй байх нөхцөл (хүсвэл устгаж болно)
    if (idx < window.GAME_SECTIONS.length - 1) {
      const adContainer = document.createElement('div');
      adContainer.className = 'ad-banner-container';
      adContainer.style.margin = '10px auto 40px'; // Дээд доод зай
      
      // Энд та өөрийнхөө зарын зургийн линкийг (src) сольж тавина
      adContainer.innerHTML = `
        <a href="#" class="ad-banner">
          <div class="ad-label">ЗАР СУРТАЛЧИЛГАА</div>
          <img src="https://placehold.co/1200x150/111/E50914?text=YOUR+AD+BANNER+HERE+(${idx + 1})" alt="Ad Banner">
        </a>
      `;
      container.appendChild(adContainer);
    }
  });
};

window.openGame = function(g) {
  if (!window.currentUser) { 
    window.openAuth('register'); 
    return window.toast('Тоглохын тулд бүртгүүлнэ үү 🔐'); 
  }
  document.getElementById('gmFrame').src = g.embed;
  document.getElementById('gameModal').classList.add('open');
};
