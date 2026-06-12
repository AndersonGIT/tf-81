/* ================================================================
   TF-81 DESIGN SYSTEM — INTERACTIVE BEHAVIOR
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── DS SIDEBAR NAVIGATION ──────────────────────────────────── */
  const sidebar  = document.getElementById('ds-sidebar');
  const mainArea = document.getElementById('ds-main');
  const toggleBtn = document.getElementById('ds-sidebar-toggle');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      mainArea?.classList.toggle('sidebar-collapsed');
    });
  }

  /* ── SCROLL SPY ──────────────────────────────────────────────── */
  const sections = document.querySelectorAll('[data-section]');
  const navLinks = document.querySelectorAll('.ds-nav-link');

  const observerOpts = { rootMargin: '-20% 0px -70% 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOpts);

  sections.forEach(sec => observer.observe(sec));

  /* ── SMOOTH SCROLL ───────────────────────────────────────────── */
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ── COLOR COPY TO CLIPBOARD ─────────────────────────────────── */
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', async () => {
      const text = el.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(text);
        const original = el.textContent;
        el.textContent = 'COPIADO!';
        el.style.color = 'var(--primitive-green-300)';
        setTimeout(() => {
          el.textContent = original;
          el.style.color = '';
        }, 1500);
      } catch {
        /* silently fail */
      }
    });
  });

  /* ── TABS ────────────────────────────────────────────────────── */
  document.querySelectorAll('.tab-list').forEach(tabList => {
    const buttons = tabList.querySelectorAll('.tab-btn');
    const panelsContainer = tabList.closest('.tabs');
    const panels = panelsContainer?.querySelectorAll('.tab-panel');

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels?.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (panels && panels[i]) panels[i].classList.add('active');
      });
    });
  });

  /* ── ALERT DISMISS ───────────────────────────────────────────── */
  document.querySelectorAll('.alert-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const alert = btn.closest('.alert');
      if (alert) {
        alert.style.transition = 'opacity 0.25s, transform 0.25s';
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(16px)';
        setTimeout(() => alert.remove(), 300);
      }
    });
  });

  /* ── MODAL ───────────────────────────────────────────────────── */
  document.querySelectorAll('[data-modal-open]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const id = trigger.getAttribute('data-modal-open');
      const backdrop = document.getElementById(id);
      if (backdrop) backdrop.classList.add('open');
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', e => {
      if (e.target === backdrop) backdrop.classList.remove('open');
    });
    backdrop.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => backdrop.classList.remove('open'));
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(b => b.classList.remove('open'));
    }
  });

  /* ── ANIMATED COUNTERS ───────────────────────────────────────── */
  function animateCounter(el) {
    const target  = parseInt(el.getAttribute('data-count'), 10);
    const duration = parseInt(el.getAttribute('data-duration') || '1200', 10);
    const start = performance.now();
    const prefix  = el.getAttribute('data-prefix') || '';
    const suffix  = el.getAttribute('data-suffix') || '';

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      el.textContent = prefix + Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ── AMMO COUNTER DEMO ───────────────────────────────────────── */
  document.querySelectorAll('.ammo-demo-fire').forEach(btn => {
    btn.addEventListener('click', () => {
      const counter = btn.closest('.ammo-demo')?.querySelector('.ammo-counter');
      if (!counter) return;
      const rounds = counter.querySelectorAll('.ammo-round:not(.spent)');
      if (rounds.length > 0) rounds[rounds.length - 1].classList.add('spent');
    });
  });

  document.querySelectorAll('.ammo-demo-reload').forEach(btn => {
    btn.addEventListener('click', () => {
      const counter = btn.closest('.ammo-demo')?.querySelector('.ammo-counter');
      if (!counter) return;
      counter.querySelectorAll('.ammo-round').forEach(r => r.classList.remove('spent'));
    });
  });

  /* ── PROGRESS BAR AUTO-ANIMATE ───────────────────────────────── */
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.progress-fill');
        if (fill) {
          const target = fill.getAttribute('data-width') || fill.style.width;
          fill.style.width = '0%';
          requestAnimationFrame(() => {
            setTimeout(() => { fill.style.width = target; }, 50);
          });
        }
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.progress-track').forEach(track => {
    const fill = track.querySelector('.progress-fill');
    if (fill) {
      fill.setAttribute('data-width', fill.style.width);
      fill.style.width = '0%';
      progressObserver.observe(track);
    }
  });

  /* ── TOAST DEMO ──────────────────────────────────────────────── */
  window.tf81ShowToast = function(message, type = 'info', title = '') {
    const container = document.getElementById('toast-container') || (() => {
      const c = document.createElement('div');
      c.id = 'toast-container';
      c.className = 'toast-container';
      document.body.appendChild(c);
      return c;
    })();

    const icons = {
      success: `<svg width="20" height="20" fill="none" stroke="var(--primitive-green-400)" stroke-width="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>`,
      danger:  `<svg width="20" height="20" fill="none" stroke="var(--primitive-red-400)" stroke-width="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
      warning: `<svg width="20" height="20" fill="none" stroke="var(--primitive-yellow-500)" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>`,
      info:    `<svg width="20" height="20" fill="none" stroke="var(--primitive-blue-300)" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>`
    };

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-body">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-text">${message}</div>
      </div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s, transform 0.3s';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 350);
    }, 3500);
  };

});
