/* ==========================================================================
   POMBAGIRAS.COM - DYNAMIC AND HIGH-PERFORMANCE JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. FLUID MESH GRADIENT BACKDROP (CANVAS)
       ========================================== */
    const canvas = document.getElementById('mesh-gradient-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let time = 0;

        // Interactive mouse lag tracking
        let mouseX = width / 2;
        let mouseY = height / 2;
        let targetMouseX = width / 2;
        let targetMouseY = height / 2;
        let lastMouseX = width / 2;
        let lastMouseY = height / 2;

        // State arrays and limit settings
        const embers = [];
        const maxEmbers = 220; // Aumentado significativamente para mais faíscas pulsantes

        /* ==========================================================
           MODERN SACRED EMBERS & PATHWAY BEAMS ENGINE
           ========================================================== */

        // 1. EMBERS (SPARKLES) CLASS
        class Ember {
            constructor(isMouseSpawn = false, mX = 0, mY = 0) {
                this.x = isMouseSpawn ? mX + (Math.random() - 0.5) * 12 : Math.random() * width;
                this.y = isMouseSpawn ? mY + (Math.random() - 0.5) * 12 : height + Math.random() * 30;
                
                // Embers spawned by mouse fly outwards initially, then float upwards
                this.vx = isMouseSpawn ? (Math.random() - 0.5) * 3.2 : (Math.random() - 0.5) * 0.5;
                this.vy = isMouseSpawn ? (Math.random() - 0.5) * 2.2 - 0.8 : -(Math.random() * 1.3 + 0.4);
                
                // Faíscas maiores e mais presentes
                this.size = Math.random() * 4.2 + 1.2; 
                this.life = Math.random() * 130 + 80;
                this.maxLife = this.life;
                
                // Distribuição de cores gótico: 45% Oxblood, 40% Ardósia, 15% Latão
                const colorRand = Math.random();
                if (colorRand < 0.45) {
                    this.color = '128, 0, 32'; // Oxblood
                } else if (colorRand < 0.85) {
                    this.color = '74, 92, 100'; // Ardósia
                } else {
                    this.color = '197, 160, 89'; // Latão
                }
                
                this.phase = Math.random() * Math.PI * 2;
                this.swaySpeed = Math.random() * 0.03 + 0.01;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                // Horizontal sinusoidal wind sway
                this.vx += Math.sin(time * this.swaySpeed + this.phase) * 0.03;
                
                // Drag effect for mouse burst to return to upward drift
                this.vy += (-(Math.random() * 0.8 + 0.4) - this.vy) * 0.05;
                
                this.life--;
                
                // Mouse interactive physical aura repulsion
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 110) {
                    const force = (110 - dist) / 110;
                    this.x -= (dx / dist) * force * 2.2;
                    this.y -= (dy / dist) * force * 1.2;
                }
            }

            draw() {
                const alpha = this.life / this.maxLife;
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
                // Incrível efeito de brilho e néon com shadowBlur de alto desempenho
                ctx.shadowBlur = this.size * 3.5;
                ctx.shadowColor = `rgba(${this.color}, ${alpha * 0.8})`;
                ctx.fillStyle = `rgba(${this.color}, ${alpha * 0.9})`;
                ctx.fill();
                ctx.restore();
            }
        }

        // 2. DIAGONAL PATHWAYS (CELESTIAL BEAMS) CLASS
        class PathBeam {
            constructor() {
                this.reset();
                // Randomize initial progress so beams start at different intervals
                this.progress = Math.random() * 0.8;
            }

            reset() {
                this.progress = 0;
                this.speed = Math.random() * 0.002 + 0.0008;
                this.width = Math.random() * 70 + 35; // Soft blurred width
                this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.22; // Approx. 45 degrees diagonal paths
                
                const colorRand = Math.random();
                if (colorRand < 0.45) {
                    this.color = 'rgba(128, 0, 32, 0.035)'; // Oxblood
                    this.glowColor = 'rgba(128, 0, 32, 0.08)';
                } else if (colorRand < 0.85) {
                    this.color = 'rgba(47, 62, 70, 0.025)'; // Ardósia
                    this.glowColor = 'rgba(47, 62, 70, 0.06)';
                } else {
                    this.color = 'rgba(197, 160, 89, 0.025)'; // Latão
                    this.glowColor = 'rgba(197, 160, 89, 0.06)';
                }
                
                // Enter from top-left boundary
                this.startX = -350;
                this.startY = Math.random() * height * 0.65;
            }

            update() {
                this.progress += this.speed;
                if (this.progress > 1.25) {
                    this.reset();
                }
            }

            draw() {
                const alpha = Math.sin(this.progress * Math.PI); // Perfect soft fade-in/fade-out
                if (alpha <= 0) return;

                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.width;
                ctx.lineCap = 'round';

                // Soft glow effect using canvas shadow properties (very performant with few elements)
                ctx.shadowColor = this.glowColor;
                ctx.shadowBlur = 30;

                const maxLength = Math.max(width, height) * 1.5;
                const currentLength = maxLength * this.progress;
                const endX = this.startX + Math.cos(this.angle) * currentLength;
                const endY = this.startY + Math.sin(this.angle) * currentLength;

                ctx.beginPath();
                ctx.moveTo(this.startX, this.startY);
                ctx.lineTo(endX, endY);
                
                ctx.globalAlpha = alpha;
                ctx.stroke();
                ctx.restore();
            }
        }

        // Spawn 3 active diagonal path beams
        const beams = [new PathBeam(), new PathBeam(), new PathBeam()];

        // Resize handler
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;

            // Interactive: Spawn beautiful embers on mouse movement
            const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
            if (dist > 6) {
                const spawnCount = Math.min(Math.floor(dist / 6), 2);
                for (let k = 0; k < spawnCount; k++) {
                    if (embers.length < maxEmbers + 40) {
                        // Spawn at mouse cursor with a slight offset and random outward burst
                        embers.push(new Ember(true, e.clientX, e.clientY));
                    }
                }
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
            }
        });

        // Pre-populate background with embers scattered vertically so it feels alive instantly
        for (let i = 0; i < 45; i++) {
            const ember = new Ember();
            ember.y = Math.random() * height;
            ember.life = Math.random() * ember.maxLife;
            embers.push(ember);
        }

        // Setup 4 dynamic color orbs that mix like liquid ink on obsidian water (Gótico Oxblood/Ardósia/Latão!)
        const orbs = [
            {
                x: width * 0.3, y: height * 0.3,
                radius: Math.max(width, height) * 0.60,
                colorStart: 'rgba(128, 0, 32, 0.45)', // Oxblood
                colorEnd: 'rgba(0, 0, 0, 0)',
                orbitRadiusX: width * 0.28,
                orbitRadiusY: height * 0.22,
                speed: 0.0035,
                phase: 0
            },
            {
                x: width * 0.7, y: height * 0.7,
                radius: Math.max(width, height) * 0.65,
                colorStart: 'rgba(47, 62, 70, 0.40)', // Ardósia
                colorEnd: 'rgba(0, 0, 0, 0)',
                orbitRadiusX: width * 0.32,
                orbitRadiusY: height * 0.25,
                speed: -0.0028,
                phase: Math.PI / 3
            },
            {
                x: width * 0.5, y: height * 0.4,
                radius: Math.max(width, height) * 0.58,
                colorStart: 'rgba(128, 0, 32, 0.38)', // Oxblood
                colorEnd: 'rgba(0, 0, 0, 0)',
                orbitRadiusX: width * 0.24,
                orbitRadiusY: height * 0.28,
                speed: 0.0042,
                phase: Math.PI / 1.5
            },
            {
                x: width * 0.2, y: height * 0.8,
                radius: Math.max(width, height) * 0.55,
                colorStart: 'rgba(47, 62, 70, 0.32)', // Ardósia
                colorEnd: 'rgba(0, 0, 0, 0)',
                orbitRadiusX: width * 0.30,
                orbitRadiusY: height * 0.18,
                speed: -0.0032,
                phase: Math.PI * 1.2
            }
        ];

        const animateMesh = () => {
            time += 0.8; // Smooth motion increment

            // Interpolate mouse coordinates for fluid lag effect
            mouseX += (targetMouseX - mouseX) * 0.06;
            mouseY += (targetMouseY - mouseY) * 0.06;

            // Abyssal velvet dark trench backdrop gradient (Gótico Vermelho)
            let baseGrad = ctx.createLinearGradient(0, 0, width, height);
            baseGrad.addColorStop(0, '#020000'); // Obsidian depth black-red
            baseGrad.addColorStop(1, '#0e0104'); // Midnight wine-black
            ctx.fillStyle = baseGrad;
            ctx.fillRect(0, 0, width, height);

            // Use screening and blend layers for rich pigment mixtures
            ctx.globalCompositeOperation = 'screen';

            // 1. Draw and animate the autonomous liquid ink orbs (Pulsando de forma muito mais dinâmica)
            orbs.forEach((orb, index) => {
                let angleX = time * orb.speed + orb.phase;
                let angleY = time * orb.speed * 0.82 + orb.phase;

                let currentX = (width * 0.5) + Math.sin(angleX) * orb.orbitRadiusX;
                let currentY = (height * 0.5) + Math.cos(angleY) * orb.orbitRadiusY;

                // Frequência de pulsação mais perceptível e dinâmica
                let dynamicRadius = orb.radius * (1.1 + Math.sin(time * 0.015 + index) * 0.22);

                let grad = ctx.createRadialGradient(currentX, currentY, 2, currentX, currentY, dynamicRadius);
                grad.addColorStop(0, orb.colorStart);
                grad.addColorStop(0.35, orb.colorStart.replace(/[\d\.]+\)$/, '0.12)')); // Soft drop
                grad.addColorStop(1, orb.colorEnd);

                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, height);
            });

            // 2. Draw and animate the diagonal path beams (under embers)
            beams.forEach(beam => {
                beam.update();
                beam.draw();
            });

            // Restore composite operation for normal particles and aura layering
            ctx.globalCompositeOperation = 'source-over';

            // 3. Draw and animate the floating embers (Sparks of the sacred fire)
            // Spawn new embers at bottom if we are below the threshold
            if (embers.length < maxEmbers && Math.random() < 0.25) {
                embers.push(new Ember());
            }

            for (let i = embers.length - 1; i >= 0; i--) {
                const ember = embers[i];
                ember.update();
                ember.draw();
                
                // Remove dead embers
                if (ember.life <= 0 || ember.y < -10 || ember.x < -10 || ember.x > width + 10) {
                    embers.splice(i, 1);
                }
            }

            // 4. Interactive "Transmutadora" Mouse Crimson/Burgundy Swelling Aura (Gótico Vermelho)
            let mousePulse = 1.0 + Math.sin(time * 0.022) * 0.08;
            let dynamicMouseRadius = Math.max(width, height) * 0.32 * mousePulse;
            
            let auraColorVal = Math.sin(time * 0.003) * 0.5 + 0.5; // 0 to 1
            let auraR = Math.round(180 + auraColorVal * 75); // Bright crimson red component
            let auraG = Math.round(0 + auraColorVal * 10); // Minimal green component
            let auraB = Math.round(20 + auraColorVal * 25); // Minimal ruby blue/violet component
            
            let mouseGrad = ctx.createRadialGradient(mouseX, mouseY, 5, mouseX, mouseY, dynamicMouseRadius);
            mouseGrad.addColorStop(0, `rgba(${auraR}, ${auraG}, ${auraB}, 0.35)`);
            mouseGrad.addColorStop(0.35, `rgba(${auraR}, ${auraG}, ${auraB}, 0.16)`);
            mouseGrad.addColorStop(0.7, `rgba(${auraR}, ${auraG}, ${auraB}, 0.05)`);
            mouseGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = mouseGrad;
            ctx.fillRect(0, 0, width, height);

            requestAnimationFrame(animateMesh);
        };

        requestAnimationFrame(animateMesh);
    }

    /* ==========================================
       2. SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-slow');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }

    /* ==========================================
       3. INTERACTIVE TABS SYSTEM WITH HASH ROUTING
       ========================================== */
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const activeTabLine = document.querySelector('.active-tab-line');
    
    // Dynamically position the sliding indicator bar under the active tab button
    const positionActiveTabLine = (activeTabButton) => {
        if (!activeTabButton || !activeTabLine) return;
        
        const offsetLeft = activeTabButton.offsetLeft;
        const width = activeTabButton.offsetWidth;
        
        activeTabLine.style.left = `${offsetLeft}px`;
        activeTabLine.style.width = `${width}px`;
    };

    const switchTab = (tabId, updateHash = true) => {
        const targetTrigger = document.querySelector(`[data-tab="${tabId}"]`);
        const targetPanel = document.getElementById(tabId);
        
        if (!targetTrigger || !targetPanel) return;

        tabTriggers.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach(p => p.classList.remove('active'));

        targetTrigger.classList.add('active');
        targetTrigger.setAttribute('aria-selected', 'true');
        targetPanel.classList.add('active');

        positionActiveTabLine(targetTrigger);

        // Sincroniza o slide do Hero dinamicamente com a aba ativa
        if (typeof window.showHeroSlide === 'function') {
            if (tabId === 'tab-pombagiras') window.showHeroSlide(1);
            else if (tabId === 'tab-faq') window.showHeroSlide(2);
            else if (tabId === 'tab-curiosidades') window.showHeroSlide(3);
            else if (tabId === 'tab-glossario') window.showHeroSlide(4);
        }

        if (updateHash) {
            history.pushState(null, null, `#${tabId}`);
        }
    };

    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const tabId = trigger.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    const handleHashRouting = () => {
        const currentHash = window.location.hash.substring(1);
        if (currentHash && document.getElementById(currentHash)) {
            switchTab(currentHash, false);
            
            setTimeout(() => {
                const portalElement = document.getElementById('portal');
                if (portalElement) {
                    portalElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        } else {
            const defaultActive = document.querySelector('.tab-trigger.active');
            if (defaultActive) {
                positionActiveTabLine(defaultActive);
            }
        }
    };

    window.addEventListener('popstate', handleHashRouting);

    window.addEventListener('resize', () => {
        const activeTrigger = document.querySelector('.tab-trigger.active');
        if (activeTrigger) {
            positionActiveTabLine(activeTrigger);
        }
    });

    setTimeout(handleHashRouting, 100);

    /* ==========================================
       4. POMBAGIRAS DECK CARDS FILTER
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const pombagiraCards = document.querySelectorAll('.pombagira-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering card click
            
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            pombagiraCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.92)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* ==========================================
       5. POMBAGIRAS DETAILED SPECIFICATION DB
       ========================================== */
    const pombagiraDetails = {
        "maria padilha": {
            oferenda: "Rosas vermelhas abertas, champanhe brut, licor de anis, pêssego em calda, cigarros finos, perfume importado.",
            cores: "Vermelho carmesim profundo e preto azeviche.",
            dia: "Sexta-feira",
            horario: "00:00 (Meia-noite)",
            signo: "Escorpião (Magnetismo, sexualidade consciente e mistério profundo)",
            badge: "Tradição & Feitiço"
        },
        "maria mulambo": {
            oferenda: "Licor de menta ou anis, espumante rosé, rosas vermelhas, figos, padê de mel, perfume suave.",
            cores: "Preto, roxo e dourado.",
            dia: "Sexta-feira",
            horario: "18:00 (Hora da Ave-Maria, limiar astral)",
            signo: "Peixes / Capricórnio (Empatia cósmica, transmutação e desapego material)",
            badge: "Transmutação"
        },
        "maria navalha": {
            oferenda: "Cerveja clara ou cachaça fina, cigarros de palha, rosas vermelhas, padê de dendê, petiscos tradicionais.",
            cores: "Vermelho, branco e preto.",
            dia: "Segunda-feira",
            horario: "12:00 ou 00:00 (Equilíbrio dos extremos)",
            signo: "Gêmeos / Sagitário (Perspicácia de rua, oratória e defesa afiada)",
            badge: "Proteção Urbana"
        },
        "maria quitéria": {
            oferenda: "Champanhe seco, cigarros, rosas vermelhas com espinhos, padê de pimenta, punhal consagrado.",
            cores: "Vermelho, preto e dourado.",
            dia: "Terça-feira",
            horario: "00:00",
            signo: "Áries (Coragem guerreira, liderança e firmeza de ação)",
            badge: "Justiça e Ordem"
        },
        "maria farrapo": {
            oferenda: "Cachaça de mel, cigarros rústicos, padê de carvão e mel, rosas vermelhas sem pétalas, frutas silvestres.",
            cores: "Preto, vermelho e cinza.",
            dia: "Segunda-feira",
            horario: "21:00",
            signo: "Virgem (Ordenação do caos mental, limpeza e cura prática)",
            badge: "Desapego e Cura"
        },
        "pombagira cigana": {
            oferenda: "Frutas doces, uvas, pão de mel, vinho licoroso, cigarros finos, moedas douradas, cartas de baralho, lenços coloridos.",
            cores: "Colorido (destaque para vermelho, amarelo, dourado e azul).",
            dia: "Quinta-feira",
            horario: "18:00",
            signo: "Touro / Sagitário (Prosperidade, fartura, liberdade e oráculos)",
            badge: "Liberdade & Clarividência"
        },
        "pombagira menina": {
            oferenda: "Licor doce, cidra de maçã, doces finos, rosas vermelhas pequenas, batom, fitas coloridas.",
            cores: "Vermelho e rosa.",
            dia: "Sexta-feira",
            horario: "00:00",
            signo: "Gêmeos / Câncer (Alegria espontânea, proteção afiada da juventude)",
            badge: "Juventude & Foco"
        },
        "rosa caveira": {
            oferenda: "Champanhe seco, cigarros finos, 7 rosas vermelhas, padê de dendê com mel, turmalina negra.",
            cores: "Preto, amarelo e vermelho.",
            dia: "Segunda-feira",
            horario: "00:00 (Meia-noite na calunga)",
            signo: "Escorpião / Capricórnio (Rigor cármico, lealdade e desintegração de ilusões)",
            badge: "Lei & Rigor"
        },
        "sete saias": {
            oferenda: "Champanhe, cigarros de menta, 7 rosas vermelhas abertas, frutas cítricas, fitas vermelhas e pretas.",
            cores: "Sete cores ou vermelho e preto.",
            dia: "Quarta-feira",
            horario: "18:00",
            signo: "Libra (Equilíbrio dos giros existenciais, atração e harmonia)",
            badge: "Dinâmica dos Caminhos"
        },
        "dama da noite": {
            oferenda: "Licor de cacau ou anis, espumante rosé, rosas vermelhas escuras, perfume importado, velas aromáticas.",
            cores: "Preto e dourado.",
            dia: "Sexta-feira",
            horario: "00:00",
            signo: "Touro / Leão (Sedução mística, autoestima e segredos ocultos)",
            badge: "Mistério Noturno"
        },
        "da figueira": {
            oferenda: "Vinho tinto suave, figos frescos, mel, fumo de rolo, rosas vermelhas, sementes de figueira.",
            cores: "Verde escuro, preto e vermelho.",
            dia: "Quinta-feira",
            horario: "18:00",
            signo: "Touro (Enraizamento estável, ancestralidade vegetal e cura fitoterapêutica)",
            badge: "Ancestralidade Terrena"
        },
        "da praia": {
            oferenda: "Champanhe branco, rosas vermelhas lançadas ao mar, mel, frutas aquáticas, conchas do mar.",
            cores: "Vermelho, azul e branco.",
            dia: "Sábado",
            horario: "06:00 ou 18:00",
            signo: "Câncer / Peixes (Fluidez emocional, purificação nas águas, intuição)",
            badge: "Fluidez e Limpeza"
        },
        "da lua": {
            oferenda: "Espumante brut, rosas vermelhas, uvas brancas, essência de alfazema, prata, incenso de mirra.",
            cores: "Prateado, preto e azul escuro.",
            dia: "Segunda-feira",
            horario: "00:00 (Sob o luar)",
            signo: "Câncer (Subconsciente profundo, visões noturnas e magnetismo etérico)",
            badge: "Magnetismo Celeste"
        },
        "da serra": {
            oferenda: "Vinho seco, fumo de corda, mel, rosas vermelhas com espinhos grandes, minerais rochosos.",
            cores: "Marrom, preto e vermelho.",
            dia: "Terça-feira",
            horario: "12:00",
            signo: "Sagitário / Capricórnio (Superação de limites, elevação de consciência)",
            badge: "Elevação & Foco"
        },
        "da sombra": {
            oferenda: "Champanhe, cigarros de cravo, rosas vermelhas escuras, carvão vegetal, incenso de arruda.",
            cores: "Preto absoluto e roxo escuro.",
            dia: "Segunda-feira",
            horario: "00:00",
            signo: "Escorpião (Integração das sombras da mente e cura de medos reprimidos)",
            badge: "Autoconhecimento"
        },
        "das águas profundas": {
            oferenda: "Champanhe branco, rosas vermelhas, perfume doce, conchas grandes, cristais de quartzo azul.",
            cores: "Azul marinho, preto e prata.",
            dia: "Sábado",
            horario: "00:00",
            signo: "Peixes / Escorpião (Cura de mágoas profundas, desvendamento emocional)",
            badge: "Subconsciente"
        },
        "das almas": {
            oferenda: "Vinho licoroso, rosas brancas e vermelhas, velas brancas, padê de mel, água de flor de laranjeira.",
            cores: "Preto, branco e vermelho.",
            dia: "Segunda-feira",
            horario: "18:00 ou 00:00",
            signo: "Capricórnio / Peixes (Passagem astral, conforto de almas e evolução cósmica)",
            badge: "Consolo & Passagem"
        },
        "das trevas": {
            oferenda: "Cachaça forte, charutos, rosas vermelhas escuras, padê de enxofre e carvão, punhal de aço.",
            cores: "Preto azeviche e roxo escuro.",
            dia: "Segunda-feira",
            horario: "00:00 (Limpeza profunda)",
            signo: "Escorpião / Áries (Neutralização de obsessões severas, desatar nós espirituais)",
            badge: "Quebra de Amarras"
        },
        "do fogo": {
            oferenda: "Licor de gengibre, cigarros finos, rosas vermelhas abertas, padê de pimenta e dendê, velas vermelhas de alta chama.",
            cores: "Vermelho escarlate e amarelo fogo.",
            dia: "Terça-feira",
            horario: "12:00 ou 00:00",
            signo: "Áries / Leão (Impulso vital, destruição de miasmas por purificação)",
            badge: "Energia Primordial"
        },
        "sete encruzilhadas": {
            oferenda: "Champanhe, cigarros de menta, 7 rosas vermelhas abertas, padê de mel e dendê, moedas douradas.",
            cores: "Vermelho, preto e dourado.",
            dia: "Quarta-feira",
            horario: "00:00",
            signo: "Gêmeos / Libra (Decisões cruciais, equilíbrio e abertura de novos rumos)",
            badge: "Senhora da Escolha"
        },
        "da fenda": {
            oferenda: "Vinho tinto seco, fumo de corda, mel de flores, rosas vermelhas, cristais brutos de ametista.",
            cores: "Cinza, preto e vermelho.",
            dia: "Quinta-feira",
            horario: "18:00",
            signo: "Virgem / Touro (Sustentação mineral estável, segurança material)",
            badge: "Portais Minerais"
        },
        "da calunga profunda": {
            oferenda: "Vinho de uva doce, cigarros, rosas escuras sem pétalas, padê de mel e pó de ferro, turmalina negra.",
            cores: "Preto e roxo.",
            dia: "Segunda-feira",
            horario: "00:00",
            signo: "Escorpião (Silêncio curativo, encerramento de ciclos negativos e eternidade)",
            badge: "Eternidade & Silêncio"
        },
        "da neblina": {
            oferenda: "Espumante branco, cigarros de cravo, rosas vermelhas, incenso de alfazema, pó de sumiço.",
            cores: "Cinza neblina, branco e vermelho.",
            dia: "Segunda-feira",
            horario: "03:00 (Hora mística)",
            signo: "Peixes / Gêmeos (Camuflagem protetora contra males invisíveis)",
            badge: "Ocultamento"
        },
        "das correntes": {
            oferenda: "Champanhe seco, cigarros finos, 7 rosas vermelhas, mel de abelha, ferro forjado antigo.",
            cores: "Vermelho, preto e cinza metálico.",
            dia: "Quarta-feira",
            horario: "18:00",
            signo: "Aquário / Áries (Libertação kármica, autonomia pessoal e quebra de pactos)",
            badge: "Libertação"
        }
    };

    /* ==========================================
       6. DYNAMIC CARDS DETAIL DRAWERS MODAL
       ========================================== */
    const cardModal = document.getElementById('cardModal');
    const cardModalClose = document.getElementById('cardModalClose');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalBadge = document.getElementById('modalBadge');
    const modalOferenda = document.getElementById('modalOferenda');
    const modalCores = document.getElementById('modalCores');
    const modalDia = document.getElementById('modalDia');
    const modalHorario = document.getElementById('modalHorario');
    const modalSigno = document.getElementById('modalSigno');

    // Click handler for pombagira cards
    pombagiraCards.forEach(card => {
        card.addEventListener('click', () => {
            const rawTitle = card.querySelector('.card-title').textContent.trim();
            const normalizedKey = rawTitle.toLowerCase();
            const cardImgSrc = card.querySelector('.card-img').src;
            const originalDesc = card.querySelector('.card-text').textContent;

            // Fetch specs from dictionary or fallback to placeholder
            const details = pombagiraDetails[normalizedKey] || {
                oferenda: "Champanhe brut, rosas vermelhas abertas e perfume suave.",
                cores: "Vermelho e Preto.",
                dia: "Sexta-feira",
                horario: "00:00",
                signo: "Escorpião",
                badge: "Tradição"
            };

            // Populate Modal Content
            modalImg.src = cardImgSrc;
            modalImg.alt = rawTitle;
            modalTitle.textContent = rawTitle;
            modalDesc.textContent = originalDesc;
            modalBadge.textContent = details.badge;
            modalOferenda.textContent = details.oferenda;
            modalCores.textContent = details.cores;
            modalDia.textContent = details.dia;
            modalHorario.textContent = details.horario;
            modalSigno.textContent = details.signo;
 
            // Handle link to dedicated page (all 24 entities now have gorgeous dedicated pages!)
            const modalArticleLink = document.getElementById('modalArticleLink');
            if (modalArticleLink) {
                const pageName = normalizedKey.replace(/\s+/g, '-');
                modalArticleLink.href = `${pageName}.html`;
                modalArticleLink.style.display = 'block';
            }
 
            // Open Modal
            cardModal.classList.add('is-active');
            document.body.style.overflow = 'hidden'; // Prevent body scroll
        });
    });

    const closeModal = () => {
        cardModal.classList.remove('is-active');
        document.body.style.overflow = ''; // Restore body scroll
    };

    if (cardModalClose) {
        cardModalClose.addEventListener('click', closeModal);
    }

    if (cardModal) {
        cardModal.addEventListener('click', (e) => {
            if (e.target === cardModal) {
                closeModal();
            }
        });
    }

    // Escape key press support to close modal drawer
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cardModal && cardModal.classList.contains('is-active')) {
            closeModal();
        }
    });

    /* ==========================================
       7. FAQ ACCORDION TRANSITIONS
       ========================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                otherItem.querySelector('.faq-content').style.maxHeight = '0';
            });

            if (!isActive) {
                item.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = `${content.scrollHeight}px`;
            }
        });
    });

    /* ==========================================
       8. FOOTER NAVIGATION ACTIONS
       ========================================== */
    const footerNavLinks = document.querySelectorAll('.footer-nav-link');
    
    footerNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetTab = link.getAttribute('data-target');
            if (targetTab) {
                e.preventDefault();
                switchTab(targetTab);
                
                const portalElement = document.getElementById('portal');
                if (portalElement) {
                    portalElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    /* ==========================================
       9. AUTOMATIC COPYRIGHT YEAR
       ========================================== */
    const copyrightYear = document.getElementById('copyrightYear');
    if (copyrightYear) {
        copyrightYear.textContent = new Date().getFullYear();
    }

    /* ==========================================
       10. SURGICAL SMOOTH SCROLL FOR AUTHOR BUTTON
       ========================================== */
    const authorBtn = document.querySelector('a[href="#about-author"]');
    if (authorBtn) {
        authorBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('about-author');
            if (target) {
                const headerOffset = 90; // Balanced offset to bring the biography beautifully and surgically into view
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    /* ==========================================
       11. LUXURY SLIDESHOW CONTROLLER (HERO)
       ========================================== */
    const heroWrapper = document.querySelector('.hero-banner-wrapper');
    const slides = document.querySelectorAll('.hero-slideshow-img');
    const indicators = document.querySelectorAll('.hero-slideshow-indicators .indicator');
    
    // Configuração de dados de textos para cada slide do Hero
    const heroContentData = [
        {
            kicker: "Filosofia Ancestral & Tecnologia",
            title: "Guardiãs dos Limiares",
            desc: "A maior plataforma dedicada à desmistificação das Pombagiras. Um estudo profundo sobre arquétipos femininos sagrados, desconstruindo dogmas sociais e preconceitos através da arte visceral, história e ciência sob a ótica de Alexia Melusine.",
            btn1Text: "Explorar Portal",
            btn1Href: "#portal",
            btn2Text: "Conhecer a Autora",
            btn2Href: "#about-author"
        },
        {
            kicker: "Oráculo & Tradição",
            title: "Mistério das Lebaras",
            desc: "Conheça as falanges e linhas de atuação espiritual das guardiãs de esquerda. Um dicionário litúrgico e histórico profundo detalhando oferendas, dias de poder e arquétipos cósmicos.",
            btn1Text: "Explorar Guardiãs",
            btn1Href: "#portal",
            btn2Text: "Ver Oferendas",
            btn2Href: "#portal"
        },
        {
            kicker: "Mitos & Teologia Consciente",
            title: "Perguntas & Respostas",
            desc: "Desmistificando preconceitos e tirando dúvidas teológicas sobre a esquerda com rigor, clareza e desconstrução filosófica de visões deturpadas e preconceituosas.",
            btn1Text: "Acessar FAQ",
            btn1Href: "#portal",
            btn2Text: "Estudo Crítico",
            btn2Href: "#portal"
        },
        {
            kicker: "Ciência & Ocultismo",
            title: "Segredos Revelados",
            desc: "Fatos históricos intrigantes, curiosidades liturgicamente corretas e o papel psicoterapêutico das guardiãs na evolução e equilíbrio mental humano.",
            btn1Text: "Ver Curiosidades",
            btn1Href: "#portal",
            btn2Text: "Sabedoria Prática",
            btn2Href: "#portal"
        },
        {
            kicker: "Conexão & Egrégora",
            title: "Comunidade de Lebarás",
            desc: "Junte-se à nossa egrégora no Telegram, WhatsApp, Discord e Spotify. Conecte-se com a diretora Alexia Melusine para partilhar conhecimento consciente e arte visceral.",
            btn1Text: "Sobre a Autora",
            btn1Href: "#about-author",
            btn2Text: "Entrar no Canal",
            btn2Href: "https://t.me/pomba_giras"
        },
        {
            kicker: "Cultura & Identidade",
            title: "Arte Visceral e Sagrada",
            desc: "Expressão estética refinada que celebra a força ancestral. Um percurso visual e literário pelas representações mais impactantes das guardiãs de caminho.",
            btn1Text: "Explorar Portal",
            btn1Href: "#portal",
            btn2Text: "Ver Galeria",
            btn2Href: "#portal"
        },
        {
            kicker: "Mistérios Femininos",
            title: "O Empoderamento Ancestral",
            desc: "A representação da autonomia feminina e da soberania espiritual. Entidades que guiam caminhos, promovem justiça e iluminam as sombras humanas.",
            btn1Text: "Explorar Portal",
            btn1Href: "#portal",
            btn2Text: "Ver Guardiãs",
            btn2Href: "#portal"
        },
        {
            kicker: "Evolução & Egrégora",
            title: "Caminhos Abertos",
            desc: "Orientação e sabedoria milenar para romper barreiras e desfazer entraves. A força de esquerda atuando no equilíbrio kármico e na autotransformação.",
            btn1Text: "Explorar Portal",
            btn1Href: "#portal",
            btn2Text: "Conhecer História",
            btn2Href: "#portal"
        }
    ];

    const heroContent = document.querySelector('.hero-banner-content');
    const kickerEl = document.querySelector('.hero-banner-content .accent-kicker');
    const titleEl = document.querySelector('.hero-banner-content .main-page-title');
    const descEl = document.querySelector('.hero-banner-content .hero-description');
    const btnCrimsonEl = document.querySelector('.hero-banner-content .hero-btn-row .btn-crimson');
    const btnOutlineEl = document.querySelector('.hero-banner-content .hero-btn-row .btn-outline');
    
    if (slides.length > 0 && indicators.length > 0) {
        let currentSlide = 0;
        let slideInterval;
        const slideDuration = 3000; // 3 seconds per photo
        let isPaused = false;
 
        const showSlide = (index) => {
            if (index === currentSlide && slides[index].classList.contains('active')) return;
 
            // Transição elegante do conteúdo textual (Fade Out -> Update -> Fade In)
            if (heroContent && heroContentData[index]) {
                heroContent.classList.add('fade-out');
                
                setTimeout(() => {
                    const data = heroContentData[index];
                    if (kickerEl) kickerEl.textContent = data.kicker;
                    if (titleEl) titleEl.textContent = data.title;
                    if (descEl) descEl.textContent = data.desc;
                    
                    heroContent.classList.remove('fade-out');
                }, 400);
            }
 
            // Define o slide atual como 'leaving' para transição de opacidade/Ken Burns de saída
            slides.forEach((slide, i) => {
                slide.classList.remove('leaving');
                if (slide.classList.contains('active')) {
                    slide.classList.remove('active');
                    slide.classList.add('leaving');
                    
                    // Limpa a classe de saída após o término da animação
                    setTimeout(() => {
                        slide.classList.remove('leaving');
                    }, 1800);
                }
            });
 
            // Ativa o novo slide
            slides[index].classList.add('active');
 
            // Atualiza os indicadores
            indicators.forEach((indicator, i) => {
                indicator.classList.remove('active');
                if (i === index) {
                    indicator.classList.add('active');
                }
            });
 
            currentSlide = index;
        };
 
        const nextSlide = () => {
            if (isPaused) return;
            let nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        };
 
        const startSlideShow = () => {
            stopSlideShow();
            slideInterval = setInterval(nextSlide, slideDuration);
        };
 
        const stopSlideShow = () => {
            if (slideInterval) {
                clearInterval(slideInterval);
            }
        };
 
        // Torna a função showSlide disponível globalmente para sincronização com as abas e footer
        window.showHeroSlide = (index) => {
            showSlide(index);
            startSlideShow(); // Reinicia o timer após interação
        };
 
        // Permite clicar nos indicadores para mudar de foto manualmente
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const targetIndex = parseInt(indicator.getAttribute('data-index'));
                window.showHeroSlide(targetIndex);
            });
        });

        // Eventos de Hover para pausar/resumir o carrossel e apreciar a imagem
        if (heroWrapper) {
            heroWrapper.addEventListener('mouseenter', () => {
                isPaused = true;
                // Pausa o preenchimento do indicador ativo (visual)
                const activeIndicator = document.querySelector('.hero-slideshow-indicators .indicator.active::after');
                if (activeIndicator) {
                    activeIndicator.style.width = getComputedStyle(activeIndicator).width;
                    activeIndicator.style.transition = 'none';
                }
            });

            heroWrapper.addEventListener('mouseleave', () => {
                isPaused = false;
                startSlideShow();
            });
        }

        // Inicializa o slideshow
        startSlideShow();
    }
});

