// ============================================================
// ai-assistant.js — Nabooshy AI v3.1 (Prompt засварласан)
// ============================================================

const API_KEYS = [
  'AIzaSyCD4uxgrRQGeDFryHGxaKOsT8h8ilYrPB0',
  'AIzaSyDVDO0plXykZt_aFsommlc4_Dzdhqyi_mg',
  'AIzaSyCUXy3kg6S6PwB3ZknM3OgE7U0q_JNFr0g',
  'AIzaSyCb9IEwdPmFNGGSJ3fIpXe9S-gGBWbvosQ',
  'AIzaSyC3EBiC-KTPxnVL9G_mFdXIUD4CCBnHctc',
  'AIzaSyD-1j16j_AhGIKlyAGIQPXyLubeTszhCLU',
  'AIzaSyBug2TvjeSJEWLtTQqGo0keJNXSslu9BcA',
  'AIzaSyBvLMa8bUjItAeFHU3rV5IJ6mK2b7X1sl8',
  'AIzaSyAPOFp7EU_j6ZLBTxMxMGjxH9F0m3cPlmQ',
];
const validKeys = API_KEYS.filter(k => k && k.trim().startsWith('AIza'));

// ── Captcha ──────────────────────────────────────────────────
let _captchaAnswer = 0;
function newCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  _captchaAnswer = a + b;
  const el = document.getElementById('ai-captcha-q');
  if (el) el.textContent = `${a} + ${b} = ?`;
}

// ── HTML ──────────────────────────────────────────────────────
const aiHTML = `
<style>
#ai-bot-wrap {
  position: fixed; bottom: 28px; left: 28px; z-index: 9999;
  font-family: 'Inter', sans-serif;
}
#ai-toggle-btn {
  width: 58px; height: 58px; border-radius: 50%;
  background: linear-gradient(135deg, #1e88e5, #1043a0);
  border: none; cursor: pointer;
  box-shadow: 0 6px 24px rgba(30,136,229,0.55);
  display: flex; align-items: center; justify-content: center;
  font-size: 26px;
  transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s;
  position: relative;
}
#ai-toggle-btn:hover { transform: scale(1.12) translateY(-4px); box-shadow: 0 12px 32px rgba(30,136,229,.7); }
#ai-toggle-btn::after {
  content:''; position:absolute; inset:-4px; border-radius:50%;
  border:2px solid rgba(30,136,229,.4);
  animation: ai-pulse 2s ease-out infinite;
}
@keyframes ai-pulse { 0%{transform:scale(1);opacity:1} 100%{transform:scale(1.5);opacity:0} }
#ai-notif-badge {
  position:absolute; top:-2px; right:-2px;
  width:18px; height:18px; border-radius:50%;
  background:#e50914; color:#fff;
  font-size:10px; font-weight:700;
  display:flex; align-items:center; justify-content:center;
  border:2px solid #050505;
  animation: ai-badge-pop .4s cubic-bezier(.34,1.56,.64,1);
}
@keyframes ai-badge-pop { from{transform:scale(0)} to{transform:scale(1)} }
#ai-chat-box {
  display:none; width:360px;
  background:rgba(10,10,16,.97);
  backdrop-filter:blur(24px);
  border:1px solid rgba(255,255,255,.08);
  border-radius:22px; overflow:hidden;
  box-shadow:0 20px 60px rgba(0,0,0,.9), 0 0 0 1px rgba(30,136,229,.15);
  margin-bottom:14px;
  animation: ai-slide-up .35s cubic-bezier(.34,1.56,.64,1);
  transform-origin: bottom left;
}
@keyframes ai-slide-up {
  from{opacity:0;transform:scale(.85) translateY(20px)}
  to  {opacity:1;transform:scale(1)   translateY(0)}
}
.ai-hdr {
  background:linear-gradient(135deg,#1e88e5,#1043a0);
  padding:14px 16px;
  display:flex; align-items:center; justify-content:space-between;
}
.ai-hdr-l { display:flex; align-items:center; gap:10px; }
.ai-hdr-av {
  width:36px; height:36px; border-radius:50%;
  background:rgba(255,255,255,.15);
  display:flex; align-items:center; justify-content:center;
  font-size:18px; border:1.5px solid rgba(255,255,255,.25);
}
.ai-hdr-name { color:#fff; font-weight:700; font-size:14px; }
.ai-hdr-status { display:flex; align-items:center; gap:5px; font-size:11px; color:rgba(255,255,255,.7); margin-top:1px; }
.ai-dot { width:6px; height:6px; border-radius:50%; background:#69f0ae; box-shadow:0 0 6px #69f0ae; animation:ai-blink 2s infinite; }
@keyframes ai-blink { 0%,100%{opacity:1} 50%{opacity:.4} }
.ai-x {
  background:rgba(255,255,255,.12); border:none; color:#fff;
  width:28px; height:28px; border-radius:50%; cursor:pointer;
  font-size:13px; transition:.2s;
  display:flex; align-items:center; justify-content:center;
}
.ai-x:hover { background:rgba(255,255,255,.3); }
#ai-chips {
  display:flex; gap:6px; flex-wrap:wrap;
  padding:10px 12px 0;
}
.ai-chip {
  background:rgba(30,136,229,.12);
  border:1px solid rgba(30,136,229,.25);
  color:#90caf9; font-size:11px; font-weight:500;
  padding:4px 11px; border-radius:20px; cursor:pointer;
  transition:all .2s; white-space:nowrap;
}
.ai-chip:hover { background:rgba(30,136,229,.28); color:#fff; }
#ai-msgs {
  height:280px; overflow-y:auto;
  padding:12px 12px 6px;
  display:flex; flex-direction:column; gap:10px;
  scroll-behavior:smooth;
}
#ai-msgs::-webkit-scrollbar { width:3px; }
#ai-msgs::-webkit-scrollbar-thumb { background:rgba(255,255,255,.1); border-radius:3px; }
.ai-row { display:flex; gap:8px; animation:ai-in .3s ease; }
@keyframes ai-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
.ai-row.user { flex-direction:row-reverse; }
.ai-ico {
  width:28px; height:28px; border-radius:50%; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  font-size:14px; background:rgba(255,255,255,.07);
  align-self:flex-end;
}
.ai-row.user .ai-ico { background:#e50914; font-size:11px; font-weight:700; color:#fff; }
.ai-bbl {
  max-width:83%; padding:10px 13px;
  font-size:13px; line-height:1.6;
  word-wrap:break-word; border-radius:16px;
}
.ai-row.bot .ai-bbl {
  background:rgba(30,136,229,.1);
  border:1px solid rgba(30,136,229,.2);
  color:#e3f2fd; border-radius:4px 16px 16px 16px;
}
.ai-row.user .ai-bbl {
  background:#e50914; color:#fff;
  border-radius:16px 4px 16px 16px;
  box-shadow:0 4px 14px rgba(229,9,20,.3);
}
.ai-auth-panel {
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.1);
  border-radius:14px; padding:14px;
  margin-top:8px; display:flex; flex-direction:column; gap:10px;
}
.ai-auth-tabs { display:flex; gap:6px; margin-bottom:2px; }
.ai-auth-tab {
  flex:1; padding:7px; border-radius:8px;
  font-size:12px; font-weight:600; cursor:pointer;
  border:1px solid rgba(255,255,255,.1);
  background:transparent; color:rgba(255,255,255,.5); transition:all .2s;
}
.ai-auth-tab.on { background:#1e88e5; color:#fff; border-color:#1e88e5; }
.ai-auth-inp {
  width:100%; background:rgba(255,255,255,.07);
  border:1px solid rgba(255,255,255,.12);
  border-radius:8px; padding:10px 12px;
  color:#fff; font-size:13px; outline:none;
  font-family:'Inter',sans-serif; transition:.2s; box-sizing:border-box;
}
.ai-auth-inp:focus { border-color:#1e88e5; background:rgba(0,0,0,.4); }
.ai-auth-inp::placeholder { color:rgba(255,255,255,.3); }
.ai-captcha-row {
  background:rgba(255,193,7,.07);
  border:1px solid rgba(255,193,7,.2);
  border-radius:8px; padding:10px 12px;
  display:flex; flex-direction:column; gap:6px;
}
.ai-captcha-label { font-size:11px; color:#ffc107; font-weight:600; }
.ai-auth-btn {
  width:100%; padding:11px; background:#e50914; color:#fff;
  border:none; border-radius:10px; font-size:13px; font-weight:700;
  cursor:pointer; transition:all .2s; font-family:'Inter',sans-serif;
}
.ai-auth-btn:hover { background:#b20710; transform:scale(1.02); }
.ai-auth-btn.blue { background:#1e88e5; }
.ai-auth-btn.blue:hover { background:#1043a0; }
.ai-auth-hint { font-size:11px; color:rgba(255,255,255,.4); text-align:center; line-height:1.5; }
.ai-mcard {
  background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1);
  border-radius:10px; padding:9px 11px; margin-top:6px; cursor:pointer;
  transition:all .2s; display:flex; align-items:center; gap:9px;
}
.ai-mcard:hover { background:rgba(30,136,229,.15); border-color:#1e88e5; }
.ai-mcard img { width:36px; height:52px; border-radius:5px; object-fit:cover; flex-shrink:0; background:rgba(255,255,255,.08); }
.ai-mcard-info { flex:1; min-width:0; }
.ai-mcard-title { font-size:12px; font-weight:700; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ai-mcard-meta { font-size:11px; color:#90caf9; margin-top:2px; }
.ai-mcard-play { width:26px; height:26px; border-radius:50%; background:#e50914; color:#fff; display:flex; align-items:center; justify-content:center; font-size:9px; flex-shrink:0; }
.ai-typing { display:flex; gap:4px; align-items:center; padding:2px 0; }
.ai-typing span { width:7px; height:7px; background:#4fc3f7; border-radius:50%; animation:ai-bounce 1.2s infinite ease-in-out both; }
.ai-typing span:nth-child(1){animation-delay:-.24s}
.ai-typing span:nth-child(2){animation-delay:-.12s}
@keyframes ai-bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
.ai-inp-row {
  padding:9px 11px 13px; background:rgba(0,0,0,.3);
  border-top:1px solid rgba(255,255,255,.05);
  display:flex; gap:7px; align-items:center;
}
#ai-input {
  flex:1; background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.1);
  border-radius:22px; padding:10px 14px;
  color:#fff; font-size:13px; outline:none;
  font-family:'Inter',sans-serif; transition:.25s;
}
#ai-input:focus { border-color:#1e88e5; background:rgba(0,0,0,.5); }
#ai-input::placeholder { color:rgba(255,255,255,.3); }
#ai-send-btn {
  width:38px; height:38px; border-radius:50%;
  background:#1e88e5; border:none; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  transition:.2s; flex-shrink:0; color:#fff;
}
#ai-send-btn:hover { background:#1043a0; transform:scale(1.08); }
@media (max-width:480px) {
  #ai-chat-box { width:calc(100vw - 24px); }
  #ai-bot-wrap { bottom:16px; left:10px; }
}
</style>

<div id="ai-bot-wrap">
  <div id="ai-chat-box">
    <div class="ai-hdr">
      <div class="ai-hdr-l">
        <div class="ai-hdr-av">🤖</div>
        <div>
          <div class="ai-hdr-name">Nabooshy AI</div>
          <div class="ai-hdr-status">
            <div class="ai-dot"></div>
            <span>Онлайн · Бэлэн байна</span>
          </div>
        </div>
      </div>
      <button class="ai-x" id="ai-close-btn">✕</button>
    </div>
    <div id="ai-chips">
      <span class="ai-chip" onclick="aiQ('Action кино санал болго')">💥 Action</span>
      <span class="ai-chip" onclick="aiQ('Comedy кино байна уу')">😂 Comedy</span>
      <span class="ai-chip" onclick="aiQ('Онлайн тоглоом байна уу')">🎮 Тоглоом</span>
      <span class="ai-chip" onclick="aiQ('Зар байршуулах')">📢 Зар</span>
    </div>
    <div id="ai-msgs"></div>
    <div class="ai-inp-row">
      <input id="ai-input" type="text" placeholder="Асуух, хайх..." autocomplete="off">
      <button id="ai-send-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  </div>
  <button id="ai-toggle-btn" title="Nabooshy AI">
    🤖
    <div id="ai-notif-badge" style="display:none">1</div>
  </button>
</div>
`;

document.body.insertAdjacentHTML('beforeend', aiHTML);

const aiBox    = document.getElementById('ai-chat-box');
const aiToggle = document.getElementById('ai-toggle-btn');
const aiClose  = document.getElementById('ai-close-btn');
const aiInput  = document.getElementById('ai-input');
const aiSend   = document.getElementById('ai-send-btn');
const aiMsgs   = document.getElementById('ai-msgs');
const aiBadge  = document.getElementById('ai-notif-badge');

let _authMode  = 'register';
let _authShown = false;

function openChat() {
  aiBox.style.display    = 'block';
  aiToggle.style.display = 'none';
  aiBadge.style.display  = 'none';
  setTimeout(() => aiInput.focus(), 200);
}
function closeChat() {
  aiBox.style.display    = 'none';
  aiToggle.style.display = 'flex';
}
aiToggle.onclick = openChat;
aiClose.onclick  = closeChat;

function addMsg(role, html, isTyping = false) {
  const wrap = document.createElement('div');
  wrap.className = `ai-row ${role}`;
  const ico = document.createElement('div');
  ico.className = 'ai-ico';
  if (role === 'bot') {
    ico.textContent = '🤖';
  } else {
    const u = window.currentUser;
    ico.textContent = u ? u.name[0].toUpperCase() : '👤';
  }
  const bbl = document.createElement('div');
  bbl.className = 'ai-bbl';
  if (isTyping) {
    bbl.innerHTML = `<div class="ai-typing"><span></span><span></span><span></span></div>`;
    wrap.id = 'ai-typing-el';
  } else {
    bbl.innerHTML = html;
  }
  wrap.append(ico, bbl);
  aiMsgs.appendChild(wrap);
  aiMsgs.scrollTop = aiMsgs.scrollHeight;
  return wrap;
}

function mCard(m) {
  const isSeries = !!m.episodes;
  const safeM = encodeURIComponent(JSON.stringify(m));
  const fn = isSeries
    ? `window.openSeriesDetail(window.SERIES?.find(s=>s.id==='${m.id}')||JSON.parse(decodeURIComponent('${safeM}')))`
    : `window.openMovieDetail(window.MOVIES?.find(x=>x.id==='${m.id}')||JSON.parse(decodeURIComponent('${safeM}')))`;
  return `
    <div class="ai-mcard" onclick="${fn}">
      <img src="${m.poster||'https://placehold.co/36x52/111/555?text=N'}"
           onerror="this.src='https://placehold.co/36x52/111/555?text=N'">
      <div class="ai-mcard-info">
        <div class="ai-mcard-title">${m.title}</div>
        <div class="ai-mcard-meta">${[m.year, m.rating?'⭐'+m.rating:'', m.cat?.split(',')[0]].filter(Boolean).join(' · ')}</div>
      </div>
      <div class="ai-mcard-play">▶</div>
    </div>`;
}

function authPanel(mode = 'register') {
  _authMode = mode;
  newCaptcha();
  return `
    <div class="ai-auth-panel" id="ai-auth-panel">
      <div class="ai-auth-tabs">
        <button class="ai-auth-tab ${mode==='register'?'on':''}" onclick="aiSwitchAuth('register')">📝 Бүртгүүлэх</button>
        <button class="ai-auth-tab ${mode==='login'?'on':''}"    onclick="aiSwitchAuth('login')">🔐 Нэвтрэх</button>
      </div>
      <input class="ai-auth-inp" id="ai-email" type="email"     placeholder="И-мэйл хаяг">
      <input class="ai-auth-inp" id="ai-pass"  type="password"  placeholder="${mode==='register'?'Нууц үг (доод тал нь 6 тэмдэгт)':'Нууц үг'}">
      <div class="ai-captcha-row">
        <div class="ai-captcha-label">🛡️ Бот хамгаалалт:</div>
        <div id="ai-captcha-q" style="font-size:16px;color:#fff;font-weight:700;"></div>
        <input class="ai-auth-inp" id="ai-captcha-a" type="number" placeholder="Хариуг бич...">
      </div>
      <button class="ai-auth-btn ${mode==='login'?'blue':''}" onclick="aiDoAuth()">
        ${mode==='register'?'🚀 Бүртгүүлж эхлэх':'✅ Нэвтрэх'}
      </button>
      <div class="ai-auth-hint">
        Бодит Gmail байх шаардлагагүй — дурын и-мэйл формат ажиллана.
      </div>
    </div>`;
}

window.aiSwitchAuth = (mode) => {
  _authMode = mode;
  newCaptcha();
  const panel = document.getElementById('ai-auth-panel');
  if (!panel) return;
  panel.querySelectorAll('.ai-auth-tab').forEach(t => t.classList.remove('on'));
  panel.querySelectorAll('.ai-auth-tab')[mode==='register'?0:1]?.classList.add('on');
  const passInp = document.getElementById('ai-pass');
  if (passInp) passInp.placeholder = mode==='register' ? 'Нууц үг (доод тал нь 6 тэмдэгт)' : 'Нууц үг';
  const btn = panel.querySelector('.ai-auth-btn');
  if (btn) {
    btn.textContent = mode==='register' ? '🚀 Бүртгүүлж эхлэх' : '✅ Нэвтрэх';
    btn.className   = `ai-auth-btn ${mode==='login'?'blue':''}`;
  }
};

window.aiDoAuth = async () => {
  const email   = (document.getElementById('ai-email')?.value    || '').trim();
  const pass    = (document.getElementById('ai-pass')?.value     || '');
  const captcha = parseInt(document.getElementById('ai-captcha-a')?.value || '0');

  if (!email || !email.includes('@')) return showAuthErr('И-мэйл хаягаа зөв оруулна уу 📧');
  if (pass.length < 6)               return showAuthErr('Нууц үг доод тал нь 6 тэмдэгт байна 🔒');
  if (isNaN(captcha) || captcha !== _captchaAnswer) {
    newCaptcha();
    return showAuthErr('Тооны бодлогыг буруу бодлоо 🔢');
  }

  const btn = document.querySelector('#ai-auth-panel .ai-auth-btn');
  if (btn) { btn.textContent = '⏳ Түр хүлээнэ үү...'; btn.disabled = true; }

  try {
    const { auth } = await import('./firebase-config.js');
    const { signInWithEmailAndPassword, createUserWithEmailAndPassword }
      = await import('https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js');

    if (_authMode === 'register') {
      await createUserWithEmailAndPassword(auth, email, pass);
      onAuthSuccess('register');
    } else {
      await signInWithEmailAndPassword(auth, email, pass);
      onAuthSuccess('login');
    }
  } catch (err) {
    newCaptcha();
    if (btn) { btn.textContent = _authMode==='register'?'🚀 Бүртгүүлж эхлэх':'✅ Нэвтрэх'; btn.disabled = false; }
    const msg =
      err.code === 'auth/email-already-in-use'  ? 'Энэ и-мэйл бүртгэлтэй байна — Нэвтрэх таб дарна уу 👆' :
      err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential' ? 'Нууц үг буруу байна 🔑' :
      err.code === 'auth/user-not-found'         ? 'Энэ и-мэйл бүртгэлгүй — Бүртгүүлэх таб дарна уу 👆' :
      'Алдаа: ' + (err.message || err.code);
    showAuthErr(msg);
  }
};

function showAuthErr(msg) {
  newCaptcha();
  addMsg('bot', `⚠️ ${msg}`);
}

function onAuthSuccess(type) {
  document.getElementById('ai-auth-panel')?.closest('.ai-row')?.remove();
  const name = window.currentUser?.name || '';
  if (type === 'register') {
    addMsg('bot', `🎉 Амжилттай бүртгүүллээ! Тавтай морил <strong>${name}</strong>! Бүх кино, тоглоомыг чөлөөтэй үзэж тоглоорой 🍿🎮`);
  } else {
    addMsg('bot', `👋 Дахин тавтай морил, <strong>${name}</strong>! Таны дуртай кинонууд хүлээж байна 🎬`);
  }
  if (window._pendingMovie) {
    setTimeout(() => { window.openPlayer?.(window._pendingMovie); window._pendingMovie = null; }, 800);
  }
  const chips = document.getElementById('ai-chips');
  if (chips) chips.style.display = 'flex';
}

// ── Автомат угтлага ───────────────────────────────────────────
function autoWelcome() {
  if (window.currentUser) return;
  const seen = localStorage.getItem('naboo_ai_welcomed');

  setTimeout(() => {
    aiBadge.style.display = 'flex';
    setTimeout(() => {
      if (aiBox.style.display === 'block') return;
      openChat();
      if (!seen) {
        addMsg('bot', `👋 Сайн уу! <strong>Nabooshy</strong>-д тавтай морил!<br><br>🎬 Кино &nbsp;·&nbsp; 📺 Цуврал &nbsp;·&nbsp; 🎮 Тоглоом — бүгд нэг дороо, <strong>үнэ төлбөргүй!</strong>`);
        setTimeout(() => {
          addMsg('bot', `Үзэхийн тулд хурдан бүртгүүлнэ үү 👇` + authPanel('register'));
          newCaptcha(); _authShown = true;
          localStorage.setItem('naboo_ai_welcomed', '1');
        }, 1200);
      } else {
        addMsg('bot', `👋 Дахин тавтай морил! Нэвтрэнэ үү 👇` + authPanel('login'));
        newCaptcha(); _authShown = true;
      }
    }, 2500);
  }, 1500);
}

let _prevUser = null;
setInterval(() => {
  const cur = window.currentUser;
  if (cur && !_prevUser) {
    _prevUser = cur;
    if (!_authShown) {
      const chips = document.getElementById('ai-chips');
      if (chips) chips.style.display = 'flex';
      if (aiBox.style.display === 'block') {
        addMsg('bot', `👋 Тавтай морил, <strong>${cur.name}</strong>! Юу хайж байна? 🎬`);
      }
    }
  }
  _prevUser = cur;
}, 500);

// ── Локал хайлт ───────────────────────────────────────────────
function localSearch(q) {
  const all = [...(window.MOVIES||[]), ...(window.SERIES||[])];
  const byName = all.filter(m =>
    m.title?.toLowerCase().includes(q) || m.title_en?.toLowerCase().includes(q)
  ).slice(0, 4);
  if (byName.length) return byName;
  return all.filter(m => m.cat?.toLowerCase().includes(q)).slice(0, 4);
}
function localGameSearch(q) {
  return (window.GAMES_LIST||[]).filter(g =>
    g.title?.toLowerCase().includes(q) || g.desc?.toLowerCase().includes(q) || g.cat?.toLowerCase().includes(q)
  ).slice(0, 3);
}

// ── Сайтын мэдээлэл + prompt ──────────────────────────────────
function buildCtx() {
  const movies = (window.MOVIES||[]).slice(0, 80);
  const series = (window.SERIES||[]).slice(0, 40);
  const games  =  window.GAMES_LIST||[];
  const phone  =  window.CONTACT_PHONE || '9937-6238';
  const year   =  window.CURRENT_YEAR  || 2026;

  const genreMap = {};
  movies.forEach(m => {
    (m.cat||'').split(',').forEach(g => {
      const k = g.trim();
      if (!genreMap[k]) genreMap[k] = [];
      if (genreMap[k].length < 6) genreMap[k].push(m.title);
    });
  });

  return `
=== NABOOSHY САЙТЫН МЭДЭЭЛЭЛ ===
Нэр: Nabooshy — Монголын онлайн кино, цуврал, тоглоомын платформ
Үүссэн он: ${year} | Зар холбоо барих: ${phone}
Нийт кино: ${movies.length} | Цуврал: ${series.length} | Тоглоом: ${games.length}

КИНОНУУДЫН БҮРЭН ЖАГСААЛТ (нэр|жил|⭐үнэлгээ|ангилал):
${movies.map(m=>`${m.title}|${m.year}|${m.rating}|${m.cat}`).join('\n')}

ЦУВРАЛ:
${series.map(s=>`${s.title}|${s.year}|${s.cat}`).join('\n')}

ТОГЛООМУУД:
${games.map(g=>`${g.title}[${g.cat}] — ${g.desc}`).join('\n')}

АНГИЛЛААР:
${Object.entries(genreMap).map(([g,t])=>`${g}: ${t.join(', ')}`).join('\n')}

ZAR HOLBOO: Зар байршуулах, реклам, сурталчилгааны асуудлаар: ${phone}
===`;
}

// ── Gemini ────────────────────────────────────────────────────
async function askGemini(userText) {
  if (!validKeys.length) return { text: '⚠️ API байхгүй.', movies: [] };

  const prompt = `
${buildCtx()}

Чи "Nabooshy AI" — Монголын кино, тоглоомын платформын ухаалаг туслах.

ХАТУУ ДҮРМҮҮД:
1. ЗӨВХӨН Монгол хэлээр хариулна. Товч, найрсаг (2-4 өгүүлбэр).
2. Кино санал болгохдоо ДЭЭРХ жагсаалтаас л авна. Байхгүй кино зохиохгүй.
3. Санал болгосон кино нэрийг [[НЭР]] гэж тэмдэглэ. Жишээ: [[Inception]]
4. Сайтын тухай асуувал (ямар site вэ, юу хийдэг вэ, хэдэн кино байна гэх мэт) → товч, бахархалтайгаар тайлбарлана.
5. "Зар байршуулах", "реклам", "сурталчилгаа" гэсэн түлхүүр үг байвал → заавал ${window.CONTACT_PHONE||'9937-6238'} дугаарыг дурдана.
6. "Чи хэн бэ", "ямар AI вэ", "хэн чамайг бүтээсэн" гэвэл → "Би Nabooshy AI. Намайг хиймэл оюун ухааны архитект бүтээсэн бөгөөд Nabooshy платформын зориулалтаар ажилладаг." гэж хариулна.
7. Сайтын техник бүтэц (код, файл, API түлхүүр) → огт хэлэхгүй, "Тэр мэдээлэл хаалттай" гэж хэл.
8. Улс төр, гэмт хэрэг, хортой контент → "Зөвхөн кино, тоглоом санал болгоно" гэж татгалзана.
9. Мэндчилгээ (сайн уу, байна уу) → дулааханаар мэндлэнэ.
10. Талархал (баярлалаа, гайхалтай) → эелдэгээр хариулна.

Хэрэглэгч: "${userText}"
`;

  for (const key of [...validKeys].sort(()=>Math.random()-.5)) {
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
        { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ contents:[{ parts:[{ text: prompt }] }] }) }
      );
      if (!r.ok) continue;
      const d   = await r.json();
      const raw = d.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const mentioned = [];
      const cleaned = raw.replace(/\[\[([^\]]+)\]\]/g, (_, name) => {
        const found = [...(window.MOVIES||[]),...(window.SERIES||[])].find(m =>
          m.title?.toLowerCase().includes(name.toLowerCase())
        );
        if (found) mentioned.push(found);
        return `<strong style="color:#90caf9">${name}</strong>`;
      });
      return { text: cleaned, movies: mentioned };
    } catch(e) { console.warn(e); }
  }
  return { text: 'Одоо ачаалалтай байна. Түр хүлээгээд дахиж оролдоно уу ⏳', movies: [] };
}

// ── Илгээх ────────────────────────────────────────────────────
async function handleSend() {
  const text = aiInput.value.trim();
  if (!text) return;
  aiInput.value = '';

  if (!window.currentUser && !_authShown) {
    addMsg('user', text);
    addMsg('bot', `Асуултанд хариулахын тулд эхлээд бүртгүүлнэ үү 👇` + authPanel('register'));
    newCaptcha(); _authShown = true;
    return;
  }

  const chips = document.getElementById('ai-chips');
  if (chips) chips.style.display = 'none';

  addMsg('user', text);
  const typing = addMsg('bot', '', true);

  const q           = text.toLowerCase();
  const localMovies = localSearch(q);
  const localGames  = localGameSearch(q);
  const { text: aiText, movies } = await askGemini(text);

  typing.remove();

  const showMovies = movies.length ? movies : localMovies.slice(0, 3);
  let html = aiText;
  if (showMovies.length) html += showMovies.map(mCard).join('');

  if (localGames.length && /тоглоом|game|chess|tetris|snake|wordle|sudoku|puzzle|arcade/i.test(text)) {
    html += `<div style="margin-top:8px;font-size:11px;color:#90caf9;margin-bottom:4px;">🎮 Тоглоомууд:</div>`;
    html += localGames.map(g => `
      <div class="ai-mcard" onclick="window.openGame&&window.openGame(window.GAMES_LIST?.find(x=>x.title==='${g.title}')||${JSON.stringify(g)})">
        <div style="font-size:24px;width:36px;text-align:center">${g.emoji}</div>
        <div class="ai-mcard-info">
          <div class="ai-mcard-title">${g.title}</div>
          <div class="ai-mcard-meta">${g.desc}</div>
        </div>
        <div class="ai-mcard-play">▶</div>
      </div>`).join('');
  }

  addMsg('bot', html);
}

window.aiQ = (text) => { aiInput.value = text; handleSend(); };
aiSend.addEventListener('click', handleSend);
aiInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

// ── Эхлүүлэх ─────────────────────────────────────────────────
const _startWelcome = setInterval(() => {
  if (typeof window.currentUser !== 'undefined') {
    clearInterval(_startWelcome);
    if (!window.currentUser) autoWelcome();
  }
}, 300);
