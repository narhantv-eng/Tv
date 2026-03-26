// ============================================================
// ai-assistant.js — Nabooshy AI (Ухаалаг хувилбар v2.0)
// ============================================================

const API_KEYS = [
  'AIzaSyCD4uxgrRQGeDFryHGxaKOsT8h8ilYrPB0',
  '', '', '', '', '', '', '', '', ''
];

const validKeys = API_KEYS.filter(k => k && k.trim().startsWith('AIza'));

// ── UI HTML ──────────────────────────────────────────────────
const aiHTML = `
<style>
  #ai-bot-wrap {
    position: fixed; bottom: 28px; left: 28px; z-index: 9999;
    font-family: 'Inter', sans-serif;
  }

  /* Нээх товч */
  #ai-toggle-btn {
    width: 58px; height: 58px; border-radius: 50%;
    background: linear-gradient(135deg, #1e88e5 0%, #1043a0 100%);
    border: none; cursor: pointer;
    box-shadow: 0 6px 24px rgba(30,136,229,0.55);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
    position: relative;
  }
  #ai-toggle-btn:hover {
    transform: scale(1.12) translateY(-4px);
    box-shadow: 0 12px 32px rgba(30,136,229,0.7);
  }
  /* Pulse цагираг */
  #ai-toggle-btn::after {
    content: '';
    position: absolute; inset: -4px;
    border-radius: 50%;
    border: 2px solid rgba(30,136,229,0.4);
    animation: ai-pulse 2s ease-out infinite;
  }
  @keyframes ai-pulse {
    0%   { transform: scale(1);   opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
  }

  /* Chat хайрцаг */
  #ai-chat-box {
    display: none;
    width: 360px;
    background: rgba(12,12,18,0.97);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(30,136,229,0.15);
    animation: ai-slide-up 0.35s cubic-bezier(0.34,1.56,0.64,1);
    transform-origin: bottom left;
    margin-bottom: 14px;
  }
  @keyframes ai-slide-up {
    from { opacity: 0; transform: scale(0.85) translateY(20px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);    }
  }

  /* Header */
  .ai-header {
    background: linear-gradient(135deg, #1e88e5, #1043a0);
    padding: 15px 18px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ai-header-left { display: flex; align-items: center; gap: 10px; }
  .ai-avatar-wrap {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    border: 1.5px solid rgba(255,255,255,0.25);
  }
  .ai-header-info { display: flex; flex-direction: column; gap: 1px; }
  .ai-header-name { color: #fff; font-weight: 700; font-size: 15px; letter-spacing: 0.3px; }
  .ai-header-status {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: rgba(255,255,255,0.7);
  }
  .ai-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #69f0ae;
    box-shadow: 0 0 6px #69f0ae;
    animation: ai-blink 2s infinite;
  }
  @keyframes ai-blink {
    0%,100% { opacity: 1; } 50% { opacity: 0.4; }
  }
  .ai-close-btn {
    background: rgba(255,255,255,0.12); border: none; color: #fff;
    width: 28px; height: 28px; border-radius: 50%; cursor: pointer;
    font-size: 13px; transition: 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .ai-close-btn:hover { background: rgba(255,255,255,0.3); }

  /* Quick suggest chips */
  .ai-chips {
    display: flex; gap: 6px; flex-wrap: wrap;
    padding: 12px 14px 0;
  }
  .ai-chip {
    background: rgba(30,136,229,0.12);
    border: 1px solid rgba(30,136,229,0.25);
    color: #90caf9; font-size: 11.5px; font-weight: 500;
    padding: 5px 12px; border-radius: 20px; cursor: pointer;
    transition: all 0.2s; white-space: nowrap;
  }
  .ai-chip:hover { background: rgba(30,136,229,0.28); color: #fff; }

  /* Мессежүүд */
  #ai-messages {
    height: 290px; overflow-y: auto;
    padding: 14px 14px 8px;
    display: flex; flex-direction: column; gap: 10px;
    scroll-behavior: smooth;
  }
  #ai-messages::-webkit-scrollbar { width: 3px; }
  #ai-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

  .ai-msg { display: flex; gap: 8px; animation: ai-msg-in 0.3s ease; }
  @keyframes ai-msg-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: none; }
  }
  .ai-msg.user { flex-direction: row-reverse; }

  .ai-msg-icon {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 14px;
    background: rgba(255,255,255,0.07);
    align-self: flex-end;
  }
  .ai-msg.user .ai-msg-icon {
    background: var(--red, #e50914);
    font-size: 12px; font-weight: 700; color: #fff;
  }

  .ai-bubble {
    max-width: 82%; padding: 10px 14px;
    font-size: 13.5px; line-height: 1.55;
    word-wrap: break-word; border-radius: 16px;
  }
  .ai-msg.bot .ai-bubble {
    background: rgba(30,136,229,0.1);
    border: 1px solid rgba(30,136,229,0.2);
    color: #e3f2fd;
    border-radius: 4px 16px 16px 16px;
  }
  .ai-msg.user .ai-bubble {
    background: var(--red, #e50914);
    color: #fff;
    border-radius: 16px 4px 16px 16px;
    box-shadow: 0 4px 14px rgba(229,9,20,0.3);
  }

  /* Кино санал бүхий карт */
  .ai-movie-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; padding: 10px 12px;
    margin-top: 8px; cursor: pointer;
    transition: all 0.2s; display: flex; align-items: center; gap: 10px;
  }
  .ai-movie-card:hover { background: rgba(30,136,229,0.15); border-color: #1e88e5; }
  .ai-movie-poster {
    width: 38px; height: 54px; border-radius: 5px;
    object-fit: cover; flex-shrink: 0;
    background: rgba(255,255,255,0.08);
  }
  .ai-movie-info { flex: 1; min-width: 0; }
  .ai-movie-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ai-movie-meta { font-size: 11px; color: #90caf9; }
  .ai-movie-play {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--red, #e50914); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; flex-shrink: 0;
  }

  /* Typing */
  .ai-typing { display: flex; gap: 4px; align-items: center; padding: 2px 0; }
  .ai-typing span {
    width: 7px; height: 7px; background: #4fc3f7; border-radius: 50%;
    animation: ai-bounce 1.2s infinite ease-in-out both;
  }
  .ai-typing span:nth-child(1) { animation-delay: -0.24s; }
  .ai-typing span:nth-child(2) { animation-delay: -0.12s; }
  @keyframes ai-bounce {
    0%,80%,100% { transform: scale(0); }
    40%          { transform: scale(1); }
  }

  /* Input */
  .ai-input-row {
    padding: 10px 12px 14px;
    background: rgba(0,0,0,0.3);
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex; gap: 8px; align-items: center;
  }
  #ai-input {
    flex: 1; background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 22px; padding: 11px 16px;
    color: #fff; font-size: 13.5px; outline: none;
    font-family: 'Inter', sans-serif;
    transition: 0.25s;
  }
  #ai-input:focus { border-color: #1e88e5; background: rgba(0,0,0,0.5); }
  #ai-input::placeholder { color: rgba(255,255,255,0.3); }
  #ai-send-btn {
    width: 40px; height: 40px; border-radius: 50%;
    background: #1e88e5; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: 0.2s; flex-shrink: 0;
    color: #fff;
  }
  #ai-send-btn:hover { background: #1043a0; transform: scale(1.08); }

  @media (max-width: 480px) {
    #ai-chat-box { width: calc(100vw - 32px); }
    #ai-bot-wrap { bottom: 18px; left: 12px; }
  }
</style>

<div id="ai-bot-wrap">
  <div id="ai-chat-box">
    <!-- Header -->
    <div class="ai-header">
      <div class="ai-header-left">
        <div class="ai-avatar-wrap">🤖</div>
        <div class="ai-header-info">
          <div class="ai-header-name">Nabooshy AI</div>
          <div class="ai-header-status">
            <div class="ai-status-dot"></div>
            <span>Онлайн · Бэлэн байна</span>
          </div>
        </div>
      </div>
      <button class="ai-close-btn" id="ai-close-btn">✕</button>
    </div>

    <!-- Quick chips -->
    <div class="ai-chips" id="aiChips">
      <span class="ai-chip" onclick="aiQuick('Action кино санал болго')">💥 Action</span>
      <span class="ai-chip" onclick="aiQuick('Comedy кино байна уу')">😂 Comedy</span>
      <span class="ai-chip" onclick="aiQuick('Онлайн тоглоом юу байна')">🎮 Тоглоом</span>
      <span class="ai-chip" onclick="aiQuick('2024 оны шилдэг кинонууд')">🔥 Шилдэг</span>
    </div>

    <!-- Мессежүүд -->
    <div id="ai-messages">
      <div class="ai-msg bot">
        <div class="ai-msg-icon">🤖</div>
        <div class="ai-bubble">
          Сайн уу! Би Nabooshy AI — танд хамгийн тохирох кино, цуврал, тоглоомыг олоход тусална. Юу хайж байна вэ? 🎬🎮
        </div>
      </div>
    </div>

    <!-- Input -->
    <div class="ai-input-row">
      <input id="ai-input" type="text" placeholder="Кино, тоглоом хайх..." autocomplete="off">
      <button id="ai-send-btn" title="Илгээх">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  </div>

  <button id="ai-toggle-btn" title="Nabooshy AI">🤖</button>
</div>
`;

document.body.insertAdjacentHTML('beforeend', aiHTML);

// ── DOM refs ──────────────────────────────────────────────────
const aiBox    = document.getElementById('ai-chat-box');
const aiToggle = document.getElementById('ai-toggle-btn');
const aiClose  = document.getElementById('ai-close-btn');
const aiInput  = document.getElementById('ai-input');
const aiSend   = document.getElementById('ai-send-btn');
const aiMsgs   = document.getElementById('ai-messages');

// ── Нээх / хаах ──────────────────────────────────────────────
aiToggle.onclick = () => {
  const open = aiBox.style.display === 'block';
  aiBox.style.display = open ? 'none' : 'block';
  aiToggle.style.display = open ? 'flex' : 'none';
  if (!open) setTimeout(() => aiInput.focus(), 200);
};
aiClose.onclick = () => {
  aiBox.style.display = 'none';
  aiToggle.style.display = 'flex';
};

// ── Quick chips ──────────────────────────────────────────────
window.aiQuick = (text) => {
  aiInput.value = text;
  handleAiSend();
};

// ── Мессеж нэмэх ────────────────────────────────────────────
function addMsg(role, content, isTyping = false) {
  const wrap = document.createElement('div');
  wrap.className = `ai-msg ${role}`;

  const icon = document.createElement('div');
  icon.className = 'ai-msg-icon';
  if (role === 'bot') {
    icon.textContent = '🤖';
  } else {
    const u = window.currentUser;
    icon.textContent = u ? u.name[0].toUpperCase() : '👤';
  }

  const bubble = document.createElement('div');
  bubble.className = 'ai-bubble';

  if (isTyping) {
    bubble.innerHTML = `<div class="ai-typing"><span></span><span></span><span></span></div>`;
    wrap.id = 'ai-typing-el';
  } else {
    bubble.innerHTML = content;
  }

  wrap.append(icon, bubble);
  aiMsgs.appendChild(wrap);
  aiMsgs.scrollTop = aiMsgs.scrollHeight;
  return wrap;
}

// ── Кино карт ───────────────────────────────────────────────
function movieCardHTML(m) {
  const poster = m.poster || 'https://placehold.co/38x54/111/555?text=N';
  const year   = m.year || '';
  const rating = m.rating ? `⭐${m.rating}` : '';
  const isSeries = !!m.episodes;
  return `
    <div class="ai-movie-card" onclick="
      ${isSeries ? `window.openSeriesDetail(window.SERIES.find(s=>s.id==='${m.id}')||${JSON.stringify(m).replace(/'/g,"\\'")})`
                 : `window.openMovieDetail(window.MOVIES.find(x=>x.id==='${m.id}')||${JSON.stringify(m).replace(/'/g,"\\'")})`}
    ">
      <img class="ai-movie-poster" src="${poster}" onerror="this.src='https://placehold.co/38x54/111/555?text=N'">
      <div class="ai-movie-info">
        <div class="ai-movie-title">${m.title}</div>
        <div class="ai-movie-meta">${[year, rating, m.cat?.split(',')[0]].filter(Boolean).join(' · ')}</div>
      </div>
      <div class="ai-movie-play">▶</div>
    </div>`;
}

// ── Локал хайлт — кино / цуврал ──────────────────────────────
function localSearch(query) {
  const q = query.toLowerCase();
  const all = [...(window.MOVIES || []), ...(window.SERIES || [])];

  // Нэрээр яг тохирох
  const byName = all.filter(m =>
    m.title?.toLowerCase().includes(q) ||
    m.title_en?.toLowerCase().includes(q)
  ).slice(0, 4);
  if (byName.length) return byName;

  // Ангиллаар
  const byGenre = all.filter(m => m.cat?.toLowerCase().includes(q)).slice(0, 4);
  return byGenre;
}

// ── Тоглоом хайх ─────────────────────────────────────────────
function localGameSearch(query) {
  const q = query.toLowerCase();
  return (window.GAMES_LIST || []).filter(g =>
    g.title?.toLowerCase().includes(q) ||
    g.desc?.toLowerCase().includes(q) ||
    g.cat?.toLowerCase().includes(q)
  ).slice(0, 3);
}

// ── Сайтын бүрэн мэдээлэл Gemini-д дамжуулах ─────────────────
function buildSiteContext() {
  const movies  = (window.MOVIES  || []).slice(0, 80);
  const series  = (window.SERIES  || []).slice(0, 40);
  const games   = window.GAMES_LIST || [];

  // Ангиллаар бүлэглэх
  const genres = {};
  movies.forEach(m => {
    (m.cat || 'other').split(',').forEach(g => {
      const key = g.trim();
      if (!genres[key]) genres[key] = [];
      if (genres[key].length < 5) genres[key].push(m.title);
    });
  });

  const genreLines = Object.entries(genres)
    .map(([g, titles]) => `  ${g}: ${titles.join(', ')}`)
    .join('\n');

  const movieList  = movies.map(m  => `${m.title} (${m.year}, ⭐${m.rating}, ${m.cat})`).join(' | ');
  const seriesList = series.map(s  => `${s.title} (${s.year})`).join(' | ');
  const gameList   = games.map(g   => `${g.title} [${g.cat}]`).join(' | ');

  return `
=== NABOOSHY САЙТЫН БҮРЭН МЭДЭЭЛЭЛ ===
Нийт кино: ${movies.length}, Цуврал: ${series.length}, Тоглоом: ${games.length}

КИНОНУУД (нэр | жил | үнэлгээ | ангилал):
${movieList}

ЦУВРАЛ:
${seriesList}

ТОГЛООМ:
${gameList}

АНГИЛЛААР:
${genreLines}
===`;
}

// ── Gemini дуудах ────────────────────────────────────────────
async function askGemini(userText) {
  if (!validKeys.length) return { text: "API түлхүүр байхгүй байна. Админтай холбогдоно уу. 🛠️", movies: [] };

  const siteCtx = buildSiteContext();

  const prompt = `
${siteCtx}

Чи "Nabooshy AI" — Монголын кино, тоглоомын сайтын ухаалаг туслах.

ДҮРМҮҮД:
1. Зөвхөн Монгол хэлээр, найрсаг, товч (2-4 өгүүлбэр) хариулна.
2. Кино санал болгохдоо ДЭЭРХ жагсаалтаас л санал болго (зохиохгүй).
3. Хэрэглэгч кино нэрлэвэл тэр кино байна/байхгүй гэж хариулна.
4. Санал болгосон кинонуудын нэрийг [[ ]] тэмдэглэгээнд хийнэ. Жишээ: [[Inception]]
5. Тоглоом хайвал тоглоомын жагсаалтаас санал болго.
6. Улс төр, кодинг, хакер асуувал "Зөвхөн кино, тоглоом санал болгоно" гэж хэл.
7. Кино байхгүй бол "Одоогоор байхгүй, удахгүй нэмнэ" гэж хэл.

Хэрэглэгч: "${userText}"
`;

  const keys = [...validKeys].sort(() => 0.5 - Math.random());
  for (const key of keys) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const raw  = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // [[MovieTitle]] тэмдэглэгээ задлах
      const mentioned = [];
      const cleaned   = raw.replace(/\[\[([^\]]+)\]\]/g, (_, name) => {
        const found = [...(window.MOVIES || []), ...(window.SERIES || [])].find(m =>
          m.title?.toLowerCase().includes(name.toLowerCase()) ||
          m.title_en?.toLowerCase().includes(name.toLowerCase())
        );
        if (found) mentioned.push(found);
        return `<strong style="color:#90caf9">${name}</strong>`;
      });

      return { text: cleaned, movies: mentioned };
    } catch (e) { console.warn('Gemini err:', e); }
  }
  return { text: "Уучлаарай, одоо хэт ачаалалтай байна. Түр хүлээгээд дахин оролдоно уу ⏳", movies: [] };
}

// ── Хариу харуулах ───────────────────────────────────────────
async function handleAiSend() {
  const text = aiInput.value.trim();
  if (!text) return;
  aiInput.value = '';

  // Chips нуух (анхных нь)
  const chips = document.getElementById('aiChips');
  if (chips) chips.style.display = 'none';

  addMsg('user', text);
  const typingEl = addMsg('bot', '', true);

  // Эхлээд локал хайлт хий
  const localMovies = localSearch(text);
  const localGames  = localGameSearch(text);

  // Gemini дуудах
  const { text: aiText, movies: mentionedMovies } = await askGemini(text);

  typingEl.remove();

  // Хариу мессеж
  let html = aiText;

  // Gemini дурьдсан кинонуудын карт
  const showMovies = mentionedMovies.length ? mentionedMovies : localMovies.slice(0, 3);
  if (showMovies.length) {
    html += showMovies.map(movieCardHTML).join('');
  }

  // Тоглоом карт
  if (localGames.length && /тоглоом|game|chess|tetris|snake|wordle|sudoku|puzzle|arcade/i.test(text)) {
    html += `<div style="margin-top:8px;font-size:12px;color:#90caf9;margin-bottom:4px;">🎮 Тоглоомууд:</div>`;
    html += localGames.map(g => `
      <div class="ai-movie-card" onclick="window.openGame && window.openGame(window.GAMES_LIST.find(x=>x.title==='${g.title}')||${JSON.stringify(g)})">
        <div style="font-size:26px;width:38px;text-align:center">${g.emoji}</div>
        <div class="ai-movie-info">
          <div class="ai-movie-title">${g.title}</div>
          <div class="ai-movie-meta">${g.desc}</div>
        </div>
        <div class="ai-movie-play">▶</div>
      </div>`).join('');
  }

  addMsg('bot', html);
}

// ── Event listeners ──────────────────────────────────────────
aiSend.addEventListener('click', handleAiSend);
aiInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleAiSend(); });
