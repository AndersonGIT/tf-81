# TF-81 — Especificação de Desenvolvimento: Etapas Pendentes

---

## CONTEXTO GERAL

**Projeto:** Site TF-81 — Dual system: site público de apresentação + plataforma privada de gestão.
**Stack:** HTML nativo + CSS custom (design system próprio) + JavaScript vanilla. Sem frameworks externos.
**Design System:** `/design-system/index.html` — showcase vivo de todos os componentes, com sidebar navegável, suporte a dark/light mode, responsividade e scroll spy.
**Estado atual do DS:** v1.1 — Fundação completa (tokens, tipografia, paleta, animações), 24 componentes base, App Interno shell, e 6 módulos de página implementados (Blog, Galeria, Efetivo, YouTube, Redes Sociais — em versões public + admin cada).

**Convenções a seguir obrigatoriamente:**
- BEM-style class naming: `.bloco__elemento--modificador`
- CSS custom properties via tokens (`var(--space-*)`, `var(--color-*)`, `var(--text-*)`)
- Cada módulo novo vai em um novo arquivo CSS dedicado em `design-system/css/`
- Seções de showcase adicionadas ao final do `design-system/index.html` com `id="ds-[nome]"` e `data-section`
- Link da nova seção adicionado na sidebar do showcase, no grupo de nav correspondente
- Dark/light mode: todas as regras sensíveis à cor têm contraparte `[data-theme="light"]`
- Responsividade: mobile (< 640px), tablet (< 768px), desktop, TV (≥ 1920px)

---

## FASE 1 — SITE PÚBLICO: Componentes críticos do design-system

Estes 5 componentes são **pré-requisito** para iniciar a construção do site público. Cada tarefa gera: (1) um arquivo CSS novo e (2) uma seção de showcase no `index.html`.

---

### TAREFA 7 — NAVBAR / HEADER DO SITE PÚBLICO

**Arquivo CSS a criar:** `design-system/css/navbar.css`
**ID no showcase:** `#ds-navbar`
**Nav group no sidebar:** `Site Público` (novo grupo)

**O que é:** Header fixo (sticky) do site de apresentação público. Diferente da sidebar do app interno — é um header horizontal clássico de site, com logo à esquerda, links de navegação no centro/direita e CTA primária.

**Componentes a construir:**

```
.site-nav                    — wrapper principal, position: sticky, top: 0, z-index alto
.site-nav--scrolled          — variação quando há scroll (borda inferior mais visível, leve backdrop blur)
.site-nav__inner             — container com max-width e padding horizontal
.site-nav__brand             — logo + nome da unidade (lado esquerdo)
.site-nav__brand-logo        — imagem do patch (circular, 36px, borda dourada)
.site-nav__brand-name        — "TASK FORCE 81" em Oswald, dourado
.site-nav__brand-tagline     — "// Operações Táticas" em JetBrains Mono, muted, xs
.site-nav__links             — lista de links horizontais (desktop)
.site-nav__link              — link individual com underline animado dourado no hover
.site-nav__link--active      — estado ativo
.site-nav__actions           — grupo de botões à direita (ex: "Área do Operador" + "Recrutamento")
.site-nav__hamburger         — botão hamburger (mobile only)
.site-nav__drawer            — menu mobile off-canvas (drawer deslizante da esquerda)
.site-nav__drawer-overlay    — overlay escurecido atrás do drawer
.site-nav__drawer-link       — link no drawer mobile
```

**Links de navegação esperados no showcase:**
- Início — Efetivo — Blog — Galeria — Mídia — Redes Sociais — Recrutamento

**CTAs à direita:**
- `btn btn-ghost btn-sm` → "Área do Operador" (link para login)
- `btn btn-primary btn-sm` → "Quero me alistar" (ancora para seção de recrutamento)

**Especificações visuais:**
- Background: `var(--color-bg-base)` com `backdrop-filter: blur(12px)` e `background-opacity: 0.9` — efeito vidro tático
- Altura: 64px desktop / 56px mobile
- Borda inferior: `1px solid var(--color-border-default)`, fica `var(--color-border-gold)` quando `.site-nav--scrolled`
- Logo: mesma imagem já usada no DS — `../assets/img/Patch de Apresentação TF81 - vFinal.png`
- Links: `font-family: var(--font-tactical)` (Rajdhani), uppercase, tracking-wide
- Underline animado: pseudo-elemento `::after` com `width: 0 → 100%` e `background: var(--color-text-gold)`
- Mobile (< 768px): links somem, hamburger aparece, drawer desliza da esquerda

**No showcase:** Mostrar 3 estados — normal, scrolled (com classe forçada), e mobile (drawer aberto simulado).

---

### TAREFA 8 — FOOTER DO SITE PÚBLICO

**Arquivo CSS a criar:** `design-system/css/footer.css`
**ID no showcase:** `#ds-footer`
**Nav group no sidebar:** `Site Público`

**O que é:** Rodapé do site de apresentação. Dividido em colunas com informações da unidade, links rápidos, redes sociais e crédito.

**Componentes a construir:**

```
.site-footer                 — wrapper principal
.site-footer__top            — área principal com colunas (grid)
.site-footer__col            — coluna individual
.site-footer__brand          — coluna de identidade (logo + descrição)
.site-footer__brand-logo     — patch circular maior (48px)
.site-footer__brand-name     — "TASK FORCE 81"
.site-footer__brand-desc     — descrição curta da unidade (2-3 linhas, muted)
.site-footer__heading        — título de coluna ("Navegação", "Contato", "Siga-nos")
.site-footer__links          — lista de links internos
.site-footer__link           — link individual
.site-footer__socials        — ícones de redes sociais (linha horizontal)
.site-footer__social-btn     — botão circular com ícone SVG (YouTube, Instagram, etc.)
.site-footer__bottom         — barra inferior com copyright e disclaimer
.site-footer__copyright      — "© 2026 Task Force 81 — Todos os direitos reservados"
.site-footer__disclaimer     — "Site fictício para fins recreativos de airsoft"
.site-footer__divider        — linha separadora entre top e bottom
```

**Layout das colunas (grid):**
- Desktop: 4 colunas — `[Brand (2fr)] [Navegação (1fr)] [Contato (1fr)] [Siga-nos (1fr)]`
- Tablet: 2 colunas
- Mobile: 1 coluna empilhada

**Conteúdo das colunas no showcase:**
- **Brand:** Logo + "Task Force 81 é uma equipe de airsoft profissional sediada no Brasil, com foco em táticas realistas, treinamento contínuo e espírito de equipe." + redes sociais
- **Navegação:** Início / Efetivo / Blog / Galeria / Mídia / Recrutamento
- **Contato:** "Dúvidas e contato via redes sociais" + email ou placeholder
- **Siga-nos:** Links com ícone + label (YouTube, Instagram, etc.)

**Especificações visuais:**
- Background: `var(--color-bg-base)` com `border-top: 1px solid var(--color-border-default)`
- Padding top: `var(--space-16)`; bottom: `var(--space-8)`
- Heading das colunas: `font-family: var(--font-mono)`, `font-size: var(--text-xs)`, `color: var(--color-text-gold)`, uppercase, tracking-military
- Links: `var(--color-text-muted)` → `var(--color-text-gold)` no hover
- Bottom bar: `border-top: 1px solid var(--color-border-subtle)`, texto muted xs, mono

---

### TAREFA 9 — HERO / LANDING SECTION

**Arquivo CSS a criar:** `design-system/css/hero.css`
**ID no showcase:** `#ds-hero-public`
**Nav group no sidebar:** `Site Público`

**O que é:** A primeira seção visível do site — impacto visual máximo, apresentação da TF-81, com identidade visual dominante e CTAs. Deve ter apelo tático/militar com a paleta já definida.

**Componentes a construir:**

```
.hero                        — wrapper principal, min-height 100svh
.hero__bg                    — camada de fundo (gradient escuro + potencial para imagem)
.hero__overlay               — overlay semitransparente tático (scanlines, vignette)
.hero__content               — container centralizado com z-index acima do bg
.hero__eyebrow               — linha pré-título ("// TASK FORCE 81 // OPERAÇÕES TÁTICAS")
.hero__title                 — título principal (multi-linha, grande, Oswald bold)
.hero__title-line            — cada linha do título (para animação stagger)
.hero__title-highlight       — palavra em destaque dourado
.hero__subtitle              — subtítulo descritivo (Barlow, max-width, centrado)
.hero__actions               — grupo de CTAs
.hero__scroll-hint           — indicador de scroll para baixo (animado)
.hero__badge                 — badge tático flutuante (ex: "FUNDADO EM 2018")
.hero__stats                 — linha de estatísticas rápidas (N operações / N membros / N anos)
.hero__stat                  — item de estatística individual
.hero__stat-value            — número (display font, grande, dourado)
.hero__stat-label            — label da stat
.hero__stat-divider          — separador vertical entre stats
```

**Conteúdo do showcase:**
- Eyebrow: `// TASK FORCE 81 // OPERAÇÕES TÁTICAS //` em JetBrains Mono, dourado, xs
- Título: `"FORÇA` / `DISCIPLINA` / `COMBATE"` — cada palavra em linha própria, peso bold, tamanho clamp(3rem, 8vw, 7rem)
- Destaque: "COMBATE" em `var(--color-text-gold)` com text-shadow glow
- Subtítulo: "Equipe de airsoft profissional dedicada a táticas realistas, treinamento contínuo e operações de alto nível."
- CTAs: `btn btn-primary btn-lg` "Ver o Efetivo" + `btn btn-outline btn-lg` "Últimas Operações"
- Stats: `84` Operações / `13` Membros / `8` Anos de Atividade
- Scroll hint: seta animada para baixo (animation bounce)

**Especificações visuais:**
- Background: `radial-gradient` escuro saindo do centro + `linear-gradient` do brand militar
- Pode reutilizar a classe `scanlines` já existente no `base.css` como overlay
- Patch da TF-81 pode aparecer como elemento decorativo large atrás do título, com baixa opacidade (watermark)
- O hero deve suportar opcionalmente uma `background-image` (foto de operação) com overlay escurecedor
- Animação de entrada: fade + slide up (reutilizar `animation-fade-up` já em `animations.css`)

**Variações a mostrar no showcase:**
- `hero--with-image` — com placeholder de background-image
- `hero--minimal` — versão mais compacta para páginas internas (não index)

---

### TAREFA 10 — SEÇÃO "SOBRE A TF-81" (MISSÃO, VALORES, HISTÓRIA)

**Arquivo CSS a criar:** `design-system/css/about.css`
**ID no showcase:** `#ds-about`
**Nav group no sidebar:** `Site Público`

**O que é:** Seção "Quem somos" do site público. Apresenta a identidade, missão, valores e a história resumida da unidade. Importante para legitimidade e recrutamento.

**Componentes a construir:**

```
.about-section               — wrapper com padding padrão de seção
.about-section-hd            — cabeçalho de seção (mesmo padrão de .crew-section-hd e .blog-section-hd)
.about-lead                  — parágrafo de abertura (texto maior, destaque)
.about-grid                  — grid de 2 colunas: texto à esq, imagem/patch à dir
.about-grid__text            — coluna de texto
.about-grid__visual          — coluna visual (patch, emblema, imagem)
.about-patch                 — exibição grande do patch da TF-81 com borda e glow dourado
.about-values                — grid de cards de valores
.about-value-card            — card individual de valor
.about-value-card__icon      — ícone SVG tático (24px)
.about-value-card__title     — nome do valor (Oswald, uppercase)
.about-value-card__desc      — descrição curta
.about-timeline-mini         — linha do tempo resumida da história
.about-timeline-mini__item   — evento na timeline
.about-timeline-mini__year   — ano (mono, gold)
.about-timeline-mini__event  — descrição do evento
.about-quote                 — citação tática destacada (estilo blockquote)
.about-quote__text           — texto da citação
.about-quote__author         — autor / posto
```

**Conteúdo do showcase:**
- Eyebrow: `// SOBRE A UNIDADE`
- Título: `"QUEM SOMOS"` ou `"A TASK FORCE 81"`
- Lead: "Somos uma equipe de airsoft profissional fundada em 2018, dedicada à simulação tática realista, ao desenvolvimento dos operadores e ao espírito de equipe."
- Valores (4 cards): `DISCIPLINA` / `LEALDADE` / `TÁTICA` / `EVOLUÇÃO` — cada um com ícone SVG e descrição de 1 linha
- Timeline mini: 2018 → Fundação / 2020 → Primeiras Operações Externas / 2022 → Estrutura de Estado-Maior / 2024 → Expansão do Efetivo
- Citação: `"Não somos apenas jogadores. Somos uma equipe."` — Estado-Maior TF-81

**Layout do grid sobre:**
- Desktop: 60/40 — texto + visual
- Mobile: empilhado, visual acima do texto

---

### TAREFA 11 — SEÇÃO DE RECRUTAMENTO PÚBLICA

**Arquivo CSS a criar:** `design-system/css/recruit.css`
**ID no showcase:** `#ds-recruit`
**Nav group no sidebar:** `Site Público`

**O que é:** Seção de CTA pública para recrutamento — convite para interessados em entrar na equipe. Apresenta requisitos, processo de seleção e formulário ou link de contato.

**Componentes a construir:**

```
.recruit-section             — wrapper principal
.recruit-section-hd          — cabeçalho padrão (label + título)
.recruit-hero                — bloco de impacto no topo da seção ("Faça parte da força")
.recruit-hero__title         — título grande de CTA
.recruit-hero__sub           — subtítulo
.recruit-requirements        — lista de requisitos para candidatos
.recruit-req-item            — item individual de requisito
.recruit-req-item__icon      — ícone check ou tático
.recruit-req-item__text      — texto do requisito
.recruit-steps               — cards de etapas do processo seletivo
.recruit-step                — card de etapa
.recruit-step__number        — número da etapa (grande, decorativo, dourado)
.recruit-step__title         — nome da etapa
.recruit-step__desc          — descrição
.recruit-form                — formulário de candidatura (inline simples)
.recruit-form__group         — agrupamento campo + label
.recruit-disclaimer          — texto de aviso / expectativas
.recruit-cta-bar             — barra de CTA final com botão primário
```

**Conteúdo do showcase:**
- Eyebrow: `// RECRUTAMENTO`
- Título: `"QUER FAZER PARTE?"` ou `"ALISTE-SE"`
- Subtítulo: "Buscamos operadores comprometidos, disciplinados e com vontade de evoluir. A seleção é exigente, porque a equipe é séria."
- Requisitos: Maior de 18 anos / Disponibilidade para treinos / Equipamento próprio (mínimo) / Comprometimento com a equipe / Sem histórico de comportamento antiético em campo
- Etapas: 1. Candidatura → 2. Avaliação pelo Estado-Maior → 3. Treino de observação → 4. Incorporação como Recruta
- Formulário: Nome completo / Callsign desejado / Idade / Cidade / Instagram (campo) + botão "Enviar Candidatura"
- Disclaimer: "O processo pode levar até 30 dias. Você será contatado via Instagram."
- Reutilizar classes `.form-input`, `.form-label`, `.btn btn-primary` já existentes

---

