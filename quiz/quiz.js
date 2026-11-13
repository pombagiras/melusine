(function () {
  'use strict';

  // ================= DATA =================
  // 30 Pombagiras (ids 0-29). Cada entrada: nome, epiteto, foto (CDN),
  // descricao curta, 3 tags e url da pagina da entidade (botao "Conhecer").
  // As 12 primeiras sao as originais do quiz (inalteradas, so com url a mais).

  const POMBAGIRAS = [
    {
      id: 0,
      nome: 'Maria Padilha',
      epiteto: 'A Rainha das Encruzilhadas',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_maria_padilha.png',
      desc: 'Comanda com luxo, magnetismo e uma vontade que não pede licença. Onde ela pisa, o poder muda de mãos.',
      tags: ['Poder', 'Sedução', 'Comando'],
      url: 'https://pombagiras.com/maria-padilha/'
    },
    {
      id: 1,
      nome: 'Maria Mulambo',
      epiteto: 'A Guardiã dos Esquecidos',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_maria_mulambo.png',
      desc: 'Veste o que sobrou e protege quem o mundo descartou. Sua força mora na lealdade silenciosa.',
      tags: ['Proteção', 'Lealdade', 'Raiz'],
      url: 'https://pombagiras.com/maria-mulambo/'
    },
    {
      id: 2,
      nome: 'Maria Quitéria',
      epiteto: 'A Guerreira da Justiça',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_maria_quiteria.png',
      desc: 'Não foge da briga quando a causa é justa. Coragem é o idioma que ela fala melhor.',
      tags: ['Coragem', 'Justiça', 'Fogo'],
      url: 'https://pombagiras.com/maria-quiteria/'
    },
    {
      id: 3,
      nome: 'Rosa Caveira',
      epiteto: 'A Senhora dos Mistérios',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_rosa_caveira.png',
      desc: 'Caminha entre a vida e a morte sem medo de nenhuma das duas. Transforma o que toca.',
      tags: ['Mistério', 'Transformação', 'Profundeza'],
      url: 'https://pombagiras.com/rosa-caveira/'
    },
    {
      id: 4,
      nome: 'Dama da Noite',
      epiteto: 'A Sedutora das Sombras',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_dama_da_noite.png',
      desc: 'Espera a escuridão para agir, porque é nela que enxerga com mais clareza.',
      tags: ['Mistério', 'Estratégia', 'Sedução'],
      url: 'https://pombagiras.com/dama-da-noite/'
    },
    {
      id: 5,
      nome: 'Sete Saias',
      epiteto: 'A Dona dos Sete Véus',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_sete_saias.png',
      desc: 'Cada camada esconde uma verdade diferente. Quem acha que a conhece, só viu a primeira saia.',
      tags: ['Camadas', 'Enigma', 'Versatilidade'],
      url: 'https://pombagiras.com/sete-saias/'
    },
    {
      id: 6,
      nome: 'Pombagira Cigana',
      epiteto: 'A Livre da Estrada',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_cigana.png',
      desc: 'Não pertence a lugar nenhum além do caminho. Lê o destino como quem lê um mapa velho.',
      tags: ['Liberdade', 'Intuição', 'Movimento'],
      url: 'https://pombagiras.com/cigana/'
    },
    {
      id: 7,
      nome: 'Maria Navalha',
      epiteto: 'A que Corta o Destino',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_maria_navalha.png',
      desc: 'Decide rápido e corta sem dó o que já não serve. Proteção afiada, sem meio-termo.',
      tags: ['Decisão', 'Defesa', 'Precisão'],
      url: 'https://pombagiras.com/maria-navalha/'
    },
    {
      id: 8,
      nome: 'Pombagira da Praia',
      epiteto: 'A Filha das Ondas',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_da_praia.png',
      desc: 'Leva embora o que pesa e devolve leveza na maré seguinte. Cura como o mar cura.',
      tags: ['Purificação', 'Leveza', 'Acolhimento'],
      url: 'https://pombagiras.com/praia/'
    },
    {
      id: 9,
      nome: 'Maria Farrapo',
      epiteto: 'A Humilde de Coração Forte',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_maria_farrapo.png',
      desc: 'Não precisa de trono para reinar. Sua simplicidade é a prova mais dura de força.',
      tags: ['Simplicidade', 'Resistência', 'Humildade'],
      url: 'https://pombagiras.com/maria-farrapo/'
    },
    {
      id: 10,
      nome: 'Pombagira Menina',
      epiteto: 'A Travessa de Riso Fácil',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_menina.png',
      desc: 'Brinca com o que assusta os outros e vira qualquer jogo a seu favor com um sorriso.',
      tags: ['Travessura', 'Charme', 'Leveza'],
      url: 'https://pombagiras.com/menina/'
    },
    {
      id: 11,
      nome: 'Pombagira da Figueira',
      epiteto: 'A Raiz Ancestral',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_da_figueira.png',
      desc: 'Ligada às raízes mais fundas, guarda sabedoria que vem de antes de você nascer.',
      tags: ['Ancestralidade', 'Sabedoria', 'Natureza'],
      url: 'https://pombagiras.com/figueira/'
    },
    {
      id: 12,
      nome: 'Pombagira das Almas',
      epiteto: 'A Ponte entre os Mundos',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_das_almas.png',
      desc: 'Conduz os que partiram e pacifica os que ficaram. Onde há luto, ela abre caminho.',
      tags: ['Resgate', 'Luto', 'Paz'],
      url: 'https://pombagiras.com/das-almas/'
    },
    {
      id: 13,
      nome: 'Pombagira das Sete Encruzilhadas',
      epiteto: 'A Senhora dos Caminhos Múltiplos',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_sete_encruzilhadas.png',
      desc: 'Governa as sete vias do destino e não deixa nenhuma escolha sem resposta. Quem se perde, ela encontra.',
      tags: ['Caminhos', 'Escolha', 'Destino'],
      url: 'https://pombagiras.com/sete-encruzilhadas/'
    },
    {
      id: 14,
      nome: 'Pombagira da Lua',
      epiteto: 'A Senhora das Marés',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_da_lua.png',
      desc: 'Muda com as fases e mexe com as marés de dentro. Cura o feminino e vê o que a luz do dia esconde.',
      tags: ['Ciclos', 'Emoção', 'Clarividência'],
      url: 'https://pombagiras.com/da-lua/'
    },
    {
      id: 15,
      nome: 'Pombagira das Trevas',
      epiteto: 'A Guardiã dos Limiares',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_das_trevas.png',
      desc: 'Guarda a porta entre a luz e o abismo. Justiça oculta, blindagem certa — ninguém a atravessa sem permissão.',
      tags: ['Blindagem', 'Justiça', 'Profundeza'],
      url: 'https://pombagiras.com/das-trevas/'
    },
    {
      id: 16,
      nome: 'Pombagira da Serra',
      epiteto: 'A Senhora dos Cumes',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_da_serra.png',
      desc: 'Vê tudo de cima e não se abala com nada. Firmeza de quem subiu e sabe o caminho de volta.',
      tags: ['Visão', 'Firmeza', 'Altura'],
      url: 'https://pombagiras.com/da-serra/'
    },
    {
      id: 17,
      nome: 'Pombagira do Fogo',
      epiteto: 'A Chama que Purifica',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_do_fogo.png',
      desc: 'Queima o que prende e purifica o que fica. Justiça rápida, sem rodeios e sem cinzas.',
      tags: ['Fogo', 'Purificação', 'Justiça'],
      url: 'https://pombagiras.com/do-fogo/'
    },
    {
      id: 18,
      nome: 'Pombagira das Águas Profundas',
      epiteto: 'A Senhora das Profundezas',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_das_aguas_profundas.png',
      desc: 'Mergulha onde ninguém desce e traz de volta o que estava submerso. Cura as feridas que nem tu sabias que tinhas.',
      tags: ['Profundeza', 'Cura', 'Inconsciente'],
      url: 'https://pombagiras.com/aguas-profundas/'
    },
    {
      id: 19,
      nome: 'Pombagira da Sombra',
      epiteto: 'O Manto Protetor',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_da_sombra.png',
      desc: 'Veste a sombra como manto e protege em silêncio. Quem a tem ao lado, ninguém vê — e ninguém toca.',
      tags: ['Sombra', 'Proteção', 'Silêncio'],
      url: 'https://pombagiras.com/da-sombra/'
    },
    {
      id: 20,
      nome: 'Pombagira da Fenda',
      epiteto: 'A Senhora das Brechas',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_da_fenda.png',
      desc: 'Abre portas onde não há parede. Quando tudo parece sem saída, ela já encontrou a brecha.',
      tags: ['Saída', 'Portal', 'Estratégia'],
      url: 'https://pombagiras.com/da-fenda/'
    },
    {
      id: 21,
      nome: 'Pombagira da Calunga',
      epiteto: 'O Repouso das Almas',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_da_calunga_profunda.png',
      desc: 'Guarda o descanso dos que partiram e dissolve as dívidas antigas. Na terra santa, tudo encontra repouso.',
      tags: ['Repouso', 'Terra', 'Transmutação'],
      url: 'https://pombagiras.com/calunga/'
    },
    {
      id: 22,
      nome: 'Pombagira das Correntes',
      epiteto: 'A que Rompe as Correntes',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_das_correntes.png',
      desc: 'Corta as amarras que ninguém vê e devolve a liberdade a quem a perdeu. Nenhuma prisão resiste a ela.',
      tags: ['Libertação', 'Quebra', 'Liberdade'],
      url: 'https://pombagiras.com/correntes/'
    },
    {
      id: 23,
      nome: 'Pombagira da Neblina',
      epiteto: 'A Senhora das Brumas',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_da_neblina.png',
      desc: 'Esconde quem ama e confunde quem persegue. Na bruma, só ela enxerga com clareza.',
      tags: ['Ocultação', 'Bruma', 'Discernimento'],
      url: 'https://pombagiras.com/da-neblina/'
    },
    {
      id: 24,
      nome: 'Pombagira da Estrada',
      epiteto: 'A Guardiã dos Viajantes',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_da_estrada.png',
      desc: 'Protege quem viaja e abre os caminhos antes de chegares. Na estrada, ela vai sempre à frente.',
      tags: ['Viagem', 'Proteção', 'Caminhos'],
      url: 'https://pombagiras.com/estrada/'
    },
    {
      id: 25,
      nome: 'Pombagira do Vento',
      epiteto: 'A Mensageira das Brisas',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_do_vento.png',
      desc: 'Leva as palavras longe e traz as respostas de volta. Leve como a brisa, impossível de prender.',
      tags: ['Vento', 'Palavra', 'Leveza'],
      url: 'https://pombagiras.com/vento/'
    },
    {
      id: 26,
      nome: 'Pombagira Cacurucaia',
      epiteto: 'A Anciã do Cruzeiro',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_cacurucaia.png',
      desc: 'A mais velha das guardiãs, com a sabedoria de quem já viu tudo. Quem a escuta, não se perde.',
      tags: ['Ancestralidade', 'Sabedoria', 'Almas'],
      url: 'https://pombagiras.com/cacurucaia/'
    },
    {
      id: 27,
      nome: 'Pombagira Mirongueira',
      epiteto: 'A Guardiã da Mironga',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_mirongueira.png',
      desc: 'Desmancha o feitiço antes de ele te tocar. A magia dela é a resposta para a magia dos outros.',
      tags: ['Magia', 'Mironga', 'Desmanche'],
      url: 'https://pombagiras.com/mirongueira/'
    },
    {
      id: 28,
      nome: 'Pombagira Baronesa',
      epiteto: 'A Guardiã da Nobreza',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_baronesa.png',
      desc: 'Resolve com elegância o que os outros resolvem com gritos. As portas abrem-se para ela sem ela precisar de pedir.',
      tags: ['Nobreza', 'Elegância', 'Diplomacia'],
      url: 'https://pombagiras.com/baronesa/'
    },
    {
      id: 29,
      nome: 'Pombagira do Lodo',
      epiteto: 'A Guardiã da Transmutação',
      img: 'https://cdn.pombagiras.com/fotos/pombagira_do_lodo.png',
      desc: 'Tira do lodo o que há de mais puro e cura o que parecia perdido. Onde tudo decanta, ela transforma.',
      tags: ['Transmutação', 'Cura', 'Limiar'],
      url: 'https://pombagiras.com/lodo/'
    }
  ];

  // ================= PERGUNTAS =================
  // 15 perguntas x 4 opcoes. Cada opcao: pid = entidade principal (+2 pontos),
  // kin = entidade parente (+1 ponto). Cada entidade e principal exatamente 2x
  // e parente exatamente 2x em todo o quiz — nenhuma fica sem hipotese de ganhar
  // e nenhuma domina. As 12 primeiras perguntas mantem o texto original;
  // as opcoes foram redistribuidas pelas 30. As 3 ultimas sao novas.

  const QUESTIONS = [
    {
      texto: 'Qual ambiente faz seu poder pulsar mais forte?',
      opcoes: [
        { t: 'Um salão de luxo, tudo em veludo e ouro', pid: 0, kin: 28 },
        { t: 'Um cemitério ao luar, entre flores murchas', pid: 3, kin: 21 },
        { t: 'Um cruzeiro das almas, entre velas e silêncio', pid: 12, kin: 26 },
        { t: 'Uma encruzilhada de sete caminhos, onde tudo se decide', pid: 13, kin: 24 }
      ]
    },
    {
      texto: 'Como você resolve um problema difícil?',
      opcoes: [
        { t: 'Escondo a dor e sigo protegendo quem eu amo', pid: 1, kin: 12 },
        { t: 'Espero a noite cair e ajo em silêncio', pid: 4, kin: 19 },
        { t: 'Procuro a brecha que ninguém viu e saio por ela', pid: 20, kin: 7 },
        { t: 'Quebro as amarras, uma por uma, até ficar livre', pid: 22, kin: 17 }
      ]
    },
    {
      texto: 'O que mais te atrai em uma pessoa?',
      opcoes: [
        { t: 'Coragem para lutar pelo que acredita', pid: 2, kin: 17 },
        { t: 'Mistério, várias camadas pra descobrir', pid: 5, kin: 23 },
        { t: 'Alguém que muda com as fases, como a lua', pid: 14, kin: 18 },
        { t: 'Firmeza de quem vê tudo de cima e não se abala', pid: 16, kin: 11 }
      ]
    },
    {
      texto: 'Qual é sua arma preferida — literal ou figurada?',
      opcoes: [
        { t: 'O silêncio da morte, que tudo transforma', pid: 3, kin: 21 },
        { t: 'As cartas, que revelam o caminho', pid: 6, kin: 13 },
        { t: 'A escuridão que protege e devolve o golpe', pid: 15, kin: 19 },
        { t: 'A elegância que abre portas sem precisar gritar', pid: 28, kin: 0 }
      ]
    },
    {
      texto: 'Como você reage quando é traído(a)?',
      opcoes: [
        { t: 'Guardo segredo e ataco na hora certa', pid: 4, kin: 15 },
        { t: 'Corto o laço na hora, sem perdão', pid: 7, kin: 22 },
        { t: 'Desapareço na sombra e deixo o resto comigo', pid: 19, kin: 18 },
        { t: 'Deixo decantar — o tempo mostra quem é quem', pid: 29, kin: 1 }
      ]
    },
    {
      texto: 'Qual elemento da natureza te representa?',
      opcoes: [
        { t: 'O véu da neblina, que esconde e revela', pid: 5, kin: 23 },
        { t: 'O mar, que acalma e engole', pid: 8, kin: 14 },
        { t: 'O fundo do mar, onde moram os segredos', pid: 18, kin: 20 },
        { t: 'O fogo, que queima e purifica', pid: 17, kin: 2 }
      ]
    },
    {
      texto: 'Como as pessoas te enxergam à primeira vista?',
      opcoes: [
        { t: 'Livre, misteriosa, sempre de passagem', pid: 6, kin: 24 },
        { t: 'Simples, mas cheia de histórias', pid: 9, kin: 26 },
        { t: 'Leve como o vento, impossível de segurar', pid: 25, kin: 6 },
        { t: 'Cheia de mistério — ninguém sabe o que ela sabe', pid: 27, kin: 4 }
      ]
    },
    {
      texto: 'Qual seu tipo de festa ideal?',
      opcoes: [
        { t: 'Nenhuma — prefiro resolver as coisas sozinha', pid: 7, kin: 20 },
        { t: 'Uma festa só à meia-noite, bem exclusiva', pid: 14, kin: 8 },
        { t: 'Uma roda simples com quem realmente importa', pid: 1, kin: 29 },
        { t: 'Uma festa cheia de risadas e travessuras', pid: 10, kin: 25 }
      ]
    },
    {
      texto: 'O que você não perdoa?',
      opcoes: [
        { t: 'Falta de respeito com os mais fracos', pid: 8, kin: 12 },
        { t: 'Desrespeito com os antepassados', pid: 11, kin: 27 },
        { t: 'Quem tenta me expor quando eu escolhi me esconder', pid: 23, kin: 5 },
        { t: 'Quem perturba o descanso dos que já partiram', pid: 26, kin: 3 }
      ]
    },
    {
      texto: 'Qual seu maior desejo?',
      opcoes: [
        { t: 'Ter paz, mesmo com pouco', pid: 9, kin: 1 },
        { t: 'Ter poder e nunca depender de ninguém', pid: 0, kin: 13 },
        { t: 'Viver na estrada, sem endereço fixo', pid: 24, kin: 25 },
        { t: 'Ver os que partiram em paz, enfim', pid: 12, kin: 3 }
      ]
    },
    {
      texto: 'Qual seu maior talento?',
      opcoes: [
        { t: 'Encantar todo mundo com um sorriso', pid: 10, kin: 14 },
        { t: 'Dar descanso a quem carrega peso demais', pid: 21, kin: 29 },
        { t: 'Enxergar na sombra o que ninguém mais vê', pid: 19, kin: 4 },
        { t: 'Acender em mim a chama certa na hora certa', pid: 17, kin: 2 }
      ]
    },
    {
      texto: 'Se pudesse escolher, onde moraria?',
      opcoes: [
        { t: 'Numa casa perto de uma árvore centenária', pid: 11, kin: 16 },
        { t: 'Num castelo de fronteira, sempre em guarda', pid: 2, kin: 0 },
        { t: 'No alto da serra, de onde se vê tudo', pid: 16, kin: 11 },
        { t: 'Num lugar fundo, onde o silêncio é completo', pid: 18, kin: 8 }
      ]
    },
    {
      texto: 'Quando a noite cai, o que te chama?',
      opcoes: [
        { t: 'Uma estrada aberta, só eu e o horizonte', pid: 24, kin: 6 },
        { t: 'A brisa que traz notícias de longe', pid: 25, kin: 9 },
        { t: 'A neblina que me esconde de quem não deve me ver', pid: 23, kin: 5 },
        { t: 'O silêncio do cemitério, onde tudo descansa', pid: 21, kin: 15 }
      ]
    },
    {
      texto: 'O que fazes quando tudo parece sem saída?',
      opcoes: [
        { t: 'Procuro a brecha que ninguém viu', pid: 20, kin: 7 },
        { t: 'Quebro as amarras, uma por uma', pid: 22, kin: 10 },
        { t: 'Paro na encruzilhada e escolho um caminho novo', pid: 13, kin: 28 },
        { t: 'Deixo decantar — a resposta sobe sozinha', pid: 29, kin: 9 }
      ]
    },
    {
      texto: 'O que os outros procuram em ti quando estão perdidos?',
      opcoes: [
        { t: 'Uma palavra que atravessa a escuridão', pid: 15, kin: 27 },
        { t: 'A calma de quem já viu muita coisa', pid: 26, kin: 16 },
        { t: 'O feitiço certo para desmanchar o que prende', pid: 27, kin: 22 },
        { t: 'A elegância de quem resolve sem gritar', pid: 28, kin: 10 }
      ]
    }
  ];

  // ================= STATE =================

  const state = {
    scores: {},
    current: 0,
    answering: false,
    tiebreak: false
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
  const elBtnEntity = document.getElementById('btnEntity');
  const elBtnShare = document.getElementById('btnShare');

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

  // ================= POPUP =================
  // (refs declared lazily inside init to guarantee DOM is ready)

  let elPopup, elPopupImg, elPopupName, elPopupClose, elPopupOverlay, elPopupStart;

  function openPopup(p) {
    elPopupImg.src = p.img;
    elPopupImg.alt = p.nome;
    elPopupImg.onerror = function () {
      this.onerror = null;
      this.src = placeholderSVG(p.nome);
    };
    elPopupName.textContent = p.nome;
    elPopup.hidden = false;
    document.body.style.overflow = 'hidden';
    elPopupClose.focus();
  }

  function closePopup() {
    elPopup.hidden = true;
    document.body.style.overflow = '';
  }

  // ================= INTRO =================

  function initIntroGrid() {
    const grid = document.getElementById('introGrid');
    if (!grid) return;

    POMBAGIRAS.forEach(p => {
      const div = document.createElement('div');
      div.className = 'pomba-thumb';
      div.setAttribute('tabindex', '0');
      div.setAttribute('role', 'button');
      div.setAttribute('aria-label', `Ver ${p.nome} e começar o quiz`);

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

      div.addEventListener('click', () => openPopup(p));
      div.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPopup(p);
        }
      });

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
      btn.addEventListener('click', () => chooseOption(btn, op.pid, op.kin));

      elQOptions.appendChild(btn);
    });
  }

  function chooseOption(btn, pid, kin) {
    if (state.answering) return;
    state.answering = true;

    // Pontuacao ponderada: +2 para a entidade principal, +1 para a parente.
    state.scores[pid] = (state.scores[pid] || 0) + 2;
    if (kin !== undefined && kin !== pid) {
      state.scores[kin] = (state.scores[kin] || 0) + 1;
    }

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

  function topScorers() {
    let bestScore = -1;
    const tied = [];
    Object.keys(state.scores).forEach(k => {
      const s = state.scores[k];
      if (s > bestScore) {
        bestScore = s;
        tied.length = 0;
        tied.push(parseInt(k, 10));
      } else if (s === bestScore) {
        tied.push(parseInt(k, 10));
      }
    });
    return { bestScore, tied };
  }

  function showResult() {
    const { tied } = topScorers();
    if (tied.length > 1 && !state.tiebreak) {
      renderTiebreak(tied);
      return;
    }
    displayResult(tied[0]);
  }

  // Desempate: so aparece quando duas ou mais guardias empatam no topo.
  // A escolha soma +1 e desempatam na hora — o quiz continua com 15 perguntas
  // para quem nao empata.
  function renderTiebreak(tied) {
    state.tiebreak = true;
    state.answering = false;

    elQEyebrow.textContent = 'Desempate';
    elProgressCount.textContent = `${pad2(QUESTIONS.length)} / ${pad2(QUESTIONS.length)}`;
    elProgressFill.style.width = '100%';
    elQText.textContent = 'Mais de uma guardiã te chamou. Qual delas te chama mais forte?';

    elQOptions.innerHTML = '';
    const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

    tied.forEach((pid, i) => {
      const p = POMBAGIRAS[pid];
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.setAttribute('data-pid', pid);

      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = letras[i] || String(i + 1);

      const txt = document.createElement('span');
      txt.textContent = `${p.nome} — ${p.epiteto}`;

      btn.appendChild(tag);
      btn.appendChild(txt);
      btn.addEventListener('click', () => {
        if (state.answering) return;
        state.answering = true;
        state.scores[pid] = (state.scores[pid] || 0) + 1;
        btn.classList.add('chosen');
        setTimeout(showResult, 620);
      });

      elQOptions.appendChild(btn);
    });

    elResult.hidden = true;
    elQuiz.hidden = false;
  }

  function displayResult(bestId) {
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

    if (elBtnEntity) {
      elBtnEntity.href = p.url;
      elBtnEntity.textContent = `Conhecer a ${p.nome}`;
    }

    if (elBtnShare) {
      const text = `A Pombagira que comanda o meu destino é a ${p.nome} — ${p.epiteto}. Descobre a tua: https://pombagiras.com/quiz/`;
      elBtnShare.href = 'https://wa.me/?text=' + encodeURIComponent(text);
    }

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
    state.tiebreak = false;
    elResult.hidden = true;
    elIntro.hidden = false;
  }

  // ================= INIT =================

  function init() {
    // Popup refs — resolved here, guaranteed DOM is ready
    elPopup        = document.getElementById('pomba-popup');
    elPopupImg     = document.getElementById('popupImg');
    elPopupName    = document.getElementById('popup-name');
    elPopupClose   = document.getElementById('popupClose');
    elPopupOverlay = document.getElementById('popupOverlay');
    elPopupStart   = document.getElementById('popupStart');

    // Popup events
    elPopupClose.addEventListener('click', closePopup);
    elPopupOverlay.addEventListener('click', closePopup);
    elPopupStart.addEventListener('click', function () {
      closePopup();
      setTimeout(startQuiz, 220);
    });

    // Build intro grid (with popup on click)
    initIntroGrid();

    // Quiz controls
    elBtnStart.addEventListener('click', startQuiz);
    elBtnRestart.addEventListener('click', restartQuiz);

    // Single unified keydown handler
    document.addEventListener('keydown', function (e) {
      // Escape closes popup
      if (e.key === 'Escape' && elPopup && !elPopup.hidden) {
        closePopup();
        return;
      }
      // 1-9 answers quiz questions (1-4 nas perguntas, 1-9 no desempate)
      if (!elQuiz.hidden) {
        const idx = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8 }[e.key];
        if (idx !== undefined) {
          const opts = elQOptions.querySelectorAll('.option');
          if (opts[idx]) opts[idx].click();
        }
      }
    });
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
