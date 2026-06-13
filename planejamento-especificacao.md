# TF-81 — Planejamento e Especificação do Site Público

---

## 1. VISÃO GERAL

**O que é:** Site de apresentação público da Task Force 81. Multi-página, estático (HTML + CSS + JS vanilla), sem backend nesta fase.

**Objetivo:** Apresentar a equipe, conteúdo (blog, galeria, mídia), atrair recrutas e servir de vitrine pública da unidade.

**Stack:** HTML5 + CSS (design-system próprio) + JavaScript vanilla. Sem frameworks, sem bundler, sem dependências externas além do Google Fonts.

**Referência de design:** Todo estilo, token e componente vem exclusivamente de `/design-system/css/`. Nunca criar estilos inline além de ajustes de layout de página.

---

## 2. ESTRUTURA DE ARQUIVOS

```
SiteTF81/
├── assets/
│   └── img/
│       ├── Patch de Apresentação TF81 - vFinal.png   ← logo principal
│       ├── Patch de Combate TF81.jpeg                ← uso decorativo
│       └── Bandeira TF81 - vFinal.png                ← uso decorativo
│
├── site/                          ← raiz do site público
│   ├── index.html                 ← Landing page (home)
│   ├── efetivo.html               ← Efetivo completo (todos os membros)
│   ├── operador.html              ← Perfil público de operador individual
│   ├── blog.html                  ← Listagem de posts do blog
│   ├── blog-post.html             ← Post individual do blog
│   ├── galeria.html               ← Galeria de fotos/álbuns
│   ├── midia.html                 ← Mídia — canal YouTube e vídeos
│   ├── recrutamento.html          ← Página de recrutamento completa
│   └── 404.html                   ← Página de erro
│
├── css/
│   └── site.css                   ← CSS exclusivo do site (layout de página, grid de seções)
│                                     Importa o design-system via @import ou links
│
└── js/
    └── site.js                    ← JS do site (navbar scroll, drawer mobile, contadores, etc.)
```

**Regra de imports CSS em cada página:**
```html
<!-- Fontes -->
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Barlow+Condensed:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@300;400;500;700&family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- Design System -->
<link rel="stylesheet" href="../design-system/css/tokens.css">
<link rel="stylesheet" href="../design-system/css/base.css">
<link rel="stylesheet" href="../design-system/css/typography.css">
<link rel="stylesheet" href="../design-system/css/components.css">
<link rel="stylesheet" href="../design-system/css/utilities.css">
<link rel="stylesheet" href="../design-system/css/animations.css">
<link rel="stylesheet" href="../design-system/css/navbar.css">
<link rel="stylesheet" href="../design-system/css/footer.css">
<link rel="stylesheet" href="../design-system/css/hero.css">

<!-- CSS específico da página (somente os módulos necessários) -->
<link rel="stylesheet" href="../design-system/css/blog.css">   <!-- apenas nas páginas de blog -->
<link rel="stylesheet" href="../design-system/css/gallery.css"> <!-- apenas nas páginas de galeria -->
<link rel="stylesheet" href="../design-system/css/crew.css">    <!-- apenas nas páginas de efetivo -->
<link rel="stylesheet" href="../design-system/css/media.css">   <!-- apenas nas páginas de mídia -->
<link rel="stylesheet" href="../design-system/css/about.css">   <!-- apenas no index -->
<link rel="stylesheet" href="../design-system/css/recruit.css"> <!-- apenas em recrutamento -->

<!-- CSS do site -->
<link rel="stylesheet" href="../css/site.css">
```

---

## 3. ARQUIVO CSS DO SITE (`css/site.css`)

Arquivo único de layout de página — não contém componentes, apenas:

```
.site-page            — wrapper de página: display flex, flex-direction column, min-height 100svh
.site-main            — conteúdo principal: flex 1, contém todas as seções
.site-section         — seção genérica de página: display flex, justify-content center
.site-section--alt    — seção com background alternado (color-bg-raised)
.site-section--dark   — seção com background canvas (mais escuro)
.site-container       — container centralizado: max-width 1200px, margin auto
.site-divider         — separador visual entre seções (linha horizontal gold sutil)
```

Também define:
- `body` com `data-theme="dark"` por padrão
- Scroll behavior suave via `scroll-behavior: smooth`
- Ajustes de `scroll-margin-top` para âncoras considerando a navbar sticky (64px)

---

## 4. ARQUIVO JS DO SITE (`js/site.js`)

Comportamentos necessários para todas as páginas:

### 4.1 Navbar scroll
```
- Observar scroll do window
- Quando scrollY > 20: adicionar .site-nav--scrolled na .site-nav
- Quando scrollY <= 20: remover .site-nav--scrolled
```

### 4.2 Navbar drawer mobile
```
- Botão .site-nav__hamburger → abre .site-nav__drawer e .site-nav__drawer-overlay
- .site-nav__drawer-close → fecha drawer
- .site-nav__drawer-overlay → clicar fecha drawer
- Pressionar ESC → fecha drawer
- Abrir drawer → body overflow hidden (prevenir scroll de fundo)
```

### 4.3 Highlight do link ativo na navbar
```
- Comparar pathname da URL com href de cada .site-nav__link
- Adicionar .site-nav__link--active no link correspondente
- Mesmo para .site-nav__drawer-link
```

### 4.4 Contadores animados (hero__stat-value)
```
- IntersectionObserver na .hero__stats
- Quando entra na viewport: animar de 0 até valor alvo em ~1.2s (easing ease-out)
- Usar data-target="84" no elemento para definir o valor final
```

### 4.5 Animações de entrada por scroll
```
- IntersectionObserver em elementos com .animate-on-scroll
- Quando entra na viewport: adicionar .is-visible
- CSS: .animate-on-scroll { opacity:0; transform:translateY(20px); transition: all 400ms ease-out; }
-      .animate-on-scroll.is-visible { opacity:1; transform:translateY(0); }
```

### 4.6 Dark/Light mode (opcional nesta fase)
```
- Botão de toggle no footer ou navbar (opcional)
- Salvar preferência em localStorage
- Aplicar data-theme no <html>
```

---

## 5. PÁGINAS DO SITE

---

### PÁGINA 1 — INDEX.HTML (Landing Page / Home)

**URL:** `/site/index.html`
**Título:** `Task Force 81 — Operações Táticas`
**CSS extra:** `about.css`, `crew.css`, `blog.css`, `gallery.css`, `media.css`, `recruit.css`

**Seções em ordem:**

#### 1.1 Navbar
- Componente: `.site-nav`
- Link ativo: "Início"
- Props: com logo patch, links completos, CTAs "Área do Operador" + "Quero me alistar"

#### 1.2 Hero
- Componente: `.hero` (fullscreen)
- Eyebrow: `// TASK FORCE 81 // OPERAÇÕES TÁTICAS //`
- Título: FORÇA / DISCIPLINA / `COMBATE` (highlight)
- Subtítulo: "Equipe de airsoft profissional dedicada a táticas realistas, treinamento contínuo e operações de alto nível."
- CTAs: "Ver o Efetivo" → `#efetivo` | "Últimas Operações" → `#blog`
- Badge: `FUNDADO EM 2018 · ATIVO`
- Stats: `84` Operações / `13` Membros / `8` Anos
- Scroll hint visível
- Watermark: patch no fundo

#### 1.3 Sobre a TF-81
- Componente: `.about-section`
- Label: `// SOBRE A UNIDADE`
- Título: "A Task Force 81"
- Lead + grid 60/40 (texto + patch animado)
- 4 value cards: DISCIPLINA / LEALDADE / TÁTICA / EVOLUÇÃO
- Timeline mini: 2018 → 2020 → 2022 → 2024
- Quote: "Não somos apenas jogadores. Somos uma equipe."

#### 1.4 Efetivo (preview)
- ID âncora: `id="efetivo"`
- Componente: `.crew-section` com `.crew-section-hd`
- Label: `// EFETIVO`
- Título: "Estado-Maior"
- Grid de 3 cards do Estado-Maior (Anderson, Antônio, Raphael) usando `.crew-grid--em`
- Botão "Ver efetivo completo" → `efetivo.html`
- **Não** mostrar Operadores e Recrutas aqui (apenas o Estado-Maior)

#### 1.5 Blog (preview)
- ID âncora: `id="blog"`
- Componente: `.blog-section` com `.blog-section-hd`
- Label: `// ÚLTIMAS OPERAÇÕES`
- Título: "Do Campo"
- Grid de 3 cards de post mais recentes usando `.blog-card` (destaque) + `.blog-card--compact`
- Botão "Ver todos os posts" → `blog.html`

#### 1.6 Galeria (preview)
- Componente: `.gallery-section` (da gallery.css)
- Label: `// GALERIA`
- Título: "Registros de Campo"
- Grid de 6 fotos (placeholders) usando `.gallery-grid`
- Botão "Ver galeria completa" → `galeria.html`

#### 1.7 Mídia (preview)
- Componente: `.media-section` (da media.css)
- Label: `// MÍDIA`
- Título: "Canal YouTube"
- 3 cards de vídeo usando `.yt-card`
- Botão "Acessar o canal" → `midia.html`

#### 1.8 Recrutamento (CTA)
- Componente: `.recruit-section`
- Label: `// RECRUTAMENTO`
- Hero bloco de impacto
- Requisitos (lista compacta)
- 4 etapas
- Formulário de candidatura
- CTA bar final

#### 1.9 Footer
- Componente: `.site-footer`
- Todas as 4 colunas: Brand / Navegação / Contato / Siga-nos

---

### PÁGINA 2 — EFETIVO.HTML

**URL:** `/site/efetivo.html`
**Título:** `Efetivo — Task Force 81`
**CSS extra:** `crew.css`

**Seções em ordem:**

#### 2.1 Navbar
- Link ativo: "Efetivo"

#### 2.2 Hero (minimal)
- Componente: `.hero.hero--minimal`
- Eyebrow: `// EFETIVO OPERACIONAL`
- Título: "NOSSA / EQUIPE" (sem highlight)
- Subtítulo: "Conheça os operadores que compõem a Task Force 81."

#### 2.3 Estado-Maior
- Componente: `.crew-section`
- Label: `// ESTADO-MAIOR`
- Título: "Comando da Unidade"
- Subtítulo explicativo do EM e rotatividade
- Grid: `.crew-grid.crew-grid--em` — 3 cards completos com dados reais
- Cards: `.crew-card` (div, não `<a>`) com rank, callsign, especialidades, stats, sociais

**Membros Estado-Maior:**
| Membro | Callsign | Posto | Especialidades | Stats |
|---|---|---|---|---|
| Anderson Diego | BRAVO-01 (Ghost) | Comandante | CQB, Comando, Instrução | 84 ops / 2018 |
| Antônio | ALPHA-01 | Sub-Comandante | Reconhecimento, Sniper | 76 ops / 2018 |
| Raphael | CHARLIE-01 | Sargento-Mor | Comunicações, Logística | 71 ops / 2019 |

#### 2.4 Liderança (se houver)
- Componente: `.crew-section`
- Label: `// LIDERANÇA`
- Grid: `.crew-grid` auto-fill com cards `.crew-card--op`
- Exibir apenas se houver membros no nível LDR

#### 2.5 Operadores
- Componente: `.crew-section`
- Label: `// OPERADORES`
- Grid: `.crew-grid` auto-fill com cards `.crew-card--op`
- 6 operadores: Lucas Castro (Viper), Pedro Moraes (Shadow), Gabriel Braga (Wolf), Felipe Nunes (Hawk), Carlos Azevedo (Reaper), Thiago Santos (Phantom)

#### 2.6 Recrutas
- Componente: `.crew-section`
- Label: `// RECRUTAS`
- Grid: `.crew-grid` com cards `.crew-card--rec`
- 4 recrutas: Jonas Oliveira (Rookie), Bruno Lima (Newt), Rodrigo Gomes (Zero), Diego Neves (Echo)

#### 2.7 CTA de Recrutamento (banner compacto)
- Componente: `.recruit-cta-bar` (da recruit.css)
- Texto: "Quer fazer parte?" + botão → `recrutamento.html`

#### 2.8 Footer

---

### PÁGINA 3 — OPERADOR.HTML (Perfil Público Individual)

**URL:** `/site/operador.html?id=anderson-diego` (ou `operador-anderson.html`)
**Título:** `[Nome] — Task Force 81`
**CSS extra:** `crew.css`

> Nesta fase, criar versão estática com dados do operador no próprio HTML. Futuramente será gerado dinamicamente.

**Seções em ordem:**

#### 3.1 Navbar

#### 3.2 Hero (minimal) do perfil
- Componente: `.hero.hero--minimal`
- Background: gradiente individual do operador
- Eyebrow: `// PERFIL DO OPERADOR`
- Título: Nome do operador
- Subtítulo: Callsign + Posto

#### 3.3 Card de perfil expandido
- Componente: Variação grande do `.crew-card` para página dedicada
- Usar: `.crew-profile` (classe nova a criar em crew.css)
- Layout 2 colunas: avatar/foto à esq, dados à dir
- Elementos: Foto/avatar grande, rank badge, nome, callsign, especialidades, bio curta, stats, sociais

**Dados do `.crew-profile`:**
```
.crew-profile                   — wrapper grid 2 colunas
.crew-profile__visual           — coluna da foto (cover + avatar grande)
.crew-profile__cover            — faixa de cor (mesmo gradiente do card)
.crew-profile__avatar           — avatar grande (80px)
.crew-profile__body             — coluna de dados
.crew-profile__rank             — badge de posto
.crew-profile__name             — nome
.crew-profile__callsign         — callsign em mono
.crew-profile__bio              — parágrafo de bio
.crew-profile__specialties      — badges de especialidade
.crew-profile__stats-row        — linha de stats (operações, anos, etc.)
.crew-profile__socials          — links sociais
```

#### 3.4 Histórico de operações (lista)
- Componente: `.timeline` (da components.css)
- Listar as últimas operações em que o membro participou
- Cada item: data, nome da op, tipo (Treino/Operação/Externo), destaque se liderou

#### 3.5 Voltar ao Efetivo (link)

#### 3.6 Footer

---

### PÁGINA 4 — BLOG.HTML (Listagem)

**URL:** `/site/blog.html`
**Título:** `Blog — Task Force 81`
**CSS extra:** `blog.css`

**Seções em ordem:**

#### 4.1 Navbar
- Link ativo: "Blog"

#### 4.2 Hero (minimal)
- Eyebrow: `// BLOG DA UNIDADE`
- Título: "OPERAÇÕES & NOTÍCIAS"
- Subtítulo: "Relatórios de campo, análises táticas e atualizações da equipe."

#### 4.3 Post em destaque
- Componente: `.blog-card.blog-card--featured` (full-width)
- 1 post em destaque no topo

#### 4.4 Filtro de categorias
- Componente: chips de filtro (`.chip` da components.css ou `.blog-tag`)
- Categorias: Todos / Operações / Tutoriais / Notícias / Externos / Equipamentos

#### 4.5 Grid de posts
- Componente: `.blog-grid` com `.blog-card`
- Paginação visual: botões "Anterior" / "Próximo" (estáticos nesta fase)
- 6 a 9 cards por página

**Posts de exemplo (conteúdo fictício para a fase estática):**
1. Relatório — Operação Névoa de Outubro (Ops)
2. Análise — CQB: Técnicas para espaços confinados (Tutorial)
3. Notícia — Novo Recruta: Diego Neves integra a equipe (Notícias)
4. Externo — TF-81 no evento Operação Fronteira 2025 (Externos)
5. Equipamentos — Guia de réplicas recomendadas para iniciantes (Equip)
6. Relatório — Treino Noturno: Identificação e Comunicação (Ops)

#### 4.6 Footer

---

### PÁGINA 5 — BLOG-POST.HTML (Post Individual)

**URL:** `/site/blog-post.html` (ou `posts/operacao-nevoa.html`)
**Título:** `[Título do Post] — TF-81`
**CSS extra:** `blog.css`

**Seções em ordem:**

#### 5.1 Navbar

#### 5.2 Hero (minimal)
- Eyebrow: categoria do post (ex: `// OPERAÇÕES`)
- Título: título do post
- Subtítulo: data + autor + tempo de leitura

#### 5.3 Corpo do post
- Componente: `.blog-post` (classe a verificar/criar em blog.css)
- Layout: `max-width: 720px`, centralizado
- Elementos dentro do post:
  - `.blog-post__meta` — autor, data, tags
  - `.blog-post__cover` — imagem de capa (placeholder)
  - `.blog-post__body` — texto em tipografia legível (Barlow, line-height relaxed)
  - `.blog-post__body h2, h3` — subtítulos com estilo tático
  - `.blog-post__body blockquote` — citações estilizadas
  - `.blog-post__body img` — imagens com borda e caption
  - `.blog-post__tags` — tags no final do post
  - `.blog-post__author-card` — card do autor (mini crew card) no final

#### 5.4 Posts relacionados
- Componente: 3 `.blog-card--compact` em grid horizontal
- Label: `// LEIA TAMBÉM`

#### 5.5 Footer

---

### PÁGINA 6 — GALERIA.HTML

**URL:** `/site/galeria.html`
**Título:** `Galeria — Task Force 81`
**CSS extra:** `gallery.css`

**Seções em ordem:**

#### 6.1 Navbar
- Link ativo: "Galeria"

#### 6.2 Hero (minimal)
- Eyebrow: `// REGISTROS DE CAMPO`
- Título: "GALERIA"
- Subtítulo: "Fotos e álbuns das operações e treinos da TF-81."

#### 6.3 Álbuns em destaque
- Componente: `.album-grid` (da gallery.css)
- 4 álbuns em grade 2×2 com `.album-card`
- Cada álbum: capa, título, quantidade de fotos, data

**Álbuns de exemplo:**
- Operação Névoa 2025 (24 fotos)
- Treinos CQB — Série 2025 (18 fotos)
- Evento Fronteira 2025 (31 fotos)
- Equipamentos do Efetivo (12 fotos)

#### 6.4 Fotos recentes
- Label: `// FOTOS RECENTES`
- Componente: `.gallery-grid` com `.gallery-item`
- Grid masonry-like (CSS grid auto rows) com placeholders
- 12 fotos em grid, clicáveis (abrem modal lightbox)

#### 6.5 Lightbox (modal de foto)
- Componente: `.modal-backdrop` + `.gallery-lightbox` (nova classe em gallery.css)
- Navegação: prev/next
- Legenda, álbum, data
- Fechar com ESC ou clique fora

#### 6.6 Footer

---

### PÁGINA 7 — MIDIA.HTML

**URL:** `/site/midia.html`
**Título:** `Mídia — Task Force 81`
**CSS extra:** `media.css`

**Seções em ordem:**

#### 7.1 Navbar
- Link ativo: "Mídia"

#### 7.2 Hero (minimal)
- Eyebrow: `// CANAL YOUTUBE`
- Título: "CONTEÚDO TF-81"
- Subtítulo: "Vídeos de operações, análises táticas e bastidores da equipe."

#### 7.3 Vídeo em destaque
- Componente: `.yt-featured` (da media.css)
- Thumbnail grande + título + descrição + botão "Assistir"

#### 7.4 Últimos vídeos
- Label: `// ÚLTIMOS VÍDEOS`
- Componente: `.yt-grid` com `.yt-card`
- 6 cards de vídeo com thumbnail (placeholder), título, duração, data

#### 7.5 Playlists
- Label: `// PLAYLISTS`
- Componente: `.yt-playlist-card` (da media.css)
- 3 playlists: Operações / Tutoriais Táticos / Bastidores

#### 7.6 Link para o canal
- Componente: `.recruit-cta-bar` reaproveitado como CTA do YouTube
- Texto: "Inscreva-se no canal" + botão externo para YouTube

#### 7.7 Footer

---

### PÁGINA 8 — RECRUTAMENTO.HTML

**URL:** `/site/recrutamento.html`
**Título:** `Recrutamento — Task Force 81`
**CSS extra:** `recruit.css`, `crew.css`

**Seções em ordem:**

#### 8.1 Navbar
- Link ativo: "Recrutamento"

#### 8.2 Hero (minimal)
- Eyebrow: `// ALISTE-SE`
- Título: "FAÇA PARTE DA FORÇA"
- Subtítulo: "Estamos recrutando operadores comprometidos e disciplinados."

#### 8.3 Hero bloco + Requisitos + Formulário
- Componente: `.recruit-section` completo (identico à seção do index, mas expandido)
- Formulário completo

#### 8.4 Etapas do processo
- Componente: `.recruit-steps` (4 etapas)

#### 8.5 CTA final
- Componente: `.recruit-cta-bar`

#### 8.6 Estado-Maior (mini)
- Label: `// CONHEÇA A LIDERANÇA`
- 3 cards compactos do Estado-Maior (`.crew-card`)
- Botão "Ver efetivo completo" → `efetivo.html`

#### 8.7 Footer

---

### PÁGINA 9 — 404.HTML

**URL:** `/site/404.html`
**Título:** `Página não encontrada — Task Force 81`

**Seções em ordem:**

#### 9.1 Navbar (sem links ativos)

#### 9.2 Erro 404 centralizado
- Componente: `.hero.hero--minimal` com conteúdo especial
- Código: `404` em fonte display dourada gigante
- Subtítulo: "POSIÇÃO NÃO LOCALIZADA"
- Texto: "A página que você procura foi movida, removida ou nunca existiu."
- CTAs: "Voltar ao início" + "Ver o Efetivo"

#### 9.3 Footer

---

## 6. COMPONENTES NOVOS A CRIAR (complementos ao DS)

Alguns componentes são específicos do site e precisam ser adicionados ao arquivo `css/site.css` ou como extensões dos CSS existentes:

| Componente | Arquivo | Descrição |
|---|---|---|
| `.crew-profile` | `crew.css` (extensão) | Layout de perfil expandido para operador.html |
| `.blog-post` | `blog.css` (extensão) | Corpo de texto do post individual |
| `.blog-post__meta` | `blog.css` (extensão) | Metadados do post (autor, data, tags) |
| `.blog-post__author-card` | `blog.css` (extensão) | Card do autor no final do post |
| `.gallery-lightbox` | `gallery.css` (extensão) | Modal lightbox para foto ampliada |
| `.site-page` | `site.css` | Wrapper de página padrão |
| `.site-main` | `site.css` | Área de conteúdo principal |
| `.site-section` | `site.css` | Seção genérica com flex justify-center |
| `.site-section--alt` | `site.css` | Seção com bg alternado |
| `.site-divider` | `site.css` | Divisor dourado entre seções |

---

## 7. ASSETS NECESSÁRIOS

### 7.1 Assets existentes
- `assets/img/Patch de Apresentação TF81 - vFinal.png` — logo circular principal
- `assets/img/Patch de Combate TF81.jpeg` — logo alternativo
- `assets/img/Bandeira TF81 - vFinal.png` — bandeira decorativa

### 7.2 Assets a criar (placeholders nesta fase)
- Fotos de perfil dos operadores (placeholder: div com iniciais — já implementado no design-system)
- Thumbnails de vídeos YouTube (placeholder: div colorida com ícone play)
- Fotos de galeria (placeholder: div colorida com ícone câmera)
- Imagem de capa dos posts (placeholder: div com gradiente)
- Capas dos álbuns (placeholder: div com gradiente)

> **Convenção de placeholder:** Usar `<div class="crew-card__avatar-placeholder">XX</div>` e variações já definidas no design-system. Para imagens maiores, usar `background: linear-gradient(135deg, ...)` definido por membro/conteúdo.

### 7.3 Favicon
- Criar `favicon.ico` e `favicon.png` a partir do patch principal
- Adicionar em todas as páginas no `<head>`

---

## 8. COMPORTAMENTOS JS POR PÁGINA

| Comportamento | Páginas |
|---|---|
| Navbar scroll + scrolled class | Todas |
| Drawer mobile | Todas |
| Link ativo na navbar | Todas |
| Contadores animados (hero stats) | index.html |
| Animações de entrada por scroll (.animate-on-scroll) | index.html, efetivo.html |
| Lightbox da galeria | galeria.html |
| Filtros de categorias blog | blog.html |

---

## 9. META TAGS E SEO (PADRÃO POR PÁGINA)

Incluir em todas as páginas:
```html
<meta name="description" content="[descrição específica da página]">
<meta name="robots" content="index, follow">
<meta property="og:title" content="[Título da Página] — Task Force 81">
<meta property="og:description" content="[descrição]">
<meta property="og:image" content="../assets/img/Patch de Apresentação TF81 - vFinal.png">
<meta property="og:type" content="website">
<meta name="theme-color" content="#C4961A">
```

---

## 10. CONVENÇÕES OBRIGATÓRIAS

1. **Sempre usar `data-theme="dark"` no `<html>` como padrão**
2. **Navegação entre páginas:** usar caminhos relativos (`../site/efetivo.html`, `./blog.html`)
3. **Âncoras internas:** todos os IDs importantes têm `scroll-margin-top: 80px` em `site.css` para compensar a navbar sticky
4. **Seções da home** têm IDs que servem de âncora para links da navbar: `#sobre`, `#efetivo`, `#blog`, `#galeria`, `#midia`, `#recrutamento`
5. **Botões de "Ver mais"** sempre levam para a página completa, nunca expandem inline
6. **Formulário de recrutamento:** nesta fase, `action="#"` sem backend. Validação HTML5 básica (`required`, `type`, `min`)
7. **Links externos** (YouTube, Instagram, etc.) sempre com `target="_blank" rel="noopener noreferrer"`
8. **Imagens** sempre com `alt` descritivo e `loading="lazy"` (exceto o logo da navbar)

---

## 11. ORDEM DE IMPLEMENTAÇÃO

### Sprint 1 — Infraestrutura (fazer primeiro)
- [ ] Criar estrutura de pastas: `site/`, `css/`, `js/`
- [ ] Criar `css/site.css` com layout de página e utilitários
- [ ] Criar `js/site.js` com navbar scroll, drawer e link ativo
- [ ] Criar template base HTML com `<head>` completo

### Sprint 2 — Home (index.html)
- [ ] Estrutura da página com todas as seções
- [ ] Seção: Navbar
- [ ] Seção: Hero (fullscreen com stats)
- [ ] Seção: Sobre a TF-81
- [ ] Seção: Efetivo preview (só EM)
- [ ] Seção: Blog preview (3 cards)
- [ ] Seção: Galeria preview (6 fotos)
- [ ] Seção: Mídia preview (3 vídeos)
- [ ] Seção: Recrutamento CTA
- [ ] Seção: Footer
- [ ] JS: contadores animados
- [ ] JS: animações de entrada

### Sprint 3 — Efetivo
- [ ] `efetivo.html` completo
- [ ] Todos os 13 membros com dados corretos
- [ ] Verificar cards Estado-Maior (div, não `<a>`)
- [ ] CTA de recrutamento no final
- [ ] Criar `.crew-profile` em `crew.css`
- [ ] `operador.html` com perfil expandido (começar por Anderson Diego)

### Sprint 4 — Blog
- [ ] `blog.html` com listagem e filtros
- [ ] `blog-post.html` com corpo de post
- [ ] Criar `.blog-post` e variações em `blog.css`
- [ ] 6 posts de conteúdo fictício

### Sprint 5 — Galeria e Mídia
- [ ] `galeria.html` com grid e álbuns
- [ ] Lightbox modal funcional
- [ ] `midia.html` com vídeos e playlists

### Sprint 6 — Recrutamento e 404
- [ ] `recrutamento.html` completo
- [ ] `404.html`

### Sprint 7 — Revisão e ajustes
- [ ] Testar responsividade em mobile (360px), tablet (768px) e desktop
- [ ] Testar dark mode e light mode em todas as páginas
- [ ] Verificar links entre páginas
- [ ] Ajustar scroll-margin-top das âncoras
- [ ] Revisar meta tags
- [ ] Favicon

---

## 12. RESUMO DE TAREFAS

| # | Arquivo | Status |
|---|---|---|
| S1-1 | `site/` `css/` `js/` (estrutura de pastas) | Pendente |
| S1-2 | `css/site.css` | Pendente |
| S1-3 | `js/site.js` | Pendente |
| S2-1 | `site/index.html` | Pendente |
| S3-1 | `site/efetivo.html` | Pendente |
| S3-2 | `site/operador.html` | Pendente |
| S3-3 | `crew.css` — extensão `.crew-profile` | Pendente |
| S4-1 | `site/blog.html` | Pendente |
| S4-2 | `site/blog-post.html` | Pendente |
| S4-3 | `blog.css` — extensão `.blog-post` | Pendente |
| S5-1 | `site/galeria.html` | Pendente |
| S5-2 | `gallery.css` — extensão `.gallery-lightbox` | Pendente |
| S5-3 | `site/midia.html` | Pendente |
| S6-1 | `site/recrutamento.html` | Pendente |
| S6-2 | `site/404.html` | Pendente |
| S7 | Revisão geral + responsividade | Pendente |
