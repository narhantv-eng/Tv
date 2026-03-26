// player.js
import './player-hls.js';

// Нэвтрэхийн өмнө дарсан кинонийг хадгалах
window._pendingMovie = null;

window.openPlayer = (m) => {
  if (!window.currentUser) {
    // Кинонийг хадгалаад нэвтрэх цонх нээнэ
    window._pendingMovie = m;
    window.closeM('movieModal');
    window.openAuth('login');
    window.toast('Үзэхийн тулд нэвтэрнэ үү 🔐');
    return;
  }
  _playMovie(m);
};

// Жинхэнэ тоглуулах функц
function _playMovie(m) {
  const wrap = document.getElementById('playerWrap');
  const p2p  = document.getElementById('p2pStatus');
  wrap.innerHTML = '';
  window.destroyHLS();

  if (m.embed?.includes('.m3u8')) {
    window.playHLS(m.embed, wrap, p2p);
  } else if (m.embed) {
    if (p2p) p2p.style.display = 'none';
    wrap.innerHTML = `<iframe src="${m.embed}" allowfullscreen
      style="width:100%;height:100%;border:none;background:#000;"></iframe>`;
  }

  document.getElementById('pTitle').textContent = m.title;
  document.getElementById('movieModal').classList.remove('open');
  document.getElementById('playerModal').classList.add('open');
}

// Нэвтэрсний дараа шууд нээх — auth.js-с дуудагдана
window.onAfterLogin = () => {
  if (window._pendingMovie) {
    const m = window._pendingMovie;
    window._pendingMovie = null;
    window.closeAuth();
    setTimeout(() => _playMovie(m), 300);
  }
};

window.closeM = (id) => {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
  if (id === 'gameModal') document.getElementById('gmFrame').src = '';
  if (id === 'playerModal') {
    const w = document.getElementById('playerWrap');
    if (w) w.innerHTML = '';
    window.destroyHLS();
  }
};

window.closeMb = (e, id) => { if (e.target.id === id) window.closeM(id); };
