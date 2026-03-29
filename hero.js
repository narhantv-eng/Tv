// hero.js — Cinematic Hero (шинэчлэгдсэн)
import './hero-trailer.js';
import './hero-volume.js';
import './hero-tmdb.js';

let hi = 0, hInt = null;

// ── Постер харуулах / нуух ──────────────────────────────────
function showPoster(url) {
  const bg  = document.querySelector('.hero-bg');
  const vig = document.querySelector('.hero-vignette');
  if (bg) {
    bg.style.backgroundImage  = `url('${url}')`;
    bg.style.backgroundSize   = 'cover';
    bg.style.backgroundPosition = 'center';
    bg.style.opacity          = '1';
    // Ken Burns restart
    bg.style.animation = 'none';
    bg.offsetHeight; // reflow trigger
    bg.style.animation = '';
  }
  if (vig) vig.style.opacity = '1';
}

function hidePoster() {
  const bg  = document.querySelector('.hero-bg');
  const vig = document.querySelector('.hero-vignette');
  if (bg)  bg.style.opacity  = '0';
  if (vig) vig.style.opacity = '0.4'; // текст уншигдахуйц байлгах
}

// ── Content animation (slide-up) ────────────────────────────
function animateContent() {
  const ids = ['heroTag', 'heroTitle', 'heroMeta', 'heroDesc', 'heroBtns'];
  ids.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'none';
    requestAnimationFrame(() => {
      setTimeout(() => {
        el.style.transition = `opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`;
        el.style.opacity    = '1';
        el.style.transform  = 'translateY(0)';
      }, 30);
    });
  });
}

// ── Progress bar ─────────────────────────────────────────────
function startProgress() {
  const fill = document.getElementById('heroProgressFill');
  if (!fill) return;
  fill.style.transition = 'none';
  fill.style.width      = '0%';
  fill.offsetHeight;
  const sec = (window.HERO_TIMER || 12000) / 1000;
  fill.style.transition = `width ${sec}s linear`;
  requestAnimationFrame(() => { fill.style.width = '100%'; });
}

function stopProgress() {
  const fill = document.getElementById('heroProgressFill');
  if (fill) { fill.style.transition = 'none'; fill.style.width = '0%'; }
}

// ── КИНО HERO ─────────────────────────────────────────────────
window.setHero = async (i) => {
  hi = i;
  const m = window.HERO_MOVIES?.[i];
  if (!m) return;

  // Идэвхтэй цэгийг шинэчлэх
  document.querySelectorAll('.hero-dot').forEach((d, idx) =>
    d.classList.toggle('active', idx === i));

  // Товчнуудын логик
  const wb = document.getElementById('heroWatch');
  const mb = document.getElementById('heroMore');
  if (wb) wb.onclick = () => window.openPlayer(m);
  if (mb) mb.onclick = () => window.openMovieDetail(m);

  // Гарчиг
  const te = document.getElementById('heroTitle');
  if (te) te.textContent = m.title;

  // Тайлбар (overview)
  const descEl = document.getElementById('heroDesc');
  if (descEl) descEl.textContent = m.overview || '';

  // Мета: ★ үнэлгээ, он, жанр тэгүүд
  const metaEl = document.getElementById('heroMeta');
  if (metaEl) {
    const genreTags = m.cat
      ? m.cat.split(',').map(g => `<span class="tag">${g.trim()}</span>`).join('')
      : '';
    metaEl.innerHTML = `
      <span class="star">★ ${m.rating}</span>
      <span>${m.year}</span>
      ${genreTags}
    `;
  }

  animateContent();
  startProgress();

  window.stopTrailer();
  showPoster(m.poster);
  window.hideVolBtn();
  window._heroMuted = true;
  window.updateVolBtn(true);

  // Trailer татаж тоглуулах
  let trailerUrl = m.trailer || null;
  if (!trailerUrl && m.tmdbId) {
    trailerUrl = await window.fetchTrailerKey(m.tmdbId);
  }

  if (trailerUrl) {
    const type = window.detectTrailerType(trailerUrl);
    if (type) {
      window.playTrailer(trailerUrl, type,
        () => { hidePoster(); window.showVolBtn(); },
        () => window.setHero((hi + 1) % window.HERO_MOVIES.length),
        () => { showPoster(m.poster); window.hideVolBtn(); }
      );
    }
  }
};

// ── Hero эхлүүлэх ──────────────────────────────────────────
window.initHero = function () {
  if (!window.HERO_MOVIES?.length) return;
  window.hideVolBtn();

  const tag = document.getElementById('heroTag');
  if (tag) tag.textContent = '🔥 ДЭЛХИЙН ШИЛДЭГ';

  const btns = document.getElementById('heroBtns');
  if (btns) {
    btns.innerHTML = `
      <button class="btn-watch" id="heroWatch">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5,3 19,12 5,21"/>
        </svg> Үзэх
      </button>
      <button class="btn-more" id="heroMore">ℹ Дэлгэрэнгүй</button>
      <button class="btn-volume" id="heroVolumeBtn" onclick="toggleHeroVolume()">🔇 Дууг нээх</button>`;
  }

  // Цэгүүд
  const dotsEl = document.getElementById('heroDots');
  if (dotsEl) {
    dotsEl.innerHTML = '';
    window.HERO_MOVIES.forEach((_, i) => {
      const dot     = document.createElement('div');
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.onclick   = () => { clearInterval(hInt); window.setHero(i); startSlide(); };
      dotsEl.appendChild(dot);
    });
  }

  // Progress bar байхгүй бол нэмэх
  const heroEl = document.getElementById('hero');
  if (heroEl && !document.getElementById('heroProgress')) {
    const pb = document.createElement('div');
    pb.id        = 'heroProgress';
    pb.className = 'hero-progress';
    pb.innerHTML = '<div class="hero-progress-fill" id="heroProgressFill"></div>';
    heroEl.appendChild(pb);
  }

  window.setHero(0);
  startSlide();
};

function startSlide() {
  clearInterval(hInt);
  hInt = setInterval(() => {
    const cont = document.getElementById('heroVideoContainer');
    if (!cont?.hasChildNodes()) {
      window.setHero((hi + 1) % window.HERO_MOVIES.length);
    }
  }, window.HERO_TIMER || 12000);
}

// ── Хуудас бүрт hero тохируулах ──────────────────────────────
window.setPageHero = function (page) {
  const heroWrap = document.getElementById('heroWrap');

  if (page === 'search') {
    if (heroWrap) heroWrap.style.display = 'none';
    window.stopTrailer?.();
    clearInterval(hInt);
    stopProgress();
    return;
  }

  if (heroWrap) heroWrap.style.display = '';

  // ── КИНО ──
  if (page === 'movies') {
    if (window.HERO_MOVIES?.length) {
      window.initHero();
    } else if (window.fetchTMDBNowPlaying) {
      window.fetchTMDBNowPlaying();
    }

  // ── ТОГЛООМ ──
  } else if (page === 'games') {
    window.stopTrailer?.();
    clearInterval(hInt);
    stopProgress();

    const games = window.HERO_GAMES || [];
    if (!games.length) return;

    let gi = 0;

    function showGame(idx) {
      const g = games[idx];
      if (!g) return;

      const posterUrl = `https://img.youtube.com/vi/${g.trailer}/hqdefault.jpg`;
      showPoster(posterUrl);

      const tag = document.getElementById('heroTag');
      if (tag) tag.innerHTML = `🎮 ${(g.cat || 'ТОГЛООМ').toUpperCase()}`;

      const title = document.getElementById('heroTitle');
      if (title) title.textContent = g.title;

      const meta = document.getElementById('heroMeta');
      if (meta) meta.innerHTML = `<span>${g.desc}</span>`;

      const desc = document.getElementById('heroDesc');
      if (desc) desc.textContent = '';

      const dotsEl = document.getElementById('heroDots');
      if (dotsEl) {
        dotsEl.innerHTML = '';
        games.forEach((_, i) => {
          const dot     = document.createElement('div');
          dot.className = 'hero-dot' + (i === idx ? ' active' : '');
          dot.onclick   = () => { clearInterval(hInt); gi = i; showGame(i); startGameSlide(); };
          dotsEl.appendChild(dot);
        });
      }

      const btns = document.getElementById('heroBtns');
      if (btns) {
        btns.innerHTML = `
          <button class="btn-watch"
            onclick="window.openPlayer({title:'${g.title}',embed:'https://www.youtube.com/embed/${g.trailer}?autoplay=1'})">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21"/>
            </svg> Трейлер үзэх
          </button>
          <button class="btn-more"
            onclick="document.getElementById('gameGenreBar')?.scrollIntoView({behavior:'smooth'})">
            🎮 Бүгд харах
          </button>
          <button class="btn-volume" id="heroVolumeBtn" onclick="toggleHeroVolume()" style="display:none">🔇 Дууг нээх</button>`;
      }

      animateContent();
      window.hideVolBtn?.();
      window.stopTrailer?.();

      const ytUrl = `https://www.youtube.com/watch?v=${g.trailer}`;
      const type  = window.detectTrailerType?.(ytUrl);
      if (type) {
        window.playTrailer?.(ytUrl, type,
          () => { hidePoster(); window.showVolBtn?.(); },
          () => { gi = (gi + 1) % games.length; showGame(gi); startGameSlide(); },
          () => { showPoster(posterUrl); window.hideVolBtn?.(); }
        );
      }
    }

    function startGameSlide() {
      clearInterval(hInt);
      hInt = setInterval(() => {
        const cont = document.getElementById('heroVideoContainer');
        if (!cont?.hasChildNodes()) {
          gi = (gi + 1) % games.length;
          showGame(gi);
        }
      }, window.GAME_TIMER || 14000);
    }

    showGame(0);
    startGameSlide();

  // ── ЦАГ АГААР ──
  } else if (page === 'weather') {
    window.stopTrailer?.();
    clearInterval(hInt);
    stopProgress();

    const bg = document.querySelector('.hero-bg');
    if (bg) {
      bg.style.backgroundImage = '';
      bg.style.background = 'linear-gradient(135deg, #1a237e 0%, #0277bd 50%, #01579b 100%)';
      bg.style.opacity    = '1';
    }
    const vig = document.querySelector('.hero-vignette');
    if (vig) vig.style.opacity = '1';

    const tag = document.getElementById('heroTag');
    if (tag) tag.textContent = '🌤 ЦАГ АГААРЫН МЭДЭЭЛЭЛ';

    const title = document.getElementById('heroTitle');
    if (title) title.textContent = 'Монгол улс';

    const meta = document.getElementById('heroMeta');
    if (meta) meta.innerHTML = '<span>21 аймаг, хотын цаг агаар</span>';

    const desc = document.getElementById('heroDesc');
    if (desc) desc.textContent = '';

    const dots = document.getElementById('heroDots');
    if (dots) dots.innerHTML = '';

    const btns = document.getElementById('heroBtns');
    if (btns) {
      btns.innerHTML = `
        <button class="btn-watch" onclick="window.loadWeather?.()">☁️ Цаг агаар харах</button>
        <button class="btn-more"  onclick="window.refreshWeather?.()">🔄 Шинэчлэх</button>`;
    }
    window.hideVolBtn?.();
    animateContent();

    const cityQuery = window.DEFAULT_CITY || 'Ulaanbaatar';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&appid=${window.OW_KEY}&units=metric`)
      .then(r => r.json())
      .then(d => {
        if (!d?.main) return;
        const temp = Math.round(d.main.temp);
        const feel = Math.round(d.main.feels_like);
        const cond = d.weather[0].main.toLowerCase();
        let icon = '🌤';
        if (cond.includes('clear'))                         icon = '☀️';
        else if (cond.includes('cloud'))                    icon = '⛅';
        else if (cond.includes('rain'))                     icon = '🌧️';
        else if (cond.includes('snow'))                     icon = '❄️';
        else if (cond.includes('thunder'))                  icon = '⛈️';
        else if (cond.includes('mist') || cond.includes('fog')) icon = '🌫️';

        const t = document.getElementById('heroTitle');
        if (t) t.textContent = `${icon} ${cityQuery}  ${temp > 0 ? '+' : ''}${temp}°C`;

        const m = document.getElementById('heroMeta');
        if (m) m.innerHTML = `
          <span>${d.weather[0].description}</span>
          <span>·</span><span>🌡️ ${feel > 0 ? '+' : ''}${feel}°C</span>
          <span>·</span><span>💧 ${d.main.humidity}%</span>
          <span>·</span><span>💨 ${(d.wind.speed * 3.6).toFixed(0)} км/ц</span>`;

        let gradient = 'linear-gradient(135deg,#1a237e,#0277bd,#01579b)';
        if      (temp < -20) gradient = 'linear-gradient(135deg,#0d1b2a,#1b2a3b,#4fc3f7)';
        else if (temp <  -5) gradient = 'linear-gradient(135deg,#1a237e,#283593,#81d4fa)';
        else if (temp >  20) gradient = 'linear-gradient(135deg,#4a0000,#b71c1c,#ff8f00)';
        else if (temp >  10) gradient = 'linear-gradient(135deg,#1b5e20,#2e7d32,#66bb6a)';

        const b = document.querySelector('.hero-bg');
        if (b) b.style.background = gradient;
      })
      .catch(() => {});
  }
};
