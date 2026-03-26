// hero.js
import './hero-trailer.js';
import './hero-volume.js';
import './hero-tmdb.js';

let hi = 0, hInt = null;

function showPoster(url) {
  const bg  = document.querySelector('.hero-bg');
  const vig = document.querySelector('.hero-vignette');
  if (bg)  { bg.style.backgroundImage = `url('${url}')`; bg.style.background = ''; bg.style.opacity = '1'; }
  if (vig) vig.style.opacity = '1';
}
function hidePoster() {
  const bg  = document.querySelector('.hero-bg');
  const vig = document.querySelector('.hero-vignette');
  if (bg)  bg.style.opacity = '0';
  if (vig) vig.style.opacity = '0';
}

// ── КИНО hero ────────────────────────────────────────────────
window.setHero = async (i) => {
  hi = i;
  const m = window.HERO_MOVIES?.[i];
  if (!m) return;

  document.querySelectorAll('.hero-dot').forEach((d, idx) =>
    d.classList.toggle('active', idx === i));

  const wb = document.getElementById('heroWatch');
  const mb = document.getElementById('heroMore');
  if (wb) wb.onclick = () => window.openPlayer(m);
  if (mb) mb.onclick = () => window.openMovieDetail(m);

  const te = document.getElementById('heroTitle');
  if (te) te.textContent = m.title;

  window.stopTrailer();
  showPoster(m.poster);
  window.hideVolBtn();
  window._heroMuted = true;
  window.updateVolBtn(true);

  let trailerUrl = m.trailer || null;
  if (!trailerUrl && m.tmdbId) trailerUrl = await window.fetchTrailerKey(m.tmdbId);

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

window.initHero = function() {
  if (!window.HERO_MOVIES?.length) return;
  window.hideVolBtn();

  const tag = document.getElementById('heroTag');
  if (tag) tag.textContent = '🔥 ДЭЛХИЙН ШИЛДЭГ';

  const btns = document.getElementById('heroBtns');
  if (btns) {
    btns.innerHTML = `
      <button class="btn-watch" id="heroWatch">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Үзэх
      </button>
      <button class="btn-more" id="heroMore">ℹ Дэлгэрэнгүй</button>
      <button class="btn-volume" id="heroVolumeBtn" onclick="toggleHeroVolume()">🔇 Дууг нээх</button>`;
  }

  const dotsEl = document.getElementById('heroDots');
  if (dotsEl) {
    dotsEl.innerHTML = '';
    window.HERO_MOVIES.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => { clearInterval(hInt); window.setHero(i); startSlide(); };
      dotsEl.appendChild(dot);
    });
  }
  window.setHero(0);
  startSlide();
};

function startSlide() {
  clearInterval(hInt);
  hInt = setInterval(() => {
    const cont = document.getElementById('heroVideoContainer');
    if (!cont?.hasChildNodes()) window.setHero((hi + 1) % window.HERO_MOVIES.length);
  }, 12000);
}

// ── Хуудас бүрт hero тохируулах ──────────────────────────────
window.setPageHero = function(page) {
  const heroWrap = document.getElementById('heroWrap');

  if (page === 'search') {
    if (heroWrap) heroWrap.style.display = 'none';
    window.stopTrailer?.();
    clearInterval(hInt);
    return;
  }

  if (heroWrap) heroWrap.style.display = '';

  // ── КИНО ────────────────────────────────────────────────────
  if (page === 'movies') {
    if (window.HERO_MOVIES?.length) {
      window.initHero();
    } else if (window.fetchTMDBNowPlaying) {
      window.fetchTMDBNowPlaying();
    }

  // ── ТОГЛООМ ─────────────────────────────────────────────────
  } else if (page === 'games') {
    window.stopTrailer?.();
    clearInterval(hInt);

    const games = (window.GAMES_LIST || []).filter(g => g.trailer);
    if (!games.length) return;

    let gi = 0;
    function showGame(idx) {
      const g = games[idx];
      if (!g) return;

      // Poster poster болгон хар gradient харуулах
      const bg = document.querySelector('.hero-bg');
      if (bg) {
        const c = g.color || ['#1a1a2e','#16213e','#0f3460'];
        bg.style.backgroundImage = '';
        bg.style.background = `linear-gradient(135deg, ${c[0]} 0%, ${c[1]} 50%, ${c[2]} 100%)`;
        bg.style.opacity = '1';
      }
      const vig = document.querySelector('.hero-vignette');
      if (vig) vig.style.opacity = '1';

      // Tag
      const tag = document.getElementById('heroTag');
      if (tag) tag.innerHTML = `🎮 ${(g.cat || 'ТОГЛООМ').toUpperCase()}`;

      // Title
      const title = document.getElementById('heroTitle');
      if (title) title.textContent = g.title;

      // Meta
      const meta = document.getElementById('heroMeta');
      if (meta) meta.innerHTML = `<span style="font-size:28px">${g.emoji}</span><span>${g.desc}</span>`;

      // Dots
      const dotsEl = document.getElementById('heroDots');
      if (dotsEl) {
        dotsEl.innerHTML = '';
        games.slice(0, 8).forEach((_, i) => {
          const dot = document.createElement('div');
          dot.className = 'hero-dot' + (i === idx ? ' active' : '');
          dot.onclick = () => { clearInterval(hInt); gi = i; showGame(i); startGameSlide(); };
          dotsEl.appendChild(dot);
        });
      }

      // Товчнууд
      const btns = document.getElementById('heroBtns');
      if (btns) {
        btns.innerHTML = `
          <button class="btn-watch" onclick="if(!window.currentUser){window.openAuth('login');return window.toast('Тоглохын тулд нэвтэрнэ үү 🔐')}document.getElementById('gmFrame').src='${g.embed}';document.getElementById('gameModal').classList.add('open')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Тоглох
          </button>
          <button class="btn-more" onclick="document.getElementById('gameGenreBar')?.scrollIntoView({behavior:'smooth'})">
            🎮 Бүгд харах
          </button>
          <button class="btn-volume" id="heroVolumeBtn" onclick="toggleHeroVolume()" style="display:none">🔇 Дууг нээх</button>`;
      }

      window.hideVolBtn?.();

      // YouTube trailer тоглуулах
      window.stopTrailer?.();
      const ytUrl = `https://www.youtube.com/watch?v=${g.trailer}`;
      const type  = window.detectTrailerType?.(ytUrl);
      if (type) {
        window.playTrailer?.(ytUrl, type,
          () => {
            if (bg) bg.style.opacity = '0';
            if (vig) vig.style.opacity = '0.3';
            window.showVolBtn?.();
          },
          () => {
            // Дуусахад дараагийн тоглоом руу шилжих
            gi = (gi + 1) % games.length;
            showGame(gi);
            startGameSlide();
          },
          () => {
            // Алдаа гарвал poster харуулах
            if (bg) bg.style.opacity = '1';
            if (vig) vig.style.opacity = '1';
            window.hideVolBtn?.();
          }
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
      }, 14000);
    }

    showGame(0);
    startGameSlide();

  // ── ЦАГ АГААР ───────────────────────────────────────────────
  } else if (page === 'weather') {
    window.stopTrailer?.();
    clearInterval(hInt);

    const bg = document.querySelector('.hero-bg');
    if (bg) {
      bg.style.backgroundImage = '';
      bg.style.background = 'linear-gradient(135deg, #1a237e 0%, #0277bd 50%, #01579b 100%)';
      bg.style.opacity = '1';
    }
    const vig = document.querySelector('.hero-vignette');
    if (vig) vig.style.opacity = '1';

    const tag = document.getElementById('heroTag');
    if (tag) tag.textContent = '🌤 ЦАГ АГААРЫН МЭДЭЭЛЭЛ';

    const title = document.getElementById('heroTitle');
    if (title) title.textContent = 'Монгол улс';

    const meta = document.getElementById('heroMeta');
    if (meta) meta.innerHTML = '<span>21 аймаг, хотын цаг агаар</span>';

    const dots = document.getElementById('heroDots');
    if (dots) dots.innerHTML = '';

    const btns = document.getElementById('heroBtns');
    if (btns) {
      btns.innerHTML = `
        <button class="btn-watch" onclick="window.loadWeather?.()">☁️ Цаг агаар харах</button>
        <button class="btn-more"  onclick="window.refreshWeather?.()">🔄 Шинэчлэх</button>`;
    }
    window.hideVolBtn?.();

    // Улаанбаатарын бодит цаг агаар
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=Ulaanbaatar&appid=${window.OW_KEY}&units=metric`)
      .then(r => r.json())
      .then(d => {
        if (!d?.main) return;
        const temp = Math.round(d.main.temp);
        const feel = Math.round(d.main.feels_like);
        const cond = d.weather[0].main.toLowerCase();
        let icon = '🌤';
        if (cond.includes('clear'))   icon = '☀️';
        else if (cond.includes('cloud')) icon = '⛅';
        else if (cond.includes('rain'))  icon = '🌧️';
        else if (cond.includes('snow'))  icon = '❄️';
        else if (cond.includes('thunder')) icon = '⛈️';
        else if (cond.includes('mist') || cond.includes('fog')) icon = '🌫️';

        const t = document.getElementById('heroTitle');
        if (t) t.textContent = `${icon} Улаанбаатар  ${temp > 0 ? '+' : ''}${temp}°C`;

        const m = document.getElementById('heroMeta');
        if (m) m.innerHTML = `
          <span>${d.weather[0].description}</span>
          <span>·</span><span>🌡️ ${feel > 0 ? '+' : ''}${feel}°C</span>
          <span>·</span><span>💧 ${d.main.humidity}%</span>
          <span>·</span><span>💨 ${(d.wind.speed * 3.6).toFixed(0)} км/ц</span>`;

        let gradient = 'linear-gradient(135deg,#1a237e,#0277bd,#01579b)';
        if (temp < -20) gradient = 'linear-gradient(135deg,#0d1b2a,#1b2a3b,#4fc3f7)';
        else if (temp < -5) gradient = 'linear-gradient(135deg,#1a237e,#283593,#81d4fa)';
        else if (temp > 20) gradient = 'linear-gradient(135deg,#4a0000,#b71c1c,#ff8f00)';
        else if (temp > 10) gradient = 'linear-gradient(135deg,#1b5e20,#2e7d32,#66bb6a)';

        const b = document.querySelector('.hero-bg');
        if (b) b.style.background = gradient;
      })
      .catch(() => {});
  }
};
