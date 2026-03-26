// ============================================================
// ai-assistant.js — Nabooshy AI (10 Key Rotation & Modern UI)
// ============================================================

// 1. ЭНД 10 ХҮРТЭЛХ API ТҮЛХҮҮРЭЭ ХИЙНЭ ҮҮ (Хоосон байсан ч алдаа заахгүй)
const API_KEYS =[
  'AIzaSy_ЭХНИЙ_ТҮЛХҮҮРЭЭ_ЭНД_ХИЙНЭ_ҮҮ', // Түлхүүр 1
  '', // Түлхүүр 2
  '', // Түлхүүр 3
  '', // Түлхүүр 4
  '', // Түлхүүр 5
  '', // Түлхүүр 6
  '', // Түлхүүр 7
  '', // Түлхүүр 8
  '', // Түлхүүр 9
  '', // Түлхүүр 10
];

// Зөвхөн 'AIza'-гаар эхэлсэн, хүчинтэй түлхүүрүүдийг ялгаж авах
const validKeys = API_KEYS.filter(key => key && key.trim().startsWith('AIza'));

// --- UI БОЛОН ДИЗАЙН (CSS & HTML) ---
const aiHTML = `
<style>
  #ai-bot-wrap { position: fixed; bottom: 30px; left: 30px; z-index: 9999; font-family: 'Inter', sans-serif; }
  #ai-chat-box { display: none; width: 340px; background: rgba(17, 17, 17, 0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.8); transition: all 0.3s ease; transform-origin: bottom left; }
  .ai-header { background: linear-gradient(135deg, #1e88e5, #1565c0); padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; color: #fff; font-weight: 700; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
  .ai-header-title { display: flex; align-items: center; gap: 8px; }
  .ai-header-title span { font-size: 20px; }
  .ai-close-btn { background: rgba(255,255,255,0.2); border: none; color: #fff; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; transition: 0.2s; }
  .ai-close-btn:hover { background: rgba(255,255,255,0.4); transform: scale(1.1); }
  #ai-messages { height: 300px; overflow-y: auto; padding: 20px 15px; display: flex; flex-direction: column; gap: 12px; scroll-behavior: smooth; }
  #ai-messages::-webkit-scrollbar { width: 4px; }
  #ai-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
  .msg-bubble { max-width: 85%; padding: 12px 16px; font-size: 13.5px; line-height: 1.5; word-wrap: break-word; animation: fadeIn 0.3s ease; }
  .msg-ai { background: rgba(30,136,229,0.15); color: #e3f2fd; border-radius: 16px 16px 16px 4px; align-self: flex-start; border: 1px solid rgba(30,136,229,0.3); }
  .msg-user { background: var(--red, #e50914); color: #fff; border-radius: 16px 16px 4px 16px; align-self: flex-end; box-shadow: 0 4px 10px rgba(229,9,20,0.3); }
  .ai-input-area { padding: 15px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 10px; }
  #ai-input { flex: 1; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 12px 16px; color: #fff; font-size: 14px; outline: none; transition: 0.3s; }
  #ai-input:focus { border-color: #1e88e5; background: rgba(0,0,0,0.5); }
  #ai-send-btn { background: #1e88e5; color: #fff; border: none; width: 42px; height: 42px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
  #ai-send-btn:hover { background: #1565c0; transform: scale(1.05); }
  #ai-toggle-btn { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #1e88e5, #1565c0); border: none; color: #fff; font-size: 28px; cursor: pointer; box-shadow: 0 8px 25px rgba(30,136,229,0.5); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; justify-content: center; }
  #ai-toggle-btn:hover { transform: scale(1.1) translateY(-5px); }
  .typing-dots { display: flex; gap: 4px; align-items: center; padding: 4px 0; }
  .typing-dots span { width: 6px; height: 6px; background: #4facfe; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
  .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
  .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
  @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>

<div id="ai-bot-wrap">
  <div id="ai-chat-box">
    <div class="ai-header">
      <div class="ai-header-title"><span>✨</span> Nabooshy AI</div>
      <button class="ai-close-btn" id="ai-close-btn">✕</button>
    </div>
    <div id="ai-messages">
      <div class="msg-bubble msg-ai">
        Сайн уу? Би бол Nabooshy сайтын ухаалаг туслах байна. Танд ямар кино, тоглоом хайж өгөх вэ? 🍿🎮
      </div>
    </div>
    <div class="ai-input-area">
      <input type="text" id="ai-input" placeholder="Энд бичнэ үү..." autocomplete="off">
      <button id="ai-send-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
    </div>
  </div>
  <button id="ai-toggle-btn">🤖</button>
</div>
`;

document.body.insertAdjacentHTML('beforeend', aiHTML);

const aiToggle = document.getElementById('ai-toggle-btn');
const aiClose = document.getElementById('ai-close-btn');
const aiBox = document.getElementById('ai-chat-box');
const aiInput = document.getElementById('ai-input');
const aiSendBtn = document.getElementById('ai-send-btn');
const aiMsgs = document.getElementById('ai-messages');

// Нээх, хаах үйлдэл
function toggleChat() {
  const isHidden = aiBox.style.display === 'none';
  aiBox.style.display = isHidden ? 'block' : 'none';
  aiToggle.style.transform = isHidden ? 'scale(0) opacity(0)' : 'scale(1) opacity(1)';
  aiToggle.style.display = isHidden ? 'none' : 'flex';
  if (isHidden) aiInput.focus();
}

aiToggle.onclick = toggleChat;
aiClose.onclick = () => {
  aiBox.style.display = 'none';
  aiToggle.style.display = 'flex';
  aiToggle.style.transform = 'scale(1)';
};

// Мессеж нэмэх
function appendMessage(text, sender, isTyping = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg-bubble ${sender === 'user' ? 'msg-user' : 'msg-ai'}`;
  
  if (isTyping) {
    msgDiv.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
    msgDiv.id = "ai-typing-indicator";
  } else {
    msgDiv.textContent = text;
  }
  
  aiMsgs.appendChild(msgDiv);
  aiMsgs.scrollTop = aiMsgs.scrollHeight;
  return msgDiv;
}

// --- AI ЛОГИК (Gemini API + Key Rotation) ---
async function askGeminiAI(userText) {
  if (validKeys.length === 0) {
    return "Уучлаарай, админ API түлхүүрээ хараахан тохируулаагүй байна. 🛠️";
  }

  // Сайтын датаг унших
  const movieCount = window.MOVIES ? window.MOVIES.length : 0;
  const seriesCount = window.SERIES ? window.SERIES.length : 0;
  const gameCount = window.GAMES_LIST ? window.GAMES_LIST.length : 0;
  const sampleMovies = window.MOVIES ? window.MOVIES.slice(0, 10).map(m => m.title).join(', ') : '';

  const systemPrompt = `
    Чи бол "Nabooshy AI" хэмээх Монголын кино, тоглоомын сайтын ухаалаг туслах.
    Сайтын мэдээлэл: Нийт ${movieCount} кино, ${seriesCount} цуврал, ${gameCount} тоглоом байна.
    Зарим кинонууд: ${sampleMovies}.
    Дүрэм:
    1. Хэрэглэгчийн асуултад зөвхөн Монгол хэлээр, маш найрсаг, товчхон (1-3 өгүүлбэр) хариулна.
    2. Хэрвээ кино санал болгохыг хүсвэл дээрх мэдээлэлд тулгуурлан санал болгоно.
    3. Сайтын код, хакердах, улс төр асуувал "Би зөвхөн кино, тоглоом санал болгох үүрэгтэй" гэж татгалзана.
    
    Хэрэглэгч: "${userText}"
  `;

  // Түлхүүрүүдийг хольж (Shuffle) эхнээс нь шалгах (Нэг нь болохгүй бол нөгөөг нь шалгана)
  const shuffledKeys = [...validKeys].sort(() => 0.5 - Math.random());

  for (let i = 0; i < shuffledKeys.length; i++) {
    const currentKey = shuffledKeys[i];
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${currentKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts:[{ text: systemPrompt }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      } else {
        console.warn(`Түлхүүр ${i+1} ажилласангүй, дараагийнхийг шалгаж байна...`);
        // Хэрвээ 429 (Limit reached) эсвэл алдаа гарвал loop цааш үргэлжилж дараагийн түлхүүрийг шалгана
      }
    } catch (error) {
      console.error("AI холболтын алдаа:", error);
    }
  }

  return "Уучлаарай, яг одоо хэт олон хүн хандаж байгаа тул систем ачаалалтай байна. Та түр хүлээгээд дахин бичнэ үү. ⏳";
}

// Илгээх үйлдэл
async function handleSend() {
  const userText = aiInput.value.trim();
  if (!userText) return;
  
  aiInput.value = '';
  appendMessage(userText, 'user');
  
  // Typing animation гаргах
  const typingIndicator = appendMessage("", 'ai', true);
  
  // AI-аас хариу хүлээх
  const aiReply = await askGeminiAI(userText);
  
  // Typing animation-ийг устгаад жинхэнэ хариуг гаргах
  typingIndicator.remove();
  appendMessage(aiReply, 'ai');
}

aiSendBtn.addEventListener('click', handleSend);
aiInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSend();
});