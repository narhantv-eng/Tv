// ai-ui.js
export const aiStyles = `
<style>
  /* Чиний явуулсан бүх CSS-ийг энд оруулна (товчлов) */
  #ai-bot-wrap { position:fixed; bottom:28px; right:28px; z-index:9999; font-family:'Inter',sans-serif; }
  #ai-chat-box { display:none; width:400px; background:rgba(10,10,16,.97); backdrop-filter:blur(24px); border-radius:22px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,.9); }
  /* ... бусад CSS ... */
</style>
`;

export const aiHTML = `
<div id="ai-bot-wrap">
  <div id="ai-chat-box">
    <div class="ai-hdr">
      <div class="ai-hdr-l"><div class="ai-hdr-av">🤖</div><div><div class="ai-hdr-name">Nabooshy AI</div><div class="ai-hdr-status"><div class="ai-dot"></div><span>Онлайн</span></div></div></div>
      <button class="ai-x" id="ai-close-btn">✕</button>
    </div>
    <div id="ai-chips">
      <span class="ai-chip" data-q="Action кино санал болго">💥 Action</span>
      <span class="ai-chip" data-q="Comedy кино байна уу">😂 Comedy</span>
    </div>
    <div id="ai-msgs"></div>
    <div class="ai-inp-row">
      <input id="ai-input" type="text" placeholder="Асуух, хайх..." autocomplete="off">
      <button id="ai-send-btn">🚀</button>
    </div>
  </div>
  <button id="ai-toggle-btn">🤖<div id="ai-notif-badge" style="display:none">1</div></button>
</div>
`;
