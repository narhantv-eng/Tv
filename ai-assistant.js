// ============================================================
// ai-assistant.js — Nabooshy AI (Gemini API дээр суурилсан)
// ============================================================

// 🛑 ТАНЫ API ТҮЛХҮҮР (Шууд ажиллана)
const GEMINI_API_KEY = "AIzaSyBxhctAb2UX1YYKAam0kekgth8pK89rkKU"; 

// ── 1. AI-ИЙН UI (ИНТЕРФЕЙС) ЗАГВАР ──
const aiHTML = `
<div id="ai-bot-wrap" style="position:fixed;bottom:25px;right:25px;z-index:9999;font-family:'Inter',sans-serif;">
  <div id="ai-chat-box" style="display:none;width:340px;background:rgba(10,10,10,0.95);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.1);border-radius:24px;padding:20px;margin-bottom:15px;box-shadow:0 20px 50px rgba(0,0,0,0.9);transform-origin:bottom right;animation:aiPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
    
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:12px;">
      <div style="font-weight:700;color:#fff;display:flex;align-items:center;gap:10px;">
        <div style="width:32px;height:32px;background:linear-gradient(135deg, var(--red), #ff4b4b);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 4px 10px rgba(229,9,20,0.4);">🤖</div>
        <div>
          <div style="font-size:15px;letter-spacing:0.5px;">Naboo AI</div>
          <div style="font-size:10px;color:var(--red);font-weight:600;letter-spacing:1px;">УХААЛАГ ТУСЛАХ</div>
        </div>
      </div>
      <button id="ai-close-btn" style="background:rgba(255,255,255,0.1);border:none;color:#fff;width:28px;height:28px;border-radius:50%;font-size:12px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;justify-content:center;">✕</button>
    </div>
    
    <div id="ai-messages" style="height:280px;overflow-y:auto;font-size:14px;color:var(--text);margin-bottom:15px;display:flex;flex-direction:column;gap:12px;padding-right:5px;scrollbar-width:none;">
      <div style="background:rgba(229,9,20,0.15);border:1px solid rgba(229,9,20,0.3);padding:12px 16px;border-radius:16px 16px 16px 4px;align-self:flex-start;max-width:90%;line-height:1.5;">
        Сайн уу? Би бол <strong>Naboo AI</strong> байна. Танд ямар кино, цуврал эсвэл тоглоом санал болгох вэ? 🍿
      </div>
    </div>
    
    <div style="position:relative;display:flex;gap:8px;">
      <input type="text" id="ai-input" placeholder="Хүссэнээ асуугаарай..." style="flex:1;padding:14px 16px;border-radius:16px;border:1px solid rgba(255,255,255,0.15);background:rgba(0,0,0,0.6);color:#fff;outline:none;font-size:14px;transition:all 0.3s;font-family:'Inter',sans-serif;">
      <button id="ai-send-btn" style="background:var(--red);border:none;width:46px;height:46px;border-radius:16px;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 15px rgba(229,9,20,0.4);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
    </div>
  </div>
  
  <button id="ai-toggle-btn" style="float:right;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg, var(--red), #b20710);border:none;color:#fff;font-size:28px;cursor:pointer;box-shadow:0 10px 30px rgba(229,9,20,0.6);transition:all 0.3s;display:flex;align-items:center;justify-content:center;position:relative;">
    🤖
    <span style="position:absolute;top:-2px;right:-2px;width:14px;height:14px;background:#0f0;border:2px solid #000;border-radius:50%;animation:pulse 2s infinite;"></span>
  </button>
</div>

<style>
  @keyframes aiPop { from { opacity:0; transform:scale(0.8) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
  @keyframes pulse { 0% { box-shadow:0 0 0 0 rgba(0,255,0,0.7); } 70% { box-shadow:0 0 0 6px rgba(0,255,0,0); } 100% { box-shadow:0 0 0 0 rgba(0,255,0,0); } }
  #ai-messages::-webkit-scrollbar { display: none; }
  .ai-typing { display:flex; gap:5px; padding:12px 16px; background:rgba(255,255,255,0.08); border-radius:16px 16px 16px 4px; align-self:flex-start; width:fit-content; }
  .ai-dot { width:6px; height:6px; background:var(--text2); border-radius:50%; animation:aiBlink 1.4s infinite both; }
  .ai-dot:nth-child(1) { animation-delay: -0.32s; }
  .ai-dot:nth-child(2) { animation-delay: -0.16s; }
  @keyframes aiBlink { 0%, 80%, 100% { transform:scale(0); opacity:0.3; } 40% { transform:scale(1); opacity:1; } }
  .ai-action-btn { display:inline-flex; align-items:center; gap:6px; margin-top:8px; margin-right:6px; padding:8px 14px; background:rgba(255,255,255,0.1); border-radius:8px; font-size:13px; font-weight:600; color:#fff; cursor:pointer; border:1px solid rgba(255,255,255,0.2); transition:all 0.2s; }
  .ai-action-btn:hover { background:var(--red); border-color:var(--red); transform:translateY(-2px); box-shadow:0 4px 10px rgba(229,9,20,0.3); }
  #ai-close-btn:hover { background:rgba(255,255,255,0.2) !important; transform:rotate(90deg); }
  #ai-send-btn:hover { transform:scale(1.05); }
</style>
`;

document.body.insertAdjacentHTML('beforeend', aiHTML);

// ── 2. ҮНДСЭН ХУВЬСАГЧУУД БОЛОН ҮЙЛДЛҮҮД ──
const aiToggle = document.getElementById('ai-toggle-btn');
const aiClose  = document.getElementById('ai-close-btn');
const aiBox    = document.getElementById('ai-chat-box');
const aiInput  = document.getElementById('ai-input');
const aiMsgs   = document.getElementById('ai-messages');
const aiSend   = document.getElementById('ai-send-btn');

let chatHistory =[]; // AI-д өмнөх яриаг сануулах санах ой

function toggleChat() {
  const isHidden = aiBox.style.display === 'none';
  aiBox.style.display = isHidden ? 'block' : 'none';
  aiToggle.style.transform = isHidden ? 'scale(0)' : 'scale(1)';
  if (isHidden) {
    aiInput.focus();
    const badge = aiToggle.querySelector('span');
    if(badge) badge.style.display = 'none';
  }
}

aiToggle.onclick = toggleChat;
aiClose.onclick  = toggleChat;

function addMsg(text, isUser) {
  const div = document.createElement('div');
  div.style.padding = '12px 16px';
  div.style.maxWidth = '90%';
  div.style.lineHeight = '1.5';
  div.style.wordBreak = 'break-word';
  
  if (isUser) {
    div.style.background = 'rgba(255,255,255,0.1)';
    div.style.borderRadius = '16px 16px 4px 16px';
    div.style.alignSelf = 'flex-end';
    div.textContent = text;
  } else {
    div.style.background = 'rgba(229,9,20,0.15)';
    div.style.border = '1px solid rgba(229,9,20,0.3)';
    div.style.borderRadius = '16px 16px 16px 4px';
    div.style.alignSelf = 'flex-start';
    div.innerHTML = formatAIResponse(text); 
  }
  
  aiMsgs.appendChild(div);
  aiMsgs.scrollTop = aiMsgs.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.id = 'ai-typing-indicator';
  div.className = 'ai-typing';
  div.innerHTML = '<div class="ai-dot"></div><div class="ai-dot"></div><div class="ai-dot"></div>';
  aiMsgs.appendChild(div);
  aiMsgs.scrollTop = aiMsgs.scrollHeight;
}

function removeTyping() {
  const ind = document.getElementById('ai-typing-indicator');
  if (ind) ind.remove();
}

// ── 3. ЖИНХЭНЭ AI ДУУДАХ ЛОГИК (Nabooshy AI Persona) ──
async function fetchAIResponse(userText) {
  // Сайтад байгаа бодит кинонуудын нэрийг AI-д өгч сургах
  const availableMovies = (window.MOVIES ||[]).slice(0, 40).map(m => m.title).join(', ');
  
  // 🤖 AI-ИЙН ТАРХИЙГ УГААХ (System Prompt)
  const systemPrompt = `Чиний нэр бол "Nabooshy AI". Чи бол Nabooshy хэмээх Монголын ухаалаг кино, тоглоомын платформын албан ёсны хиймэл оюун ухаант туслах.
  
  ХАТУУ ДҮРЭМ:
  1. Чи өөрийгөө хэзээ ч Google, Gemini, эсвэл өөр компани бүтээсэн гэж хэлж болохгүй! 
  2. Хэн чамайг бүтээсэн бэ гэвэл "Намайг Nabooshy платформын хөгжүүлэлтийн баг бүтээсэн" гэж бахархалтайгаар хариулна.
  3. Хэрэглэгчтэй маш найрсаг, богинохон, орчин үеийн хэллэгээр Монголоор хариулна.
  4. Манай сайтад яг одоо байгаа кинонууд: ${availableMovies}. Хэрэв кино санал болговол эдгээрээс сонгож санал болго.
  5. Хэрэв хэрэглэгч "өөр" гэвэл өмнөхөөсөө шал өөр төрлийн (жишээ нь инээдмийн байсан бол аймшиг) зүйл санал болго.
  6. Хэрэв чи ямар нэг төрөл (Action, Comedy, Drama, Horror, Sci-Fi) санал болгож байвал хариултынхаа төгсгөлд [SEARCH:төрөл] гэж бичээрэй. Жишээ нь: [SEARCH:comedy]
  7. Хэрэв чи тодорхой нэг кино санал болгож байвал [MOVIE:киноны_нэр] гэж бичээрэй.`;

  const requestBody = {
    contents: [
      { role: "user", parts: [{ text: systemPrompt }] },
      ...chatHistory,
      { role: "user", parts: [{ text: userText }] }
    ],
    generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
  };

  try {
    // Тайлбар: Бодит байдал дээр gemini-2.0-flash нь хамгийн сүүлийн үеийн тогтвортой үнэгүй хувилбар тул үүнийг ашиглалаа. (Алдаа гарахгүй найдвартай ажиллана)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error("API алдаа гарлаа");
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0].content) {
      const aiText = data.candidates[0].content.parts[0].text;
      
      // Түүхээ хадгалах
      chatHistory.push({ role: "user", parts: [{ text: userText }] });
      chatHistory.push({ role: "model", parts: [{ text: aiText }] });
      
      return aiText;
    }
  } catch (error) {
    console.error("AI Error:", error);
    return "Уучлаарай, миний сүлжээнд алдаа гарлаа. Та Хайх цэснээс өөрөө хайгаад үзээрэй 😅";
  }
}

// ── 4. AI-ИЙН ХАРИУГ ГОЁ БОЛГОЖ, ТОВЧЛУУР ҮҮСГЭХ ──
function formatAIResponse(text) {
  // Bold текстийг янзлах
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff;">$1</strong>');
  
  //[SEARCH:төрөл] тагийг товчлуур болгох
  html = html.replace(/\[SEARCH:(.*?)\]/gi, (match, keyword) => {
    const cleanKeyword = keyword.trim().toLowerCase();
    let icon = '🔍';
    if(cleanKeyword.includes('comedy')) icon = '😂';
    if(cleanKeyword.includes('action')) icon = '💥';
    if(cleanKeyword.includes('horror')) icon = '👻';
    if(cleanKeyword.includes('drama'))  icon = '🎭';
    if(cleanKeyword.includes('sci-fi')) icon = '🚀';
    
    return `<br><button class="ai-action-btn" onclick="window.doSearch('${cleanKeyword}')">${icon} ${keyword.toUpperCase()} хайх</button>`;
  });

  // [MOVIE:нэр] тагийг товчлуур болгох
  html = html.replace(/\[MOVIE:(.*?)\]/gi, (match, movieName) => {
    const cleanName = movieName.trim();
    return `<br><button class="ai-action-btn" onclick="window.doSearch('${cleanName}')">▶️ '${cleanName}' үзэх</button>`;
  });

  return html;
}

// ── 5. МЕССЕЖ ИЛГЭЭХ ҮЙЛДЭЛ ──
async function handleSend() {
  const text = aiInput.value.trim();
  if (!text) return;
  
  addMsg(text, true);
  aiInput.value = '';
  showTyping();
  
  const responseText = await fetchAIResponse(text);
  
  removeTyping();
  addMsg(responseText, false);
}

aiSend.onclick = handleSend;
aiInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleSend();
});

// Гаднаас дуудах боломжтой болгох (Жишээ нь өөр хуудаснаас)
window.openNabooAI = function(initialMessage) {
  if (aiBox.style.display === 'none') toggleChat();
  if (initialMessage) {
    aiInput.value = initialMessage;
    handleSend();
  }
};