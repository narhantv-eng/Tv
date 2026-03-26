// ============================================================
// series.js — Цуврал дэлгэрэнгүй, цуврал хуудас
// ============================================================

export const SERIES_GENRES = [
  { label: '🌐 Бүгд',       keys: [] },
  { label: '🎭 Драма',       keys: ['drama', 'romance'] },
  { label: '⚔️ Action',     keys: ['action', 'adventure'] },
  { label: '😂 Инээдмийн',  keys: ['comedy'] },
  { label: '🎨 Аниме',       keys: ['animation', 'anime'] },
  { label: '👻 Аймшиг',     keys: ['horror', 'thriller'] },
];

window.openSeriesDetail = function (s) {
  document.getElementById('smHero').style.backgroundImage = `url('${s.poster}')`;
  document.getElementById('smTitle').textContent = s.title;
  document.getElementById('smMeta').innerHTML =
    `<span class="st">★</span>${s.rating} &nbsp;·&nbsp; ${s.year}`;
  document.getElementById('smDesc').textContent = '';

  const epGrid = document.getElementById('smEpGrid');
  epGrid.innerHTML = '';

  (s.episodes || []).forEach((ep, i) => {
    const el = document.createElement('div');
    el.className = 'ep-item';
    el.innerHTML = `
      <div class="ep-num">${i + 1}</div>
      <div class="ep-label">${ep.episode_title || 'Анги'}</div>`;
    el.onclick = () =>
      window.openPlayer({
        title: `${s.title} — ${i + 1}-р анги`,
        embed: ep.embed_links?.[0] || '',
        poster: s.poster,
      });
    epGrid.appendChild(el);
  });

  document.getElementById('seriesModal').classList.add('open');
};

// ── Цуврал хуудас ─────────────────────────────────────────────
let seriesBuilt = false;

export function buildSeriesPage() {
  if (seriesBuilt) return;
  seriesBuilt = true;

  const bar = document.getElementById('seriesGenreBar');
  if (!bar) return;
  bar.innerHTML = '';

  SERIES_GENRES.forEach((g, i) => {
    const pill = document.createElement('button');
    pill.className = 'gpill' + (i === 0 ? ' on' : '');
    pill.textContent = g.label;
    pill.onclick = () => {
      bar.querySelectorAll('.gpill').forEach((p) => p.classList.remove('on'));
      pill.classList.add('on');
      renderSeriesGrid(g.keys);
    };
    bar.appendChild(pill);
  });

  renderSeriesGrid([]);
}

function renderSeriesGrid(keys) {
  const grid = document.getElementById('seriesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const items =
    keys.length === 0
      ? window.SERIES
      : window.SERIES.filter((s) => keys.some((k) => s.cat.includes(k)));

  const cnt = document.getElementById('seriesCount');
  if (cnt) cnt.textContent = `Нийт ${items.length} цуврал`;

  items.slice(0, 80).forEach((s) => {
    const card = window.makeMovieCard(s);
    card.onclick = () => window.openSeriesDetail(s);
    grid.appendChild(card);
  });
}
