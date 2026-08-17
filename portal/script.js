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
                "oferenda": "Rosas vermelhas abertas, champanhe brut, licor de anis, pêssego em calda, cigarros finos, perfume importado.",
                "cores": "Rosa choque, Vermelho carmesim, Dourado e Branco.",
                "dia": "Sexta-feira",
                "horario": "20:00 ou 00:00 (Noite do amor e da magia)",
                "signo": "Escorpião / Oxum (Magnetismo, autonomia soberana e realeza)",
                "badge": "Tradição & Feitiço"
        },
        "maria mulambo": {
                "oferenda": "Licor de menta ou anis, espumante rosé, rosas vermelhas, figos, padê de mel, perfume suave.",
                "cores": "Preto, Cinza, Vinho, Marrom e Laranja queimado.",
                "dia": "Segunda-feira",
                "horario": "12:00 (Hora da misericórdia) ou 18:00",
                "signo": "Peixes / Obaluaê (Empatia cósmica, transmutação e desapego material)",
                "badge": "Transmutação"
        },
        "maria navalha": {
                "oferenda": "Cerveja clara ou cachaça fina, cigarros de palha, rosas vermelhas, padê de dendê, petiscos tradicionais.",
                "cores": "Vermelho sangue, Preto fosco, Metalizado e Laranja.",
                "dia": "Sexta-feira",
                "horario": "21:00 ou 02:00 (Hora da rua)",
                "signo": "Gêmeos / Ogum (Perspicácia de rua, oratória e defesa afiada)",
                "badge": "Proteção Urbana"
        },
        "maria quitéria": {
                "oferenda": "Champanhe seco, cigarros, rosas vermelhas com espinhos, padê de pimenta, punhal consagrado.",
                "cores": "Amarelo ouro, Vermelho sangue, Laranja e Preto.",
                "dia": "Quinta-feira",
                "horario": "14:00 (Hora da justiça) ou 21:00 (Hora da guerra)",
                "signo": "Áries / Ogum (Coragem guerreira, liderança e firmeza de ação)",
                "badge": "Justiça e Ordem"
        },
        "maria farrapo": {
                "oferenda": "Cachaça de mel, cigarros rústicos, padê de carvão e mel, rosas vermelhas sem pétalas, frutas silvestres.",
                "cores": "Marrom terra, Laranja queimado, Preto fosco, Cinza e Bege.",
                "dia": "Quarta-feira",
                "horario": "15:00 (Hora da sanidade) ou 23:00 (Hora do caos)",
                "signo": "Virgem / Obaluaê (Ordenação do caos mental, limpeza e cura prática)",
                "badge": "Desapego e Cura"
        },
        "pombagira cigana": {
                "oferenda": "Frutas doces, uvas, pão de mel, vinho licoroso, cigarros finos, moedas douradas, cartas de baralho, lenços coloridos.",
                "cores": "Vermelho paixão, Dourado, Roxo, Verde esmeralda e Azul turquesa.",
                "dia": "Sexta-feira",
                "horario": "18:00 (Hora do encontro) ou Domingo pela manhã",
                "signo": "Touro / Sagitário (Prosperidade, fartura, liberdade e oráculos)",
                "badge": "Liberdade & Clarividência"
        },
        "cigana": {
                "oferenda": "Frutas doces, uvas, pão de mel, vinho licoroso, cigarros finos, moedas douradas, cartas de baralho, lenços coloridos.",
                "cores": "Vermelho paixão, Dourado, Roxo, Verde esmeralda e Azul turquesa.",
                "dia": "Sexta-feira",
                "horario": "18:00 (Hora do encontro) ou Domingo pela manhã",
                "signo": "Touro / Sagitário (Prosperidade, fartura, liberdade e oráculos)",
                "badge": "Liberdade & Clarividência"
        },
        "pombagira menina": {
                "oferenda": "Licor doce, cidra de maçã, doces finos, rosas vermelhas pequenas, batom, fitas coloridas.",
                "cores": "Rosa bebê, Branco puro, Lilás claro, Amarelo e Azul céu.",
                "dia": "Domingo",
                "horario": "10:00 (Manhã da renovação) ou 15:00",
                "signo": "Gêmeos / Câncer / Oxum (Alegria espontânea, proteção afiada da juventude)",
                "badge": "Juventude & Foco"
        },
        "menina": {
                "oferenda": "Licor doce, cidra de maçã, doces finos, rosas vermelhas pequenas, batom, fitas coloridas.",
                "cores": "Rosa bebê, Branco puro, Lilás claro, Amarelo e Azul céu.",
                "dia": "Domingo",
                "horario": "10:00 (Manhã da renovação) ou 15:00",
                "signo": "Gêmeos / Câncer / Oxum (Alegria espontânea, proteção afiada da juventude)",
                "badge": "Juventude & Foco"
        },
        "rosa caveira": {
                "oferenda": "Champanhe seco, cigarros finos, 7 rosas vermelhas, padê de dendê com mel, turmalina negra.",
                "cores": "Roxo profundo, Preto, Cinza, Prata e Vermelho vinho.",
                "dia": "Sábado",
                "horario": "23:00 (Hora da calunga) ou 03:00 (Hora morta)",
                "signo": "Escorpião / Capricórnio / Omolu (Rigor cármico, lealdade e encerramento de ciclos)",
                "badge": "Lei & Rigor"
        },
        "sete saias": {
                "oferenda": "Champanhe, cigarros de menta, 7 rosas vermelhas abertas, frutas cítricas, fitas coloridas de sete cores.",
                "cores": "Sete cores do arco-íris, vermelho e preto.",
                "dia": "Sexta-feira",
                "horario": "19:00 (Noite de festa) ou Sábado à tarde",
                "signo": "Libra / Oxum (Equilíbrio dos giros existenciais, atração e harmonia)",
                "badge": "Dinâmica dos Caminhos"
        },
        "dama da noite": {
                "oferenda": "Licor de cacau ou anis, espumante rosé, rosas vermelhas escuras, perfume importado, velas aromáticas.",
                "cores": "Preto aveludado, Prata, Violeta e Azul meia-noite.",
                "dia": "Sexta-feira",
                "horario": "00:00 (Meia-noite) ou 03:33 (Hora do mistério)",
                "signo": "Touro / Leão / Iemanjá (Sedução mística, autoestima e segredos ocultos)",
                "badge": "Mistério Noturno"
        },
        "pombagira da figueira": {
                "oferenda": "Vinho tinto suave, figos frescos, mel, fumo de rolo, rosas vermelhas, sementes de figueira.",
                "cores": "Verde musgo, Marrom terra, Roxo terroso, Dourado velho e Preto.",
                "dia": "Terça-feira",
                "horario": "21:00 (Hora da ancestralidade) ou Sábado às 06:00",
                "signo": "Touro / Ossain (Enraizamento estável, ancestralidade vegetal e cura)",
                "badge": "Ancestralidade Terrena"
        },
        "da figueira": {
                "oferenda": "Vinho tinto suave, figos frescos, mel, fumo de rolo, rosas vermelhas, sementes de figueira.",
                "cores": "Verde musgo, Marrom terra, Roxo terroso, Dourado velho e Preto.",
                "dia": "Terça-feira",
                "horario": "21:00 (Hora da ancestralidade) ou Sábado às 06:00",
                "signo": "Touro / Ossain (Enraizamento estável, ancestralidade vegetal e cura)",
                "badge": "Ancestralidade Terrena"
        },
        "pombagira da praia": {
                "oferenda": "Champanhe branco, rosas vermelhas lançadas ao mar, mel, frutas aquáticas, conchas do mar.",
                "cores": "Azul marinho, Branco espuma, Prata, Verde água-marinha e Rosa.",
                "dia": "Segunda-feira",
                "horario": "06:00 (Nascer do sol no mar) ou 18:00 (Pôr do sol)",
                "signo": "Câncer / Peixes / Iemanjá (Fluidez emocional, purificação nas águas)",
                "badge": "Fluidez e Limpeza"
        },
        "da praia": {
                "oferenda": "Champanhe branco, rosas vermelhas lançadas ao mar, mel, frutas aquáticas, conchas do mar.",
                "cores": "Azul marinho, Branco espuma, Prata, Verde água-marinha e Rosa.",
                "dia": "Segunda-feira",
                "horario": "06:00 (Nascer do sol no mar) ou 18:00 (Pôr do sol)",
                "signo": "Câncer / Peixes / Iemanjá (Fluidez emocional, purificação nas águas)",
                "badge": "Fluidez e Limpeza"
        },
        "pombagira da lua": {
                "oferenda": "Espumante brut, rosas vermelhas, uvas brancas, essência de alfazema, prata, incenso de mirra.",
                "cores": "Prata luzente, Branco lunar, Roxo violeta, Azul celeste e Cinza.",
                "dia": "Segunda-feira",
                "horario": "00:00 (Sob o luar pleno)",
                "signo": "Câncer / Lua (Subconsciente profundo, visões noturnas e magnetismo)",
                "badge": "Magnetismo Celeste"
        },
        "da lua": {
                "oferenda": "Espumante brut, rosas vermelhas, uvas brancas, essência de alfazema, prata, incenso de mirra.",
                "cores": "Prata luzente, Branco lunar, Roxo violeta, Azul celeste e Cinza.",
                "dia": "Segunda-feira",
                "horario": "00:00 (Sob o luar pleno)",
                "signo": "Câncer / Lua (Subconsciente profundo, visões noturnas e magnetismo)",
                "badge": "Magnetismo Celeste"
        },
        "pombagira da serra": {
                "oferenda": "Vinho seco, fumo de corda, mel, rosas vermelhas com espinhos grandes, minerais rochosos.",
                "cores": "Verde montanha, Cinza rocha, Marrom pedra, Azul céu e Branco nuvem.",
                "dia": "Domingo",
                "horario": "06:00 (Nascer do sol na serra) ou Quinta-feira às 15:00",
                "signo": "Sagitário / Capricórnio / Oxóssi (Superação de limites, visão panorâmica)",
                "badge": "Elevação & Foco"
        },
        "da serra": {
                "oferenda": "Vinho seco, fumo de corda, mel, rosas vermelhas com espinhos grandes, minerais rochosos.",
                "cores": "Verde montanha, Cinza rocha, Marrom pedra, Azul céu e Branco nuvem.",
                "dia": "Domingo",
                "horario": "06:00 (Nascer do sol na serra) ou Quinta-feira às 15:00",
                "signo": "Sagitário / Capricórnio / Oxóssi (Superação de limites, visão panorâmica)",
                "badge": "Elevação & Foco"
        },
        "pombagira da sombra": {
                "oferenda": "Champanhe, cigarros de cravo, rosas vermelhas escuras, carvão vegetal, incenso de arruda.",
                "cores": "Preto opaco, Cinza sombra, Roxo escurecido e Marrom noturno.",
                "dia": "Sábado",
                "horario": "00:00 ou 04:00 (Hora da invisibilidade)",
                "signo": "Escorpião / Oxóssi (Integração das sombras da mente e proteção discreta)",
                "badge": "Autoconhecimento"
        },
        "da sombra": {
                "oferenda": "Champanhe, cigarros de cravo, rosas vermelhas escuras, carvão vegetal, incenso de arruda.",
                "cores": "Preto opaco, Cinza sombra, Roxo escurecido e Marrom noturno.",
                "dia": "Sábado",
                "horario": "00:00 ou 04:00 (Hora da invisibilidade)",
                "signo": "Escorpião / Oxóssi (Integração das sombras da mente e proteção discreta)",
                "badge": "Autoconhecimento"
        },
        "das águas profundas": {
                "oferenda": "Champanhe branco, rosas vermelhas, perfume doce, conchas grandes, cristais de quartzo azul.",
                "cores": "Azul profundo, Verde abismo, Preto marinho, Roxo submerso e Prata.",
                "dia": "Segunda-feira",
                "horario": "23:00 ou 00:00 (Maré alta e profunda)",
                "signo": "Peixes / Escorpião / Iemanjá (Cura de mágoas profundas e inconsciente)",
                "badge": "Subconsciente"
        },
        "pombagira das águas profundas": {
                "oferenda": "Champanhe branco, rosas vermelhas, perfume doce, conchas grandes, cristais de quartzo azul.",
                "cores": "Azul profundo, Verde abismo, Preto marinho, Roxo submerso e Prata.",
                "dia": "Segunda-feira",
                "horario": "23:00 ou 00:00 (Maré alta e profunda)",
                "signo": "Peixes / Escorpião / Iemanjá (Cura de mágoas profundas e inconsciente)",
                "badge": "Subconsciente"
        },
        "águas profundas": {
                "oferenda": "Champanhe branco, rosas vermelhas, perfume doce, conchas grandes, cristais de quartzo azul.",
                "cores": "Azul profundo, Verde abismo, Preto marinho, Roxo submerso e Prata.",
                "dia": "Segunda-feira",
                "horario": "23:00 ou 00:00 (Maré alta e profunda)",
                "signo": "Peixes / Escorpião / Iemanjá (Cura de mágoas profundas e inconsciente)",
                "badge": "Subconsciente"
        },
        "das almas": {
                "oferenda": "Vinho licoroso, rosas brancas e vermelhas, velas brancas e pretas, padê de mel, água de flor de laranjeira.",
                "cores": "Branco fosco, Preto veludo, Cinza névoa, Prata lunar e Roxo claro.",
                "dia": "Sábado",
                "horario": "00:00 ou Domingo às 04:00 (Hora das almas)",
                "signo": "Capricórnio / Peixes / Omolu (Passagem astral e consolo espiritual)",
                "badge": "Consolo & Passagem"
        },
        "pombagira das almas": {
                "oferenda": "Vinho licoroso, rosas brancas e vermelhas, velas brancas e pretas, padê de mel, água de flor de laranjeira.",
                "cores": "Branco fosco, Preto veludo, Cinza névoa, Prata lunar e Roxo claro.",
                "dia": "Sábado",
                "horario": "00:00 ou Domingo às 04:00 (Hora das almas)",
                "signo": "Capricórnio / Peixes / Omolu (Passagem astral e consolo espiritual)",
                "badge": "Consolo & Passagem"
        },
        "almas": {
                "oferenda": "Vinho licoroso, rosas brancas e vermelhas, velas brancas e pretas, padê de mel, água de flor de laranjeira.",
                "cores": "Branco fosco, Preto veludo, Cinza névoa, Prata lunar e Roxo claro.",
                "dia": "Sábado",
                "horario": "00:00 ou Domingo às 04:00 (Hora das almas)",
                "signo": "Capricórnio / Peixes / Omolu (Passagem astral e consolo espiritual)",
                "badge": "Consolo & Passagem"
        },
        "das trevas": {
                "oferenda": "Cachaça forte, charutos, rosas vermelhas escuras, padê de carvão, punhal de aço.",
                "cores": "Preto absoluto, Roxo escuro, Azul meia-noite e Vermelho sangue velho.",
                "dia": "Sábado",
                "horario": "03:33 (Hora morta profunda) ou 00:00 de Lua Nova",
                "signo": "Escorpião / Omolu (Neutralização de demandas severas e proteção)",
                "badge": "Quebra de Amarras"
        },
        "pombagira das trevas": {
                "oferenda": "Cachaça forte, charutos, rosas vermelhas escuras, padê de carvão, punhal de aço.",
                "cores": "Preto absoluto, Roxo escuro, Azul meia-noite e Vermelho sangue velho.",
                "dia": "Sábado",
                "horario": "03:33 (Hora morta profunda) ou 00:00 de Lua Nova",
                "signo": "Escorpião / Omolu (Neutralização de demandas severas e proteção)",
                "badge": "Quebra de Amarras"
        },
        "trevas": {
                "oferenda": "Cachaça forte, charutos, rosas vermelhas escuras, padê de carvão, punhal de aço.",
                "cores": "Preto absoluto, Roxo escuro, Azul meia-noite e Vermelho sangue velho.",
                "dia": "Sábado",
                "horario": "03:33 (Hora morta profunda) ou 00:00 de Lua Nova",
                "signo": "Escorpião / Omolu (Neutralização de demandas severas e proteção)",
                "badge": "Quebra de Amarras"
        },
        "do fogo": {
                "oferenda": "Licor de gengibre, cigarros finos, rosas vermelhas abertas, padê de pimenta e dendê, velas vermelhas de alta chama.",
                "cores": "Vermelho fogo, Laranja brasa, Amarelo chama e Dourado faísca.",
                "dia": "Sexta-feira",
                "horario": "21:00 (Hora do fogo) ou Terça-feira ao meio-dia",
                "signo": "Áries / Leão / Iansã (Impulso vital, destruição de miasmas por purificação)",
                "badge": "Energia Primordial"
        },
        "pombagira do fogo": {
                "oferenda": "Licor de gengibre, cigarros finos, rosas vermelhas abertas, padê de pimenta e dendê, velas vermelhas de alta chama.",
                "cores": "Vermelho fogo, Laranja brasa, Amarelo chama e Dourado faísca.",
                "dia": "Sexta-feira",
                "horario": "21:00 (Hora do fogo) ou Terça-feira ao meio-dia",
                "signo": "Áries / Leão / Iansã (Impulso vital, destruição de miasmas por purificação)",
                "badge": "Energia Primordial"
        },
        "fogo": {
                "oferenda": "Licor de gengibre, cigarros finos, rosas vermelhas abertas, padê de pimenta e dendê, velas vermelhas de alta chama.",
                "cores": "Vermelho fogo, Laranja brasa, Amarelo chama e Dourado faísca.",
                "dia": "Sexta-feira",
                "horario": "21:00 (Hora do fogo) ou Terça-feira ao meio-dia",
                "signo": "Áries / Leão / Iansã (Impulso vital, destruição de miasmas por purificação)",
                "badge": "Energia Primordial"
        },
        "sete encruzilhadas": {
                "oferenda": "Champanhe, cigarros de menta, 7 rosas vermelhas abertas, padê de mel e dendê, moedas douradas.",
                "cores": "Amarelo ouro, Branco, Preto, Cinza prata, Vermelho escarlate e Verde.",
                "dia": "Sexta-feira",
                "horario": "19:00 ou Quarta-feira à meia-noite (Hora das decisões)",
                "signo": "Gêmeos / Libra / Exu (Decisões cruciais e múltiplos caminhos)",
                "badge": "Senhora da Escolha"
        },
        "da fenda": {
                "oferenda": "Vinho tinto seco, fumo de corda, mel de flores, rosas vermelhas, cristais brutos de ametista.",
                "cores": "Marrom fenda, Preto brecha, Roxo portal, Cinza poeira e Verde musgo.",
                "dia": "Quarta-feira",
                "horario": "03:00 (Hora das fendas) ou Domingo à meia-noite",
                "signo": "Virgem / Touro / Exu (Portais minerais e transições ocultas)",
                "badge": "Portais Minerais"
        },
        "pombagira da fenda": {
                "oferenda": "Vinho tinto seco, fumo de corda, mel de flores, rosas vermelhas, cristais brutos de ametista.",
                "cores": "Marrom fenda, Preto brecha, Roxo portal, Cinza poeira e Verde musgo.",
                "dia": "Quarta-feira",
                "horario": "03:00 (Hora das fendas) ou Domingo à meia-noite",
                "signo": "Virgem / Touro / Exu (Portais minerais e transições ocultas)",
                "badge": "Portais Minerais"
        },
        "fenda": {
                "oferenda": "Vinho tinto seco, fumo de corda, mel de flores, rosas vermelhas, cristais brutos de ametista.",
                "cores": "Marrom fenda, Preto brecha, Roxo portal, Cinza poeira e Verde musgo.",
                "dia": "Quarta-feira",
                "horario": "03:00 (Hora das fendas) ou Domingo à meia-noite",
                "signo": "Virgem / Touro / Exu (Portais minerais e transições ocultas)",
                "badge": "Portais Minerais"
        },
        "da calunga profunda": {
                "oferenda": "Vinho de uva doce, cigarros, rosas escuras sem pétalas, padê de mel e pó de ferro, turmalina negra.",
                "cores": "Preto absoluto, Roxo túmulo, Cinza cinzas, Branco osso e Vermelho ancestral.",
                "dia": "Sábado",
                "horario": "03:33 ou Sexta-feira à meia-noite profunda",
                "signo": "Escorpião / Omolu (Silêncio curativo, ancestralidade e encerramento kármico)",
                "badge": "Eternidade & Silêncio"
        },
        "pombagira da calunga profunda": {
                "oferenda": "Vinho de uva doce, cigarros, rosas escuras sem pétalas, padê de mel e pó de ferro, turmalina negra.",
                "cores": "Preto absoluto, Roxo túmulo, Cinza cinzas, Branco osso e Vermelho ancestral.",
                "dia": "Sábado",
                "horario": "03:33 ou Sexta-feira à meia-noite profunda",
                "signo": "Escorpião / Omolu (Silêncio curativo, ancestralidade e encerramento kármico)",
                "badge": "Eternidade & Silêncio"
        },
        "calunga profunda": {
                "oferenda": "Vinho de uva doce, cigarros, rosas escuras sem pétalas, padê de mel e pó de ferro, turmalina negra.",
                "cores": "Preto absoluto, Roxo túmulo, Cinza cinzas, Branco osso e Vermelho ancestral.",
                "dia": "Sábado",
                "horario": "03:33 ou Sexta-feira à meia-noite profunda",
                "signo": "Escorpião / Omolu (Silêncio curativo, ancestralidade e encerramento kármico)",
                "badge": "Eternidade & Silêncio"
        },
        "da neblina": {
                "oferenda": "Espumante branco, cigarros de cravo, rosas vermelhas, incenso de alfazema, pó de sumiço.",
                "cores": "Cinza névoa, Branco neblina, Prata difuso, Roxo nublado e Azul cinza.",
                "dia": "Quarta-feira",
                "horario": "05:00 (Neblina matinal) ou 18:00 (Neblina noturna)",
                "signo": "Peixes / Gêmeos / Iansã (Camuflagem protetora e clareza mental)",
                "badge": "Ocultamento"
        },
        "pombagira da neblina": {
                "oferenda": "Espumante branco, cigarros de cravo, rosas vermelhas, incenso de alfazema, pó de sumiço.",
                "cores": "Cinza névoa, Branco neblina, Prata difuso, Roxo nublado e Azul cinza.",
                "dia": "Quarta-feira",
                "horario": "05:00 (Neblina matinal) ou 18:00 (Neblina noturna)",
                "signo": "Peixes / Gêmeos / Iansã (Camuflagem protetora e clareza mental)",
                "badge": "Ocultamento"
        },
        "neblina": {
                "oferenda": "Espumante branco, cigarros de cravo, rosas vermelhas, incenso de alfazema, pó de sumiço.",
                "cores": "Cinza névoa, Branco neblina, Prata difuso, Roxo nublado e Azul cinza.",
                "dia": "Quarta-feira",
                "horario": "05:00 (Neblina matinal) ou 18:00 (Neblina noturna)",
                "signo": "Peixes / Gêmeos / Iansã (Camuflagem protetora e clareza mental)",
                "badge": "Ocultamento"
        },
        "das correntes": {
                "oferenda": "Champanhe seco, cigarros finos, 7 rosas vermelhas, mel de abelha, ferro forjado antigo.",
                "cores": "Cinza ferro, Preto corrente, Prata corte, Vermelho quebra e Azul liberdade.",
                "dia": "Quinta-feira",
                "horario": "15:00 (Hora da justiça libertadora) ou Sábado às 06:00",
                "signo": "Aquário / Áries / Ogum (Libertação kármica e quebra de amarras)",
                "badge": "Libertação"
        },
        "pombagira das correntes": {
                "oferenda": "Champanhe seco, cigarros finos, 7 rosas vermelhas, mel de abelha, ferro forjado antigo.",
                "cores": "Cinza ferro, Preto corrente, Prata corte, Vermelho quebra e Azul liberdade.",
                "dia": "Quinta-feira",
                "horario": "15:00 (Hora da justiça libertadora) ou Sábado às 06:00",
                "signo": "Aquário / Áries / Ogum (Libertação kármica e quebra de amarras)",
                "badge": "Libertação"
        },
        "correntes": {
                "oferenda": "Champanhe seco, cigarros finos, 7 rosas vermelhas, mel de abelha, ferro forjado antigo.",
                "cores": "Cinza ferro, Preto corrente, Prata corte, Vermelho quebra e Azul liberdade.",
                "dia": "Quinta-feira",
                "horario": "15:00 (Hora da justiça libertadora) ou Sábado às 06:00",
                "signo": "Aquário / Áries / Ogum (Libertação kármica e quebra de amarras)",
                "badge": "Libertação"
        },
        "da estrada": {
                "oferenda": "Cerveja clara, cigarros finos, rosas vermelhas, padê de mel, moedas correntes.",
                "cores": "Marrom estrada, Cinza asfalto, Amarelo linha, Vermelho distância e Verde.",
                "dia": "Domingo ou Sexta-feira",
                "horario": "18:00 (Retorno de viagem) ou 21:00 (Saída para a estrada)",
                "signo": "Gêmeos / Mercúrio / Exu (Proteção em trânsito e abertura de caminhos)",
                "badge": "Guardiã dos Viajantes"
        },
        "pombagira da estrada": {
                "oferenda": "Cerveja clara, cigarros finos, rosas vermelhas, padê de mel, moedas correntes.",
                "cores": "Marrom estrada, Cinza asfalto, Amarelo linha, Vermelho distância e Verde.",
                "dia": "Domingo ou Sexta-feira",
                "horario": "18:00 (Retorno de viagem) ou 21:00 (Saída para a estrada)",
                "signo": "Gêmeos / Mercúrio / Exu (Proteção em trânsito e abertura de caminhos)",
                "badge": "Guardiã dos Viajantes"
        },
        "estrada": {
                "oferenda": "Cerveja clara, cigarros finos, rosas vermelhas, padê de mel, moedas correntes.",
                "cores": "Marrom estrada, Cinza asfalto, Amarelo linha, Vermelho distância e Verde.",
                "dia": "Domingo ou Sexta-feira",
                "horario": "18:00 (Retorno de viagem) ou 21:00 (Saída para a estrada)",
                "signo": "Gêmeos / Mercúrio / Exu (Proteção em trânsito e abertura de caminhos)",
                "badge": "Guardiã dos Viajantes"
        },
        "do vento": {
                "oferenda": "Velas brancas ou azuis claras de queima rápida, flores brancas, perfume suave, incenso de alfazema.",
                "cores": "Branco vento, Azul céu, Cinza nuvem, Prata ar e Amarelo leve.",
                "dia": "Domingo ou Terça-feira",
                "horario": "15:00 (Vento da tarde) ou ao nascer do sol",
                "signo": "Aquário / Mercúrio / Iansã (Comunicação instantânea e leveza)",
                "badge": "Leveza e Mensagens"
        },
        "pombagira do vento": {
                "oferenda": "Velas brancas ou azuis claras de queima rápida, flores brancas, perfume suave, incenso de alfazema.",
                "cores": "Branco vento, Azul céu, Cinza nuvem, Prata ar e Amarelo leve.",
                "dia": "Domingo ou Terça-feira",
                "horario": "15:00 (Vento da tarde) ou ao nascer do sol",
                "signo": "Aquário / Mercúrio / Iansã (Comunicação instantânea e leveza)",
                "badge": "Leveza e Mensagens"
        },
        "vento": {
                "oferenda": "Velas brancas ou azuis claras de queima rápida, flores brancas, perfume suave, incenso de alfazema.",
                "cores": "Branco vento, Azul céu, Cinza nuvem, Prata ar e Amarelo leve.",
                "dia": "Domingo ou Terça-feira",
                "horario": "15:00 (Vento da tarde) ou ao nascer do sol",
                "signo": "Aquário / Mercúrio / Iansã (Comunicação instantânea e leveza)",
                "badge": "Leveza e Mensagens"
        },
        "cacurucaia – senhora do cruzeiro": {
                "oferenda": "Vinho tinto seco, rosas escuras no cruzeiro, velas pretas e roxas firmadas no chão, padê de carvão e mel.",
                "cores": "Preto fosco, Vermelho escuro, Bordô, Roxo profundo e Marrom-terra.",
                "dia": "Segunda-feira ou Sábado de Calunga",
                "horario": "00:00 às 03:00 (Madrugada do Cruzeiro)",
                "signo": "Capricórnio / Saturno / Omolu (Estabilização de almas e corte de laços doentios)",
                "badge": "Senhora do Cruzeiro"
        },
        "cacurucaia": {
                "oferenda": "Vinho tinto seco, rosas escuras no cruzeiro, velas pretas e roxas firmadas no chão, padê de carvão e mel.",
                "cores": "Preto fosco, Vermelho escuro, Bordô, Roxo profundo e Marrom-terra.",
                "dia": "Segunda-feira ou Sábado de Calunga",
                "horario": "00:00 às 03:00 (Madrugada do Cruzeiro)",
                "signo": "Capricórnio / Saturno / Omolu (Estabilização de almas e corte de laços doentios)",
                "badge": "Senhora do Cruzeiro"
        },
        "cacurucaia - senhora do cruzeiro": {
                "oferenda": "Vinho tinto seco, rosas escuras no cruzeiro, velas pretas e roxas firmadas no chão, padê de carvão e mel.",
                "cores": "Preto fosco, Vermelho escuro, Bordô, Roxo profundo e Marrom-terra.",
                "dia": "Segunda-feira ou Sábado de Calunga",
                "horario": "00:00 às 03:00 (Madrugada do Cruzeiro)",
                "signo": "Capricórnio / Saturno / Omolu (Estabilização de almas e corte de laços doentios)",
                "badge": "Senhora do Cruzeiro"
        },
        "pombagira cacurucaia": {
                "oferenda": "Vinho tinto seco, rosas escuras no cruzeiro, velas pretas e roxas firmadas no chão, padê de carvão e mel.",
                "cores": "Preto fosco, Vermelho escuro, Bordô, Roxo profundo e Marrom-terra.",
                "dia": "Segunda-feira ou Sábado de Calunga",
                "horario": "00:00 às 03:00 (Madrugada do Cruzeiro)",
                "signo": "Capricórnio / Saturno / Omolu (Estabilização de almas e corte de laços doentios)",
                "badge": "Senhora do Cruzeiro"
        },
        "calunga": {
                "oferenda": "Vinho de uva doce, cigarros, rosas escuras sem pétalas, padê de mel e pó de ferro, turmalina negra.",
                "cores": "Preto absoluto, Roxo túmulo, Cinza cinzas, Branco osso e Vermelho ancestral.",
                "dia": "Sábado",
                "horario": "03:33 ou Sexta-feira à meia-noite profunda",
                "signo": "Escorpião / Omolu (Silêncio curativo, ancestralidade e encerramento kármico)",
                "badge": "Eternidade & Silêncio"
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

        // Skip banner cards that lack accordion elements
        if (!trigger || !content) return;

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(otherItem => {
                const otherTrigger = otherItem.querySelector('.faq-trigger');
                const otherContent = otherItem.querySelector('.faq-content');
                if (!otherTrigger || !otherContent) return;
                otherItem.classList.remove('active');
                otherTrigger.setAttribute('aria-expanded', 'false');
                otherContent.style.maxHeight = null;
            });

            // Toggle active item
            if (!isActive) {
                item.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = '1000px';
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
       10. LUXURY SLIDESHOW CONTROLLER (HERO)
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
            btn2Href: "https://pombagiras.com/alexiamelusine/"
        },
        {
            kicker: "Oráculo & Tradição",
            title: "Mistério das Lebaras",
            desc: "Conheça as falanges e linhas de atuação espiritual das guardiãs de esquerda. Um dicionário litúrgico e histórico profundo detalhando oferendas, dias de poder e arquétipos cósmicos.",
            btn1Text: "Explorar Guardiãs",
            btn1Href: "#portal",
            btn2Text: "Conhecer a Autora",
            btn2Href: "https://pombagiras.com/alexiamelusine/"
        },
        {
            kicker: "Mitos & Teologia Consciente",
            title: "Perguntas & Respostas",
            desc: "Desmistificando preconceitos e tirando dúvidas teológicas sobre a esquerda com rigor, clareza e desconstrução filosófica de visões deturpadas e preconceituosas.",
            btn1Text: "Acessar FAQ",
            btn1Href: "#portal",
            btn2Text: "Conhecer a Autora",
            btn2Href: "https://pombagiras.com/alexiamelusine/"
        },
        {
            kicker: "Ciência & Ocultismo",
            title: "Segredos Revelados",
            desc: "Fatos históricos intrigantes, curiosidades liturgicamente corretas e o papel psicoterapêutico das guardiãs na evolução e equilíbrio mental humano.",
            btn1Text: "Ver Curiosidades",
            btn1Href: "#portal",
            btn2Text: "Conhecer a Autora",
            btn2Href: "https://pombagiras.com/alexiamelusine/"
        },
        {
            kicker: "Conexão & Egrégora",
            title: "Comunidade de Lebarás",
            desc: "Junte-se à nossa egrégora no Telegram, WhatsApp, Discord e Spotify. Conecte-se com a diretora Alexia Melusine para partilhar conhecimento consciente e arte visceral.",
            btn1Text: "Sobre a Autora",
            btn1Href: "https://pombagiras.com/alexiamelusine/",
            btn2Text: "Entrar no Canal",
            btn2Href: "https://t.me/pomba_giras"
        },
        {
            kicker: "Cultura & Identidade",
            title: "Arte Visceral e Sagrada",
            desc: "Expressão estética refinada que celebra a força ancestral. Um percurso visual e literário pelas representações mais impactantes das guardiãs de caminho.",
            btn1Text: "Explorar Portal",
            btn1Href: "#portal",
            btn2Text: "Conhecer a Autora",
            btn2Href: "https://pombagiras.com/alexiamelusine/"
        },
        {
            kicker: "Mistérios Femininos",
            title: "O Empoderamento Ancestral",
            desc: "A representação da autonomia feminina e da soberania espiritual. Entidades que guiam caminhos, promovem justiça e iluminam as sombras humanas.",
            btn1Text: "Explorar Portal",
            btn1Href: "#portal",
            btn2Text: "Conhecer a Autora",
            btn2Href: "https://pombagiras.com/alexiamelusine/"
        },
        {
            kicker: "Evolução & Egrégora",
            title: "Caminhos Abertos",
            desc: "Orientação e sabedoria milenar para romper barreiras e desfazer entraves. A força de esquerda atuando no equilíbrio kármico e na autotransformação.",
            btn1Text: "Explorar Portal",
            btn1Href: "#portal",
            btn2Text: "Conhecer a Autora",
            btn2Href: "https://pombagiras.com/alexiamelusine/"
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
        const slideDuration = 3500; // 3.5 seconds per photo
        let isPaused = false;
 
        const showSlide = (index) => {
            if (index < 0 || index >= slides.length) return;
            if (index === currentSlide && slides[index].classList.contains('active')) return;
 
            // Transição elegante do conteúdo textual
            if (heroContent && heroContentData[index]) {
                heroContent.classList.add('fade-out');
                
                setTimeout(() => {
                    const data = heroContentData[index];
                    if (kickerEl) kickerEl.textContent = data.kicker;
                    if (titleEl) titleEl.textContent = data.title;
                    if (descEl) descEl.textContent = data.desc;
                    if (btnOutlineEl) {
                        btnOutlineEl.textContent = data.btn2Text || "Conhecer a Autora";
                        btnOutlineEl.href = data.btn2Href || "https://pombagiras.com/alexiamelusine/";
                        if (data.btn2Href && data.btn2Href.startsWith('http')) {
                            btnOutlineEl.target = "_blank";
                            btnOutlineEl.rel = "noopener";
                        } else {
                            btnOutlineEl.removeAttribute('target');
                            btnOutlineEl.removeAttribute('rel');
                        }
                    }
                    heroContent.classList.remove('fade-out');
                }, 300);
            }
 
            // Atualiza slides
            slides.forEach((slide, i) => {
                slide.classList.remove('leaving');
                if (slide.classList.contains('active')) {
                    slide.classList.remove('active');
                    slide.classList.add('leaving');
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
                slideInterval = null;
            }
        };
 
        window.showHeroSlide = (index) => {
            showSlide(index);
            startSlideShow();
        };
 
        // Clicar nos indicadores para mudar de foto manualmente
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const targetIndex = parseInt(indicator.getAttribute('data-index'), 10);
                if (!isNaN(targetIndex)) {
                    window.showHeroSlide(targetIndex);
                }
            });
        });

        // Hover events
        if (heroWrapper) {
            heroWrapper.addEventListener('mouseenter', () => {
                isPaused = true;
            });

            heroWrapper.addEventListener('mouseleave', () => {
                isPaused = false;
                startSlideShow();
            });
        }

        // Inicia o slideshow automaticamente
        startSlideShow();
    }
});

