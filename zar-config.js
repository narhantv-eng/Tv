// zar-config.js
// Нийт бүх хэсгүүдийн ард зар гарах боломжтой жагсаалт
window.MY_ADS = [

  // ── НҮҮР ХУУДАСНЫ ҮНДСЭН ХЭСГҮҮД ──────────────────
  {
    afterRowId: 'rowFeatured',   // Онцлох киноны доор
    isActive: true,
    label: 'BANNER 1',
    src: '' // Спонсор линк энд орно
  },
  {
    afterRowId: 'rowSeries',     // Цуврал киноны доор
    isActive: true,
    label: 'BANNER 2',
    src: ''
  },
  {
    afterRowId: 'rowGames',      // Нүүр хуудас дахь тоглоомын мөрний доор
    isActive: true,
    label: 'BANNER 3',
    src: ''
  },

  // ── КИНОНЫ ТӨРЛҮҮД (HOME_ROWS) ────────────────────
  { afterRowId: 'rowAction',      isActive: true,  label: 'BANNER 4' },
  { afterRowId: 'rowAdventure',   isActive: true,  label: 'BANNER 5' },
  { afterRowId: 'rowComedy',      isActive: true,  label: 'BANNER 6' },
  { afterRowId: 'rowDrama',       isActive: true,  label: 'BANNER 7' },
  { afterRowId: 'rowHorror',      isActive: true,  label: 'BANNER 8' },
  { afterRowId: 'rowThriller',    isActive: true,  label: 'BANNER 9' },
  { afterRowId: 'rowSciFi',       isActive: true,  label: 'BANNER 10' },
  { afterRowId: 'rowFantasy',     isActive: true,  label: 'BANNER 11' },
  { afterRowId: 'rowAnimation',   isActive: true,  label: 'BANNER 12' },
  { afterRowId: 'rowCrime',       isActive: true,  label: 'BANNER 13' },
  { afterRowId: 'rowRomance',     isActive: true,  label: 'BANNER 14' },
  { afterRowId: 'rowMystery',     isActive: true,  label: 'BANNER 15' },
  { afterRowId: 'rowDocumentary', isActive: true,  label: 'BANNER 16' },
  { afterRowId: 'rowFamily',      isActive: true,  label: 'BANNER 17' },
  { afterRowId: 'rowHistory',     isActive: true,  label: 'BANNER 18' },
  { afterRowId: 'rowWar',         isActive: true,  label: 'BANNER 19' },
  { afterRowId: 'rowBiography',   isActive: true,  label: 'BANNER 20' },

  // ── ОЛОН УЛСЫН КИНО (TMDB) ───────────────────────
  {
    afterRowId: 'rowInternational', 
    isActive: true, 
    label: 'BANNER 21' 
  },

  // ── ТОГЛООМЫН ХУУДАСНЫ АНГИЛАЛУУД ────────────────
  { afterRowId: 'gameRow_puzzle',   isActive: true, label: 'GAME AD 1' },
  { afterRowId: 'gameRow_strategy', isActive: true, label: 'GAME AD 2' },
  { afterRowId: 'gameRow_arcade',   isActive: true, label: 'GAME AD 3' },
  { afterRowId: 'gameRow_multi',    isActive: true, label: 'GAME AD 4' }

];

// КОД БҮРЭН ГАРЧ ДУУСЛАА.
