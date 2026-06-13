## FASE 2 — APP INTERNO: Módulos pendentes

Estes módulos são para a plataforma privada de gestão da equipe. Virão **depois** do site público estar pronto. Cada um segue o padrão `app.css` (shell com sidebar + topbar + conteúdo).

---

### TAREFA APP-1 — AUTENTICAÇÃO (LOGIN)

**Arquivo CSS a criar:** `design-system/css/auth.css`
**ID no showcase:** `#ds-auth`

**O que é:** Página de login para operadores acessarem a área interna. Tela isolada (sem sidebar), com identidade visual da TF-81.

**Componentes:**

```
.auth-page          — fullscreen, centralizado, bg escuro com scanlines
.auth-card          — card de login centralizado (max-width: 400px)
.auth-card__brand   — logo + nome no topo do card
.auth-card__title   — "ACESSO RESTRITO" ou "LOGIN"
.auth-card__body    — formulário (email/callsign + senha)
.auth-card__footer  — link "Esqueci minha senha" + versão
.auth-alert         — alerta de erro de login
```

**Funcionalidade esperada:** Form com campos `callsign` ou `email` + `senha` + botão "Acessar" + link de recuperação. Validação no front (campos vazios). Sem backend definido ainda.

---

### TAREFA APP-2 — PAINEL DE RECRUTAMENTO (ADMIN)

**Arquivo CSS a criar:** `design-system/css/recruit-admin.css`
**ID no showcase:** `#ds-recruit-admin`

**O que é:** Tela interna para o Estado-Maior visualizar e gerenciar candidaturas recebidas pela seção pública.

**Componentes:**

```
.recruit-pipeline           — visão kanban de etapas (colunas)
.recruit-col                — coluna kanban (etapa do processo)
.recruit-col__header        — header da coluna com nome da etapa e contador
.recruit-candidate-card     — card do candidato na coluna
.recruit-candidate-card__name
.recruit-candidate-card__callsign
.recruit-candidate-card__date   — data de candidatura
.recruit-candidate-card__actions — botões: Aprovar / Rejeitar / Ver detalhes
.recruit-detail-panel       — painel lateral de detalhes do candidato (drawer)
```

**Status de candidatura:** `NOVA` / `EM AVALIAÇÃO` / `TREINO MARCADO` / `APROVADO` / `REJEITADO`

---

### TAREFA APP-3 — CALENDÁRIO DE EVENTOS

**Arquivo CSS a criar:** `design-system/css/calendar.css`
**ID no showcase:** `#ds-calendar`

**O que é:** Tela do app interno para gerenciar e visualizar treinos, operações e eventos externos. Vista mensal + lista de próximos eventos.

**Componentes:**

```
.cal                    — wrapper principal
.cal__header            — navegação mês/ano + botões prev/next
.cal__grid              — grid 7 colunas (dias da semana)
.cal__day               — célula de dia
.cal__day--today        — destaque para hoje
.cal__day--has-event    — dia com evento marcado
.cal__event-dot         — indicador de evento (bullet colorido)
.cal__event-pill        — pill de evento dentro do dia (desktop)
.cal-event-list         — lista de próximos eventos
.cal-event-item         — item de evento na lista
.cal-event-item__date   — data/hora (mono)
.cal-event-item__type   — badge do tipo (Treino / Operação / Externo)
.cal-event-item__title
.cal-event-item__place  — local
```

**Tipos de evento e cores:**
- `Treino` → verde militar (`--color-brand-military`)
- `Operação` → dourado (`--color-text-gold`)
- `Externo / Convite` → cobre (`--color-text-copper`)
- `Administrativo` → muted

---

### TAREFA APP-4 — CONTROLE DE PRESENÇA

**Arquivo CSS a criar:** `design-system/css/attendance.css`
**ID no showcase:** `#ds-attendance`

**O que é:** Tela para registrar e visualizar presença dos operadores em treinos e operações.

**Componentes:**

```
.attendance-event-header    — info do evento selecionado + data
.attendance-list            — lista de operadores com toggle de presença
.attendance-row             — linha de operador
.attendance-row__avatar     — mini avatar com iniciais
.attendance-row__name
.attendance-row__rank-badge — badge de posto
.attendance-toggle          — switch presente/ausente/justificado
.attendance-summary         — resumo (X presentes / Y ausentes / Z justificados)
.attendance-history-table   — tabela histórica de presenças por operador
.attendance-rate            — barra de taxa de presença (% com progress bar)
```

---

### TAREFA APP-5 — INVENTÁRIO / EQUIPAMENTOS

**Arquivo CSS a criar:** `design-system/css/inventory.css`
**ID no showcase:** `#ds-inventory`

**O que é:** Controle de equipamentos da equipe e por operador. Pode ser por item (réplica, colete, acessório) associado a um operador.

**Componentes:**

```
.inv-grid               — grid de cards de equipamentos
.inv-card               — card de item de equipamento
.inv-card__img          — imagem ou placeholder da réplica
.inv-card__name         — nome do item
.inv-card__type-badge   — tipo (Réplica / Colete / Acessório / Munição)
.inv-card__owner        — operador dono
.inv-card__status       — status (Operacional / Manutenção / Inativo)
.inv-card__actions
.inv-owner-panel        — painel por operador listando seus equipamentos
.inv-stats-bar          — barra de resumo geral do inventário
```

---

### TAREFA APP-6 — CONTROLE FINANCEIRO

**Arquivo CSS a criar:** `design-system/css/finance.css`
**ID no showcase:** `#ds-finance`

**O que é:** Controle de mensalidades, entradas e saídas financeiras da equipe. Dashboard + tabela de transações + status por operador.

**Componentes:**

```
.fin-summary-row            — barra de KPIs financeiros (saldo, entradas, saídas)
.fin-kpi                    — KPI individual financeiro (reutiliza `.kpi` do app.css com variação)
.fin-transaction-table      — tabela de transações (data / tipo / descrição / valor / saldo)
.fin-row--income            — linha de entrada (verde)
.fin-row--expense           — linha de saída (vermelho)
.fin-badge-paid             — badge "Pago" (verde)
.fin-badge-pending          — badge "Pendente" (âmbar)
.fin-badge-late             — badge "Em atraso" (vermelho)
.fin-member-dues            — tabela de situação de mensalidades por operador
.fin-chart-placeholder      — área reservada para gráfico (implementação futura)
```

---

## RESUMO EXECUTIVO

| # | Módulo | Fase | CSS Novo | Prioridade |
|---|--------|------|----------|------------|
| T7 | Navbar / Header | Site Público | `navbar.css` | CRÍTICO |
| T8 | Footer | Site Público | `footer.css` | CRÍTICO |
| T9 | Hero / Landing | Site Público | `hero.css` | CRÍTICO |
| T10 | Sobre a TF-81 | Site Público | `about.css` | CRÍTICO |
| T11 | Recrutamento Público | Site Público | `recruit.css` | CRÍTICO |
| A1 | Login / Auth | App Interno | `auth.css` | MÉDIO |
| A2 | Recrutamento Admin | App Interno | `recruit-admin.css` | MÉDIO |
| A3 | Calendário | App Interno | `calendar.css` | MÉDIO |
| A4 | Presença | App Interno | `attendance.css` | BAIXO |
| A5 | Inventário | App Interno | `inventory.css` | BAIXO |
| A6 | Financeiro | App Interno | `finance.css` | BAIXO |

**Ordem de execução recomendada:** T7 → T9 → T10 → T11 → T8 (navbar primeiro para definir header, hero depois para contexto visual, sobre e recrutamento no meio, footer por último para fechar o layout). App interno começa pelo A1 (auth) após o site público estar completo.
