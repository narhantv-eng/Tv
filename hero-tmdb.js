// hero-tmdb.js — TMDB API + Trailer татах

// TMDB Genre ID → нэр
const _GENRE_MAP = {
  28:'Action', 12:'Adventure', 16:'Animation', 35:'Comedy',
  80:'Crime', 99:'Documentary', 18:'Drama', 10751:'Family',
  14:'Fantasy', 36:'History', 27:'Horror', 10402:'Music',
  9648:'Mystery', 10749:'Romance', 878:'Sci-Fi',
  53:'Thriller', 10752:'War', 37:'Western', 66:'Biography'
};

// Trailer ID татах (TMDB)
window.fetchTrailerKey = async (tmdbId) => {
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${window.TMDB_KEY}`
    );
    const d = await r.json();
    const t = d.results?.find(
      v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    );
    return t?.key ? `https://www.youtube.com/watch?v=${t.key}` : null;
  } catch { return null; }
};

// Дэлхийд яг одоо гарч буй кинонуудыг татах
window.fetchTMDBNowPlaying = async function () {
  try {
    const r = await fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${window.TMDB_KEY}&language=en-US&page=1`
    );
    const d = await r.json();

    window.HERO_MOVIES = d.results.slice(0, 7).map(m => ({
      id:       'hero_' + m.id,
      tmdbId:   m.id,
      title:    m.title,
      title_en: m.title,
      rating:   m.vote_average.toFixed(1),
      year:     m.release_date?.split('-')[0] || '',
      poster:   `https://image.tmdb.org/t/p/w1280${m.backdrop_path || m.poster_path}`,
      embed:    `https://vidsrc.to/embed/movie/${m.id}`,
      // Жанр тэгүүд
      cat: (m.genre_ids || [])
        .slice(0, 3)
        .map(id => _GENRE_MAP[id])
        .filter(Boolean)
        .join(', '),
      // Тайлбар
      overview: m.overview
        ? m.overview.length > 180
          ? m.overview.substring(0, 177) + '...'
          : m.overview
        : '',
      trailer: null,
    }));

    // "Дэлхийд яг одоо" мөрийг дүүргэх
    const intEl = document.getElementById('rowInternational');
    if (intEl) {
      intEl.innerHTML = '';
      window.HERO_MOVIES.forEach(m => intEl.appendChild(window.makeMovieCard(m)));
    }

    window.initHero();
  } catch (e) {
    console.error('TMDB now_playing:', e);
    window.initHero();
  }
};
