// ai-assistant.js (Шинэчлэгдсэн хувилбар)
import { aiStyles, aiHTML } from './ai-ui.js';
import { askGroq, localSearch } from './ai-logic.js';

document.body.insertAdjacentHTML('beforeend', aiStyles + aiHTML);

const aiInput = document.getElementById('ai-input');
const aiSend = document.getElementById('ai-send-btn');
const aiMsgs = document.getElementById('ai-msgs');

async function handleSend() {
  const text = aiInput.value.trim();
  if (!text) return;
  
  addMsg('user', text);
  aiInput.value = '';
  
  const typing = addMsg('bot', '...', true);
  const response = await askGroq(text, "Чи бол Nabooshy AI...");
  typing.remove();
  
  addMsg('bot', response.text);
}

function addMsg(role, content, isTyping = false) {
  const div = document.createElement('div');
  div.className = `ai-row ${role}`;
  div.innerHTML = `<div class="ai-bbl">${content}</div>`;
  aiMsgs.appendChild(div);
  aiMsgs.scrollTop = aiMsgs.scrollHeight;
  return div;
}

aiSend.onclick = handleSend;
aiInput.onkeydown = (e) => e.key === 'Enter' && handleSend();