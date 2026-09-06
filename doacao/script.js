/**
 * POMBAGIRAS.COM — Script Interativo da Página de Doação
 * Funções: Cursor personalizado, FAQ Accordion acessível, Efeitos hover dinâmicos
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Setup do Cursor Personalizado
    const cursor = document.getElementById("custom-cursor");
    const dot = document.getElementById("custom-cursor-dot");
    const interactives = document.querySelectorAll("a, button, .faq-question-btn, .interactive-el, .donation-card");

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && cursor && dot) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + "px";
            dot.style.top = mouseY + "px";
        });

        // Loop de interpolação suave para o anel do cursor
        const renderCursor = () => {
            cursorX += (mouseX - cursorX) * 0.18;
            cursorY += (mouseY - cursorY) * 0.18;
            cursor.style.left = cursorX + "px";
            cursor.style.top = cursorY + "px";
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);

        // Efeitos de Hover
        interactives.forEach(el => {
            el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
            el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
        });
    }

    // 2. FAQ Accordion Acessível
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const btn = item.querySelector(".faq-question-btn");
        const answer = item.querySelector(".faq-answer");

        if (btn && answer) {
            btn.addEventListener("click", () => {
                const isActive = item.classList.contains("active");

                // Fecha outros itens para foco limpo
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove("active");
                        const otherBtn = otherItem.querySelector(".faq-question-btn");
                        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
                    }
                });

                // Alterna o estado do item atual
                if (isActive) {
                    item.classList.remove("active");
                    btn.setAttribute("aria-expanded", "false");
                } else {
                    item.classList.add("active");
                    btn.setAttribute("aria-expanded", "true");
                }
            });
        }
    });

    // 3. Efeito Sutil de Destaque Dinâmico nos Cards de Doação
    const cards = document.querySelectorAll(".donation-card, .donation-card-featured");
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        cards.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            });
        });
    }

    // 4. Suporte a Links Âncora com Rolagem Suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        });
    });
});
