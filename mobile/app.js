// =============================================================================
// POMBAGIRAS MOBILE — app.js
// =============================================================================

// ---------------------------------------------------------------------------
// DADOS DE TODAS AS 27 POMBAGIRAS
// ---------------------------------------------------------------------------
const pombagirasData = {
  "Cacurucaia": {
    nome: "Pombagira Cacurucaia", icone: "🕷️",
    oferenda: "Farofa preta, cachaça, vela preta e roxa",
    dia: "Sábado", cores: "Preto e roxo escuro", lua: "Lua Nova", horario: "3h",
    descricao: "Guardiã das teias ocultas e dos segredos enterrados. Trabalha com magia densa, proteção contra feitiços e desmantelamento de armadilhas espirituais."
  },
  "Cigana": {
    nome: "Pombagira Cigana", icone: "🔮",
    oferenda: "Moedas, vinho tinto, rosas amarelas",
    dia: "Sexta-feira", cores: "Vermelho, dourado e roxo", lua: "Lua Crescente", horario: "18h",
    descricao: "A Andarilha da Liberdade. Rege o nomadismo, a prosperidade e a leitura de caminhos. Especialista em baralho, fartura e magia da sorte."
  },
  "Da Calunga Profunda": {
    nome: "Pombagira da Calunga Profunda", icone: "💀",
    oferenda: "Velas pretas, vinho seco, rosas negras",
    dia: "Sábado", cores: "Preto, roxo e vermelho sangue", lua: "Lua Minguante", horario: "3h33",
    descricao: "Rainha do Além e da Justiça Ancestral dos Mortos. Trabalha no nível mais profundo do cemitério espiritual, resgatando linhagens ancestrais."
  },
  "Da Estrada": {
    nome: "Pombagira da Estrada", icone: "🛤️",
    oferenda: "Cachaça, cigarro, farofa de dendê",
    dia: "Segunda-feira", cores: "Cinza asfalto e vermelho", lua: "Lua Crescente", horario: "21h",
    descricao: "Guardiã das estradas e dos viajantes. Abre caminhos, protege nas viagens e atua nas encruzilhadas de terra e asfalto."
  },
  "Da Fenda": {
    nome: "Pombagira da Fenda", icone: "🌀",
    oferenda: "Velas marrom e preta, pedra de calcário",
    dia: "Quarta-feira", cores: "Marrom, preto e roxo portal", lua: "Lua Nova", horario: "3h",
    descricao: "Guardiã das passagens secretas e portais ocultos. Trabalha nas fendas da terra, nas rachaduras da realidade, entre dimensões."
  },
  "Da Figueira": {
    nome: "Pombagira da Figueira", icone: "🌳",
    oferenda: "Figos frescos, mel, cachaça",
    dia: "Terça-feira", cores: "Verde musgo e marrom", lua: "Lua Cheia", horario: "21h",
    descricao: "Sacerdotisa Ancestral. Trabalha em figueiras e árvores sagradas, atuando com cura profunda, proteção espiritual e resgate de ancestralidade."
  },
  "Da Lua": {
    nome: "Pombagira da Lua", icone: "🌙",
    oferenda: "Água de lua, flores brancas, prata",
    dia: "Segunda-feira", cores: "Prata, branco lunar e roxo violeta", lua: "Lua Cheia", horario: "0h",
    descricao: "Regente dos ciclos noturnos e da magia lunar. Trabalha com as marés emocionais, os sonhos proféticos e a intuição aguçada."
  },
  "Da Neblina": {
    nome: "Pombagira da Neblina", icone: "🌫️",
    oferenda: "Velas cinza e branca, incenso denso",
    dia: "Quarta-feira", cores: "Cinza névoa, branco e prata difuso", lua: "Lua Minguante", horario: "5h",
    descricao: "Confusão Estratégica e Ocultação de Caminhos. Cria neblina espiritual para enganar inimigos e proteger os que precisam se ocultar."
  },
  "Das Águas Profundas": {
    nome: "Pombagira das Águas Profundas", icone: "🌊",
    oferenda: "Conchas do fundo do mar, vinho azul, flores brancas",
    dia: "Segunda-feira", cores: "Azul profundo, verde abismo e preto marinho", lua: "Lua Cheia", horario: "23h",
    descricao: "Rege o inconsciente coletivo, os segredos enterrados nas águas e as memórias ancestrais. Cura as feridas mais profundas da alma."
  },
  "Das Almas": {
    nome: "Pombagira das Almas", icone: "👻",
    oferenda: "Velas branca e preta juntas, água, flores silvestres",
    dia: "Sábado", cores: "Branco fosco, preto veludo e cinza névoa", lua: "Lua Minguante", horario: "0h",
    descricao: "Guardiã dos Desencarnados, Ponte entre Mundos. Tem trânsito livre entre o plano físico e espiritual, auxiliando almas em sofrimento."
  },
  "Das Correntes": {
    nome: "Pombagira das Correntes", icone: "⛓️",
    oferenda: "Correntes metálicas, velas cinza e vermelha",
    dia: "Quinta-feira", cores: "Cinza ferro, preto corrente e prata corte", lua: "Lua Minguante", horario: "15h",
    descricao: "Desamarração e Libertação de Amarras. Corta correntes espirituais, emocionais e kármicas, rompendo laços tóxicos e vícios."
  },
  "Das Trevas": {
    nome: "Pombagira das Trevas", icone: "🌑",
    oferenda: "Velas pretas de 7 dias, água com sal, ferro velho",
    dia: "Sábado", cores: "Preto absoluto, roxo escuro e azul meia-noite", lua: "Lua Nova", horario: "3h33",
    descricao: "Guardiã do Desconhecido e da Sombria Justiça. Atua onde a luz não alcança, quebrando magia negra pesada e proteção contra ataques de magistas."
  },
  "Do Fogo": {
    nome: "Pombagira do Fogo", icone: "🔥",
    oferenda: "Pimenta, cachaça, velas vermelha e laranja",
    dia: "Sexta-feira", cores: "Vermelho fogo, laranja brasa e amarelo chama", lua: "Lua Cheia", horario: "21h",
    descricao: "Transformação pela Chama e Justiça Rápida. Queima demandas, acelera processos e traz justiça rápida em situações urgentes."
  },
  "Do Vento": {
    nome: "Pombagira do Vento", icone: "💨",
    oferenda: "Flores leves, incenso de penas, vela branca e azul",
    dia: "Quarta-feira", cores: "Azul vento, branco nuvem e prata ar", lua: "Lua Crescente", horario: "18h",
    descricao: "Mensageira dos Ares e da Transformação Rápida. Trabalha com comunicação, notícias e mudanças rápidas que chegam como o vento."
  },
  "Maria Farrapo": {
    nome: "Pombagira Maria Farrapo", icone: "🧹",
    oferenda: "Farofa, marafo, cigarrilhas",
    dia: "Quarta-feira", cores: "Marrom e preto", lua: "Lua Crescente", horario: "15h",
    descricao: "A Varredora das Demandas Mentais. Trabalha com almas em sofrimento psíquico, trazendo sanidade onde há caos e organização mental."
  },
  "Maria Mulambo": {
    nome: "Pombagira Maria Mulambo", icone: "🌿",
    oferenda: "Farofa de dendê, cachaça",
    dia: "Segunda-feira", cores: "Preto e roxo", lua: "Lua Minguante", horario: "12h",
    descricao: "A Senhora da Transmutação. Transforma lágrimas em força, miséria em dignidade. Trabalha com almas profundamente feridas e rejeitadas."
  },
  "Maria Navalha": {
    nome: "Pombagira Maria Navalha", icone: "🗡️",
    oferenda: "Malte, navalha, rosas",
    dia: "Sexta-feira", cores: "Vermelho e branco", lua: "Lua Cheia", horario: "21h",
    descricao: "A Protetora dos Marginalizados. Protege os esquecidos da sociedade, corta demandas e falsidades. Trabalha nas periferias e becos."
  },
  "Maria Padilha": {
    nome: "Pombagira Maria Padilha", icone: "👑",
    oferenda: "Rosas vermelhas, champagne, espelho",
    dia: "Sexta-feira", cores: "Rosa choque e vermelho", lua: "Lua Cheia", horario: "20h",
    descricao: "A mais reverenciada. Rege o amor, a autonomia feminina, o poder de escolha e a justiça emocional. A rainha que ordena e não implora."
  },
  "Maria Quitéria": {
    nome: "Pombagira Maria Quitéria", icone: "⚔️",
    oferenda: "Velas, perfume, joias",
    dia: "Quinta-feira", cores: "Amarelo e vermelho", lua: "Lua Crescente", horario: "14h",
    descricao: "Sentinela da Justiça Implacável. Protege mulheres em situação de violência, corta demandas pesadas e enfrenta a escuridão sem hesitação."
  },
  "Menina": {
    nome: "Pombagira Menina", icone: "🎀",
    oferenda: "Doces finos, fitas, sucos",
    dia: "Domingo", cores: "Rosa e lilás", lua: "Lua Nova", horario: "10h",
    descricao: "A Alegria em Movimento. Trabalha com doçura e leveza, mas sua força é imensa. Quebra demandas pesadas com risos e alegria."
  },
  "Rosa Caveira": {
    nome: "Pombagira Rosa Caveira", icone: "💀",
    oferenda: "Rosas pretas, vinho seco",
    dia: "Sábado", cores: "Roxo e preto", lua: "Lua Minguante", horario: "23h",
    descricao: "A Rainha da Calunga. Trabalha na linha da morte simbólica, do fim dos ciclos, da quebra de demandas e da justiça espiritual rigorosa."
  },
  "Sete Encruzilhadas": {
    nome: "Pombagira Sete Encruzilhadas", icone: "🔱",
    oferenda: "Sete velas coloridas, sete rosas, sete moedas",
    dia: "Sexta-feira", cores: "Sete cores (arco-íris)", lua: "Lua Cheia", horario: "19h",
    descricao: "Senhora dos Caminhos Múltiplos. Ajuda a encontrar direção em meio ao caos, escolhas difíceis e situações complexas da vida."
  },
  "Sete Saias": {
    nome: "Pombagira Sete Saias", icone: "💃",
    oferenda: "Champanhe, 7 fitas",
    dia: "Sexta-feira", cores: "Sete Cores", lua: "Lua Cheia", horario: "19h",
    descricao: "A Dançarina dos Caminhos. Cada saia representa um caminho, uma possibilidade. Rege a versatilidade e a celebração da vida."
  },
  "Da Praia": {
    nome: "Pombagira da Praia", icone: "🌊",
    oferenda: "Conchas, champanhe rosé",
    dia: "Segunda-feira", cores: "Azul marinho e prata", lua: "Lua Minguante", horario: "6h",
    descricao: "A Mulher das Águas Salgadas. Trabalha na beira do mar, onde as ondas levam o sofrimento e trazem novas oportunidades de amor."
  },
  "Da Serra": {
    nome: "Pombagira da Serra", icone: "⛰️",
    oferenda: "Pedras da montanha, velas verde e marrom",
    dia: "Domingo", cores: "Verde montanha, cinza rocha e dourado pico", lua: "Lua Crescente", horario: "6h",
    descricao: "Altitude e Visão Estratégica. Tem visão ampla dos caminhos, enxergando o que vem à frente. Ajuda a subir na vida com firmeza."
  },
  "Da Sombra": {
    nome: "Pombagira da Sombra", icone: "🌑",
    oferenda: "Velas pretas e cinza, água escura",
    dia: "Sábado", cores: "Preto opaco, cinza sombra e roxo escurecido", lua: "Lua Nova", horario: "0h",
    descricao: "Invisibilidade e Proteção Silenciosa. Trabalha na sombra, protegendo sem ser vista. Guardiã dos que precisam passar despercebidos."
  },
  "Dama da Noite": {
    nome: "Pombagira Dama da Noite", icone: "🌺",
    oferenda: "Flores brancas, licor doce",
    dia: "Sábado", cores: "Preto e violeta", lua: "Lua Nova", horario: "0h",
    descricao: "Guardiã dos segredos da noite. Rege o oculto, os sonhos, a magia lunar e os segredos que não podem ser revelados."
  }
};

// ---------------------------------------------------------------------------
// ARRAY DO CARROSSEL — 27 pombagiras com URLs do Supabase
// ---------------------------------------------------------------------------
const carouselImages = [
  { name: "Cacurucaia",        url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_cacurucaia.png" },
  { name: "Cigana",            url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_cigana.png" },
  { name: "Da Calunga Profunda", url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_da_calunga_profunda.png" },
  { name: "Da Estrada",        url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_da_estrada.png" },
  { name: "Da Fenda",          url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_da_fenda.png" },
  { name: "Da Figueira",       url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_da_figueira.png" },
  { name: "Da Lua",            url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_da_lua.png" },
  { name: "Da Neblina",        url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_da_neblina.png" },
  { name: "Das Águas Profundas", url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_das_aguas_profundas.png" },
  { name: "Das Almas",         url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_das_almas.png" },
  { name: "Das Correntes",     url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_das_correntes.png" },
  { name: "Das Trevas",        url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_das_trevas.png" },
  { name: "Do Fogo",           url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_do_fogo.png" },
  { name: "Do Vento",          url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_do_vento.png" },
  { name: "Maria Farrapo",     url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_maria_farrapo.png" },
  { name: "Maria Mulambo",     url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_maria_mulambo.png" },
  { name: "Maria Navalha",     url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_maria_navalha.png" },
  { name: "Maria Padilha",     url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_maria_padilha.png" },
  { name: "Maria Quitéria",    url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_maria_quiteria.png" },
  { name: "Menina",            url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_menina.png" },
  { name: "Rosa Caveira",      url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_rosa_caveira.png" },
  { name: "Sete Encruzilhadas", url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_sete_encruzilhadas.png" },
  { name: "Sete Saias",        url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_sete_saias.png" },
  { name: "Da Praia",          url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_da_praia.png" },
  { name: "Da Serra",          url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_da_serra.png" },
  { name: "Da Sombra",         url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_da_sombra.png" },
  { name: "Dama da Noite",     url: "https://luauvcxdhhyzpafvcqwu.supabase.co/storage/v1/object/public/fotos-site/pombagira_dama_da_noite.png" }
];

// ---------------------------------------------------------------------------
// BOTTOM SHEET — abre ao clicar no carrossel
// ---------------------------------------------------------------------------
function openBottomSheet(name, imgUrl) {
  const data = pombagirasData[name];
  const sheet = document.getElementById('bottomSheet');
  const sheetImg = document.getElementById('sheetImg');
  const sheetName = document.getElementById('sheetName');
  const sheetBody = document.getElementById('sheetBody');

  if (!sheet) return;

  sheetImg.src = imgUrl;
  sheetImg.alt = name;
  sheetName.textContent = (data ? data.nome : name);

  if (data) {
    sheetBody.innerHTML = `
      <p class="sheet-desc">${data.descricao}</p>
      <div class="sheet-info-grid">
        <div class="sheet-info-item"><span class="sheet-label">🌹 Oferenda</span><span class="sheet-value">${data.oferenda}</span></div>
        <div class="sheet-info-item"><span class="sheet-label">📅 Dia</span><span class="sheet-value">${data.dia}</span></div>
        <div class="sheet-info-item"><span class="sheet-label">🎨 Cores</span><span class="sheet-value">${data.cores}</span></div>
        <div class="sheet-info-item"><span class="sheet-label">🌙 Lua Ideal</span><span class="sheet-value">${data.lua}</span></div>
        <div class="sheet-info-item"><span class="sheet-label">🕐 Horário</span><span class="sheet-value">${data.horario}</span></div>
      </div>
    `;
  } else {
    sheetBody.innerHTML = `<p class="sheet-desc">Informações em breve sobre esta guardiã.</p>`;
  }

  sheet.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeBottomSheet() {
  const sheet = document.getElementById('bottomSheet');
  if (!sheet) return;
  sheet.classList.remove('active');
  document.body.style.overflow = '';
}

// ---------------------------------------------------------------------------
// CARROSSEL — loop infinito com suporte a touch e clique
// ---------------------------------------------------------------------------
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const container = document.getElementById('carouselContainer');
  if (!track || !container) return;

  // Duplica para loop infinito
  [...carouselImages, ...carouselImages].forEach((img, index) => {
    const div = document.createElement('div');
    div.className = 'carousel-item';
    div.setAttribute('tabindex', '0');
    div.setAttribute('role', 'button');
    div.setAttribute('aria-label', `Ver detalhes de ${img.name}`);
    if (index >= carouselImages.length) div.setAttribute('aria-hidden', 'true');

    div.innerHTML = `<img src="${img.url}" alt="${img.name}" loading="lazy"><span>${img.name}</span>`;

    const handleInteraction = () => {
      if (!hasMoved) openBottomSheet(img.name, img.url);
    };
    div.addEventListener('click', handleInteraction);
    div.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleInteraction(); }
    });
    track.appendChild(div);
  });

  // Motor de animação
  let isDragging = false;
  let startX = 0;
  let currentXDiff = 0;
  let positionX = 0;
  let hasMoved = false;
  const speed = 0.5;

  function getLoopWidth() { return track.scrollWidth / 2; }

  function renderLoop() {
    if (!isDragging) {
      positionX -= speed;
      const limit = getLoopWidth();
      if (Math.abs(positionX) >= limit) positionX = 0;
      track.style.transform = `translateX(${positionX}px)`;
    }
    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);

  // Touch events
  container.addEventListener('touchstart', (e) => {
    isDragging = true; hasMoved = false;
    startX = e.touches[0].clientX; currentXDiff = 0;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    currentXDiff = currentX - startX;
    if (Math.abs(currentXDiff) > 6) hasMoved = true;
    let targetX = positionX + currentXDiff;
    const limit = getLoopWidth();
    if (targetX > 0) targetX = -limit + targetX;
    else if (Math.abs(targetX) >= limit) targetX = targetX + limit;
    track.style.transform = `translateX(${targetX}px)`;
  }, { passive: true });

  container.addEventListener('touchend', () => {
    if (isDragging) { positionX += currentXDiff; isDragging = false; }
  });

  // Mouse drag
  container.addEventListener('mousedown', (e) => {
    isDragging = true; hasMoved = false;
    startX = e.clientX; currentXDiff = 0;
    container.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentXDiff = e.clientX - startX;
    if (Math.abs(currentXDiff) > 6) hasMoved = true;
    let targetX = positionX + currentXDiff;
    const limit = getLoopWidth();
    if (targetX > 0) targetX = -limit + targetX;
    else if (Math.abs(targetX) >= limit) targetX = targetX + limit;
    track.style.transform = `translateX(${targetX}px)`;
  });
  window.addEventListener('mouseup', () => {
    if (isDragging) { positionX += currentXDiff; isDragging = false; container.style.cursor = ''; }
  });
}

// ---------------------------------------------------------------------------
// TABS DO PORTAL EDUCATIVO
// ---------------------------------------------------------------------------
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    const activate = () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    };
    tab.addEventListener('click', activate);
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      if (e.key === 'ArrowRight') { const next = tab.nextElementSibling; if (next) { next.focus(); next.click(); } }
      if (e.key === 'ArrowLeft') { const prev = tab.previousElementSibling; if (prev) { prev.focus(); prev.click(); } }
    });
  });
}

// ---------------------------------------------------------------------------
// FAQ ACCORDION
// ---------------------------------------------------------------------------
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    if (!q) return;
    const toggleFAQ = () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        const qi = i.querySelector('.faq-question');
        if (qi) qi.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        q.setAttribute('aria-expanded', 'true');
      }
    };
    q.addEventListener('click', toggleFAQ);
    q.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFAQ(); }
    });
  });
}

// ---------------------------------------------------------------------------
// NAV BAR — scroll tracking
// ---------------------------------------------------------------------------
function initNavScroll() {
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const eduSection = document.getElementById('educativo');
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      item.classList.remove('active');
      item.removeAttribute('aria-current');
    });
    if (eduSection && scrollPos >= (eduSection.offsetTop - 250)) {
      const activeTabEl = document.querySelector('.nav-tab.active');
      const activeTab = activeTabEl ? activeTabEl.dataset.target : '';
      let activeNavItem;
      if (activeTab === 'faq') activeNavItem = document.querySelector('.mobile-nav-item[data-nav="faq"]');
      else if (activeTab === 'bibliografia') activeNavItem = document.querySelector('.mobile-nav-item[data-nav="bibliografia"]');
      else activeNavItem = document.querySelector('.mobile-nav-item[data-nav="portal"]');
      if (activeNavItem) { activeNavItem.classList.add('active'); activeNavItem.setAttribute('aria-current', 'page'); }
    } else {
      const homeNavItem = document.querySelector('.mobile-nav-item[data-nav="home"]');
      if (homeNavItem) { homeNavItem.classList.add('active'); homeNavItem.setAttribute('aria-current', 'page'); }
    }
  }, { passive: true });
}

// ---------------------------------------------------------------------------
// ROTEAMENTO POR ÂNCORA (footer links → aba certa)
// ---------------------------------------------------------------------------
function activateMobileTabFromAnchor(targetId) {
  const tabBtn = document.querySelector(`.nav-tab[data-target="${targetId}"]`);
  if (!tabBtn) return;
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
    t.setAttribute('tabindex', '-1');
  });
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  tabBtn.classList.add('active');
  tabBtn.setAttribute('aria-selected', 'true');
  tabBtn.setAttribute('tabindex', '0');
  const targetContent = document.getElementById(targetId);
  if (targetContent) targetContent.classList.add('active');
  const eduSection = document.getElementById('educativo');
  if (eduSection) eduSection.scrollIntoView({ behavior: 'smooth' });
}

function initAnchorRouting() {
  const TAB_IDS = ['glossario', 'curiosidades', 'faq', 'pombagiras', 'chico', 'bibliografia', 'cosmovisoes'];
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      if (hash && hash.length > 1) {
        const targetId = hash.substring(1);
        if (TAB_IDS.includes(targetId)) {
          e.preventDefault();
          activateMobileTabFromAnchor(targetId);
        }
      }
    });
  });
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    if (TAB_IDS.includes(hash)) setTimeout(() => activateMobileTabFromAnchor(hash), 300);
  }
}

// ---------------------------------------------------------------------------
// OTIMIZAÇÃO DE VÍDEO (conexões lentas)
// ---------------------------------------------------------------------------
function initVideoOptimization() {
  const video = document.querySelector('.hero-video');
  if (!video) return;
  if (navigator.connection) {
    const isSlowConnection = ['slow-2g', '2g', '3g'].includes(navigator.connection.effectiveType);
    const isSaveDataMode = navigator.connection.saveData === true;
    if (isSlowConnection || isSaveDataMode) video.remove();
  }
}

// ---------------------------------------------------------------------------
// BOTTOM SHEET — evento de fechar
// ---------------------------------------------------------------------------
function initBottomSheet() {
  const sheet = document.getElementById('bottomSheet');
  const closeBtn = document.getElementById('sheetClose');
  const overlay = document.getElementById('sheetOverlay');
  if (!sheet) return;
  if (closeBtn) closeBtn.addEventListener('click', closeBottomSheet);
  if (overlay) overlay.addEventListener('click', closeBottomSheet);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sheet.classList.contains('active')) closeBottomSheet();
  });
  // Swipe para baixo fecha
  let touchStartY = 0;
  sheet.querySelector('.sheet-content')?.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  sheet.querySelector('.sheet-content')?.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientY - touchStartY;
    if (diff > 80) closeBottomSheet();
  }, { passive: true });
}

// ---------------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initTabs();
  initFAQ();
  initNavScroll();
  initAnchorRouting();
  initVideoOptimization();
  initBottomSheet();
});
