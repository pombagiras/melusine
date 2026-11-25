(function () {
  'use strict';

  // ================= DATA =================
  // 30 Pombagiras (ids 0-29). Nome, epiteto, foto (CDN), descricao curta,
  // 3 tags e url da pagina da entidade — EXATAMENTE os mesmos do quiz.js.
  // Só se acrescenta o campo `frase`: a frase do dia aprovada pela Alexia
  // a 25/11/2026. Não reescrever descrições, não trocar fotos, não reordenar.

  const POMBAGIRAS = [
    { id: 0, nome: 'Maria Padilha', epiteto: 'A Rainha das Encruzilhadas', img: 'https://cdn.pombagiras.com/fotos/pombagira_maria_padilha.png', desc: 'Comanda com luxo, magnetismo e uma vontade que não pede licença. Onde ela pisa, o poder muda de mãos.', tags: ['Poder', 'Sedução', 'Comando'], url: 'https://pombagiras.com/maria-padilha/', frase: 'Hoje, decide como quem não pede licença.' },
    { id: 1, nome: 'Maria Mulambo', epiteto: 'A Guardiã dos Esquecidos', img: 'https://cdn.pombagiras.com/fotos/pombagira_maria_mulambo.png', desc: 'Veste o que sobrou e protege quem o mundo descartou. Sua força mora na lealdade silenciosa.', tags: ['Proteção', 'Lealdade', 'Raiz'], url: 'https://pombagiras.com/maria-mulambo/', frase: 'Quem o mundo descartou, ela não deixa para trás.' },
    { id: 2, nome: 'Maria Quitéria', epiteto: 'A Guerreira da Justiça', img: 'https://cdn.pombagiras.com/fotos/pombagira_maria_quiteria.png', desc: 'Não foge da briga quando a causa é justa. Coragem é o idioma que ela fala melhor.', tags: ['Coragem', 'Justiça', 'Fogo'], url: 'https://pombagiras.com/maria-quiteria/', frase: 'Coragem hoje é não fugir da briga justa.' },
    { id: 3, nome: 'Rosa Caveira', epiteto: 'A Senhora dos Mistérios', img: 'https://cdn.pombagiras.com/fotos/pombagira_rosa_caveira.png', desc: 'Caminha entre a vida e a morte sem medo de nenhuma das duas. Transforma o que toca.', tags: ['Mistério', 'Transformação', 'Profundeza'], url: 'https://pombagiras.com/rosa-caveira/', frase: 'O que precisa de se transformar, transforma-se.' },
    { id: 4, nome: 'Dama da Noite', epiteto: 'A Sedutora das Sombras', img: 'https://cdn.pombagiras.com/fotos/pombagira_dama_da_noite.png', desc: 'Espera a escuridão para agir, porque é nela que enxerga com mais clareza.', tags: ['Mistério', 'Estratégia', 'Sedução'], url: 'https://pombagiras.com/dama-da-noite/', frase: 'Espera. Vê na escuridão o que o dia esconde.' },
    { id: 5, nome: 'Sete Saias', epiteto: 'A Dona dos Sete Véus', img: 'https://cdn.pombagiras.com/fotos/pombagira_sete_saias.png', desc: 'Cada camada esconde uma verdade diferente. Quem acha que a conhece, só viu a primeira saia.', tags: ['Camadas', 'Enigma', 'Versatilidade'], url: 'https://pombagiras.com/sete-saias/', frase: 'Há mais em ti do que a primeira camada mostra.' },
    { id: 6, nome: 'Pombagira Cigana', epiteto: 'A Livre da Estrada', img: 'https://cdn.pombagiras.com/fotos/pombagira_cigana.png', desc: 'Não pertence a lugar nenhum além do caminho. Lê o destino como quem lê um mapa velho.', tags: ['Liberdade', 'Intuição', 'Movimento'], url: 'https://pombagiras.com/cigana/', frase: 'O caminho abre-se a quem não fica parado.' },
    { id: 7, nome: 'Maria Navalha', epiteto: 'A que Corta o Destino', img: 'https://cdn.pombagiras.com/fotos/pombagira_maria_navalha.png', desc: 'Decide rápido e corta sem dó o que já não serve. Proteção afiada, sem meio-termo.', tags: ['Decisão', 'Defesa', 'Precisão'], url: 'https://pombagiras.com/maria-navalha/', frase: 'Corta hoje o que já não te serve.' },
    { id: 8, nome: 'Pombagira da Praia', epiteto: 'A Filha das Ondas', img: 'https://cdn.pombagiras.com/fotos/pombagira_da_praia.png', desc: 'Leva embora o que pesa e devolve leveza na maré seguinte. Cura como o mar cura.', tags: ['Purificação', 'Leveza', 'Acolhimento'], url: 'https://pombagiras.com/praia/', frase: 'Deixa a maré levar o que pesa.' },
    { id: 9, nome: 'Maria Farrapo', epiteto: 'A Humilde de Coração Forte', img: 'https://cdn.pombagiras.com/fotos/pombagira_maria_farrapo.png', desc: 'Não precisa de trono para reinar. Sua simplicidade é a prova mais dura de força.', tags: ['Simplicidade', 'Resistência', 'Humildade'], url: 'https://pombagiras.com/maria-farrapo/', frase: 'Não precisas de trono para ter firmeza.' },
    { id: 10, nome: 'Pombagira Menina', epiteto: 'A Travessa de Riso Fácil', img: 'https://cdn.pombagiras.com/fotos/pombagira_menina.png', desc: 'Brinca com o que assusta os outros e vira qualquer jogo a seu favor com um sorriso.', tags: ['Travessura', 'Charme', 'Leveza'], url: 'https://pombagiras.com/menina/', frase: 'Leva o dia com leveza, sem perder a esperteza.' },
    { id: 11, nome: 'Pombagira da Figueira', epiteto: 'A Raiz Ancestral', img: 'https://cdn.pombagiras.com/fotos/pombagira_da_figueira.png', desc: 'Ligada às raízes mais fundas, guarda sabedoria que vem de antes de você nascer.', tags: ['Ancestralidade', 'Sabedoria', 'Natureza'], url: 'https://pombagiras.com/figueira/', frase: 'A raiz funda sustenta o que cresce.' },
    { id: 12, nome: 'Pombagira das Almas', epiteto: 'A Ponte entre os Mundos', img: 'https://cdn.pombagiras.com/fotos/pombagira_das_almas.png', desc: 'Conduz os que partiram e pacifica os que ficaram. Onde há luto, ela abre caminho.', tags: ['Resgate', 'Luto', 'Paz'], url: 'https://pombagiras.com/das-almas/', frase: 'Onde há luto, há caminho para a paz.' },
    { id: 13, nome: 'Pombagira das Sete Encruzilhadas', epiteto: 'A Senhora dos Caminhos Múltiplos', img: 'https://cdn.pombagiras.com/fotos/pombagira_sete_encruzilhadas.png', desc: 'Governa as sete vias do destino e não deixa nenhuma escolha sem resposta. Quem se perde, ela encontra.', tags: ['Caminhos', 'Escolha', 'Destino'], url: 'https://pombagiras.com/sete-encruzilhadas/', frase: 'Sete caminhos. Escolhe um e caminha.' },
    { id: 14, nome: 'Pombagira da Lua', epiteto: 'A Senhora das Marés', img: 'https://cdn.pombagiras.com/fotos/pombagira_da_lua.png', desc: 'Muda com as fases e mexe com as marés de dentro. Cura o feminino e vê o que a luz do dia esconde.', tags: ['Ciclos', 'Emoção', 'Clarividência'], url: 'https://pombagiras.com/da-lua/', frase: 'Como a lua, muda sem perder o rumo.' },
    { id: 15, nome: 'Pombagira das Trevas', epiteto: 'A Guardiã dos Limiares', img: 'https://cdn.pombagiras.com/fotos/pombagira_das_trevas.png', desc: 'Guarda a porta entre a luz e o abismo. Justiça oculta, blindagem certa — ninguém a atravessa sem permissão.', tags: ['Blindagem', 'Justiça', 'Profundeza'], url: 'https://pombagiras.com/das-trevas/', frase: 'A porta guarda-se. Ninguém passa sem permissão.' },
    { id: 16, nome: 'Pombagira da Serra', epiteto: 'A Senhora dos Cumes', img: 'https://cdn.pombagiras.com/fotos/pombagira_da_serra.png', desc: 'Vê tudo de cima e não se abala com nada. Firmeza de quem subiu e sabe o caminho de volta.', tags: ['Visão', 'Firmeza', 'Altura'], url: 'https://pombagiras.com/da-serra/', frase: 'Vê de cima. Não te abales com o ruído de baixo.' },
    { id: 17, nome: 'Pombagira do Fogo', epiteto: 'A Chama que Purifica', img: 'https://cdn.pombagiras.com/fotos/pombagira_do_fogo.png', desc: 'Queima o que prende e purifica o que fica. Justiça rápida, sem rodeios e sem cinzas.', tags: ['Fogo', 'Purificação', 'Justiça'], url: 'https://pombagiras.com/do-fogo/', frase: 'Queima o que prende. Fica o que é teu.' },
    { id: 18, nome: 'Pombagira das Águas Profundas', epiteto: 'A Senhora das Profundezas', img: 'https://cdn.pombagiras.com/fotos/pombagira_das_aguas_profundas.png', desc: 'Mergulha onde ninguém desce e traz de volta o que estava submerso. Cura as feridas que nem tu sabias que tinhas.', tags: ['Profundeza', 'Cura', 'Inconsciente'], url: 'https://pombagiras.com/aguas-profundas/', frase: 'O que estava submerso pode voltar à superfície.' },
    { id: 19, nome: 'Pombagira da Sombra', epiteto: 'O Manto Protetor', img: 'https://cdn.pombagiras.com/fotos/pombagira_da_sombra.png', desc: 'Veste a sombra como manto e protege em silêncio. Quem a tem ao lado, ninguém vê — e ninguém toca.', tags: ['Sombra', 'Proteção', 'Silêncio'], url: 'https://pombagiras.com/da-sombra/', frase: 'Em silêncio, ela protege quem ama.' },
    { id: 20, nome: 'Pombagira da Fenda', epiteto: 'A Senhora das Brechas', img: 'https://cdn.pombagiras.com/fotos/pombagira_da_fenda.png', desc: 'Abre portas onde não há parede. Quando tudo parece sem saída, ela já encontrou a brecha.', tags: ['Saída', 'Portal', 'Estratégia'], url: 'https://pombagiras.com/da-fenda/', frase: 'Onde não há parede, há porta.' },
    { id: 21, nome: 'Pombagira da Calunga', epiteto: 'O Repouso das Almas', img: 'https://cdn.pombagiras.com/fotos/pombagira_da_calunga_profunda.png', desc: 'Guarda o descanso dos que partiram e dissolve as dívidas antigas. Na terra santa, tudo encontra repouso.', tags: ['Repouso', 'Terra', 'Transmutação'], url: 'https://pombagiras.com/calunga/', frase: 'Descansa. O que é antigo pode repousar.' },
    { id: 22, nome: 'Pombagira das Correntes', epiteto: 'A que Rompe as Correntes', img: 'https://cdn.pombagiras.com/fotos/pombagira_das_correntes.png', desc: 'Corta as amarras que ninguém vê e devolve a liberdade a quem a perdeu. Nenhuma prisão resiste a ela.', tags: ['Libertação', 'Quebra', 'Liberdade'], url: 'https://pombagiras.com/correntes/', frase: 'Corta a amarra que ninguém vê.' },
    { id: 23, nome: 'Pombagira da Neblina', epiteto: 'A Senhora das Brumas', img: 'https://cdn.pombagiras.com/fotos/pombagira_da_neblina.png', desc: 'Esconde quem ama e confunde quem persegue. Na bruma, só ela enxerga com clareza.', tags: ['Ocultação', 'Bruma', 'Discernimento'], url: 'https://pombagiras.com/da-neblina/', frase: 'Na bruma, só ela vê com clareza. Espera.' },
    { id: 24, nome: 'Pombagira da Estrada', epiteto: 'A Guardiã dos Viajantes', img: 'https://cdn.pombagiras.com/fotos/pombagira_da_estrada.png', desc: 'Protege quem viaja e abre os caminhos antes de chegares. Na estrada, ela vai sempre à frente.', tags: ['Viagem', 'Proteção', 'Caminhos'], url: 'https://pombagiras.com/estrada/', frase: 'Na estrada, ela vai à frente e abre o caminho.' },
    { id: 25, nome: 'Pombagira do Vento', epiteto: 'A Mensageira das Brisas', img: 'https://cdn.pombagiras.com/fotos/pombagira_do_vento.png', desc: 'Leva as palavras longe e traz as respostas de volta. Leve como a brisa, impossível de prender.', tags: ['Vento', 'Palavra', 'Leveza'], url: 'https://pombagiras.com/vento/', frase: 'A palavra certa viaja longe.' },
    { id: 26, nome: 'Pombagira Cacurucaia', epiteto: 'A Anciã do Cruzeiro', img: 'https://cdn.pombagiras.com/fotos/pombagira_cacurucaia.png', desc: 'A mais velha das guardiãs, com a sabedoria de quem já viu tudo. Quem a escuta, não se perde.', tags: ['Ancestralidade', 'Sabedoria', 'Almas'], url: 'https://pombagiras.com/cacurucaia/', frase: 'Quem escuta os mais velhos, não se perde.' },
    { id: 27, nome: 'Pombagira Mirongueira', epiteto: 'A Guardiã da Mironga', img: 'https://cdn.pombagiras.com/fotos/pombagira_mirongueira.png', desc: 'Desmancha o feitiço antes de ele te tocar. A magia dela é a resposta para a magia dos outros.', tags: ['Magia', 'Mironga', 'Desmanche'], url: 'https://pombagiras.com/mirongueira/', frase: 'O feitiço desmancha-se antes de te tocar.' },
    { id: 28, nome: 'Pombagira Baronesa', epiteto: 'A Guardiã da Nobreza', img: 'https://cdn.pombagiras.com/fotos/pombagira_baronesa.png', desc: 'Resolve com elegância o que os outros resolvem com gritos. As portas abrem-se para ela sem ela precisar de pedir.', tags: ['Nobreza', 'Elegância', 'Diplomacia'], url: 'https://pombagiras.com/baronesa/', frase: 'Resolve com elegância o que outros resolvem com gritos.' },
    { id: 29, nome: 'Pombagira do Lodo', epiteto: 'A Guardiã da Transmutação', img: 'https://cdn.pombagiras.com/fotos/pombagira_do_lodo.png', desc: 'Tira do lodo o que há de mais puro e cura o que parecia perdido. Onde tudo decanta, ela transforma.', tags: ['Transmutação', 'Cura', 'Limiar'], url: 'https://pombagiras.com/lodo/', frase: 'Do lodo, tira-se o que há de mais puro.' }
  ];

  // ================= LÓGICA DA DATA =================
  // A carta é determinística pela data em America/Sao_Paulo.
  // Índice = dias desde 1970-01-01, módulo 30.
  // NÃO usar o dia do mês: meses com 28, 29, 30 ou 31 dias NÃO interferem,
  // porque a contagem é contínua. Não há dia vazio, salto ou repetição.
  // Vetores de teste:
  //   2026-11-25 -> 20782 dias -> 20782 % 30 = 22 -> Pombagira das Correntes
  //   2026-11-26 -> 20783 dias -> 20783 % 30 = 23 -> Pombagira da Neblina

  function getTodayParts() {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const parts = fmt.formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    return { y: parseInt(get('year'), 10), m: parseInt(get('month'), 10), d: parseInt(get('day'), 10) };
  }

  function getTodayIndex() {
    const { y, m, d } = getTodayParts();
    const utcDays = Math.floor(Date.UTC(y, m - 1, d) / 86400000);
    return utcDays % 30;
  }

  function placeholderSVG(nome) {
    const initials = nome.split(' ').map((w) => w[0]).join('').slice(0, 2);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='400'><rect width='100%' height='100%' fill='%233B424B'/><text x='50%' y='52%' font-family='Georgia,serif' font-size='72' fill='%23B5863A' text-anchor='middle'>${initials}</text></svg>`;
    return 'data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, '%27');
  }

  // ================= RENDER =================

  function init() {
    const idx = getTodayIndex();
    const p = POMBAGIRAS[idx];

    const elDate = document.getElementById('cartaDate');
    const elImg = document.getElementById('cartaImg');
    const elName = document.getElementById('cartaName');
    const elEpithet = document.getElementById('cartaEpithet');
    const elFrase = document.getElementById('cartaFrase');
    const elDesc = document.getElementById('cartaDesc');
    const elTags = document.getElementById('cartaTags');
    const elBtnEntity = document.getElementById('btnEntity');
    const elBtnShare = document.getElementById('btnShare');

    if (elDate) {
      const { y, m, d } = getTodayParts();
      const dateObj = new Date(Date.UTC(y, m - 1, d));
      elDate.textContent = 'Hoje, ' + dateObj.toLocaleDateString('pt-BR', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' });
    }
    if (elImg) {
      elImg.src = p.img;
      elImg.alt = p.nome;
      elImg.onerror = function () { this.onerror = null; this.src = placeholderSVG(p.nome); };
    }
    if (elName) elName.textContent = p.nome;
    if (elEpithet) elEpithet.textContent = p.epiteto;
    if (elFrase) elFrase.textContent = p.frase;
    if (elDesc) elDesc.textContent = p.desc;
    if (elTags) {
      elTags.innerHTML = '';
      p.tags.forEach((t) => { const s = document.createElement('span'); s.textContent = t; elTags.appendChild(s); });
    }
    if (elBtnEntity) {
      elBtnEntity.href = p.url;
      elBtnEntity.textContent = 'Conhecer a ' + p.nome;
    }
    if (elBtnShare) {
      const text = 'A carta de hoje é a ' + p.nome + ' — ' + p.epiteto + '. Descobre a tua: https://pombagiras.com/carta-do-dia/';
      elBtnShare.href = 'https://wa.me/?text=' + encodeURIComponent(text);
    }

    window._cartaDoDia = p;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
