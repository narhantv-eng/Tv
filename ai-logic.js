// ai-logic.js
import { GROQ_KEYS, AI_CONFIG } from './ai-config.js';

let _keyCooldowns = {};

export async function askGroq(userText, systemPrompt) {
  const key = getAvailableKey();
  if (!key) return { text: '⏳ API хэтэрсэн байна. Түр хүлээнэ үү.' };

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userText }]
      })
    });

    if (res.status === 429) { _keyCooldowns[key] = Date.now(); return askGroq(userText, systemPrompt); }
    const data = await res.json();
    return { text: data.choices[0].message.content, movies: [] };
  } catch (e) { return { text: '⚠️ Алдаа гарлаа.' }; }
}

function getAvailableKey() {
  const now = Date.now();
  return GROQ_KEYS.find(k => !_keyCooldowns[k] || (now - _keyCooldowns[k] > AI_CONFIG.cooldown_time));
}

export function localSearch(q) {
  const all = [...(window.MOVIES || []), ...(window.SERIES || [])];
  return all.filter(m => m.title?.toLowerCase().includes(q.toLowerCase())).slice(0, 3);
}
