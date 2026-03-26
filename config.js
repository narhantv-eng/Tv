// =============================================
// ⚙️ ТОХИРГОО (config.js)
// =============================================

// 1. API Түлхүүрүүд
window.TMDB_KEY = '0b34540c864eaaf51207c87c28dabb36';
window.OW_KEY   = '28b8969deb0ae248fe2db2e6064dd511';

// 2. Ерөнхий мэдээллүүд
window.CONTACT_PHONE = '9937-6238';
window.CURRENT_YEAR  = new Date().getFullYear(); // Он солигдоход автоматаар дагаж солигдоно
window.DEFAULT_CITY  = 'Ulaanbaatar';

// 3. Хугацааны тохиргоо (Миллисекундээр: 1000 = 1 секунд)
window.HERO_TIMER = 12000; // Киноны слайд солигдох хугацаа
window.GAME_TIMER = 14000; // Тоглоомын слайд солигдох хугацаа

// 4. Орлуулах утгууд (Мэдээлэл дутуу үед гарах)
window.FALLBACK_YEAR   = 2024;
window.FALLBACK_RATING = 7.0;
window.FALLBACK_POSTER = 'https://placehold.co/300x450/111/555?text=No+Image';

// 5. Хувьсагчид
window.MOVIES      = [];
window.SERIES      =[];
window.HERO_MOVIES =[];

// 6. Нүүр хуудасны эгнээнүүд
window.HOME_ROWS =[
  { id: 'rowAction',      title: '💥 Action',       keys:['action'] },
  { id: 'rowAdventure',   title: '🗺️ Adventure',    keys:['adventure'] },
  { id: 'rowComedy',      title: '😂 Comedy',       keys:['comedy'] },
  { id: 'rowDrama',       title: '🎭 Drama',        keys: ['drama'] },
  { id: 'rowHorror',      title: '👻 Horror',       keys: ['horror'] },
  { id: 'rowThriller',    title: '🔪 Thriller',     keys: ['thriller'] },
  { id: 'rowSciFi',       title: '🚀 Sci-Fi',       keys:['sci-fi', 'science fiction'] },
  { id: 'rowFantasy',     title: '✨ Fantasy',      keys: ['fantasy'] },
  { id: 'rowRomance',     title: '❤️ Romance',      keys: ['romance'] },
  { id: 'rowAnimation',   title: '🎨 Animation',    keys: ['animation', 'anime'] },
  { id: 'rowMystery',     title: '🕵️ Mystery',      keys: ['mystery'] },
  { id: 'rowCrime',       title: '🚨 Crime',        keys: ['crime'] },
  { id: 'rowDocumentary', title: '📹 Documentary',  keys: ['documentary'] },
  { id: 'rowFamily',      title: '👨‍👩‍👧‍👦 Family',       keys: ['family'] },
  { id: 'rowHistory',     title: '🏛️ History',      keys: ['history'] },
  { id: 'rowWar',         title: '🪖 War',          keys: ['war'] },
  { id: 'rowMusic',       title: '🎵 Music',        keys: ['music', 'musical'] },
  { id: 'rowWestern',     title: '🤠 Western',      keys: ['western'] },
  { id: 'rowBiography',   title: '📖 Biography',    keys: ['biography'] }
];
