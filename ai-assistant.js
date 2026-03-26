// ============================================================
// ai-assistant.js — Жинхэнэ AI (Gemini API) холбосон хувилбар
// ============================================================

// 1. ЭНД ӨӨРИЙН GEMINI API ТҮЛХҮҮРЭЭ ХИЙНЭ ҮҮ (aistudio.google.com-с үнэгүй авна)
const GEMINI_API_KEY = 'AIzaSyB5GeZCzpGwrylytrr65RZ1aAyCLo2ti00'; 

const aiHTML = `
<div id="ai-bot-wrap" style="position:fixed;bottom:30px;left:30px;z-index:9999;font-family:sans-serif;">
  <div id="ai-chat-box" style="display:none;width:320px;background:var(--bg2, #1e1e2e);border:1px solid var(--border, #333);border-radius:16px;padding:16px;margin-bottom:15px;box-shadow:0 10px 30px rgba(0,0,0,0.6);transition:all 0.3s ease;">
    
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
      <div style="font-weight:700;color:var(--blue, #4facfe);display:flex;align-items:center;gap:8px;">
        <span style="font-size:18px;">🤖</span> Naboo AI
      </div>
      <button id="ai-close-btn" style="background:none;border:none;color:#888;cursor:pointer;font-size:14px;padding:4px;">✖</button>
    </div>

    <div id="ai-messages" style="height:250px;overflow-y:auto;font-size:13px;color:var(--text2, #ddd);margin-bottom:15px;display:flex;flex-direction:column;gap:10px;padding-right:5px;">
      <div style="color:var(--blue, #4facfe);background:rgba(30,136,229,0.1);padding:10px 14px;border-radius:14px 14px 14px 0;align-self:flex-start;max-width:85%;line-height:1.4;">
        Сайн уу? Би бол Naboo сайтын ухаалаг туслах байна. Та манай сайт дээрх кино, тоглоом, цаг агаарын талаар хүссэн зүйлээ асуугаарай!
      </div>
    </div>

    <div style="display:flex;gap:8px;">
      <input type="text" id="ai-input" placeholder="Асуултаа энд бичнэ үү..." style="flex:1;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:rgba(0,0,0,0.2);color:#fff;outline:none;font-size:13px;">
    </div>
  </div>

  <button id="ai-toggle-btn" style="width:56px;height:56px;border-radius:50%;background:var(--blue, #1e88e5);border:none;color:#fff;font-size:26px;cursor:pointer;box-shadow:0 4px 15px rgba(30,136,229,0.4);transition:transform 0.3s;display:flex;align-items:center;justify-content:center;">🤖</button>
</div>
`;

document.body.insertAdjacentHTML('beforeend', aiHTML);

const aiToggle = document.getElementById('ai-toggle-btn');
const aiClose = document.getElementById('ai-close-btn');
const aiBox = document.getElementById('ai-chat-box');
const aiInput = document.getElementById('ai-input');
const aiMsgs = document.getElementById('ai-messages');

function toggleChat() {
  const isHidden = aiBox.style.display === 'none';
  aiBox.style.display = isHidden ? 'block' : 'none';
  aiToggle.style.transform = isHidden ? 'scale(0.9)' : 'scale(1)';
  if (isHidden) aiInput.focus();
}

aiToggle.onclick = toggleChat;
aiClose.onclick = toggleChat;

function appendMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.textContent = text;
  msgDiv.style.padding = "10px 14px";
  msgDiv.style.maxWidth = "85%";
  msgDiv.style.lineHeight = "1.4";
  msgDiv.style.wordWrap = "break-word";
  
  if (sender === 'user') {
    msgDiv.style.color = "#fff";
    msgDiv.style.background = "rgba(255,255,255,0.15)";
    msgDiv.style.borderRadius = "14px 14px 0 14px";
    msgDiv.style.alignSelf = "flex-end";
  } else {
    msgDiv.style.color = "var(--blue, #4facfe)";
    msgDiv.style.background = "rgba(30,136,229,0.1)";
    msgDiv.style.borderRadius = "14px 14px 14px 0";
    msgDiv.style.alignSelf = "flex-start";
  }
  
  aiMsgs.appendChild(msgDiv);
  aiMsgs.scrollTop = aiMsgs.scrollHeight;
  return msgDiv;
}

// Жинхэнэ AI-тай харилцах функц
async function askGeminiAI(userText) {
  // 1. Сайтын мэдээллийг динамикаар уншиж авах (app.js болон config.js-ээс)
  const movieCount = window.MOVIES ? window.MOVIES.length : 0;
  const seriesCount = window.SERIES ? window.SERIES.length : 0;
  const gameCount = window.GAMES_LIST ? window.GAMES_LIST.length : 0;
  
  // AI-д зориулж хэдэн киноны нэрсийг жишээ болгож өгөх
  const sampleMovies = window.MOVIES ? window.MOVIES.slice(0, 15).map(m => m.title).join(', ') : 'Мэдээлэл уншиж байна';

  // 2. AI-д өгөх ХАТУУ ДҮРЭМ (System Prompt)
  const systemPrompt = `
    Чи бол "Naboo" (Nabooshy) хэмээх Монголын кино, тоглоом, цаг агаарын сайтын ухаалаг туслах AI байна.
    
    Сайтын яг одоогийн бодит мэдээлэл:
    - Нийт киноны тоо: ${movieCount}
    - Нийт цувралын тоо: ${seriesCount}
    - Нийт тоглоомын тоо: ${gameCount}
    - Манай сайтад байгаа зарим кинонууд: ${sampleMovies}

    Чиний дагах хатуу дүрмүүд:
    1. Хэрэглэгч "хэдэн кино байна", "heden kino bga we" гэх мэтээр яаж ч асуусан дээрх тоон мэдээлэлд тулгуурлаж хариулна.
    2. Хэрэглэгч кино санал болгохыг хүсвэл дээрх кинонуудаас эсвэл ерөнхий төрлөөр (Action, Comedy гэх мэт) санал болгоно.
    3. Хэрвээ хэрэглэгч сайтын код, хэрхэн бүтсэн, хакердах, эсвэл улс төр гэх мэт сайтад хамааралгүй зүйл асуувал: "Уучлаарай, би зөвхөн Naboo сайтын кино, тоглоомын талаар мэдээлэл өгөх үүрэгтэй туслах байна." гэж эелдгээр татгалзана.
    4. Хариултыг үргэлж Монгол хэлээр, найрсаг, маш товчхон (1-3 өгүүлбэрт багтааж) өгнө.
    
    Хэрэглэгчийн асуулт: "${userText}"
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents:[{ parts: [{ text: systemPrompt }] }]
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return "Уучлаарай, сүлжээний алдаа гарлаа. Та дахин оролдоно уу.";
    }
  } catch (error) {
    console.error("AI Error:", error);
    return "Уучлаарай, AI сервертэй холбогдож чадсангүй.";
  }
}

aiInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter' && aiInput.value.trim()) {
    const userText = aiInput.value.trim();
    aiInput.value = '';
    
    // Хэрэглэгчийн мессеж
    appendMessage(userText, 'user');
    
    // AI бодож байна...
    const typingIndicator = appendMessage("Бодож байна...", 'ai');
    typingIndicator.style.opacity = "0.5";
    typingIndicator.style.fontStyle = "italic";
    
    // Жинхэнэ AI-аас хариу авах
    const aiReply = await askGeminiAI(userText);
    
    // Хариуг дэлгэцэнд гаргах
    typingIndicator.remove();
    appendMessage(aiReply, 'ai');
  }
});
