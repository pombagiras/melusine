/**
 * POMBAGIRAS.COM — MÓDULO DE DONATIVOS & SUSTENTABILIDADE AUTÔNOMA
 * Interações: Custom Cursor Magnético, FAQ Accordion Acessível, Efeitos Dinâmicos
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Custom Cursor Desktop (Magnético e suave)
  const cursorRing = document.getElementById("cursor-ring");
  const cursorPoint = document.getElementById("cursor-point");
  const interactiveElements = document.querySelectorAll("a, button, .color-reveal-frame, .donation-card, .faq-trigger");

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && cursorRing && cursorPoint) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorPoint.style.left = `${mouseX}px`;
      cursorPoint.style.top = `${mouseY}px`;
    });

    const animateCursor = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => cursorRing.classList.add("hover-active"));
      el.addEventListener("mouseleave", () => cursorRing.classList.remove("hover-active"));
    });
  }

  // 2. FAQ Accordion Acessível (WAI-ARIA compliance)
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    const content = item.querySelector(".faq-content");

    if (trigger && content) {
      trigger.addEventListener("click", () => {
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";

        // Fecha outros itens para leitura focada
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove("active");
            const otherTrigger = other.querySelector(".faq-trigger");
            if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
          }
        });

        // Alterna o estado atual
        if (isExpanded) {
          item.classList.remove("active");
          trigger.setAttribute("aria-expanded", "false");
        } else {
          item.classList.add("active");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    }
  });

  // 3. Suporte a Links Âncora com Rolagem Suave
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId.length > 1) {
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
