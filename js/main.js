/* ============================================================
   nutcracker.sh — main.js
   ============================================================ */

(function () {
  'use strict';

  // ── Navbar scroll effect ──────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // ── Mobile nav toggle ─────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    const spans = navToggle.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.querySelectorAll('span').forEach(s => {
        s.style.transform = ''; s.style.opacity = '';
      });
    });
  });

  // ── Active nav link on scroll ─────────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));

  // ── Tab switching ─────────────────────────────────────────
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + target)?.classList.add('active');
    });
  });

  // ── Copy buttons ──────────────────────────────────────────
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy ||
        btn.closest('.code-block')?.querySelector('pre')?.textContent || '';

      navigator.clipboard.writeText(text.trim()).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copied'); }, 1800);
      }).catch(() => {
        // fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text.trim();
        ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      });
    });
  });

  // ── Fade-in on scroll ─────────────────────────────────────
  const fadeEls = document.querySelectorAll(
    '.feature-card, .doc-card, .usage-block, .features-detail, .cta-card, .hero-stats, .section-header'
  );

  fadeEls.forEach(el => el.classList.add('fade-in'));

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  fadeEls.forEach(el => fadeObserver.observe(el));

  // ── Typewriter effect for terminal lines ──────────────────
  function typewriterTerminal() {
    const lines = document.querySelectorAll('#terminalLines .t-line');
    lines.forEach((line, i) => {
      line.style.opacity = '0';
      line.style.transform = 'translateX(-4px)';
      line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    let delay = 400;
    lines.forEach((line, i) => {
      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transform = 'none';
      }, delay);
      delay += i % 2 === 0 ? 180 : 80;
    });
  }

  // Trigger typewriter once when terminal enters view
  const terminalEl = document.querySelector('.hero-terminal');
  if (terminalEl) {
    const termObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        typewriterTerminal();
        termObs.disconnect();
      }
    }, { threshold: 0.3 });
    termObs.observe(terminalEl);
  }

  // ── Smooth anchor scroll (fallback for older browsers) ────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : document.body;
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
