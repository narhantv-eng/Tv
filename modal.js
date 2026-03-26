// ============================================================
// player/modal.js — Modal нээх / хаах
// ============================================================

import { playHLS, destroyHLS } from './hls.js';

window.openPlayer = (m) => {
  if (!window.currentUser) {
    window.closeM('movieModal');
    window.openAuth('login');
    return window.toast('Үзэхийн тулд нэвтэрнэ үү 🔐');
  }

  const wrap      = document.getElementById('playerWrap');
  const p2pStatus = document.getElementById('p2pStatus');
  wrap.innerHTML  = '';

  destroyHLS();

  const url = m.embed;

  if (url?.includes('.m3u8')) {
    playHLS(url, wrap, p2pStatus);
  } else if (url) {
    if (p2pStatus) p2pStatus.style.display = 'none';
    wrap.innerHTML = `
      <iframe src="${url}" allowfullscreen
              style="width:100%;height:100%;border:none;background:#000;"></iframe>`;
  }

  document.getElementById('pTitle').textContent = m.title;
  document.getElementById('movieModal').classList.remove('open');
  document.getElementById('playerModal').classList.add('open');
};

window.closeM = (id) => {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');

  if (id === 'gameModal') {
    document.getElementById('gmFrame').src = '';
  }

  if (id === 'playerModal') {
    const w = document.getElementById('playerWrap');
    if (w) w.innerHTML = '';
    destroyHLS();
  }
};

window.closeMb = (e, id) => {
  if (e.target.id === id) window.closeM(id);
};
