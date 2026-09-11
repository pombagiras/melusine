/**
 * ============================================================================
 * POMBAGIRAS.COM — MÓDULO PONTOS CANTADOS
 * Player Contínuo (YouTube IFrame API) + Canvas Partículas de Brasa & Fumaça
 * ============================================================================
 */

(function () {
  'use strict';

  // 13 Faixas Oficiais da Playlist
  const TRACKS = [
    {
      id: "eDouWBmWQsw",
      title: "Louvação e Firmeza Sagrada",
      author: "Almas de Pombagira | Alexia Melusine",
      desc: "Evocação e louvação cerimonial dedicada às falanges e rainhas das Almas. Vibração de cura, abertura e proteção espiritual."
    },
    {
      id: "0Z4JR8caiSY",
      title: "Evocação nos Caminhos da Noite",
      author: "Almas de Pombagira | Alexia Melusine",
      desc: "Cântico sagrado para firmar a corrente dos caminhos noturnos, transmutando densidades e abrindo passagens de força."
    },
    {
      id: "ZVBjZtpzm7U",
      title: "Ponto de Força e Proteção das Guardiãs",
      author: "Almas de Pombagira | Alexia Melusine",
      desc: "Ponto cantado de firmeza de terreiro e sustentação áurica sob o amparo protetor das Guardiãs ancestrais."
    },
    {
      id: "MaJ6sw0JF_Q",
      title: "Mistério das Encruzilhadas e Fogo",
      author: "Almas de Pombagira | Alexia Melusine",
      desc: "Harmonia mística nos mistérios do fogo ritual e das encruzilhadas abertas, onde a justiça e a coragem se manifestam."
    },
    {
      id: "MEkVcbQ3G8s",
      title: "Ritual Sonoro: 40 Minutos de Pontos Cantados",
      author: "Almas de Pombagira | Alexia Melusine",
      desc: "Sessão imersiva contínua de 40 minutos de curimbas e louvações sagradas para meditação, firmeza e conexão espiritual."
    },
    {
      id: "VrnxN78yHAU",
      title: "Cântico Ancestral e Firmeza de Lebara",
      author: "Almas de Pombagira | Alexia Melusine",
      desc: "Louvação tradicional de reverência às Lebaras, honrando a sabedoria das mulheres que caminham nas sombras e na luz."
    },
    {
      id: "6Mk3h4woem4",
      title: "Saudação às Guardiãs e Rainhas da Noite",
      author: "Almas de Pombagira | Alexia Melusine",
      desc: "Toque rítmico e reverente saudando as Rainhas da Noite, suas capas, gargalhadas e poder de ordenação cósmica."
    },
    {
      id: "tI7LKxSm0Ag",
      title: "Fogo, Rosas e Encruza",
      author: "Almas de Pombagira | Alexia Melusine",
      desc: "Ponto entoado com o pulsar dos atabaques sobre as oferendas de rosas vermelhas e o mistério transformador do fogo sagrado."
    },
    {
      id: "9C5zbr-NxpY",
      title: "Gira e Louvação Sagrada",
      author: "Almas de Pombagira | Alexia Melusine",
      desc: "Cântico de gira para elevação de frequência, movimentação de energias estagnadas e ancoragem das falanges amigas."
    },
    {
      id: "_QmcmgEhq7g",
      title: "Ponto de Chamada e Assentamento",
      author: "Almas de Pombagira | Alexia Melusine",
      desc: "Ponto litúrgico de invocação de força nas tronqueiras e firmezas das senhoras guardiãs de luz e mistério."
    },
    {
      id: "-YzOfAuRhKM",
      title: "Vozes da Noite e Ancestralidade",
      author: "Almas de Pombagira | Alexia Melusine",
      desc: "A vibração melódica que resgata a memória ancestral feminina e desfaz todo o preconceito em torno das Pombagiras."
    },
    {
      id: "ZFtCte0AHkQ",
      title: "Quem escuta com respeito, reconhece um ponto",
      author: "Almas de Pombagira | Alexia Melusine",
      desc: "Ponto reflexivo e poderoso: a diferença entre o som profano e o sagrado está no coração de quem ouve e reverencia."
    },
    {
      id: "mXFADUxkbhU",
      title: "Rosas queimam, corujas anunciam",
      author: "Almas de Pombagira | Alexia Melusine",
      desc: "Cântico profundo das Almas: a anunciação dos mistérios noturnos, o aroma das rosas e a presença viva da guardiã."
    }
  ];

  // Estado do Player
  let ytPlayer = null;
  let currentTrackIndex = 0;
  let isPlayerReady = false;
  let isContinuousModalOpen = false;
  let isPlaying = false;

  // DOM Elements
  const modalBackdrop = document.getElementById('playlist-modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const btnContinuousHero = document.getElementById('btn-continuous-hero');
  const modalTrackStatus = document.getElementById('modal-track-status');
  const modalCurrentTrackLabel = document.getElementById('modal-current-track-label');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const queueItemsList = document.getElementById('queue-items-list');
  const embersCanvas = document.getElementById('embers-canvas');
  const modalYtDirectBtn = document.getElementById('modal-yt-direct-btn');

  // ==========================================================================
  // 1. CARREGAMENTO DO YOUTUBE IFRAME API
  // ==========================================================================
  function loadYouTubeIFrameAPI() {
    if (window.YT && window.YT.Player) {
      initYouTubePlayer();
      return;
    }
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  window.onYouTubeIframeAPIReady = function () {
    initYouTubePlayer();
  };

  function initYouTubePlayer() {
    isPlayerReady = true;
  }

  function onPlayerStateChange(event) {
    if (event.data === 1) { // YT.PlayerState.PLAYING
      isPlaying = true;
      updatePlayPauseButton(true);
    } else if (event.data === 2) { // YT.PlayerState.PAUSED
      isPlaying = false;
      updatePlayPauseButton(false);
    } else if (event.data === 0) { // YT.PlayerState.ENDED
      // Avanço automático contínuo
      playNext();
    }
  }

  // ==========================================================================
  // 2. GERENCIAMENTO DE REPRODUÇÃO & FILA
  // ==========================================================================
  function loadTrack(index, autoPlay = true) {
    if (index < 0) index = TRACKS.length - 1;
    if (index >= TRACKS.length) index = 0;
    currentTrackIndex = index;

    const track = TRACKS[currentTrackIndex];
    const container = document.getElementById('yt-continuous-player');

    if (container) {
      const autoplayParam = autoPlay ? '1' : '0';
      let originParam = '';
      if (window.location.origin && window.location.origin !== 'null' && !window.location.origin.startsWith('file')) {
        originParam = `&origin=${encodeURIComponent(window.location.origin)}`;
      }

      container.innerHTML = `<iframe id="active-yt-iframe" 
        src="https://www.youtube-nocookie.com/embed/${track.id}?autoplay=${autoplayParam}&enablejsapi=1&playsinline=1&rel=0${originParam}" 
        title="${escapeHTML(track.title)}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" 
        allowfullscreen 
        style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"></iframe>`;

      if (window.YT && window.YT.Player) {
        try {
          ytPlayer = new window.YT.Player('active-yt-iframe', {
            events: {
              onStateChange: onPlayerStateChange
            }
          });
        } catch (e) {
          // Fallback silencioso
        }
      }
    }

    isPlaying = autoPlay;
    updatePlayPauseButton(isPlaying);
    updateUIState();
  }

  function playNext() {
    loadTrack(currentTrackIndex + 1, true);
  }

  function playPrev() {
    loadTrack(currentTrackIndex - 1, true);
  }

  function togglePlayPause() {
    const iframe = document.getElementById('active-yt-iframe');
    if (!iframe) {
      loadTrack(currentTrackIndex, true);
      return;
    }
    try {
      if (isPlaying) {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        isPlaying = false;
      } else {
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        isPlaying = true;
      }
      updatePlayPauseButton(isPlaying);
    } catch (e) {
      // Fallback
    }
  }

  function updatePlayPauseButton(playing) {
    if (!btnPlayPause) return;
    btnPlayPause.innerHTML = playing
      ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"></rect><rect x="14" y="4" width="4" height="16" rx="1"></rect></svg>`
      : `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    btnPlayPause.setAttribute('aria-label', playing ? 'Pausar reprodução' : 'Iniciar reprodução');
  }

  function updateUIState() {
    const track = TRACKS[currentTrackIndex];
    if (modalTrackStatus) {
      modalTrackStatus.textContent = `Faixa ${currentTrackIndex + 1} de ${TRACKS.length}`;
    }
    if (modalCurrentTrackLabel) {
      modalCurrentTrackLabel.textContent = track.title;
      modalCurrentTrackLabel.title = track.title;
    }
    if (modalYtDirectBtn) {
      modalYtDirectBtn.href = `https://www.youtube.com/watch?v=${track.id}`;
    }

    // Atualizar classe ativa na lista lateral
    if (queueItemsList) {
      const items = queueItemsList.querySelectorAll('.queue-item');
      items.forEach((item, idx) => {
        if (idx === currentTrackIndex) {
          item.classList.add('active');
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  // Montar lista de fila no sidebar do modal
  function renderQueueList() {
    if (!queueItemsList) return;
    queueItemsList.innerHTML = '';
    TRACKS.forEach((track, idx) => {
      const li = document.createElement('li');
      li.className = `queue-item ${idx === currentTrackIndex ? 'active' : ''}`;
      li.setAttribute('data-index', idx);
      li.innerHTML = `
        <span class="queue-item-idx">${String(idx + 1).padStart(2, '0')}</span>
        <div class="queue-item-info">
          <span class="queue-item-title">${escapeHTML(track.title)}</span>
          <span class="queue-item-author">${escapeHTML(track.author)}</span>
        </div>
      `;
      li.addEventListener('click', () => {
        loadTrack(idx, true);
      });
      queueItemsList.appendChild(li);
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // ==========================================================================
  // 3. CONTROLE DO MODAL DE PLAYLIST
  // ==========================================================================
  function openContinuousModal(startIndex = 0) {
    isContinuousModalOpen = true;
    if (modalBackdrop) {
      modalBackdrop.style.display = 'flex';
      void modalBackdrop.offsetWidth;
      modalBackdrop.classList.add('active');
      modalBackdrop.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';

    resizeCanvas();
    startEmbersAnimation();
    loadTrack(startIndex, true);
  }

  function closeContinuousModal() {
    isContinuousModalOpen = false;
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      modalBackdrop.setAttribute('aria-hidden', 'true');
      setTimeout(() => {
        if (!isContinuousModalOpen && modalBackdrop) {
          modalBackdrop.style.display = 'none';
        }
      }, 400);
    }
    document.body.style.overflow = '';

    stopEmbersAnimation();
    const container = document.getElementById('yt-continuous-player');
    if (container) {
      container.innerHTML = '';
    }
    isPlaying = false;
    updatePlayPauseButton(false);
  }

  // ==========================================================================
  // 4. CANVAS: ANIMAÇÃO DE BRASAS & FUMAÇA CERIMONIAL
  // ==========================================================================
  let canvasCtx = null;
  let particles = [];
  let animFrameId = null;
  let canvasWidth = 0;
  let canvasHeight = 0;

  function initCanvas() {
    if (!embersCanvas) return;
    canvasCtx = embersCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!embersCanvas) return;
    canvasWidth = embersCanvas.width = embersCanvas.offsetWidth;
    canvasHeight = embersCanvas.height = embersCanvas.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvasWidth;
      this.y = initial ? Math.random() * canvasHeight : canvasHeight + 10;
      this.size = Math.random() * 2.8 + 1.2;
      this.speedY = Math.random() * 0.9 + 0.35;
      this.speedX = (Math.random() - 0.5) * 0.7;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.decay = Math.random() * 0.003 + 0.0015;
      // Tons quentes de brasa ritual (dourado, escarlate, carmesim)
      const colors = [
        '255, 77, 109',  // Vermelho destaque
        '230, 0, 38',    // Vermelho vivo
        '212, 195, 155', // Latão brilhante
        '181, 162, 122', // Latão ancestral
        '255, 140, 0'    // Brasa viva
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.02) * 0.4;
      this.opacity -= this.decay;

      if (this.opacity <= 0 || this.y < -10) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${Math.max(this.opacity, 0)})`;
      ctx.shadowBlur = this.size * 3;
      ctx.shadowColor = `rgba(${this.color}, 0.8)`;
      ctx.fill();
      ctx.restore();
    }
  }

  function startEmbersAnimation() {
    if (!embersCanvas || !canvasCtx) return;
    resizeCanvas();
    particles = [];
    const count = Math.min(Math.floor(canvasWidth * 0.045), 55);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    if (animFrameId) cancelAnimationFrame(animFrameId);
    loopEmbers();
  }

  function loopEmbers() {
    if (!isContinuousModalOpen) return;
    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(canvasCtx);
    }

    animFrameId = requestAnimationFrame(loopEmbers);
  }

  function stopEmbersAnimation() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    if (canvasCtx && embersCanvas) {
      canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    }
  }

  // ==========================================================================
  // 5. FAQ ACCORDION INTERATIVO
  // ==========================================================================
  function initFAQAccordion() {
    const faqButtons = document.querySelectorAll('.faq-question');
    faqButtons.forEach(button => {
      button.addEventListener('click', () => {
        const item = button.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Fecha os outros
        document.querySelectorAll('.faq-item.open').forEach(opened => {
          if (opened !== item) {
            opened.classList.remove('open');
            opened.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          }
        });

        // Alterna o atual
        if (isOpen) {
          item.classList.remove('open');
          button.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          button.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // ==========================================================================
  // 6. EVENT LISTENERS E INICIALIZAÇÃO
  // ==========================================================================
  function initEventListeners() {
    // Botão Principal Hero para abrir modo contínuo
    if (btnContinuousHero) {
      btnContinuousHero.addEventListener('click', () => {
        openContinuousModal(0);
      });
    }

    // Clique na capa do vídeo no card (abre e reproduz automaticamente)
    const videoCovers = document.querySelectorAll('.video-cover-wrap');
    videoCovers.forEach(cover => {
      cover.addEventListener('click', () => {
        const idx = parseInt(cover.getAttribute('data-track-index'), 10) || 0;
        openContinuousModal(idx);
      });
      cover.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = parseInt(cover.getAttribute('data-track-index'), 10) || 0;
          openContinuousModal(idx);
        }
      });
    });

    // Botões nos cards individuais: "Tocar na Playlist"
    const cardPlaylistBtns = document.querySelectorAll('.btn-card-playlist');
    cardPlaylistBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-track-index'), 10) || 0;
        openContinuousModal(idx);
      });
    });

    // Fechar modal
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeContinuousModal);
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          closeContinuousModal();
        }
      });
    }

    // Controles do player
    if (btnPlayPause) btnPlayPause.addEventListener('click', togglePlayPause);
    if (btnPrev) btnPrev.addEventListener('click', playPrev);
    if (btnNext) btnNext.addEventListener('click', playNext);

    // Teclado
    document.addEventListener('keydown', (e) => {
      if (!isContinuousModalOpen) return;

      if (e.key === 'Escape') {
        closeContinuousModal();
      } else if (e.key === 'ArrowRight') {
        playNext();
      } else if (e.key === 'ArrowLeft') {
        playPrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    });
  }

  // Inicialização no DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    renderQueueList();
    initFAQAccordion();
    initEventListeners();
    loadYouTubeIFrameAPI();
  });

})();
