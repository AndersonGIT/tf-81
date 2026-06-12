/* ================================================================
   TF-81 DESIGN SYSTEM — INTERACTIVE BEHAVIOR
   v1.1 — Responsive + Theme System
   ================================================================ */

/* ── THEME SYSTEM ────────────────────────────────────────────── */

const THEME_KEY = 'tf81-theme';
const html      = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  updateThemeToggles(theme);
}

function getStoredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function updateThemeToggles(theme) {
  const isDark = theme === 'dark';
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    const label = btn.querySelector('.theme-toggle-label');
    const icon  = btn.querySelector('.theme-icon-dark');
    const iconL = btn.querySelector('.theme-icon-light');
    if (label) label.textContent = isDark ? 'Dark' : 'Light';
    if (icon)  icon.style.display  = isDark ? 'block' : 'none';
    if (iconL) iconL.style.display = isDark ? 'none'  : 'block';
    btn.setAttribute('aria-label', isDark ? 'Ativar modo claro' : 'Ativar modo escuro');
  });
}

function toggleTheme() {
  const current = html.getAttribute('data-theme') || 'dark';
  const next    = current === 'dark' ? 'light' : 'dark';

  /* Smooth transition */
  document.body.classList.add('theme-transitioning');
  applyTheme(next);
  setTimeout(() => document.body.classList.remove('theme-transitioning'), 350);
}

/* Init theme before DOM load to prevent flash */
applyTheme(getStoredTheme());

/* ── DOM READY ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── THEME TOGGLE BUTTONS ──────────────────────────────────── */
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  /* Sync initial state */
  updateThemeToggles(getStoredTheme());

  /* Listen for system preference changes */
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });

  /* ── DS SIDEBAR ──────────────────────────────────────────────── */
  const sidebar     = document.getElementById('ds-sidebar');
  const overlay     = document.getElementById('ds-overlay');
  const toggleBtn   = document.getElementById('ds-sidebar-toggle');

  function openSidebar() {
    sidebar?.classList.add('open');
    sidebar?.classList.remove('collapsed');
    overlay?.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('visible');
    document.body.style.overflow = '';
  }
  function isMobile() { return window.innerWidth < 768; }

  toggleBtn?.addEventListener('click', () => {
    const isOpen = sidebar?.classList.contains('open');
    if (isMobile()) {
      isOpen ? closeSidebar() : openSidebar();
    } else {
      sidebar?.classList.toggle('collapsed');
      document.getElementById('ds-main')?.classList.toggle('sidebar-collapsed');
    }
  });

  overlay?.addEventListener('click', closeSidebar);

  /* Close on resize if going to desktop */
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      closeSidebar();
      document.body.style.overflow = '';
    }
  });

  /* ── SCROLL SPY ──────────────────────────────────────────────── */
  const sections = document.querySelectorAll('[data-section]');
  const navLinks = document.querySelectorAll('.ds-nav-link');

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(sec => spy.observe(sec));

  /* ── SMOOTH SCROLL ───────────────────────────────────────────── */
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        if (isMobile()) closeSidebar();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── COLOR COPY ──────────────────────────────────────────────── */
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', async () => {
      const text = el.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(text);
        const orig = el.textContent;
        el.textContent = 'COPIADO!';
        el.style.color = html.getAttribute('data-theme') === 'light' ? '#2A6018' : 'var(--primitive-green-300)';
        setTimeout(() => { el.textContent = orig; el.style.color = ''; }, 1500);
      } catch { /* silently fail */ }
    });
  });

  /* ── TABS ────────────────────────────────────────────────────── */
  document.querySelectorAll('.tab-list').forEach(tabList => {
    const btns   = tabList.querySelectorAll('.tab-btn');
    const panels = tabList.closest('.tabs')?.querySelectorAll('.tab-panel');
    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        panels?.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (panels?.[i]) panels[i].classList.add('active');
      });
    });
  });

  /* ── ALERT DISMISS ───────────────────────────────────────────── */
  document.querySelectorAll('.alert-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const alert = btn.closest('.alert');
      if (!alert) return;
      alert.style.transition = 'opacity .25s, transform .25s';
      alert.style.opacity    = '0';
      alert.style.transform  = 'translateX(16px)';
      setTimeout(() => alert.remove(), 280);
    });
  });

  /* ── MODAL ───────────────────────────────────────────────────── */
  document.querySelectorAll('[data-modal-open]').forEach(t => {
    t.addEventListener('click', () => {
      document.getElementById(t.getAttribute('data-modal-open'))?.classList.add('open');
    });
  });
  document.querySelectorAll('.modal-backdrop').forEach(bd => {
    bd.addEventListener('click', e => { if (e.target === bd) bd.classList.remove('open'); });
    bd.querySelectorAll('[data-modal-close]').forEach(b => {
      b.addEventListener('click', () => bd.classList.remove('open'));
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(b => b.classList.remove('open'));
    }
  });

  /* ── ANIMATED COUNTERS ───────────────────────────────────────── */
  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-count'), 10);
    const duration = parseInt(el.getAttribute('data-duration') || '1200', 10);
    const prefix   = el.getAttribute('data-prefix') || '';
    const suffix   = el.getAttribute('data-suffix') || '';
    const start    = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3); /* ease-out cubic */
      el.textContent = prefix + Math.round(e * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const cntObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animateCounter(entry.target);
        cntObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => cntObs.observe(el));

  /* ── AMMO COUNTER ────────────────────────────────────────────── */
  document.querySelectorAll('.ammo-demo-fire').forEach(btn => {
    btn.addEventListener('click', () => {
      const rounds = btn.closest('.ammo-demo')
        ?.querySelector('.ammo-counter')
        ?.querySelectorAll('.ammo-round:not(.spent)');
      if (rounds?.length) rounds[rounds.length - 1].classList.add('spent');
    });
  });
  document.querySelectorAll('.ammo-demo-reload').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.ammo-demo')
        ?.querySelector('.ammo-counter')
        ?.querySelectorAll('.ammo-round')
        .forEach(r => r.classList.remove('spent'));
    });
  });

  /* ── PROGRESS AUTO-ANIMATE ───────────────────────────────────── */
  const progObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.progress-fill');
        if (fill) {
          const target = fill.getAttribute('data-width') || fill.style.width;
          fill.style.width = '0%';
          requestAnimationFrame(() => setTimeout(() => { fill.style.width = target; }, 50));
        }
        progObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.progress-track').forEach(track => {
    const fill = track.querySelector('.progress-fill');
    if (fill) {
      fill.setAttribute('data-width', fill.style.width);
      fill.style.width = '0%';
      progObs.observe(track);
    }
  });

  /* ── TOAST ───────────────────────────────────────────────────── */
  window.tf81ShowToast = function(message, type = 'info', title = '') {
    const container = document.getElementById('toast-container') || (() => {
      const c = document.createElement('div');
      c.id = 'toast-container';
      c.className = 'toast-container';
      document.body.appendChild(c);
      return c;
    })();

    const icons = {
      success: `<svg width="20" height="20" fill="none" stroke="var(--color-status-active)" stroke-width="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>`,
      danger:  `<svg width="20" height="20" fill="none" stroke="var(--color-status-danger)" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
      warning: `<svg width="20" height="20" fill="none" stroke="var(--color-status-warning)" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01"/></svg>`,
      info:    `<svg width="20" height="20" fill="none" stroke="var(--color-status-info)" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>`
    };

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-body">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-text">${message}</div>
      </div>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity .3s, transform .3s';
      toast.style.opacity    = '0';
      toast.style.transform  = 'translateX(100%)';
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  };

}); /* end DOMContentLoaded */
