// player.js
import './player-hls.js';

window.openPlayer = (m) => {
  if (!window.currentUser) {
    window.closeM('movieModal'); window.openAuth('login');
    return window.toast('Үзэхийн тулд нэвтэрнэ үү 🔐');
  }
  const wrap = document.getElementById('playerWrap');
  const p2p  = document.getElementById('p2pStatus');
  wrap.innerHTML = ''; window.destroyHLS();

  if (m.embed?.includes('.m3u8')) {
    window.playHLS(m.embed, wrap, p2p);
  } else if (m.embed) {
    if (p2p) p2p.style.display = 'none';
    wrap.innerHTML = `<iframe src="${m.embed}" allowfullscreen style="width:100%;height:100%;border:none;background:#000;"></iframe>`;
  }
  document.getElementById('pTitle').textContent = m.title;
  document.getElementById('movieModal').classList.remove('open');
  document.getElementById('playerModal').classList.add('open');
};

window.closeM = (id) => {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
  if (id === 'gameModal')   document.getElementById('gmFrame').src = '';
  if (id === 'playerModal') { const w = document.getElementById('playerWrap'); if (w) w.innerHTML = ''; window.destroyHLS(); }
};
window.closeMb = (e, id) => { if (e.target.id === id) window.closeM(id); };
