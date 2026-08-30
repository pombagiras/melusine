// ============================================================
// GIRA — script.js v3 | Preview Card + Fire + Glass Pop
// ============================================================

const POMBAGIRAS = [
  { id: 'maria-padilha',       num: '01', name: 'Maria Padilha',        essence: 'Comando / Realeza',          color: '#800020', img: 'fotos/pombagira_maria_padilha.png',        page: 'maria-padilha.html' },
  { id: 'maria-mulambo',       num: '02', name: 'Maria Mulambo',         essence: 'Cura / Humildade',           color: '#5B1A6A', img: 'fotos/pombagira_maria_mulambo.png',        page: 'maria-mulambo.html' },
  { id: 'maria-quiteria',      num: '03', name: 'Maria Quiteria',        essence: 'Guerra / Protecao',          color: '#4A0E17', img: 'fotos/pombagira_maria_quiteria.png',       page: 'maria-quiteria.html' },
  { id: 'rosa-caveira',        num: '04', name: 'Rosa Caveira',           essence: 'Justica / Morte',            color: '#2F3E46', img: 'fotos/pombagira_rosa_caveira.png',         page: 'rosa-caveira.html' },
  { id: 'dama-da-noite',       num: '05', name: 'Dama da Noite',          essence: 'Misterio / Oculto',         color: '#3D1A5C', img: 'fotos/pombagira_dama_da_noite.png',        page: 'dama-da-noite.html' },
  { id: 'sete-saias',          num: '06', name: 'Sete Saias',             essence: 'Alegria / Intensidade',     color: '#800020', img: 'fotos/pombagira_sete_saias.png',           page: 'sete-saias.html' },
  { id: 'cigana',              num: '07', name: 'Cigana',                 essence: 'Liberdade / Prosperidade',  color: '#8A6F3B', img: 'fotos/pombagira_cigana.png',               page: 'cigana.html' },
  { id: 'maria-navalha',       num: '08', name: 'Maria Navalha',          essence: 'Malandragem / Rua',         color: '#4A0E17', img: 'fotos/pombagira_maria_navalha.png',        page: 'maria-navalha.html' },
  { id: 'da-praia',            num: '09', name: 'Da Praia',               essence: 'Emocao / Limpeza',          color: '#1A3A5C', img: 'fotos/pombagira_da_praia.png',             page: 'da-praia.html' },
  { id: 'maria-farrapo',       num: '10', name: 'Maria Farrapo',          essence: 'Sanidade / Caos',           color: '#5B1A6A', img: 'fotos/pombagira_maria_farrapo.png',        page: 'maria-farrapo.html' },
  { id: 'menina',              num: '11', name: 'Menina',                 essence: 'Renovacao / Inocencia',     color: '#2C0810', img: 'fotos/pombagira_menina.png',               page: 'menina.html' },
  { id: 'da-figueira',         num: '12', name: 'Da Figueira',            essence: 'Raiz / Ancestral',          color: '#1A2428', img: 'fotos/pombagira_da_figueira.png',          page: 'da-figueira.html' },
  { id: 'das-almas',           num: '13', name: 'Das Almas',              essence: 'Transicao / Mediunidade',   color: '#2F3E46', img: 'fotos/pombagira_das_almas.png',            page: 'das-almas.html' },
  { id: 'sete-encruzilhadas',  num: '14', name: '7 Encruzilhadas',        essence: 'Destino / Escolha',         color: '#800020', img: 'fotos/pombagira_sete_encruzilhadas.png',  page: 'sete-encruzilhadas.html' },
  { id: 'da-lua',              num: '15', name: 'Da Lua',                 essence: 'Ciclos / Intuicao',         color: '#3D1A5C', img: 'fotos/pombagira_da_lua.png',               page: 'da-lua.html' },
  { id: 'das-trevas',          num: '16', name: 'Das Trevas',             essence: 'Sombra / Transformacao',    color: '#0D0D0D', img: 'fotos/pombagira_das_trevas.png',           page: 'das-trevas.html' },
  { id: 'da-serra',            num: '17', name: 'Da Serra',               essence: 'Altitude / Silencio',       color: '#1A2428', img: 'fotos/pombagira_da_serra.png',             page: 'da-serra.html' },
  { id: 'do-fogo',             num: '18', name: 'Do Fogo',                essence: 'Purificacao / Paixao',      color: '#CC1122', img: 'fotos/pombagira_do_fogo.png',              page: 'do-fogo.html' },
  { id: 'das-aguas-profundas', num: '19', name: 'Aguas Profundas',        essence: 'Profundidade / Emocao',     color: '#1A3A5C', img: 'fotos/pombagira_das_aguas_profundas.png',  page: 'das-aguas-profundas.html' },
  { id: 'da-sombra',          num: '20', name: 'Da Sombra',              essence: 'Dualidade / Oculto',        color: '#2C0810', img: 'fotos/pombagira_da_sombra.png',            page: 'da-sombra.html' },
  { id: 'da-fenda',           num: '21', name: 'Da Fenda',               essence: 'Limiar / Portal',           color: '#5B1A6A', img: 'fotos/pombagira_da_fenda.png',             page: 'da-fenda.html' },
  { id: 'da-calunga-profunda', num: '22', name: 'Calunga Profunda',       essence: 'Morte / Renascimento',      color: '#2F3E46', img: 'fotos/pombagira_da_calunga_profunda.png',  page: 'da-calunga-profunda.html' },
  { id: 'das-correntes',      num: '23', name: 'Das Correntes',          essence: 'Fluxo / Continuidade',      color: '#1A3A5C', img: 'fotos/pombagira_das_correntes.png',        page: 'das-correntes.html' },
  { id: 'da-neblina',         num: '24', name: 'Da Neblina',             essence: 'Veu / Misterio',            color: '#4A5F69', img: 'fotos/pombagira_da_neblina.png',           page: 'da-neblina.html' }
];

const FAQ_DATA = [
  {
    q: 'Como saber qual é minha Pombagira?',
    a: 'A identificação da sua Pombagira de regência ou proteção espiritual é revelada tradicionalmente através de uma consulta ao oráculo sagrado (Jogo de Búzios, Baralho Cigano ou Cartomancia na Umbanda e Quimbanda) conduzida por um sacerdote experiente, ou durante o desenvolvimento mediúnico em um terreiro consagrado. Não se escolhe uma Pombagira por gosto pessoal; trata-se de uma afinidade vibratória e kármica ancestral que se manifesta para orientar e proteger sua jornada.'
  },
  {
    q: 'Por que sinto a presença das Pombagiras?',
    a: 'Sentir a presença de uma Pombagira manifesta-se através de arrepios sutis na pele, sensação de calor confortante nas costas ou no peito, perfume repentino de rosas ou essências sem fonte física, intuições aguçadas em encruzilhadas ou encerramentos de ciclos, e um súbito despertar de força, dignidade e autoestima. Essa aproximação indica que a guardiã está alinhando seu campo energético ou sinalizando proteção.'
  },
  {
    q: 'Pombagira é um demônio?',
    a: 'Não. Pombagira não é um demônio e não pertence à mitologia maniqueísta judaico-cristã. Essa associação preconceituosa surgiu durante o período colonial como tentativa de demonizar as divindades, ancestrais e saberes das religiões de matriz afro-brasileira. A Pombagira é um espírito de luz, justiça, sabedoria primordial e guardiã dos limiares cósmicos do feminino sagrado.'
  },
  {
    q: 'Como consigo me conectar com uma Pombagira?',
    a: 'A conexão autêntica fundamenta-se no respeito, na firmeza moral e na higiene energética. Para sintonizar, você pode firmar uma vela bicolor (vermelha e preta) ou vela vermelha com um copo de água mineral limpa em local elevado e reservado, mentalizando gratidão, clareza mental e abertura de caminhos nobres. Banhos de ervas aromáticas, orações sinceras e respeito às tradições fortalecem o laço sagrado.'
  },
  {
    q: 'Posso fazer pedidos a uma Pombagira?',
    a: 'Sim, desde que com maturidade, merecimento e ética espiritual. Pombagiras são mensageiras da Justiça Divina e realizadoras kármicas. Pedidos de cura emocional, clareza no amor-próprio, prosperidade e corte de amarras são bem-vindos. Jamais devem ser feitos pedidos que visem violar o livre-arbítrio de terceiros ou causar danos, pois a espiritualidade maior rege-se pela Lei Cósmica.'
  },
  {
    q: 'Pombagira faz o mal?',
    a: 'Pombagira não faz o mal. Como entidade de Lei e Justiça Maior, ela preserva a ordem universal. Quem busca rituais para prejudicar outrem não lida com Pombagiras coroadas, mas sim com obsessores e quiumbas (espíritos inferiores). A verdadeira Pombagira atua curando, quebrando feitiços, reerguendo pessoas e restabelecendo a dignidade humana.'
  },
  {
    q: 'Pombagira e a Lei do Retorno?',
    a: 'Nas tradições afro-brasileiras, a Pombagira é uma das maiores executoras da Lei do Retorno (Causa e Efeito). Toda energia emitida — seja de amor, traição, gratidão ou maldade — retorna potencializada à sua origem. A Pombagira não julga arbitrariamente; ela apenas cumpre e acelera o ciclo de retorno que o próprio indivíduo semeou, assegurando que o equilíbrio kármico prevaleça.'
  }
];

// ── PAGE LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) { loader.classList.add('loaded'); loader.addEventListener('transitionend', () => loader.remove(), { once: true }); }
  }, 1200);
});

// ── CUSTOM CURSOR ──
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  document.body.classList.add('cursor-moved');
  cursorDot.style.left = mouseX + 'px'; cursorDot.style.top = mouseY + 'px';
});
(function animateCursor() { ringX += (mouseX-ringX)*0.12; ringY += (mouseY-ringY)*0.12; cursorRing.style.left=ringX+'px'; cursorRing.style.top=ringY+'px'; requestAnimationFrame(animateCursor); })();
document.querySelectorAll('a,button,.pombagira-card,.faq-question,.wheel-btn').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
});

// ── NAV ──
const hamburger = document.getElementById('nav-hamburger');
if (hamburger) hamburger.addEventListener('click', () => { document.body.classList.toggle('nav-open'); hamburger.setAttribute('aria-expanded', document.body.classList.contains('nav-open')); });

// ── HELIX CHRONO MATRIX (Hero 3D Physics Engine) ──
(function initHelixChronoMatrix() {
  const container = document.getElementById('hero-matrix-container');
  const canvas = document.getElementById('hero-matrix-canvas');
  if (!container || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  let isRunning = true;
  let topology = 'DOUBLE_HELIX';
  let topologyTransition = { progress: 1, from: 'DOUBLE_HELIX', to: 'DOUBLE_HELIX' };

  let rings = [];
  let particles = [];
  let width = 0;
  let height = 0;

  const pointer = {
    x: -2000,
    y: -2000,
    targetX: -2000,
    targetY: -2000,
    radius: 240,
  };

  function initTopology(w, h) {
    rings = [];
    const ringCount = 28;
    const pointsPerRing = 120;

    for (let r = 0; r < ringCount; r++) {
      const progress = r / ringCount;
      const points = [];
      const baseRadius = Math.min(w, h) * 0.38 * (0.35 + progress * 0.65);
      const yOffset = (progress - 0.5) * (h * 0.48);

      for (let p = 0; p < pointsPerRing; p++) {
        points.push({
          x: 0,
          y: 0,
          baseY: yOffset,
          vy: 0,
          excitation: 0,
        });
      }

      rings.push({
        points,
        radius: baseRadius,
        baseRadius,
        yOffset,
        rotationSpeed: (r % 2 === 0 ? 1 : -1) * (0.002 + (r / ringCount) * 0.0025),
        angle: (r * Math.PI) / ringCount,
        harmonicOffset: r * 0.22,
        ringIndex: r,
      });
    }

    particles = [];
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        ringIndex: Math.floor(Math.random() * ringCount),
        progress: Math.random(),
        speed: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2 + 1.5,
      });
    }
  }

  function resize() {
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    initTopology(rect.width, rect.height);
  }

  window.addEventListener('resize', resize);
  setTimeout(resize, 50);

  // Pointer interaction
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    pointer.targetX = e.clientX - rect.left;
    pointer.targetY = e.clientY - rect.top;
  });

  container.addEventListener('mouseleave', () => {
    pointer.targetX = -2000;
    pointer.targetY = -2000;
  });

  // Touch interaction
  container.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = container.getBoundingClientRect();
      pointer.targetX = e.touches[0].clientX - rect.left;
      pointer.targetY = e.touches[0].clientY - rect.top;
    }
  }, { passive: true });

  container.addEventListener('touchend', () => {
    pointer.targetX = -2000;
    pointer.targetY = -2000;
  });

  // Auto Topology Evolution
  const modes = ['DOUBLE_HELIX', 'NEURAL_STRATA', 'QUANTUM_RIBBONS'];
  let modeIdx = 0;
  setInterval(() => {
    if (!isRunning) return;
    modeIdx = (modeIdx + 1) % modes.length;
    const nextMode = modes[modeIdx];
    topologyTransition = {
      progress: 0,
      from: topology,
      to: nextMode,
    };
    topology = nextMode;
  }, 9000);

  // Render loop
  let time = 0;
  function render() {
    requestAnimationFrame(render);
    if (!isRunning) return;

    time += 0.012;
    const trans = topologyTransition;
    if (trans.progress < 1) {
      trans.progress = Math.min(1, trans.progress + 0.045);
    }

    // Pointer lerp
    pointer.x += (pointer.targetX - pointer.x) * 0.1;
    pointer.y += (pointer.targetY - pointer.y) * 0.1;

    // Background clearing with brand dark palette
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // Render fibers
    for (let rIdx = 0; rIdx < rings.length; rIdx++) {
      const ring = rings[rIdx];
      ring.angle += ring.rotationSpeed;

      const points = ring.points;
      const numPoints = points.length;

      ctx.beginPath();
      let firstProjX = 0;
      let firstProjY = 0;
      let avgExcitation = 0;

      for (let pIdx = 0; pIdx < numPoints; pIdx++) {
        const pt = points[pIdx];
        const theta = (pIdx / numPoints) * Math.PI * 2 + ring.angle;

        const getPos = (mode) => {
          let x = Math.cos(theta) * ring.radius;
          let z = Math.sin(theta) * ring.radius;
          let y = ring.yOffset;

          if (mode === 'DOUBLE_HELIX') {
            y += Math.sin(theta * 2 + time * 2 + ring.harmonicOffset) * 45;
          } else if (mode === 'NEURAL_STRATA') {
            x += Math.sin(y * 0.02 + time * 1.5) * 35;
            y += Math.cos(theta * 3 + time) * 30;
          } else {
            x *= 1 + Math.sin(theta * 4 + time * 1.2) * 0.15;
            y += Math.sin(x * 0.008 + time * 2) * 50;
          }
          return { x, y, z };
        };

        const posFrom = getPos(trans.from);
        const posTo = getPos(trans.to);
        const easeProgress = trans.progress < 0.5
          ? 2 * trans.progress * trans.progress
          : -1 + (4 - 2 * trans.progress) * trans.progress;

        const x3D = posFrom.x + (posTo.x - posFrom.x) * easeProgress;
        const y3D = posFrom.y + (posTo.y - posFrom.y) * easeProgress;
        const z3D = posFrom.z + (posTo.z - posFrom.z) * easeProgress;

        const fov = 600;
        const cameraDist = 550;
        const scale = fov / (cameraDist + z3D);

        const projX = centerX + x3D * scale;
        const projY = centerY + (y3D + pt.vy) * scale;

        // Pointer attraction field
        const dx = projX - pointer.x;
        const dy = projY - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < pointer.radius && dist > 0) {
          const ratio = 1 - dist / pointer.radius;
          const targetVy = Math.sin(theta + time) * ratio * 18;
          pt.vy += (targetVy - pt.vy) * 0.12;
          pt.excitation = Math.max(pt.excitation, ratio);
        } else {
          pt.vy *= 0.92;
        }

        pt.excitation *= 0.92;
        avgExcitation += pt.excitation;

        if (pIdx === 0) {
          firstProjX = projX;
          firstProjY = projY;
          ctx.moveTo(projX, projY);
        } else {
          ctx.lineTo(projX, projY);
        }
      }

      ctx.lineTo(firstProjX, firstProjY);
      avgExcitation /= numPoints;

      const progress = rIdx / rings.length;
      const isExcited = avgExcitation > 0.05;

      // Color selection according to Pombagiras ecosystem palette
      if (isExcited) {
        // Vibrant Gold / Brass & Crimson glow
        const alpha = Math.min(1, 0.45 + avgExcitation * 0.55);
        ctx.strokeStyle = `rgba(226, 201, 138, ${alpha})`;
        ctx.lineWidth = 1.3 + avgExcitation * 1.8;
      } else {
        // Multi-layered subtle harmonic palette: Brass, Oxblood, Purple, Slate
        let colorStr = '197, 160, 89'; // Brass default
        if (rIdx % 4 === 1) colorStr = '128, 0, 32'; // Crimson
        else if (rIdx % 4 === 2) colorStr = '91, 26, 106'; // Purple
        else if (rIdx % 4 === 3) colorStr = '232, 224, 208'; // Warm Cream Dim

        const depthAlpha = (0.12 + progress * 0.4) * 0.75;
        ctx.strokeStyle = `rgba(${colorStr}, ${depthAlpha})`;
        ctx.lineWidth = 0.85;
      }

      ctx.stroke();
    }

    // Render Traveling Particles (Brass / Warm gold embers)
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.progress = (p.progress + p.speed + 1) % 1;

      const ring = rings[p.ringIndex];
      if (!ring) continue;

      const numPoints = ring.points.length;
      const exactIndex = p.progress * numPoints;
      const pIdx1 = Math.floor(exactIndex) % numPoints;
      const pIdx2 = (pIdx1 + 1) % numPoints;
      const blend = exactIndex - Math.floor(exactIndex);

      const theta1 = (pIdx1 / numPoints) * Math.PI * 2 + ring.angle;
      const theta2 = (pIdx2 / numPoints) * Math.PI * 2 + ring.angle;

      const x1 = Math.cos(theta1) * ring.radius;
      const z1 = Math.sin(theta1) * ring.radius;
      const x2 = Math.cos(theta2) * ring.radius;
      const z2 = Math.sin(theta2) * ring.radius;

      const x3D = x1 + (x2 - x1) * blend;
      const z3D = z1 + (z2 - z1) * blend;
      const y3D = ring.yOffset;

      const fov = 600;
      const cameraDist = 550;
      const scale = fov / (cameraDist + z3D);

      const projX = centerX + x3D * scale;
      const projY = centerY + y3D * scale;

      const dx = projX - pointer.x;
      const dy = projY - pointer.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const isNearHover = dist < pointer.radius;

      ctx.beginPath();
      ctx.arc(projX, projY, p.size * scale, 0, Math.PI * 2);

      if (isNearHover) {
        ctx.fillStyle = '#FAF6EE'; // Warm cream brilliant on hover
        ctx.shadowColor = '#E2C98A';
        ctx.shadowBlur = 10;
      } else {
        ctx.fillStyle = i % 2 === 0 ? '#C5A059' : '#C0002A'; // Brass or Crimson pearl
        ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  requestAnimationFrame(render);
})();

// ── PARTICLES ──
(function() {
  const c = document.getElementById('particles'); if (!c) return;
  const n = window.innerWidth<768?8:16;
  for(let i=0;i<n;i++){const p=document.createElement('div');p.className='particle';const s=Math.random()*4+1;const cols=['rgba(197,160,89,','rgba(128,0,32,','rgba(91,26,106,'];p.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;top:${Math.random()*100+100}%;background:${cols[~~(Math.random()*cols.length)]}${Math.random()*.6+.2});animation-duration:${Math.random()*12+8}s;animation-delay:${Math.random()*8}s;`;c.appendChild(p);}
})();

// ── WHEEL PREVIEW CARD (Portrait on right) & NAME STAGE (Left side) ──
const preview = document.createElement('div');
preview.id = 'wheel-preview';
preview.innerHTML = `
  <img id="preview-img" src="" alt="" loading="lazy">
  <div class="preview-gradient"></div>
  <div class="preview-info">
    <span class="preview-num" id="preview-num"></span>
    <h3 class="preview-name-el" id="preview-name-el"></h3>
    <span class="preview-essence-el" id="preview-essence-el"></span>
    <div class="preview-hint"><i class="fas fa-arrow-right"></i> Clique para ver o perfil</div>
  </div>`;
document.body.appendChild(preview);

const leftStage = document.createElement('div');
leftStage.id = 'wheel-left-stage';
leftStage.innerHTML = `
  <div class="stage-aura" id="stage-aura" aria-hidden="true"></div>
  <div class="stage-flame-crown" aria-hidden="true">
    <span class="flame-sparkle s1">✦</span>
    <span class="flame-sparkle s2">✧</span>
    <span class="flame-sparkle s3">✦</span>
  </div>
  <div class="stage-card-body">
    <span class="stage-badge" id="stage-badge">POMBAGIRA 01 · GIRA SAGRADA</span>
    <div class="stage-name-wrapper">
      <h2 class="stage-name" id="stage-name">Maria Padilha</h2>
      <div class="stage-name-glow" id="stage-name-glow" aria-hidden="true">Maria Padilha</div>
    </div>
    <div class="stage-divider">
      <span class="divider-line"></span>
      <span class="divider-symbol">❖</span>
      <span class="divider-line"></span>
    </div>
    <span class="stage-essence" id="stage-essence">Comando / Realeza</span>
    <div class="stage-subtext" id="stage-subtext">Arquétipo Sagrado &amp; Regência Astral</div>
  </div>`;
document.body.appendChild(leftStage);

const prevImg = document.getElementById('preview-img');
const prevNum = document.getElementById('preview-num');
const prevName = document.getElementById('preview-name-el');
const prevEss = document.getElementById('preview-essence-el');

const stageBadge = document.getElementById('stage-badge');
const stageName = document.getElementById('stage-name');
const stageNameGlow = document.getElementById('stage-name-glow');
const stageEssence = document.getElementById('stage-essence');
const stageAura = document.getElementById('stage-aura');
const wheelWrapper = document.getElementById('wheel-wrapper');

let previewTimeout = null;

function positionPreview() {
  if (!wheelWrapper) return;
  const wr = wheelWrapper.getBoundingClientRect();
  const pw = 300, sw = 310, gap = 20;
  
  // Right portrait card
  let rightLeft = Math.min(window.innerWidth - pw - 16, wr.right + gap);
  const top = wr.top + (wr.height/2) - (preview.offsetHeight/2 || 240);
  preview.style.left = Math.max(16, rightLeft) + 'px';
  preview.style.top = Math.max(70, Math.min(top, window.innerHeight - 490)) + 'px';

  // Left name stage
  let leftPos = Math.max(16, wr.left - sw - gap);
  const stageTop = wr.top + (wr.height/2) - (leftStage.offsetHeight/2 || 150);
  leftStage.style.left = leftPos + 'px';
  leftStage.style.top = Math.max(70, Math.min(stageTop, window.innerHeight - 400)) + 'px';
}

function showPreview(p) {
  clearTimeout(previewTimeout);
  // Pre-load image for snappy reveal
  if (prevImg.dataset.current !== p.img) {
    prevImg.src = p.img;
    prevImg.dataset.current = p.img;
  }
  prevNum.textContent = 'Pombagira ' + p.num;
  prevName.textContent = p.name;
  prevEss.textContent = p.essence;

  // Left side name stage update
  stageBadge.textContent = 'POMBAGIRA ' + p.num + ' · GIRA SAGRADA';
  stageName.textContent = p.name;
  stageNameGlow.textContent = p.name;
  stageEssence.textContent = p.essence;
  if (stageAura && p.color) {
    stageAura.style.background = `radial-gradient(circle, ${p.color}55 0%, transparent 70%)`;
  }

  positionPreview();
  preview.classList.add('visible');
  leftStage.classList.add('visible');
  document.body.classList.add('cursor-hover');
}

function hidePreview() {
  previewTimeout = setTimeout(() => { 
    preview.classList.remove('visible'); 
    leftStage.classList.remove('visible');
  }, 120);
}

wheelWrapper.addEventListener('mouseleave', () => {
  hidePreview();
  document.body.classList.remove('cursor-hover');
});

// ── SVG WHEEL ──
const svgNS = 'http://www.w3.org/2000/svg';
const wheelSvg = document.getElementById('wheel-svg');
const slicesGroup = document.getElementById('wheel-slices');
const CX=250, CY=250, R_OUTER=238, R_INNER=73;
const N=POMBAGIRAS.length, SLICE_ANGLE=360/N;
const STRIP_COLORS=['#0A020E','#0E040A','#080308','#0C0308'];

function polarToCart(cx,cy,r,deg){ const rad=(deg-90)*Math.PI/180; return{x:cx+r*Math.cos(rad),y:cy+r*Math.sin(rad)}; }
function slicePath(i,ro,ri){ ro=ro||R_OUTER;ri=ri||R_INNER; const s=i*SLICE_ANGLE,e=s+SLICE_ANGLE,p1=polarToCart(CX,CY,ro,s),p2=polarToCart(CX,CY,ro,e),p3=polarToCart(CX,CY,ri,e),p4=polarToCart(CX,CY,ri,s),la=SLICE_ANGLE>180?1:0; return`M ${p4.x} ${p4.y} L ${p1.x} ${p1.y} A ${ro} ${ro} 0 ${la} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${ri} ${ri} 0 ${la} 0 ${p4.x} ${p4.y} Z`; }

// Center: inject favicon image
const centerEl = document.querySelector('.wheel-center-circle');
if(centerEl){ centerEl.innerHTML='<img class="wheel-center-img" src="https://cdn.pombagiras.com/fotos/FINAL-FAVICON-VIP%20.png" alt="GIRA" style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;">'; }

// Build slices
POMBAGIRAS.forEach((p,i) => {
  const g = document.createElementNS(svgNS,'g');
  g.setAttribute('class','wheel-slice');
  g.setAttribute('data-index',i);
  g.setAttribute('role','button');
  g.setAttribute('aria-label',`${p.name} - ${p.essence}`);
  g.setAttribute('tabindex','0');
  g.style.cursor='pointer';

  // Clip path
  const clipId=`clip-${p.id}`;
  const defs=wheelSvg.querySelector('defs');
  const cp=document.createElementNS(svgNS,'clipPath');cp.setAttribute('id',clipId);
  const cpP=document.createElementNS(svgNS,'path');cpP.setAttribute('d',slicePath(i));
  cp.appendChild(cpP);defs.appendChild(cp);

  // BG
  const bg=document.createElementNS(svgNS,'path');bg.setAttribute('d',slicePath(i));bg.setAttribute('fill',STRIP_COLORS[i%STRIP_COLORS.length]);bg.setAttribute('stroke','rgba(197,160,89,0.2)');bg.setAttribute('stroke-width','0.6');g.appendChild(bg);

  // Image
  const imgEl=document.createElementNS(svgNS,'image');
  imgEl.setAttribute('href',p.img);imgEl.setAttribute('x',CX-R_OUTER);imgEl.setAttribute('y',CY-R_OUTER);
  imgEl.setAttribute('width',R_OUTER*2);imgEl.setAttribute('height',R_OUTER*2);
  imgEl.setAttribute('clip-path',`url(#${clipId})`);imgEl.setAttribute('preserveAspectRatio','xMidYMin slice');
  imgEl.style.filter='grayscale(75%) brightness(0.42) contrast(1.1)';
  imgEl.style.transition='filter 0.5s ease';
  g.appendChild(imgEl);

  // Color overlay
  const ov=document.createElementNS(svgNS,'path');ov.setAttribute('d',slicePath(i));ov.setAttribute('fill',p.color);ov.setAttribute('opacity','0.38');ov.style.transition='opacity 0.4s ease';g.appendChild(ov);

  // Glass shimmer
  const gl=document.createElementNS(svgNS,'path');gl.setAttribute('d',slicePath(i));gl.setAttribute('fill','rgba(255,240,200,0.07)');gl.setAttribute('stroke','rgba(197,160,89,0.55)');gl.setAttribute('stroke-width','1.5');gl.style.opacity='0';gl.style.transition='opacity 0.3s ease';g.appendChild(gl);

  // Separator line
  const la=i*SLICE_ANGLE,ls=polarToCart(CX,CY,R_INNER,la),le=polarToCart(CX,CY,R_OUTER,la);
  const ln=document.createElementNS(svgNS,'line');ln.setAttribute('x1',ls.x);ln.setAttribute('y1',ls.y);ln.setAttribute('x2',le.x);ln.setAttribute('y2',le.y);ln.setAttribute('stroke','rgba(197,160,89,0.35)');ln.setAttribute('stroke-width','0.7');g.appendChild(ln);

  // Mobile text label
  const midA=i*SLICE_ANGLE+SLICE_ANGLE/2;
  const tR=(R_OUTER+R_INNER)/2+10;const tp=polarToCart(CX,CY,tR,midA);
  const tx=document.createElementNS(svgNS,'text');
  tx.setAttribute('class','slice-label-mobile');tx.setAttribute('x',tp.x);tx.setAttribute('y',tp.y);
  tx.setAttribute('transform',`rotate(${midA},${tp.x},${tp.y})`);
  tx.textContent=p.name.length>10?p.name.substring(0,9)+'.':p.name;
  tx.style.pointerEvents='none';g.appendChild(tx);

  // ── HOVER ──
  g.addEventListener('mouseenter',()=>{
    // Color reveal
    imgEl.style.filter='grayscale(0%) brightness(0.78) contrast(1.12) saturate(1.4)';
    ov.setAttribute('opacity','0.18');
    gl.style.opacity='1';
    // Show portrait preview
    showPreview(p);
  });
  g.addEventListener('mouseleave',()=>{
    imgEl.style.filter='grayscale(75%) brightness(0.42) contrast(1.1)';
    ov.setAttribute('opacity','0.38');
    gl.style.opacity='0';
  });
  g.addEventListener('click',()=>{ window.location.href=p.page; });
  g.addEventListener('keydown',(e)=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();window.location.href=p.page;} });

  slicesGroup.appendChild(g);
});

// ── TOOLTIP (mobile / fallback) ──
const tooltip=document.getElementById('wheel-tooltip');
const tipName=document.getElementById('tooltip-name');
const tipEss=document.getElementById('tooltip-essence');
let tipVisible=false;
document.addEventListener('mousemove',(e)=>{
  if(!tipVisible)return;
  let x=e.clientX+18,y=e.clientY-10;
  if(x+230>window.innerWidth)x=e.clientX-240;
  if(y+80>window.innerHeight)y=e.clientY-90;
  tooltip.style.left=x+'px';tooltip.style.top=y+'px';
});

// ── WHEEL CONTROLS ──
const wheelEl=document.getElementById('wheel-svg');
const speedLabel=document.getElementById('speed-label');
const speeds=[{label:'Devagar',dur:'120s'},{label:'Normal',dur:'60s'},{label:'Rapido',dur:'30s'},{label:'Veloz',dur:'12s'}];
let speedIdx=1,paused=false;
function setSpeed(){ speedLabel.textContent=speeds[speedIdx].label; if(!paused){wheelEl.style.animation=`spinWheel ${speeds[speedIdx].dur} linear infinite`;wheelEl.style.animationPlayState='running';} }
document.getElementById('btn-faster').addEventListener('click',()=>{speedIdx=Math.min(speedIdx+1,speeds.length-1);setSpeed();});
document.getElementById('btn-slower').addEventListener('click',()=>{speedIdx=Math.max(speedIdx-1,0);setSpeed();});
const pauseBtn=document.getElementById('btn-pause');
pauseBtn.addEventListener('click',()=>{
  paused=!paused;
  if(paused){wheelEl.style.animationPlayState='paused';pauseBtn.innerHTML='<i class="fas fa-play"></i>';speedLabel.textContent='Pausada';fireEnabled=false;}
  else{wheelEl.style.animationPlayState='running';pauseBtn.innerHTML='<i class="fas fa-pause"></i>';speedLabel.textContent=speeds[speedIdx].label;fireEnabled=true;}
});
wheelWrapper.addEventListener('mouseenter',()=>{if(!paused)wheelEl.style.animationPlayState='paused';});
wheelWrapper.addEventListener('mouseleave',()=>{if(!paused)wheelEl.style.animationPlayState='running';});

// ── FIRE CANVAS ──
const fireCanvas=document.createElement('canvas');fireCanvas.id='fire-canvas';wheelWrapper.appendChild(fireCanvas);
const fCtx=fireCanvas.getContext('2d');
let fireEnabled=true;
function resizeFire(){ const s=wheelWrapper.offsetWidth+120;fireCanvas.width=s;fireCanvas.height=s; }
resizeFire();window.addEventListener('resize',resizeFire);
const FCOLS=['rgba(255,60,0,','rgba(255,140,0,','rgba(255,200,40,','rgba(197,80,20,','rgba(192,0,42,','rgba(255,90,30,'];
class FP{ constructor(){this.reset();}
  reset(){ const cs=fireCanvas.width,cx=cs/2,cy=cs/2,R=cs*0.415,a=Math.random()*Math.PI*2;this.x=cx+R*Math.cos(a);this.y=cy+R*Math.sin(a);const o=Math.random()*.7+.4;this.vx=Math.cos(a)*o*(Math.random()*.9+.2);this.vy=Math.sin(a)*o*(Math.random()*.9+.2)-(Math.random()*1.4+.7);this.life=Math.random()*.8+.3;this.decay=Math.random()*.025+.012;this.size=Math.random()*6+2;this.color=FCOLS[~~(Math.random()*FCOLS.length)]; }
  update(){ this.x+=this.vx;this.y+=this.vy;this.vy-=0.032;this.vx*=0.98;this.size*=0.974;this.life-=this.decay; }
  draw(c){ if(this.life<=0||this.size<.3)return;c.beginPath();const g=c.createRadialGradient(this.x,this.y,0,this.x,this.y,this.size);g.addColorStop(0,`${this.color}${Math.min(this.life,.9)})`);g.addColorStop(.55,`${this.color}${Math.min(this.life*.55,.45)})`);g.addColorStop(1,`${this.color}0)`);c.fillStyle=g;c.arc(this.x,this.y,this.size,0,Math.PI*2);c.fill(); }
}
let fps=[];const MAX_FP=window.innerWidth<768?25:65;
(function fireTick(){ requestAnimationFrame(fireTick);fCtx.clearRect(0,0,fireCanvas.width,fireCanvas.height);if(paused)return;const sc=[1,2,3,6][speedIdx];for(let i=0;i<sc&&fps.length<MAX_FP;i++)fps.push(new FP());fps=fps.filter(p=>p.life>0&&p.size>.3);fps.forEach(p=>{p.update();p.draw(fCtx);});if(Math.random()<.06&&!paused){for(let i=0;i<4;i++)fps.push(new FP());} })();

// ── GRID CARDS ──
(function buildCards(){
  const grid=document.getElementById('grid-pombagiras');if(!grid)return;
  POMBAGIRAS.forEach(p=>{
    const a=document.createElement('a');a.href=p.page;a.className='pombagira-card reveal';a.setAttribute('role','listitem');a.id=`card-${p.id}`;
    a.innerHTML=`<img class="card-img" src="${p.img}" alt="${p.name}" loading="lazy" width="300" height="400"><div class="card-overlay"></div><div class="card-body"><span class="card-number">${p.num}</span><h3 class="card-name">${p.name}</h3><span class="card-essence">${p.essence}</span></div><div class="card-arrow" aria-hidden="true"><i class="fas fa-arrow-right"></i></div>`;
    grid.appendChild(a);
    a.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    a.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });
})();

// ── FAQ ──
(function buildFAQ(){
  const list=document.getElementById('faq-list');if(!list)return;
  FAQ_DATA.forEach((item,i)=>{
    const li=document.createElement('li');li.className='faq-item reveal';
    li.innerHTML=`<button class="faq-question" aria-expanded="false" id="faq-q-${i}" aria-controls="faq-a-${i}">${item.q}<span class="faq-icon" aria-hidden="true">+</span></button><div class="faq-answer" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}"><p>${item.a}</p></div>`;
    list.appendChild(li);
    li.querySelector('.faq-question').addEventListener('click',()=>{const open=li.classList.contains('open');document.querySelectorAll('.faq-item.open').forEach(el=>{el.classList.remove('open');el.querySelector('.faq-question').setAttribute('aria-expanded','false');});if(!open){li.classList.add('open');li.querySelector('.faq-question').setAttribute('aria-expanded','true');}});
  });
})();

// ── SCROLL REVEAL ──
const ro=new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ro.unobserve(e.target);}}),{threshold:.1,rootMargin:'0px 0px -40px 0px'});
function obsReveal(){document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));}
obsReveal();setTimeout(obsReveal,150);

// ── HERO TO WHEEL HARMONIC SCROLL CONNECTION ──
(function initHarmonicBridge() {
  const bridge = document.getElementById('hero-bridge');
  const wheelSec = document.getElementById('wheel-section');
  const wheelWrapper = document.getElementById('wheel-wrapper');
  if (!bridge || !wheelSec) return;

  bridge.addEventListener('click', (e) => {
    e.preventDefault();
    wheelSec.scrollIntoView({ behavior: 'smooth' });
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;
        const ratio = Math.min(Math.max(scrollY / (heroHeight * 0.75), 0), 1);

        // Smooth energy conduit reaction
        const beam = bridge.querySelector('.bridge-beam');
        const orb = bridge.querySelector('.bridge-orb');
        if (beam) beam.style.height = `${46 + ratio * 30}px`;
        if (orb) orb.style.transform = `scale(${1 + ratio * 0.25}) translateY(${ratio * 12}px)`;

        // Subtle wheel aura expansion as you scroll down
        if (wheelWrapper) {
          wheelWrapper.style.transform = `translateY(${Math.max(0, (1 - ratio) * 20)}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ── EMAIL CLICK TO COPY ──
(function initEmailCopy() {
  const btn = document.getElementById('btn-copy-email');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const email = btn.getAttribute('data-email') || 'contato@pombagiras.com';
    try {
      await navigator.clipboard.writeText(email);
      const badge = btn.querySelector('.copy-badge');
      if (badge) {
        const originalText = badge.innerHTML;
        badge.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        badge.style.background = 'rgba(197, 160, 89, 0.4)';
        badge.style.color = '#FFF2CC';
        setTimeout(() => {
          badge.innerHTML = originalText;
          badge.style.background = '';
          badge.style.color = '';
        }, 2200);
      }
    } catch (err) {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      alert('Email copiado: ' + email);
    }
  });
})();

