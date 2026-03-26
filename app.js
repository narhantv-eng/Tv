// ============================================================
// app.js — Гол entry point
// ============================================================

import './firebase-config.js';
import './auth.js';
import './player.js';
import './config.js';
import './weather.js';
import './games.js';
import './hero.js';

import { fillRow }         from './utils.js';
import { buildMoviesPage } from './movies.js';
import { buildSeriesPage } from './series.js';
import './search.js';

window.MOVIES = [];
window.SERIES = [];

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
});

window.scrollRow = function(id, dx) {
  document.getElementById(id)?.scrollBy({ left: dx, behavior: 'smooth' });
};

async function loadData() {
  try {
    window.MOVIES = [];
    window.SERIES = [];

    const res  = await fetch('data.json?t=' + new Date().getTime(), { cache: 'no-store' });
    const json = await res.json();
    const raw  = json.data || json;

    raw.forEach((item, i) => {
      const isSeries = item.type?.toLowerCase().includes('series');
      const base = {
        id:       (isSeries ? 's' : 'm') + i,
        title:    item.mongolian_title || item.title,
        title_en: item.title,
        year:     item.year || 2024,
        rating:   item.ratings?.imdb ? parseFloat(item.ratings.imdb) : 7.0,
        poster:   (item.poster_link || '').replace(
          /http(s)?:\/\/www\.themoviedb\.org\/t\/p\/(original|w500)\//g,
          'https://image.tmdb.org/t/p/w500/'
        ),
        cat: (
          Array.isArray(item.genre)
            ? item.genre.join(',')
            : item.genre || ''
        ).toLowerCase(),
      };
      if (isSeries) {
        window.SERIES.push({ ...base, episodes: item.episodes || [] });
      } else {
        window.MOVIES.push({ ...base, embed: item.embed_links?.[0] || '' });
      }
    });

    buildHomeRows();
    if (window.fetchTMDBNowPlaying) window.fetchTMDBNowPlaying();

  } catch (e) {
    window.toast('Өгөгдөл татахад алдаа!');
    console.error(e);
  }
}

function buildHomeRows() {
  fillRow('rowFeatured', window.MOVIES.slice(0, 30));
  fillRow('rowSeries',   window.SERIES.slice(0, 20), true);

  const dc = document.getElementById('dynamicRows');
  if (dc && window.HOME_ROWS) {
    dc.innerHTML = '';
    window.HOME_ROWS.forEach(({ id, title, keys }) => {
      const items = window.MOVIES.filter(m => keys.some(k => m.cat.includes(k))).slice(0, 25);
      if (items.length > 0) {
        const sec = document.createElement('section');
        sec.className = 'sec';
        sec.innerHTML = `
          <div class="sec-head"><div class="sec-title">${title}</div></div>
          <div class="row-wrap">
            <button class="scroll-btn left" onclick="scrollRow('${id}',-600)">❮</button>
            <div class="scroll-row" id="${id}"></div>
            <button class="scroll-btn right" onclick="scrollRow('${id}',600)">❯</button>
          </div>`;
        dc.appendChild(sec);
        fillRow(id, items);
      }
    });
  }

  if (window.buildGamesRow) window.buildGamesRow();
  setTimeout(() => { if (window.insertAds) window.insertAds(); }, 500);
}

window.showMoviesGrid = function() {
  const s = document.getElementById('moviesFullSection');
  if (!s) return;
  if (s.style.display !== 'none') {
    s.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    s.style.display = '';
    buildMoviesPage();
    s.scrollIntoView({ behavior: 'smooth' });
  }
};

window.showSeriesGrid = function() {
  const s = document.getElementById('seriesFullSection');
  if (!s) return;
  if (s.style.display !== 'none') {
    s.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    s.style.display = '';
    buildSeriesPage();
    s.scrollIntoView({ behavior: 'smooth' });
  }
};

window.gotoPage = function(p) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.getElementById('page-' + p)?.classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('t-' + p)?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (window.setPageHero) window.setPageHero(p);
  if (p === 'games'   && window.buildGamesPage) window.buildGamesPage();
  if (p === 'weather' && window.loadWeather)    window.loadWeather();
  if (p === 'search') setTimeout(() => document.getElementById('searchPageInput')?.focus(), 300);
};

loadData();
