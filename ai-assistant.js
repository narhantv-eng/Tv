// ============================================================
// ai-assistant.js — AI Туслахын UI болон Логик
// ============================================================

const aiHTML = `
<div id="ai-bot-wrap" style="position:fixed;bottom:30px;left:30px;z-index:9999;">
  <div id="ai-chat-box" style="display:none;width:300px;background:var(--bg2);border:1px solid var(--border);border-radius:16px;padding:16px;margin-bottom:15px;box-shadow:0 10px 30px rgba(0,0,0,0.8);">
    <div style="font-weight:700;margin-bottom:10px;color:var(--blue);">🤖 Naboo AI</div>
    <div id="ai-messages" style="height:150px;overflow-y:auto;font-size:13px;color:var(--text2);margin-bottom:10px;display:flex;flex-direction:column;gap:8px;">
      <div>Сайн уу? Танд ямар төрлийн кино санал болгох вэ? (Жнь: Гунигтай, Инээдтэй, Адал явдалтай)</div>
    </div>
    <input type="text" id="ai-input" placeholder="Энд бичнэ үү..." style="width:100%;padding:10px;border-radius:8px;border:none;background:rgba(255,255,255,0.1);color:#fff;outline:none;">
  </div>
  <button id="ai-toggle-btn" style="width:50px;height:50px;border-radius:50%;background:var(--blue);border:none;color:#fff;font-size:24px;cursor:pointer;box-shadow:0 4px 15px rgba(30,136,229,0.5);transition:transform 0.3s;">🤖</button>
</div>
`;

document.body.insertAdjacentHTML('beforeend', aiHTML);

const aiToggle = document.getElementById('ai-toggle-btn');
const aiBox = document.getElementById('ai-chat-box');
const aiInput = document.getElementById('ai-input');
const aiMsgs = document.getElementById('ai-messages');

aiToggle.onclick = () => {
  const isHidden = aiBox.style.display === 'none';
  aiBox.style.display = isHidden ? 'block' : 'none';
  aiToggle.style.transform = isHidden ? 'scale(0.9)' : 'scale(1)';
  if (isHidden) aiInput.focus();
};

aiInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && aiInput.value.trim()) {
    const userText = aiInput.value.trim();
    aiMsgs.innerHTML += `<div style="color:#fff;text-align:right;background:rgba(255,255,255,0.1);padding:6px 10px;border-radius:10px;align-self:flex-end;">${userText}</div>`;
    aiInput.value = '';
    
    // AI сэтгэхүй (Энгийн Keyword matching - 2026 оны хөнгөн хувилбар)
    setTimeout(() => {
      let reply = "Уучлаарай, сайн ойлгосонгүй. Өөрөөр хэлнэ үү.";
      let keyword = "";
      
      if (userText.toLowerCase().includes('гуниг')) { reply = "Танд 'Драма' төрлийн кинонууд таалагдах байх 🎭"; keyword = "drama"; }
      else if (userText.toLowerCase().includes('инээ')) { reply = "Сайхан инээмээр байна уу? 'Комеди' санал болгоё 😂"; keyword = "comedy"; }
      else if (userText.toLowerCase().includes('адал')) { reply = "Адал явдал хайж байна уу? Эдгээр киног үзээрэй 💥"; keyword = "action"; }
      
      aiMsgs.innerHTML += `<div style="color:var(--blue);background:rgba(30,136,229,0.1);padding:6px 10px;border-radius:10px;align-self:flex-start;">${reply}</div>`;
      aiMsgs.scrollTop = aiMsgs.scrollHeight;
      
      if (keyword) {
        window.doSearch(keyword); // Хайлтын хуудас руу шууд шиднэ
      }
    }, 800);
  }
});