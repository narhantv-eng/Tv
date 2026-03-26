// ============================================================
// movies.js — Кино карт, дэлгэрэнгүй, кино хуудас
// ============================================================

export const MOVIE_GENRES =[
  { label: '🌐 All',          keys: [] },
  { label: '💥 Action',       keys: ['action'] },
  { label: '🗺️ Adventure',    keys: ['adventure'] },
  { label: '😂 Comedy',       keys: ['comedy'] },
  { label: '🎭 Drama',        keys: ['drama'] },
  { label: '👻 Horror',       keys: ['horror'] },
  { label: '🔪 Thriller',     keys: ['thriller'] },
  { label: '🚀 Sci-Fi',       keys:['sci-fi', 'science fiction'] },
  { label: '✨ Fantasy',      keys: ['fantasy'] },
  { label: '❤️ Romance',      keys: ['romance'] },
  { label: '🎨 Animation',    keys: ['animation', 'anime'] },
  { label: '🕵️ Mystery',      keys: ['mystery'] },
  { label: '🚨 Crime',        keys: ['crime'] },
  { label: '📹 Documentary',  keys: ['documentary'] },
  { label: '👨‍👩‍👧‍👦 Family',       keys: ['family'] },
  { label: '🏛️ History',      keys: ['history'] },
  { label: '🪖 War',          keys: ['war'] },
  { label: '🎵 Music',        keys: ['music', 'musical'] },
  { label: '🤠 Western',      keys: ['western'] },
  { label: '📖 Biography',    keys:['biography'] }
];

window.makeMovieCard = function (m) {
  const d = document.createElement('div');
  d.className = 'mcard';
  d.innerHTML = `
    <div class="mcard-poster-wrap">
      <img class="mcard-poster"
           src="${m.poster || ''}"
           onerror="fixPoster(this,'${(m.title_en || m.title).replace(/'/g, "\\'")}')">
      <div class="mcard-ov">
        <div class="mcard-play">
          <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" fill="white"/></svg>
        </div>
      </div>
    </div>
    <div class="mcard-info">
      <div class="mcard-title">${m.title}</div>
      <div class="mcard-sub"><span class="st">★</span>${m.rating} <span>·</span> ${m.year}</div>
    </div>`;
  d.addEventListener('click', () => window.openMovieDetail(m));
  return d;
};

window.openMovieDetail = function (m) {
  document.getElementById('mHero').style.backgroundImage = `url('${m.poster}')`;
  document.getElementById('mTitle').textContent = m.title;
  document.getElementById('mMeta').innerHTML =
    `<span class="st">★</span>${m.rating} &nbsp;·&nbsp; ${m.year} &nbsp;·&nbsp; ${m.cat || ''}`;
  document.getElementById('mDesc').textContent = '';
  document.getElementById('mActs').innerHTML =
    `<button class="btn-watch" style="width:100%;margin-top:10px;"
             onclick="openPlayer(window._curM)">▶ ЯГ ОДОО ҮЗЭХ</button>`;
  window._curM = m;
  document.getElementById('movieModal').classList.add('open');
};

// ── Кино хуудас ──────────────────────────────────────────────
let moviesBuilt = false;

export function buildMoviesPage() {
  if (moviesBuilt) return;
  moviesBuilt = true;

  const bar = document.getElementById('movieGenreBar');
  if (!bar) return;
  bar.innerHTML = '';

  MOVIE_GENRES.forEach((g, i) => {
    const pill = document.createElement('button');
    pill.className = 'gpill' + (i === 0 ? ' on' : '');
    pill.textContent = g.label;
    pill.onclick = () => {
      bar.querySelectorAll('.gpill').forEach((p) => p.classList.remove('on'));
      pill.classList.add('on');
      renderMoviesGrid(g.keys);
    };
    bar.appendChild(pill);
  });

  renderMoviesGrid([]);
}

function renderMoviesGrid(keys) {
  const grid = document.getElementById('moviesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const items =
    keys.length === 0
      ? window.MOVIES
      : window.MOVIES.filter((m) => keys.some((k) => m.cat.includes(k)));

  const cnt = document.getElementById('moviesCount');
  if (cnt) cnt.textContent = `Нийт ${items.length} кино`;

  items.slice(0, 80).forEach((m) => grid.appendChild(window.makeMovieCard(m)));
}
