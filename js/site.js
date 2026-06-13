/* ================================================================
   TF-81 SITE PÚBLICO — COMPORTAMENTO E CARREGAMENTO DINÂMICO
   ----------------------------------------------------------------
   Os dados são mocados em /data/*.json e carregados via fetch
   (AJAX). Quando o backend .NET Core existir, basta apontar
   DATA_BASE para a API (ou para o repositório GitHub temporário).
   ================================================================ */

(function () {
  'use strict';

  /* ── CONFIGURAÇÃO DE DADOS ─────────────────────────────────── */
  /* Fase atual: arquivos locais. Fase 2: raw.githubusercontent.com.
     Fase 3: API .NET Core.                                        */
  const DATA_BASE = '../data';

  const dataCache = {};

  async function fetchJSON(nome) {
    if (dataCache[nome]) return dataCache[nome];
    const resposta = await fetch(`${DATA_BASE}/${nome}.json`, { cache: 'no-store' });
    if (!resposta.ok) {
      throw new Error(`Falha ao carregar ${nome}.json (HTTP ${resposta.status})`);
    }
    const dados = await resposta.json();
    dataCache[nome] = dados;
    return dados;
  }

  /* Escapa texto vindo dos dados antes de inserir no HTML */
  function esc(valor) {
    return String(valor ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function setHTML(seletor, html) {
    const el = document.querySelector(seletor);
    if (el) el.innerHTML = html;
    return el;
  }

  function mostrarErro(seletor, mensagem) {
    setHTML(seletor, `<div class="site-data-error">⚠ ${esc(mensagem)}</div>`);
  }

  /* ── TEMA (dark/light) ─────────────────────────────────────── */
  const THEME_KEY = 'tf81-theme';
  const html = document.documentElement;

  function aplicarTema(tema) {
    html.setAttribute('data-theme', tema);
    localStorage.setItem(THEME_KEY, tema);
  }

  function temaInicial() {
    const salvo = localStorage.getItem(THEME_KEY);
    if (salvo) return salvo;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  aplicarTema(temaInicial());

  function alternarTema() {
    const atual = html.getAttribute('data-theme') || 'dark';
    aplicarTema(atual === 'dark' ? 'light' : 'dark');
  }

  /* ── ÍCONES SVG REUTILIZÁVEIS ──────────────────────────────── */
  const ICONES = {
    youtube: '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.5a3 3 0 00-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 00.5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 002.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 002.1-2.1C24 15.6 24 12 24 12s0-3.6-.5-5.5zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>',
    instagram: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    facebook: '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>',
    play: '<svg width="14" height="14" fill="rgba(7,7,10,0.9)" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21"/></svg>',
    camera: '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24" style="color:rgba(196,150,26,0.25)"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>',
    imagem: '<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24" style="color:rgba(196,150,26,0.2)"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    olho: '<svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    coracao: '<svg class="blog-like-btn__icon" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
    fechar: '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    anterior: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>',
    proximo: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>',
    hamburger: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    tema: '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"/></svg>'
  };

  function iconeRede(id) {
    return ICONES[id] || ICONES.instagram;
  }

  /* ── COMPONENTE: NAVBAR + DRAWER ───────────────────────────── */
  const LINKS_NAV = [
    { id: 'home',         rotulo: 'Início',       href: './index.html' },
    { id: 'efetivo',      rotulo: 'Efetivo',      href: './efetivo.html' },
    { id: 'blog',         rotulo: 'Blog',         href: './blog.html' },
    { id: 'galeria',      rotulo: 'Galeria',      href: './galeria.html' },
    { id: 'midia',        rotulo: 'Mídia',        href: './midia.html' },
    { id: 'recrutamento', rotulo: 'Recrutamento', href: './recrutamento.html' }
  ];

  const LOGO = '../assets/img/Patch de Apresentação TF81 - vFinal.png';

  function renderNavbar(paginaAtiva) {
    const ativos = { operador: 'efetivo', 'blog-post': 'blog' };
    const ativa = ativos[paginaAtiva] || paginaAtiva;

    const links = LINKS_NAV.map(l =>
      `<a href="${l.href}" class="site-nav__link${l.id === ativa ? ' site-nav__link--active' : ''}">${l.rotulo}</a>`
    ).join('');

    const drawerLinks = LINKS_NAV.map(l =>
      `<a href="${l.href}" class="site-nav__drawer-link${l.id === ativa ? ' site-nav__drawer-link--active' : ''}">${l.rotulo}</a>`
    ).join('');

    return `
      <nav class="site-nav" id="site-nav">
        <div class="site-nav__inner">
          <a href="./index.html" class="site-nav__brand">
            <img src="${LOGO}" alt="Patch da Task Force 81" class="site-nav__brand-logo">
            <div class="site-nav__brand-text">
              <span class="site-nav__brand-name">Task Force 81</span>
              <span class="site-nav__brand-tagline">// Operações Táticas</span>
            </div>
          </a>
          <div class="site-nav__links">${links}</div>
          <div class="site-nav__actions">
            <button class="btn btn-ghost btn-sm" data-theme-toggle aria-label="Alternar tema" title="Alternar tema">${ICONES.tema}</button>
            <a href="#" class="btn btn-ghost btn-sm">Área do Operador</a>
            <a href="./recrutamento.html" class="btn btn-primary btn-sm">Quero me alistar</a>
          </div>
          <button class="site-nav__hamburger" id="site-nav-hamburger" aria-label="Abrir menu">${ICONES.hamburger}</button>
        </div>
      </nav>
      <div class="site-nav__drawer-overlay" id="site-nav-overlay"></div>
      <aside class="site-nav__drawer" id="site-nav-drawer" aria-label="Menu de navegação">
        <div class="site-nav__drawer-header">
          <a href="./index.html" class="site-nav__brand">
            <img src="${LOGO}" alt="Patch da Task Force 81" class="site-nav__brand-logo" style="width:28px;height:28px;">
            <span class="site-nav__brand-name" style="font-size:var(--text-sm);">TF-81</span>
          </a>
          <button class="site-nav__drawer-close" id="site-nav-drawer-close" aria-label="Fechar menu">${ICONES.fechar}</button>
        </div>
        <div class="site-nav__drawer-links">${drawerLinks}</div>
        <div class="site-nav__drawer-footer">
          <button class="btn btn-ghost btn-sm" data-theme-toggle style="width:100%;justify-content:center;">Alternar tema</button>
          <a href="#" class="btn btn-ghost btn-sm" style="width:100%;justify-content:center;">Área do Operador</a>
          <a href="./recrutamento.html" class="btn btn-primary btn-sm" style="width:100%;justify-content:center;">Quero me alistar</a>
        </div>
      </aside>`;
  }

  /* ── COMPONENTE: FOOTER ────────────────────────────────────── */
  function renderFooter(redes) {
    const botoesSociais = redes.map(r =>
      `<a href="${esc(r.url)}" class="site-footer__social-btn" title="${esc(r.nome)}" target="_blank" rel="noopener noreferrer">${iconeRede(r.id)}</a>`
    ).join('');

    const linhasSociais = redes.map(r =>
      `<a href="${esc(r.url)}" class="site-footer__social-row" target="_blank" rel="noopener noreferrer">${iconeRede(r.id)} ${esc(r.nome)}</a>`
    ).join('');

    const linksNavegacao = LINKS_NAV.map(l =>
      `<a href="${l.href}" class="site-footer__link">${l.rotulo}</a>`
    ).join('');

    return `
      <footer class="site-footer">
        <div class="site-footer__inner">
          <div class="site-footer__top">
            <div class="site-footer__col">
              <div class="site-footer__brand">
                <div class="site-footer__brand-identity">
                  <img src="${LOGO}" alt="Patch da Task Force 81" class="site-footer__brand-logo" loading="lazy">
                  <div>
                    <div class="site-footer__brand-name">Task Force 81</div>
                    <div class="site-footer__brand-sub">// Operações Táticas</div>
                  </div>
                </div>
                <p class="site-footer__brand-desc">Task Force 81 é uma equipe de airsoft profissional sediada no Brasil, com foco em táticas realistas, treinamento contínuo e espírito de equipe.</p>
                <div class="site-footer__socials">${botoesSociais}</div>
              </div>
            </div>
            <div class="site-footer__col">
              <div class="site-footer__heading">Navegação</div>
              <div class="site-footer__links">${linksNavegacao}</div>
            </div>
            <div class="site-footer__col">
              <div class="site-footer__heading">Contato</div>
              <p class="site-footer__info-text">Dúvidas, parcerias e solicitações de contato são respondidas exclusivamente via redes sociais.</p>
              <div class="site-footer__links" style="margin-top:var(--space-2);">
                <a href="https://instagram.com/tf81airsoft" class="site-footer__link" target="_blank" rel="noopener noreferrer">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 2H3v20l4-4h14V2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="13" y2="14"/></svg>
                  Instagram DM
                </a>
                <span class="site-footer__link">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Resposta em até 48h
                </span>
              </div>
            </div>
            <div class="site-footer__col">
              <div class="site-footer__heading">Siga-nos</div>
              <div class="site-footer__links">${linhasSociais}</div>
            </div>
          </div>
          <hr class="site-footer__divider">
          <div class="site-footer__bottom">
            <span class="site-footer__copyright">© 2026 Task Force 81 — Todos os direitos reservados</span>
            <span class="site-footer__disclaimer">Site fictício para fins recreativos de airsoft</span>
          </div>
        </div>
      </footer>`;
  }

  /* ── COMPORTAMENTOS GLOBAIS ────────────────────────────────── */
  function iniciarNavbarScroll() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;
    const atualizar = () => nav.classList.toggle('site-nav--scrolled', window.scrollY > 20);
    window.addEventListener('scroll', atualizar, { passive: true });
    atualizar();
  }

  function iniciarDrawer() {
    const drawer = document.getElementById('site-nav-drawer');
    const overlay = document.getElementById('site-nav-overlay');
    const abrir = document.getElementById('site-nav-hamburger');
    const fechar = document.getElementById('site-nav-drawer-close');
    if (!drawer || !overlay) return;

    function abrirDrawer() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function fecharDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    abrir?.addEventListener('click', abrirDrawer);
    fechar?.addEventListener('click', fecharDrawer);
    overlay.addEventListener('click', fecharDrawer);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') fecharDrawer();
    });
  }

  function iniciarTemaToggles() {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', alternarTema);
    });
  }

  /* Contadores animados — .hero__stat-value[data-target] */
  function iniciarContadores() {
    const stats = document.querySelector('.hero__stats');
    if (!stats) return;

    function animar(el) {
      const alvo = parseInt(el.getAttribute('data-target'), 10) || 0;
      const duracao = 1200;
      const inicio = performance.now();
      function quadro(agora) {
        const p = Math.min((agora - inicio) / duracao, 1);
        const easing = 1 - Math.pow(1 - p, 3); /* ease-out */
        el.textContent = Math.round(easing * alvo);
        if (p < 1) requestAnimationFrame(quadro);
      }
      requestAnimationFrame(quadro);
    }

    const obs = new IntersectionObserver(entradas => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          entrada.target.querySelectorAll('.hero__stat-value[data-target]').forEach(animar);
          obs.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.4 });

    obs.observe(stats);
  }

  /* Animações de entrada por scroll */
  const obsEntrada = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('is-visible');
        obsEntrada.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  function observarAnimacoes(raiz) {
    (raiz || document).querySelectorAll('.animate-on-scroll:not(.is-visible)').forEach(el => obsEntrada.observe(el));
  }

  /* ── TEMPLATES DE CARDS ────────────────────────────────────── */

  function cardSociais(membro) {
    if (!membro.sociais || !membro.sociais.length) return '';
    const links = membro.sociais.map(s =>
      `<a href="${esc(s.url)}" class="crew-card__social-link" title="${esc(s.tipo)}" target="_blank" rel="noopener noreferrer">${iconeRede(s.tipo)}</a>`
    ).join('');
    return `<div class="crew-card__socials">${links}</div>`;
  }

  function cardEspecialidades(membro) {
    if (!membro.especialidades || !membro.especialidades.length) return '';
    const chips = membro.especialidades.map(e => `<span class="crew-card__specialty">${esc(e)}</span>`).join('');
    return `<div class="crew-card__specialties">${chips}</div>`;
  }

  /* Card de membro do efetivo. EM = <div> (sem link no card todo). */
  function cardMembro(membro) {
    const nivel = membro.nivel === 'EM' ? 'em' : membro.nivel === 'REC' ? 'rec' : 'op';
    const url = `./operador.html?id=${encodeURIComponent(membro.id)}`;
    const tag = nivel === 'em' ? 'div' : 'a';
    const href = nivel === 'em' ? '' : ` href="${url}"`;
    const rotuloCta = nivel === 'rec' ? 'Ver perfil →' : 'Ver perfil completo →';
    const cta = nivel === 'em'
      ? `<a href="${url}" class="crew-card__cta" style="text-decoration:none;">${rotuloCta}</a>`
      : `<div class="crew-card__cta">${rotuloCta}</div>`;

    return `
      <${tag}${href} class="crew-card animate-on-scroll">
        <div class="crew-card__cover" style="background:${membro.gradiente}">
          <div class="crew-card__avatar-wrap">
            <div class="crew-card__avatar crew-card__avatar--${nivel}">
              <div class="crew-card__avatar-placeholder"${nivel === 'rec' ? ' style="font-size:var(--text-lg)"' : ''}>${esc(membro.iniciais)}</div>
            </div>
          </div>
        </div>
        <div class="crew-card__body">
          <div class="crew-card__rank crew-card__rank--${nivel}">${esc(membro.posto)}</div>
          <div class="crew-card__name">${esc(membro.nome)}</div>
          <div class="crew-card__callsign">// ${esc(membro.callsign)}</div>
          ${cardEspecialidades(membro)}
          <div class="crew-card__stats">
            <div class="crew-card__stat">
              <span class="crew-card__stat-value">${esc(membro.operacoes)}</span>
              <span class="crew-card__stat-label">Operações</span>
            </div>
            <div class="crew-card__stat">
              <span class="crew-card__stat-value">${esc(membro.desde)}</span>
              <span class="crew-card__stat-label">Desde</span>
            </div>
          </div>
          ${nivel === 'em' ? cardSociais(membro) : ''}
          ${cta}
        </div>
      </${tag}>`;
  }

  function tierEfetivo(rotulo, classeBadge, simbolo, membros, classeGrid) {
    if (!membros.length) return '';
    const cards = membros.map(cardMembro).join('');
    return `
      <div class="crew-tier">
        <div class="crew-tier__hd">
          <span class="crew-tier__badge crew-tier__badge--${classeBadge}">${simbolo} ${rotulo}</span>
          <span class="crew-tier__count">${membros.length} ${membros.length === 1 ? 'membro' : 'membros'}</span>
          <div class="crew-tier__line"></div>
        </div>
        <div class="crew-grid${classeGrid ? ' ' + classeGrid : ''}">${cards}</div>
      </div>`;
  }

  /* Card de post do blog (grid) */
  function cardPost(post, horizontal) {
    return `
      <a href="./blog-post.html?id=${encodeURIComponent(post.id)}" class="blog-card${horizontal ? ' blog-card--h' : ''} animate-on-scroll" data-categoria="${esc(post.categoria)}">
        <div class="blog-card__img blog-card__img--placeholder" style="background:${post.gradiente}">
          <div class="blog-card__cat-overlay"><span class="blog-tag blog-tag--${esc(post.categoria)}">${esc(post.categoriaLabel)}</span></div>
          ${ICONES.imagem}
        </div>
        <div class="blog-card__body">
          <div class="blog-card__title">${esc(post.titulo)}</div>
          <div class="blog-card__excerpt">${esc(post.resumo)}</div>
        </div>
        <div class="blog-card__footer">
          <div class="blog-card__author"><div class="avatar avatar--xs avatar--gold">${esc(post.autorIniciais.charAt(0))}</div>${esc(post.autorNome)}</div>
          <div class="blog-card__meta">
            <span>${esc(post.data)}</span><span>·</span><span>${esc(post.leitura)}</span>
            <span class="blog-view-count">${ICONES.olho}${esc(post.views)}</span>
          </div>
        </div>
      </a>`;
  }

  /* Post em destaque (hero do blog) */
  function heroPost(post) {
    return `
      <a href="./blog-post.html?id=${encodeURIComponent(post.id)}" class="blog-hero blog-hero--no-img animate-on-scroll" style="background:${post.gradiente}">
        <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(196,150,26,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(196,150,26,0.04) 1px,transparent 1px);background-size:40px 40px;pointer-events:none"></div>
        <div class="blog-hero__body">
          <div class="blog-hero__top">
            <span class="blog-featured-badge">
              <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Destaque
            </span>
            <span class="blog-tag blog-tag--${esc(post.categoria)}">${esc(post.categoriaLabel)}</span>
          </div>
          <div class="blog-hero__title">${esc(post.titulo)}</div>
          <div class="blog-hero__excerpt">${esc(post.resumo)}</div>
          <div class="blog-hero__meta">
            <div class="blog-hero__author">
              <div class="avatar avatar--xs avatar--gold">${esc(post.autorIniciais.charAt(0))}</div>
              ${esc(post.autorNome)} · ${esc(post.autorPosto)}
            </div>
            <div class="blog-hero__date">${esc(post.data)}</div>
            <div class="blog-hero__read-time">${esc(post.leitura)} leitura</div>
            <div class="blog-view-count">${ICONES.olho} ${esc(post.views)}</div>
          </div>
        </div>
      </a>`;
  }

  /* Item da galeria (foto) */
  function itemGaleria(foto, indice, variante) {
    return `
      <div class="gallery-item${variante ? ' gallery-item--' + variante : ''} animate-on-scroll" data-foto-indice="${indice}" role="button" tabindex="0" aria-label="Ampliar foto: ${esc(foto.titulo)}">
        <div class="gallery-item__img" style="background:${foto.gradiente};display:flex;align-items:center;justify-content:center;">${ICONES.camera}</div>
        <div class="gallery-item__overlay">
          <div class="gallery-item__title">${esc(foto.titulo)}</div>
          <div class="gallery-item__meta">${esc(foto.album)} · ${esc(foto.data)}</div>
        </div>
      </div>`;
  }

  /* Card de álbum */
  function cardAlbum(album) {
    const slides = album.fotos.slice(0, 3).map(f =>
      `<div class="album-card__slide" style="background:${f.gradiente}"></div>`
    ).join('');
    const variante = album.fotos.length === 1 ? ' album-card--single' : album.fotos.length === 2 ? ' album-card--two' : '';
    return `
      <a href="#" class="album-card${variante} animate-on-scroll" data-album-id="${esc(album.id)}" data-categoria="${esc(album.categoria)}">
        <div class="album-card__slides">${slides}</div>
        <div class="album-card__overlay"></div>
        <div class="album-card__body">
          <div class="album-card__name">${esc(album.nome)}</div>
          <div class="album-card__meta">${esc(album.data)} <span class="album-card__count">📷 ${album.fotos.length}</span></div>
        </div>
      </a>`;
  }

  /* Card de vídeo do YouTube */
  function cardVideo(video) {
    return `
      <a href="${esc(video.url)}" class="yt-card animate-on-scroll" target="_blank" rel="noopener noreferrer">
        <div class="yt-card__thumb">
          <div style="width:100%;height:100%;background:${video.gradiente}"></div>
          <div class="yt-card__play">${ICONES.play}</div>
          <span class="yt-card__duration">${esc(video.duracao)}</span>
        </div>
        <div class="yt-card__body">
          <div class="yt-card__channel">
            <div class="yt-card__channel-avatar" style="background:${video.canalGradiente}"></div>
            <span class="yt-card__channel-name">${esc(video.canalNome)}</span>
          </div>
          <div class="yt-card__title">${esc(video.titulo)}</div>
          <div class="yt-card__meta">
            <span class="yt-card__meta-item">${esc(video.views)}</span>
            <span class="yt-card__meta-item">·</span>
            <span class="yt-card__meta-item">${esc(video.data)}</span>
          </div>
        </div>
      </a>`;
  }

  function videoDestaque(video) {
    return `
      <a href="${esc(video.url)}" class="yt-featured animate-on-scroll" target="_blank" rel="noopener noreferrer" style="text-decoration:none;">
        <div class="yt-featured__thumb" style="background:${video.gradiente}"></div>
        <div class="yt-featured__play"><svg width="20" height="20" fill="rgba(7,7,10,0.9)" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21"/></svg></div>
        <div class="yt-featured__badge">★ Destaque</div>
        <div class="yt-featured__body">
          <div class="yt-featured__channel">
            <div class="yt-featured__channel-avatar" style="background:linear-gradient(135deg,#1A0A0A,#240808);width:24px;height:24px;border-radius:50%;border:1px solid rgba(255,255,255,0.2)"></div>
            <span class="yt-featured__channel-name">${esc(video.canalNome)}</span>
          </div>
          <h3 class="yt-featured__title">${esc(video.titulo)}</h3>
          <div class="yt-featured__meta">
            <span class="yt-featured__meta-item">${esc(video.views)}</span>
            <span class="yt-featured__meta-item">·</span>
            <span class="yt-featured__meta-item">${esc(video.data)}</span>
            <span class="yt-featured__meta-item">·</span>
            <span class="yt-featured__meta-item">${esc(video.duracao)}</span>
          </div>
        </div>
      </a>`;
  }

  function cardPlaylist(playlist) {
    return `
      <a href="${esc(playlist.url)}" class="yt-playlist-card animate-on-scroll" target="_blank" rel="noopener noreferrer">
        <div class="yt-playlist-card__cover" style="background:${playlist.gradiente}">
          <span class="yt-playlist-card__count">▤ ${playlist.qtd} vídeos</span>
        </div>
        <div class="yt-playlist-card__body">
          <div class="yt-playlist-card__title">${esc(playlist.nome)}</div>
          <div class="yt-playlist-card__desc">${esc(playlist.descricao)}</div>
        </div>
      </a>`;
  }

  /* ── LIGHTBOX DA GALERIA ───────────────────────────────────── */
  let lightboxFotos = [];
  let lightboxIndice = 0;

  function montarLightbox() {
    if (document.getElementById('gallery-lightbox')) return;
    const el = document.createElement('div');
    el.id = 'gallery-lightbox';
    el.className = 'gallery-lightbox';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.innerHTML = `
      <div class="album-viewer album-viewer--inline">
        <div class="album-viewer__header">
          <div class="album-viewer__title" id="lightbox-titulo">Galeria</div>
          <div class="album-viewer__counter" id="lightbox-contador">1 / 1</div>
          <button class="album-viewer__close" id="lightbox-fechar" title="Fechar">${ICONES.fechar}</button>
        </div>
        <div class="album-viewer__stage">
          <button class="album-viewer__nav album-viewer__nav--prev" id="lightbox-anterior" aria-label="Foto anterior">${ICONES.anterior}</button>
          <div class="album-viewer__slide-bg" id="lightbox-slide"></div>
          <div class="album-viewer__caption" id="lightbox-legenda"></div>
          <button class="album-viewer__nav album-viewer__nav--next" id="lightbox-proximo" aria-label="Próxima foto">${ICONES.proximo}</button>
        </div>
        <div class="album-viewer__strip" id="lightbox-strip"></div>
      </div>`;
    document.body.appendChild(el);

    document.getElementById('lightbox-fechar').addEventListener('click', fecharLightbox);
    document.getElementById('lightbox-anterior').addEventListener('click', () => navegarLightbox(-1));
    document.getElementById('lightbox-proximo').addEventListener('click', () => navegarLightbox(1));
    el.addEventListener('click', e => { if (e.target === el) fecharLightbox(); });
    document.addEventListener('keydown', e => {
      if (!el.classList.contains('open')) return;
      if (e.key === 'Escape') fecharLightbox();
      if (e.key === 'ArrowLeft') navegarLightbox(-1);
      if (e.key === 'ArrowRight') navegarLightbox(1);
    });
  }

  function abrirLightbox(fotos, indice, titulo) {
    montarLightbox();
    lightboxFotos = fotos;
    lightboxIndice = indice;
    const el = document.getElementById('gallery-lightbox');
    document.getElementById('lightbox-titulo').textContent = titulo || 'Galeria';
    const strip = document.getElementById('lightbox-strip');
    strip.innerHTML = fotos.map((f, i) =>
      `<div class="album-viewer__thumb" data-indice="${i}"><div class="album-viewer__thumb-bg" style="background:${f.gradiente}"></div></div>`
    ).join('');
    strip.querySelectorAll('.album-viewer__thumb').forEach(t => {
      t.addEventListener('click', () => {
        lightboxIndice = parseInt(t.getAttribute('data-indice'), 10);
        atualizarLightbox();
      });
    });
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
    atualizarLightbox();
  }

  function fecharLightbox() {
    document.getElementById('gallery-lightbox')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navegarLightbox(passo) {
    lightboxIndice = (lightboxIndice + passo + lightboxFotos.length) % lightboxFotos.length;
    atualizarLightbox();
  }

  function atualizarLightbox() {
    const foto = lightboxFotos[lightboxIndice];
    if (!foto) return;
    document.getElementById('lightbox-slide').style.background = foto.gradiente;
    document.getElementById('lightbox-legenda').textContent =
      `${foto.legenda || foto.titulo}${foto.album ? ' · ' + foto.album : ''}${foto.data ? ' · ' + foto.data : ''}`;
    document.getElementById('lightbox-contador').textContent = `${lightboxIndice + 1} / ${lightboxFotos.length}`;
    document.querySelectorAll('#lightbox-strip .album-viewer__thumb').forEach((t, i) => {
      t.classList.toggle('active', i === lightboxIndice);
    });
  }

  /* Achata as fotos de todos os álbuns com referência ao álbum */
  function fotosAchatadas(albuns) {
    const fotos = [];
    albuns.forEach(album => {
      album.fotos.forEach(f => {
        fotos.push({ ...f, album: album.nome, albumId: album.id, categoria: album.categoria, data: album.data });
      });
    });
    return fotos;
  }

  /* ── PÁGINAS ───────────────────────────────────────────────── */

  async function paginaHome() {
    /* Stats do hero */
    try {
      const dados = await fetchJSON('membros');
      const stats = dados.stats;
      const mapa = { operacoes: stats.operacoes, membros: stats.membros, anos: stats.anos };
      Object.entries(mapa).forEach(([chave, valor]) => {
        const el = document.querySelector(`.hero__stat-value[data-stat="${chave}"]`);
        if (el) { el.setAttribute('data-target', valor); el.textContent = '0'; }
      });
      iniciarContadores();

      /* Estado-Maior preview */
      const em = dados.membros.filter(m => m.nivel === 'EM');
      setHTML('[data-slot="em-preview"]', em.map(cardMembro).join(''));
      observarAnimacoes();
    } catch (erro) {
      mostrarErro('[data-slot="em-preview"]', 'Não foi possível carregar o efetivo.');
    }

    /* Blog preview — 3 posts mais recentes (destaque primeiro) */
    try {
      const dados = await fetchJSON('posts');
      const ordenados = [...dados.posts].sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
      setHTML('[data-slot="blog-preview"]', ordenados.slice(0, 3).map(p => cardPost(p)).join(''));
      observarAnimacoes();
    } catch (erro) {
      mostrarErro('[data-slot="blog-preview"]', 'Não foi possível carregar os posts.');
    }

    /* Galeria preview — 6 fotos */
    try {
      const dados = await fetchJSON('albuns');
      const fotos = fotosAchatadas(dados.albuns).slice(0, 6);
      setHTML('[data-slot="galeria-preview"]', fotos.map((f, i) => itemGaleria(f, i)).join(''));
      document.querySelectorAll('[data-slot="galeria-preview"] .gallery-item').forEach(item => {
        item.addEventListener('click', () => {
          abrirLightbox(fotos, parseInt(item.getAttribute('data-foto-indice'), 10), 'Registros de Campo');
        });
      });
      observarAnimacoes();
    } catch (erro) {
      mostrarErro('[data-slot="galeria-preview"]', 'Não foi possível carregar a galeria.');
    }

    /* Mídia preview — 3 vídeos */
    try {
      const dados = await fetchJSON('videos');
      setHTML('[data-slot="midia-preview"]', dados.videos.slice(0, 3).map(cardVideo).join(''));
      observarAnimacoes();
    } catch (erro) {
      mostrarErro('[data-slot="midia-preview"]', 'Não foi possível carregar os vídeos.');
    }
  }

  async function paginaEfetivo() {
    try {
      const dados = await fetchJSON('membros');
      const m = dados.membros;
      const html = [
        tierEfetivo('Estado-Maior', 'em', '★', m.filter(x => x.nivel === 'EM'), 'crew-grid--em'),
        tierEfetivo('Liderança', 'op', '✦', m.filter(x => x.nivel === 'LDR'), ''),
        tierEfetivo('Operadores', 'op', '◆', m.filter(x => x.nivel === 'OP'), ''),
        tierEfetivo('Recrutas', 'rec', '▸', m.filter(x => x.nivel === 'REC'), '')
      ].join('');
      setHTML('[data-slot="efetivo-completo"]', html);
      const total = document.querySelector('[data-slot="total-membros"]');
      if (total) total.textContent = `${m.length} operadores ativos`;
      observarAnimacoes();
    } catch (erro) {
      mostrarErro('[data-slot="efetivo-completo"]', 'Não foi possível carregar o efetivo.');
    }
  }

  async function paginaOperador() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || 'anderson-diego';
    try {
      const dados = await fetchJSON('membros');
      const membro = dados.membros.find(m => m.id === id) || dados.membros[0];
      const nivel = membro.nivel === 'EM' ? 'em' : membro.nivel === 'REC' ? 'rec' : 'op';

      /* Hero */
      const heroTitulo = document.querySelector('[data-slot="operador-nome"]');
      if (heroTitulo) heroTitulo.textContent = membro.nome;
      const heroSub = document.querySelector('[data-slot="operador-sub"]');
      if (heroSub) heroSub.textContent = `// ${membro.callsign} · ${membro.posto}`;
      document.title = `${membro.nome} — Task Force 81`;

      /* Perfil expandido */
      const especialidades = (membro.especialidades || []).map(e =>
        `<span class="crew-card__specialty">${esc(e)}</span>`
      ).join('');

      const sociais = (membro.sociais || []).map(s =>
        `<a href="${esc(s.url)}" class="crew-card__social-link" title="${esc(s.tipo)}" target="_blank" rel="noopener noreferrer">${iconeRede(s.tipo)}</a>`
      ).join('');

      setHTML('[data-slot="operador-perfil"]', `
        <div class="crew-profile animate-on-scroll">
          <div class="crew-profile__visual">
            <div class="crew-profile__cover" style="background:${membro.gradiente}"></div>
            <div class="crew-profile__avatar crew-card__avatar--${nivel}">
              <div class="crew-profile__avatar-placeholder">${esc(membro.iniciais)}</div>
            </div>
            <div class="crew-profile__code">${esc(membro.codigo)}</div>
          </div>
          <div class="crew-profile__body">
            <div class="crew-profile__rank crew-card__rank crew-card__rank--${nivel}">${esc(membro.posto)}</div>
            <h2 class="crew-profile__name">${esc(membro.nome)}</h2>
            <div class="crew-profile__callsign">// ${esc(membro.callsign)}</div>
            <p class="crew-profile__bio">${esc(membro.bio)}</p>
            ${especialidades ? `<div class="crew-profile__specialties">${especialidades}</div>` : ''}
            <div class="crew-profile__stats-row">
              <div class="crew-card__stat">
                <span class="crew-card__stat-value">${esc(membro.operacoes)}</span>
                <span class="crew-card__stat-label">Operações</span>
              </div>
              <div class="crew-card__stat">
                <span class="crew-card__stat-value">${esc(membro.desde)}</span>
                <span class="crew-card__stat-label">Desde</span>
              </div>
              <div class="crew-card__stat">
                <span class="crew-card__stat-value">${new Date().getFullYear() - membro.desde}</span>
                <span class="crew-card__stat-label">Anos de TF-81</span>
              </div>
            </div>
            ${sociais ? `<div class="crew-profile__socials">${sociais}</div>` : ''}
          </div>
        </div>`);

      /* Histórico de operações */
      const itens = (membro.historico || []).map((h, i, lista) => `
        <div class="timeline-item">
          <div class="timeline-marker">
            <div class="timeline-dot${h.tipo === 'Treino' ? ' timeline-dot--green' : h.tipo === 'Externo' ? ' timeline-dot--muted' : ''}"></div>
            ${i < lista.length - 1 ? '<div class="timeline-line"></div>' : ''}
          </div>
          <div class="timeline-content">
            <div class="timeline-date">${esc(h.data)} · ${esc(h.tipo)}${h.liderou ? ' · <span style="color:var(--color-text-gold)">LIDEROU</span>' : ''}</div>
            <div class="timeline-title">${esc(h.titulo)}</div>
            <div class="timeline-body">${esc(h.descricao)}</div>
          </div>
        </div>`).join('');
      setHTML('[data-slot="operador-historico"]', itens || '<div class="site-data-loading" style="padding:var(--space-6)">Sem registros de operação.</div>');
      observarAnimacoes();
    } catch (erro) {
      mostrarErro('[data-slot="operador-perfil"]', 'Não foi possível carregar o perfil do operador.');
    }
  }

  async function paginaBlog() {
    const POR_PAGINA = 6;
    let categoriaAtiva = 'todos';
    let paginaAtual = 1;
    let posts = [];

    try {
      const dados = await fetchJSON('posts');
      posts = dados.posts;

      /* Destaque */
      const destaque = posts.find(p => p.destaque) || posts[0];
      setHTML('[data-slot="blog-destaque"]', heroPost(destaque));

      /* Filtros */
      const filtros = dados.categorias.map(c =>
        `<button class="gallery-filter__btn${c.id === 'todos' ? ' active' : ''}" style="border-radius:var(--radius-full)" data-filtro="${esc(c.id)}">${esc(c.label)}</button>`
      ).join('');
      setHTML('[data-slot="blog-filtros"]', filtros);

      function postsFiltrados() {
        return categoriaAtiva === 'todos' ? posts : posts.filter(p => p.categoria === categoriaAtiva);
      }

      function renderizarGrid() {
        const filtrados = postsFiltrados();
        const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
        paginaAtual = Math.min(paginaAtual, totalPaginas);
        const visiveis = filtrados.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

        setHTML('[data-slot="blog-grid"]',
          visiveis.length
            ? visiveis.map(p => cardPost(p)).join('')
            : '<div class="site-data-loading" style="grid-column:1/-1">Nenhum post nesta categoria.</div>');

        const contador = document.querySelector('[data-slot="blog-contador"]');
        if (contador) contador.textContent = `${filtrados.length} ${filtrados.length === 1 ? 'post' : 'posts'}`;

        const indicador = document.querySelector('[data-slot="blog-pagina"]');
        if (indicador) indicador.textContent = `Página ${paginaAtual} de ${totalPaginas}`;

        const btnAnterior = document.querySelector('[data-slot="blog-anterior"]');
        const btnProximo = document.querySelector('[data-slot="blog-proximo"]');
        if (btnAnterior) btnAnterior.disabled = paginaAtual <= 1;
        if (btnProximo) btnProximo.disabled = paginaAtual >= totalPaginas;
        observarAnimacoes();
      }

      document.querySelectorAll('[data-slot="blog-filtros"] [data-filtro]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-slot="blog-filtros"] [data-filtro]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          categoriaAtiva = btn.getAttribute('data-filtro');
          paginaAtual = 1;
          renderizarGrid();
        });
      });

      document.querySelector('[data-slot="blog-anterior"]')?.addEventListener('click', () => {
        paginaAtual--; renderizarGrid();
        document.querySelector('[data-slot="blog-grid"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      document.querySelector('[data-slot="blog-proximo"]')?.addEventListener('click', () => {
        paginaAtual++; renderizarGrid();
        document.querySelector('[data-slot="blog-grid"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      renderizarGrid();
      observarAnimacoes();
    } catch (erro) {
      mostrarErro('[data-slot="blog-grid"]', 'Não foi possível carregar os posts.');
    }
  }

  async function paginaBlogPost() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    try {
      const dados = await fetchJSON('posts');
      const post = dados.posts.find(p => p.id === id) || dados.posts[0];
      document.title = `${post.titulo} — TF-81`;

      /* Hero */
      const eyebrow = document.querySelector('[data-slot="post-categoria"]');
      if (eyebrow) eyebrow.textContent = `// ${post.categoriaLabel.toUpperCase()}`;
      const titulo = document.querySelector('[data-slot="post-titulo"]');
      if (titulo) titulo.textContent = post.titulo;
      const sub = document.querySelector('[data-slot="post-sub"]');
      if (sub) sub.textContent = `${post.data} · ${post.autorNome} · ${post.leitura} de leitura`;

      /* Corpo */
      const blocos = post.conteudo.map(bloco => {
        switch (bloco.tipo) {
          case 'h2': return `<h2>${esc(bloco.texto)}</h2>`;
          case 'h3': return `<h3>${esc(bloco.texto)}</h3>`;
          case 'quote': return `<blockquote>${esc(bloco.texto)}</blockquote>`;
          case 'img': return `
            <figure class="blog-post__figure">
              <div class="blog-post__figure-img" style="background:${bloco.gradiente}">${ICONES.camera}</div>
              <figcaption>${esc(bloco.legenda)}</figcaption>
            </figure>`;
          default: return `<p>${esc(bloco.texto)}</p>`;
        }
      }).join('');

      const tags = post.tags.map(t => `<span class="blog-tag blog-tag--${esc(post.categoria)}">${esc(t)}</span>`).join('');

      setHTML('[data-slot="post-corpo"]', `
        <article class="blog-post">
          <div class="blog-post__meta">
            <div class="blog-post__author">
              <div class="avatar avatar--sm avatar--gold">${esc(post.autorIniciais.charAt(0))}</div>
              <div>
                <div class="blog-post__author-name">${esc(post.autorNome)} · ${esc(post.autorPosto)}</div>
                <div class="blog-post__author-date">${esc(post.data)} · ${esc(post.leitura)} de leitura</div>
              </div>
            </div>
            <span class="blog-tag blog-tag--${esc(post.categoria)}">${esc(post.categoriaLabel)}</span>
          </div>
          <div class="blog-post__cover" style="background:${post.gradiente}">${ICONES.camera}</div>
          <div class="blog-post__body">${blocos}</div>
          <div class="blog-post__tags">${tags}</div>
          <div class="blog-post__author-card">
            <div class="avatar avatar--lg avatar--gold">${esc(post.autorIniciais.charAt(0))}</div>
            <div>
              <div class="blog-post__author-card-label">// ESCRITO POR</div>
              <div class="blog-post__author-card-name">${esc(post.autorNome)}</div>
              <div class="blog-post__author-card-role">${esc(post.autorPosto)}</div>
            </div>
          </div>
        </article>`);

      /* Relacionados — mesma categoria, depois mais recentes */
      const relacionados = dados.posts
        .filter(p => p.id !== post.id)
        .sort((a, b) => (b.categoria === post.categoria ? 1 : 0) - (a.categoria === post.categoria ? 1 : 0))
        .slice(0, 3);
      setHTML('[data-slot="post-relacionados"]', relacionados.map(p => cardPost(p)).join(''));
      observarAnimacoes();
    } catch (erro) {
      mostrarErro('[data-slot="post-corpo"]', 'Não foi possível carregar o post.');
    }
  }

  async function paginaGaleria() {
    let categoriaAtiva = 'todos';
    try {
      const dados = await fetchJSON('albuns');
      const todasFotos = fotosAchatadas(dados.albuns);

      /* Filtros com contagem */
      function contagem(catId) {
        return catId === 'todos' ? todasFotos.length : todasFotos.filter(f => f.categoria === catId).length;
      }
      const filtros = dados.categorias.map(c =>
        `<button class="gallery-filter__btn${c.id === 'todos' ? ' active' : ''}" data-filtro="${esc(c.id)}">${esc(c.label)} <span class="gallery-filter__count">${contagem(c.id)}</span></button>`
      ).join('');
      setHTML('[data-slot="galeria-filtros"]', filtros);

      function renderizar() {
        const albunsVisiveis = categoriaAtiva === 'todos'
          ? dados.albuns
          : dados.albuns.filter(a => a.categoria === categoriaAtiva);
        const fotosVisiveis = (categoriaAtiva === 'todos'
          ? todasFotos
          : todasFotos.filter(f => f.categoria === categoriaAtiva)).slice(0, 12);

        setHTML('[data-slot="galeria-albuns"]',
          albunsVisiveis.length
            ? albunsVisiveis.map(cardAlbum).join('')
            : '<div class="site-data-loading" style="grid-column:1/-1">Nenhum álbum nesta categoria.</div>');

        const variantes = ['hero', '', '', 'tall', '', 'wide', '', '', 'wide', '', '', ''];
        setHTML('[data-slot="galeria-fotos"]',
          fotosVisiveis.map((f, i) => itemGaleria(f, i, variantes[i] || '')).join(''));

        /* Lightbox: clique no álbum abre o álbum; clique na foto abre a partir dela */
        document.querySelectorAll('[data-slot="galeria-albuns"] .album-card').forEach(card => {
          card.addEventListener('click', e => {
            e.preventDefault();
            const album = dados.albuns.find(a => a.id === card.getAttribute('data-album-id'));
            if (album) {
              const fotos = album.fotos.map(f => ({ ...f, album: album.nome, data: album.data }));
              abrirLightbox(fotos, 0, album.nome);
            }
          });
        });
        document.querySelectorAll('[data-slot="galeria-fotos"] .gallery-item').forEach(item => {
          const abrirFoto = () => abrirLightbox(fotosVisiveis, parseInt(item.getAttribute('data-foto-indice'), 10), 'Fotos Recentes');
          item.addEventListener('click', abrirFoto);
          item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirFoto(); } });
        });
        observarAnimacoes();
      }

      document.querySelectorAll('[data-slot="galeria-filtros"] [data-filtro]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('[data-slot="galeria-filtros"] [data-filtro]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          categoriaAtiva = btn.getAttribute('data-filtro');
          renderizar();
        });
      });

      renderizar();
    } catch (erro) {
      mostrarErro('[data-slot="galeria-albuns"]', 'Não foi possível carregar a galeria.');
    }
  }

  async function paginaMidia() {
    try {
      const dados = await fetchJSON('videos');
      setHTML('[data-slot="midia-destaque"]', videoDestaque(dados.destaque));
      setHTML('[data-slot="midia-videos"]', dados.videos.map(cardVideo).join(''));
      setHTML('[data-slot="midia-playlists"]', dados.playlists.map(cardPlaylist).join(''));
      document.querySelectorAll('[data-slot="canal-url"]').forEach(a => { a.href = dados.canal.url; });
      const inscritos = document.querySelector('[data-slot="canal-inscritos"]');
      if (inscritos) inscritos.textContent = `${dados.canal.handle} · ${dados.canal.inscritos}`;
      observarAnimacoes();
    } catch (erro) {
      mostrarErro('[data-slot="midia-videos"]', 'Não foi possível carregar os vídeos.');
    }
  }

  async function paginaRecrutamento() {
    try {
      const dados = await fetchJSON('membros');
      const em = dados.membros.filter(m => m.nivel === 'EM');
      setHTML('[data-slot="em-mini"]', em.map(cardMembro).join(''));
      observarAnimacoes();
    } catch (erro) {
      mostrarErro('[data-slot="em-mini"]', 'Não foi possível carregar o Estado-Maior.');
    }
  }

  /* Formulário de recrutamento (sem backend nesta fase) */
  function iniciarFormularioRecrutamento() {
    document.querySelectorAll('form[data-form="recrutamento"]').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        const aviso = form.querySelector('.recruit-disclaimer');
        if (aviso) {
          aviso.textContent = '✓ Candidatura registrada! Nesta fase de demonstração os dados não são enviados — o envio real chegará com o backend.';
          aviso.style.color = 'var(--color-status-active)';
        }
        form.reset();
      });
    });
  }

  /* ── BOOTSTRAP ─────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', async () => {
    const pagina = document.body.getAttribute('data-page') || '';

    /* Componentes compartilhados */
    const slotNavbar = document.querySelector('[data-component="navbar"]');
    if (slotNavbar) slotNavbar.outerHTML = renderNavbar(pagina);

    const slotFooter = document.querySelector('[data-component="footer"]');
    if (slotFooter) {
      let redes = [];
      try {
        const dados = await fetchJSON('redes-sociais');
        redes = dados.redes.filter(r => r.ativo);
      } catch (erro) {
        redes = [];
      }
      slotFooter.outerHTML = renderFooter(redes);
    }

    iniciarNavbarScroll();
    iniciarDrawer();
    iniciarTemaToggles();
    iniciarFormularioRecrutamento();
    observarAnimacoes();

    const rotas = {
      'home': paginaHome,
      'efetivo': paginaEfetivo,
      'operador': paginaOperador,
      'blog': paginaBlog,
      'blog-post': paginaBlogPost,
      'galeria': paginaGaleria,
      'midia': paginaMidia,
      'recrutamento': paginaRecrutamento
    };

    if (rotas[pagina]) rotas[pagina]();
  });
})();
