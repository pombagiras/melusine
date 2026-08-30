// GIRA subpage.js - Individual Pombagira Page JS
// Custom cursor, nav, page loader, reveal

// Page Loader
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.classList.add('loaded');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }
  }, 900);
});

// Custom Cursor
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  document.body.classList.add('cursor-moved');
  if (cursorDot) { cursorDot.style.left = mouseX + 'px'; cursorDot.style.top = mouseY + 'px'; }
});

function animateCursor() {
  const ease = 0.12;
  ringX += (mouseX - ringX) * ease;
  ringY += (mouseY - ringY) * ease;
  if (cursorRing) { cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px'; }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Nav Hamburger
const hamburger = document.getElementById('nav-hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
    hamburger.setAttribute('aria-expanded', document.body.classList.contains('nav-open'));
  });
}

// Scroll Reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Mobile: disable cursor on touch
window.addEventListener('touchstart', () => {
  if (cursorDot) cursorDot.style.display = 'none';
  if (cursorRing) cursorRing.style.display = 'none';
  document.body.style.cursor = '';
}, { once: true });

// Email Click to Copy
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

// Keyboard: close nav on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
    document.body.classList.remove('nav-open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
  }
});
