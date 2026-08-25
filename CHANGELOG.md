# Changelog

## Refinamento visual — mais elegante

- **Sombras**: substituída a `shadow-sm` padrão por `.shadow-elegant`, uma sombra
  difusa e tingida de navy (em vez de preto puro) nos cards de destaque
  (`StatCard`, `SectionCard`, `WelcomeCard`, `Odontogram`, cards de autenticação).
- **Navegação da sidebar**: item ativo trocou o bloco preenchido por um indicador
  mais discreto — barra fina ciano à esquerda + fundo levemente tingido, em vez de
  preenchimento sólido.
- **Cores mais contidas**: badges de ícone dos `StatCard` e status do odontograma
  com tons menos saturados (ex.: `amber-50`/`amber-700` em vez de
  `amber-100`/`amber-600`).
- **Espaçamento**: mais respiro em cards e seções (`p-6`→`p-7`, `p-8`→`p-9` nos
  cards de autenticação), bordas mais claras (hairline), radius levemente maior
  (`0.625rem`→`0.75rem`) para um acabamento mais suave.
- **Glow ambiente** também nas telas de login/cadastro/recuperação de senha, para
  coerência com o restante do app.

## UX/UI — identidade odontológica e modernização

- **Tipografia**: Plus Jakarta Sans (via `next/font/google`) para títulos e destaques
  (`font-heading`), aplicada em `PageHeader`, `SectionCard`, cabeçalhos de paciente,
  telas de autenticação, dashboard e plano de tratamento. Geist Sans continua para
  UI densa (tabelas, formulários).
- **Odontograma visual** (`src/clinic-ui/dental/Odontogram.tsx`): mapa interativo dos
  32 dentes em notação FDI, cores por status (planejado/em andamento/concluído).
  Integrado ao Plano de Tratamento — clicar num dente sem procedimento cria um item
  novo já com o dente preenchido; clicar num dente com procedimento existente rola a
  tela até o card correspondente e o destaca por instantes.
- **Dashboard**: `WelcomeCard` redesenhado com um traço decorativo que ecoa o
  conector do ícone da marca, e mostra o número de consultas do dia; `StatCard` com
  ícone em badge colorido por categoria e valor em destaque com números tabulares.
- **Fundo ambiente**: glow sutil nas cores da marca atrás do conteúdo principal
  (`.bg-ambient-glow`), substituindo o cinza chapado padrão.

## Conversão para OdontoFlow (SaaS odontológico)

Adaptação completa do domínio de dados, terminologia e identidade visual do
sistema (originalmente construído para uma clínica de terapia) para
odontologia. Instância única por clínica — sem multi-tenant nesta etapa.

### Modelo de dados
- `Patient`: novos campos `email`, `cpf`, `insurancePlan`
- `Anamnesis`: reescrita para campos odontológicos (`medicalConditions`,
  `previousSurgeries`, `isPregnant`, `isSmoker`, `hasBruxism`,
  `lastDentalVisit`, `dentalHistory`, `oralHygieneHabits`)
- `Procedure` (novo): catálogo de procedimentos da clínica
- `TreatmentPlan` + `TreatmentPlanItem` (novo): plano de tratamento por
  itens, cada um com procedimento, dente (FDI), face, status e custo
  estimado — substitui os campos de plano terapêutico (abordagem, metas,
  critérios de alta)
- `Appointment`: novos campos `professionalId` (dentista responsável) e
  `procedureId`; duração padrão 30min (era 50min)
- `User`: papel padrão `Dentista` (era `Terapeuta`); novos campos
  `croNumber`, `specialty`
- `Patient.status`: `"Em Terapia"` → `"Em Tratamento"`
- `Message.type`: `"LembreteSessao"` → `"LembreteConsulta"`
- Migration `20260824000000_dental_saas` cobre todo o diff acima

### Funcionalidades novas
- Catálogo de Procedimentos (CRUD completo, rota `/procedures`)
- Rota `/api/professionals` para listar dentistas em seletores
- Plano de tratamento por procedimento/dente com custo total calculado
- Agenda com seleção de dentista responsável e procedimento

### Identidade visual
- Paleta extraída da marca OdontoFlow aplicada em `globals.css`
- Sidebar redesenhada (navy + ciano), logo aplicada em telas de
  autenticação, recibo em PDF e e-mail de redefinição de senha
- Ícones do app (favicon, apple-icon) gerados a partir do logotipo
- Ver `docs/DESIGN_SYSTEM.md` para o detalhamento

### Terminologia
- "Terapeuta" → "Dentista", "sessão" → "consulta"/"atendimento" em toda a
  interface, e-mails e mensagens de WhatsApp
- "ClinicOffice" → "OdontoFlow" em todos os textos e templates
