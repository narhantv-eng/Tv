// zar.js
import './zar-config.js'; // window.MY_ADS-г ачаална
import { ZAR_CSS } from './zar-styles.js'; // CSS загварыг импортолно

const _ZAR_MAX = 100;

// CSS загварыг хуудасны <head> хэсэгт нэмэх функц
function _zarInjectCSS() {
  if (document.getElementById('_zar_css')) return;
  const s = document.createElement('style');
  s.id = '_zar_css';
  s.textContent = ZAR_CSS;
  document.head.appendChild(s);
}

// Линкийн өргөтгөлөөр нь төрлийг (Видео, Зураг, Линк) тогтоох функц
function _zarDetectType(src) {
  if (!src) return 'empty';
  const clean = src.split('?')[0].toLowerCase();
  if (/\.(mp4|webm|ogg|mov)$/.test(clean)) return 'video';
  if (/\.(jpg|jpeg|png|gif|webp|avif|svg)$/.test(clean)) return 'image';
  return 'link';
}

// Зарын элементийг (HTML) угсарч үүсгэх функц
function _zarBuildEl(ad) {
  const wrap = document.createElement('div');
  wrap.className = 'ad-wrap';
  wrap.dataset.zarLabel = ad.label || '';

  const type = _zarDetectType(ad.src);

  if (type === 'video') {
    wrap.innerHTML = `
      <div class="ad-video-box">
        <div class="ad-corner-badge">${ad.label || 'РЕКЛАМ'}</div>
        <video src="${ad.src}" autoplay loop muted playsinline></video>
      </div>`;
  } else if (type === 'image') {
    const href = ad.link || ad.src;
    wrap.innerHTML = `
      <a href="${href}" target="_blank" rel="noopener" class="ad-img-box">
        <div class="ad-corner-badge">${ad.label || 'РЕКЛАМ'}</div>
        <img src="${ad.src}" alt="${ad.label || 'Реклам'}">
      </a>`;
  } else if (type === 'link') {
    const domain = (() => { 
      try { return new URL(ad.src).hostname.replace('www.',''); } 
      catch(_){ return ad.src; } 
    })();
    wrap.innerHTML = `
      <div class="ad-link-box">
        <div class="ad-link-left">
          <div class="ad-badge">${ad.label || 'BANNER'}</div>
          <div class="ad-link-texts">
            <div class="ad-link-title">${domain}</div>
            <div class="ad-link-sub">Рекламаа явуулж байна</div>
          </div>
        </div>
        <a href="${ad.src}" target="_blank" rel="noopener" class="ad-goto-btn">↗ ҮЗЭХ</a>
      </div>`;
  } else {
    // src хоосон үед гарах "Реклам байршуулах" хэсэг
    wrap.innerHTML = `
      <div class="ad-empty-box">
        <div class="ad-link-left">
          <div class="ad-badge">${ad.label || 'BANNER'}</div>
          <div class="ad-link-texts">
            <div class="ad-link-title" style="color:#D4AF37">Энд таны рекламаа байрлуул</div>
            <div class="ad-link-sub">Рекламаа явуулах бол холбогдоно уу</div>
          </div>
        </div>
        <a href="tel:99376238" class="ad-phone-btn">📞 99376238</a>
      </div>`;
  }
  return wrap;
}

// Заруудыг тодорхойлсон байршлуудад нь оруулах үндсэн функц
function insertAds() {
  _zarInjectCSS();
  
  // Хуудсан дээр байгаа хуучин заруудыг цэвэрлэх
  document.querySelectorAll('.ad-wrap').forEach(el => el.remove());

  // Идэвхтэй заруудыг шүүж авах
  const ads = (window.MY_ADS || []).filter(a => a.isActive).slice(0, _ZAR_MAX);

  ads.forEach(ad => {
    const row = document.getElementById(ad.afterRowId);
    if (!row || !row.parentElement) return;
    
    // Тухайн мөрний (section) доор зарыг байршуулах
    row.parentElement.insertAdjacentElement('afterend', _zarBuildEl(ad));
  });
}

// Глобал байдлаар бусад JS файлууд ашиглах боломжтой болгох
window.insertAds = insertAds;
window._zarBuildEl = _zarBuildEl;
window._zarInjectCSS = _zarInjectCSS;

// КОД БҮРЭН ГАРЧ ДУУСЛАА.
