(function () {
  'use strict';

  // ================= DATA =================

  const POMBAGIRAS = [
    {
      id: 0,
      nome: 'Maria Padilha',
      epiteto: 'A Rainha das Encruzilhadas',
      img: 'https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/pombagira_maria_padilha.png',
      desc: 'Comanda com luxo, magnetismo e uma vontade que não pede licença. Onde ela pisa, o poder muda de mãos.',
      tags: ['Poder', 'Sedução', 'Comando']
    },
    {
      id: 1,
      nome: 'Maria Mulambo',
      epiteto: 'A Guardiã dos Esquecidos',
      img: 'https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/pombagira_maria_mulambo.png',
      desc: 'Veste o que sobrou e protege quem o mundo descartou. Sua força mora na lealdade silenciosa.',
      tags: ['Proteção', 'Lealdade', 'Raiz']
    },
    {
      id: 2,
      nome: 'Maria Quitéria',
      epiteto: 'A Guerreira da Justiça',
      img: 'https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/pombagira_maria_quiteria.png',
      desc: 'Não foge da briga quando a causa é justa. Coragem é o idioma que ela fala melhor.',
      tags: ['Coragem', 'Justiça', 'Fogo']
    },
    {
      id: 3,
      nome: 'Rosa Caveira',
      epiteto: 'A Senhora dos Mistérios',
      img: 'https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/pombagira_rosa_caveira.png',
      desc: 'Caminha entre a vida e a morte sem medo de nenhuma das duas. Transforma o que toca.',
      tags: ['Mistério', 'Transformação', 'Profundeza']
    },
    {
      id: 4,
      nome: 'Dama da Noite',
      epiteto: 'A Sedutora das Sombras',
      img: 'https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/pombagira_dama_da_noite.png',
      desc: 'Espera a escuridão para agir, porque é nela que enxerga com mais clareza.',
      tags: ['Mistério', 'Estratégia', 'Sedução']
    },
    {
      id: 5,
      nome: 'Sete Saias',
      epiteto: 'A Dona dos Sete Véus',
      img: 'https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/pombagira_sete_saias.png',
      desc: 'Cada camada esconde uma verdade diferente. Quem acha que a conhece, só viu a primeira saia.',
      tags: ['Camadas', 'Enigma', 'Versatilidade']
    },
    {
      id: 6,
      nome: 'Pombagira Cigana',
      epiteto: 'A Livre da Estrada',
      img: 'https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/pombagira_cigana.png',
      desc: 'Não pertence a lugar nenhum além do caminho. Lê o destino como quem lê um mapa velho.',
      tags: ['Liberdade', 'Intuição', 'Movimento']
    },
    {
      id: 7,
      nome: 'Maria Navalha',
      epiteto: 'A que Corta o Destino',
      img: 'https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/pombagira_maria_navalha.png',
      desc: 'Decide rápido e corta sem dó o que já não serve. Proteção afiada, sem meio-termo.',
      tags: ['Decisão', 'Defesa', 'Precisão']
    },
    {
      id: 8,
      nome: 'Pombagira da Praia',
      epiteto: 'A Filha das Ondas',
      img: 'https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/pombagira_da_praia.png',
      desc: 'Leva embora o que pesa e devolve leveza na maré seguinte. Cura como o mar cura.',
      tags: ['Purificação', 'Leveza', 'Acolhimento']
    },
    {
      id: 9,
      nome: 'Maria Farrapo',
      epiteto: 'A Humilde de Coração Forte',
      img: 'https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/pombagira_maria_farrapo.png',
      desc: 'Não precisa de trono para reinar. Sua simplicidade é a prova mais dura de força.',
      tags: ['Simplicidade', 'Resistência', 'Humildade']
    },
    {
      id: 10,
      nome: 'Pombagira Menina',
      epiteto: 'A Travessa de Riso Fácil',
      img: 'https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/pombagira_menina.png',
      desc: 'Brinca com o que assusta os outros e vira qualquer jogo a seu favor com um sorriso.',
      tags: ['Travessura', 'Charme', 'Leveza']
    },
    {
      id: 11,
      nome: 'Pombagira da Figueira',
      epiteto: 'A Raiz Ancestral',
      img: 'https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/pombagira_da_figueira.png',
      desc: 'Ligada às raízes mais fundas, guarda sabedoria que vem de antes de você nascer.',
      tags: ['Ancestralidade', 'Sabedoria', 'Natureza']
    }
  ];

  const QUESTIONS = [
    {
      texto: 'Qual ambiente faz seu poder pulsar mais forte?',
      opcoes: [
        { t: 'Um salão de luxo, tudo em veludo e ouro', pid: 0 },
        { t: 'Um cemitério ao luar, entre flores murchas', pid: 3 },
        { t: 'Uma estrada sem fim, com o vento no rosto', pid: 6 },
        { t: 'Um beco simples, onde ninguém te julga', pid: 9 }
      ]
    },
    {
      texto: 'Como você resolve um problema difícil?',
      opcoes: [
        { t: 'Escondo a dor e sigo protegendo quem eu amo', pid: 1 },
        { t: 'Espero a noite cair e ajo em silêncio', pid: 4 },
        { t: 'Corto o problema pela raiz, sem hesitar', pid: 7 },
        { t: 'Brinco com a situação até virar a meu favor', pid: 10 }
      ]
    },
    {
      texto: 'O que mais te atrai em uma pessoa?',
      opcoes: [
        { t: 'Coragem para lutar pelo que acredita', pid: 2 },
        { t: 'Mistério, várias camadas pra descobrir', pid: 5 },
        { t: 'Leveza e pureza de intenção', pid: 8 },
        { t: 'Sabedoria e raízes profundas', pid: 11 }
      ]
    },
    {
      texto: 'Qual é sua arma preferida — literal ou figurada?',
      opcoes: [
        { t: 'O silêncio da morte, que tudo transforma', pid: 3 },
        { t: 'As cartas, que revelam o caminho', pid: 6 },
        { t: 'A simplicidade, que desarma qualquer um', pid: 9 },
        { t: 'O charme, que conquista reinos', pid: 0 }
      ]
    },
    {
      texto: 'Como você reage quando é traído(a)?',
      opcoes: [
        { t: 'Guardo segredo e ataco na hora certa', pid: 4 },
        { t: 'Corto o laço na hora, sem perdão', pid: 7 },
        { t: 'Faço charme e viro o jogo a meu favor', pid: 10 },
        { t: 'Perdoo, mas nunca esqueço', pid: 1 }
      ]
    },
    {
      texto: 'Qual elemento da natureza te representa?',
      opcoes: [
        { t: 'O véu da neblina, que esconde e revela', pid: 5 },
        { t: 'O mar, que acalma e engole', pid: 8 },
        { t: 'A árvore, com raiz funda e copa firme', pid: 11 },
        { t: 'O fogo, que queima e purifica', pid: 2 }
      ]
    },
    {
      texto: 'Como as pessoas te enxergam à primeira vista?',
      opcoes: [
        { t: 'Livre, misteriosa, sempre de passagem', pid: 6 },
        { t: 'Simples, mas cheia de histórias', pid: 9 },
        { t: 'Poderosa, intimidante, de respeito', pid: 0 },
        { t: 'Sombria, intensa, inesquecível', pid: 3 }
      ]
    },
    {
      texto: 'Qual seu tipo de festa ideal?',
      opcoes: [
        { t: 'Nenhuma — prefiro resolver as coisas sozinha', pid: 7 },
        { t: 'Uma festa só à meia-noite, bem exclusiva', pid: 4 },
        { t: 'Uma roda simples com quem realmente importa', pid: 1 },
        { t: 'Uma festa cheia de risadas e travessuras', pid: 10 }
      ]
    },
    {
      texto: 'O que você não perdoa?',
      opcoes: [
        { t: 'Falta de respeito com os mais fracos', pid: 8 },
        { t: 'Desrespeito com os antepassados', pid: 11 },
        { t: 'Covardia', pid: 2 },
        { t: 'Mentiras contadas sem necessidade', pid: 5 }
      ]
    },
    {
      texto: 'Qual seu maior desejo?',
      opcoes: [
        { t: 'Ter paz, mesmo com pouco', pid: 9 },
        { t: 'Ter poder e nunca depender de ninguém', pid: 0 },
        { t: 'Entender os mistérios da vida e da morte', pid: 3 },
        { t: 'Viver livre, sem amarras', pid: 6 }
      ]
    },
    {
      texto: 'Qual seu maior talento?',
      opcoes: [
        { t: 'Encantar todo mundo com um sorriso', pid: 10 },
        { t: 'Cuidar de quem ninguém mais cuida', pid: 1 },
        { t: 'Enxergar o que está escondido', pid: 4 },
        { t: 'Tomar decisões rápidas e certeiras', pid: 7 }
      ]
    },
    {
      texto: 'Se pudesse escolher, onde moraria?',
      opcoes: [
        { t: 'Numa casa perto de uma árvore centenária', pid: 11 },
        { t: 'Num castelo de fronteira, sempre em guarda', pid: 2 },
        { t: 'Numa casa cheia de espelhos e véus', pid: 5 },
        { t: 'Numa casa à beira-mar', pid: 8 }
      ]
    }
  ];

  // ================= STATE =================

  const state = {
    scores: {},
    current: 0,
    answering: false
  };

  // ================= DOM ELEMENTS =================

  const elIntro = document.getElementById('screen-intro');
  const elQuiz = document.getElementById('screen-quiz');
  const elResult = document.getElementById('screen-result');

  const elQEyebrow = document.getElementById('qEyebrow');
  const elQText = document.getElementById('qText');
  const elQOptions = document.getElementById('qOptions');
  const elProgressFill = document.getElementById('progressFill');
  const elProgressCount = document.getElementById('progressCount');

  const elResultImg = document.getElementById('resultImg');
  const elResultName = document.getElementById('resultName');
  const elResultEpithet = document.getElementById('resultEpithet');
  const elResultDesc = document.getElementById('resultDesc');
  const elResultTags = document.getElementById('resultTags');
  const elResultSaudacao = document.getElementById('resultSaudacao');

  const elBtnStart = document.getElementById('btnStart');
  const elBtnRestart = document.getElementById('btnRestart');

  // ================= UTILS =================

  function placeholderSVG(nome) {
    const initials = nome
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='400'>
      <rect width='100%' height='100%' fill='%233B424B'/>
      <text x='50%' y='52%' font-family='Georgia,serif' font-size='72' fill='%23B5863A' text-anchor='middle'>${initials}</text>
    </svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, '%27');
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  // ================= INTRO =================

  function initIntroGrid() {
    const grid = document.getElementById('introGrid');
    if (!grid) return;

    POMBAGIRAS.forEach(p => {
      const div = document.createElement('div');
      div.className = 'pomba-thumb';

      const img = document.createElement('img');
      img.src = p.img;
      img.alt = p.nome;
      img.loading = 'lazy';
      img.onerror = function () {
        this.onerror = null;
        this.src = placeholderSVG(p.nome);
      };

      const span = document.createElement('span');
      span.textContent = p.nome;

      div.appendChild(img);
      div.appendChild(span);
      grid.appendChild(div);
    });
  }

  // ================= QUIZ =================

  function renderQuestion() {
    state.answering = false;
    const q = QUESTIONS[state.current];

    elQEyebrow.textContent = `Pergunta ${pad2(state.current + 1)}`;
    elProgressCount.textContent = `${pad2(state.current + 1)} / ${pad2(QUESTIONS.length)}`;
    elProgressFill.style.width = `${(state.current / QUESTIONS.length) * 100}%`;
    elQText.textContent = q.texto;

    elQOptions.innerHTML = '';
    const letras = ['A', 'B', 'C', 'D'];

    q.opcoes.forEach((op, i) => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.setAttribute('data-pid', op.pid);

      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = letras[i];

      const txt = document.createElement('span');
      txt.textContent = op.t;

      btn.appendChild(tag);
      btn.appendChild(txt);
      btn.addEventListener('click', () => chooseOption(btn, op.pid));

      elQOptions.appendChild(btn);
    });
  }

  function chooseOption(btn, pid) {
    if (state.answering) return;
    state.answering = true;

    state.scores[pid] = (state.scores[pid] || 0) + 1;

    const all = elQOptions.querySelectorAll('.option');
    all.forEach(o => {
      if (o === btn) {
        o.classList.add('chosen');
      } else {
        o.classList.add('fade');
      }
    });

    setTimeout(() => {
      state.current++;
      if (state.current < QUESTIONS.length) {
        renderQuestion();
      } else {
        elProgressFill.style.width = '100%';
        setTimeout(showResult, 350);
      }
    }, 620);
  }

  // ================= RESULT =================

  function showResult() {
    let bestId = 0;
    let bestScore = -1;

    Object.keys(state.scores).forEach(k => {
      if (state.scores[k] > bestScore) {
        bestScore = state.scores[k];
        bestId = parseInt(k, 10);
      }
    });

    const p = POMBAGIRAS[bestId];

    elResultImg.src = p.img;
    elResultImg.alt = p.nome;
    elResultImg.onerror = function () {
      this.onerror = null;
      this.src = placeholderSVG(p.nome);
    };

    elResultName.textContent = p.nome;
    elResultEpithet.textContent = p.epiteto;
    elResultDesc.textContent = p.desc;
    elResultSaudacao.textContent = `Salve ${p.nome}! Salve a lei dela!`;

    elResultTags.innerHTML = '';
    p.tags.forEach(t => {
      const s = document.createElement('span');
      s.textContent = t;
      elResultTags.appendChild(s);
    });

    elQuiz.hidden = true;
    elResult.hidden = false;

    window._lastResult = p;
  }

  // ================= EVENT HANDLERS =================

  function startQuiz() {
    elIntro.hidden = true;
    elQuiz.hidden = false;
    renderQuestion();
  }

  function restartQuiz() {
    state.scores = {};
    state.current = 0;
    elResult.hidden = true;
    elIntro.hidden = false;
  }

  function handleKeydown(e) {
    if (elQuiz.hidden) return;

    const idx = { '1': 0, '2': 1, '3': 2, '4': 3 }[e.key];
    if (idx === undefined) return;

    const opts = elQOptions.querySelectorAll('.option');
    if (opts[idx]) opts[idx].click();
  }

  // ================= INIT =================

  function init() {
    initIntroGrid();

    elBtnStart.addEventListener('click', startQuiz);
    elBtnRestart.addEventListener('click', restartQuiz);
    document.addEventListener('keydown', handleKeydown);
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
