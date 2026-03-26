// games-data.js

// --- 1. HERO ХЭСЭГТ ГАРАХ 5 ТРЕЙЛЕР (Зөвхөн чимэглэл зориулалттай) ---
window.HERO_GAMES =[
  { 
    title: 'PUBG', 
    cat: 'Shooter',  
    desc: 'Battle Royale - Дэлхийн хамгийн алдартай тоглоом', 
    trailer: 'GXXEsnG14kw' 
  },
  { 
    title: 'Dota 2',      
    cat: 'Strategy', 
    desc: 'MOBA - Стратеги болон багийн ажиллагаа', 
    trailer: '-cSFPIwMEq4' 
  },
  { 
    title: 'Counter-Strike 2', 
    cat: 'Shooter',  
    desc: 'Тактикийн буудлага', 
    trailer: 'c80dVYcL69E' 
  },
  { 
    title: 'Valorant',    
    cat: 'Shooter',  
    desc: '5v5 Буудлага', 
    trailer: 'e_E9W2vsRbQ' 
  },
  { 
    title: 'Mobile Legends', 
    cat: 'Strategy', 
    desc: 'Гар утасны MOBA', 
    trailer: 'W1ZJ1Hj2kQY' 
  }
];

// --- 2. ДООД ТАЛЫН ЖАГСААЛТАД ГАРАХ ЖИНХЭНЭ ТОГЛООМУУД ---
window.GAMES_LIST =[
  { title:'Wordle',      cat:'puzzle',   emoji:'🔤', color:['#1a1a2e','#16213e','#0f3460'], desc:'Үг таах тоглоом',        embed:'https://wordleunlimited.org/' },
  { title:'2048',        cat:'puzzle',   emoji:'🔢', color:['#1a0a00','#3d1f00','#f5a623'], desc:'Тоон нийлүүлэлт',        embed:'https://play2048.co/' },
  { title:'Sudoku',      cat:'puzzle',   emoji:'🧩', color:['#0d1b2a','#1b2a3b','#2196f3'], desc:'Судоку тоглоом',          embed:'https://sudoku.com/' },
  { title:'Chess',       cat:'strategy', emoji:'♟️', color:['#1a0a0a','#2d1515','#c9a84c'], desc:'Шатар тоглоом',          embed:'https://www.chess.com/play/computer' },
  { title:'Minesweeper', cat:'strategy', emoji:'💣', color:['#0a1a0a','#1a3a1a','#4caf50'], desc:'Минэ эрэх тоглоом',      embed:'https://minesweeper.online/' },
  { title:'Solitaire',   cat:'strategy', emoji:'🃏', color:['#0a0a1a','#1a1a3a','#9c27b0'], desc:'Картын тоглоом',         embed:'https://www.solitaire.org/' },
  { title:'Snake',       cat:'arcade',   emoji:'🐍', color:['#001a00','#003300','#00c853'], desc:'Могойн тоглоом',         embed:'https://playsnake.org/' },
  { title:'Pac-Man',     cat:'arcade',   emoji:'👻', color:['#1a1500','#332b00','#ffd600'], desc:'Пак-ман классик',        embed:'https://freepacman.org/' },
  { title:'Tetris',      cat:'arcade',   emoji:'🎮', color:['#00001a','#000033','#3f51b5'], desc:'Тетрис тоглоом',         embed:'https://tetris.com/play-tetris' },
  { title:'Flappy Bird', cat:'arcade',   emoji:'🐦', color:['#0a1a2a','#0d3349','#29b6f6'], desc:'Нисэх шувуу',            embed:'https://flappybird.io/' },
  { title:'Tic-Tac-Toe', cat:'multi',    emoji:'✖️', color:['#1a001a','#2d002d','#e91e63'], desc:'Икс Оо',                 embed:'https://playtictactoe.org/' },
  { title:'Skribbl.io',  cat:'multi',    emoji:'🎨', color:['#001a1a','#003333','#00bcd4'], desc:'Зурж таах',              embed:'https://skribbl.io/' },
  { title:'Agar.io',     cat:'multi',    emoji:'🟢', color:['#001a05','#003310','#00e676'], desc:'Хүн идэх тоглоом',       embed:'https://agar.io/' },
  { title:'Slither.io',  cat:'multi',    emoji:'🐛', color:['#0a0a00','#1a1a00','#cddc39'], desc:'Олон тоглогчийн могой',  embed:'https://slither.io/' },
  { title:'Crossword',   cat:'puzzle',   emoji:'📝', color:['#1a1a1a','#2d2d2d','#e0e0e0'], desc:'Үгийн сүлжээ',          embed:'https://crosswordlabs.com/' },
  { title:'Checkers',    cat:'strategy', emoji:'🔴', color:['#1a0505','#330a0a','#e53935'], desc:'Даам тоглоом',          embed:'https://www.gameflare.com/online-game/checkers/' },
];

window.GAME_CATS =[
  { label:'🌐 Бүгд',        key:'' },
  { label:'🎯 Буудлага',    key:'shooter' },
  { label:'♟️ Стратеги',    key:'strategy' },
  { label:'🧩 Оюун ухаан',  key:'puzzle' },
  { label:'🕹️ Аркад',      key:'arcade' },
  { label:'👥 Олон тоглогч',key:'multi' },
];
