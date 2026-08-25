# OdontoFlow

SaaS de gestão para clínicas odontológicas: cadastro de pacientes, anamnese,
agenda com dentista e procedimento vinculados, catálogo de procedimentos,
plano de tratamento por dente/procedimento, financeiro (com cobranças
recorrentes e recibo em PDF), lembretes automáticos por WhatsApp, relatórios
e gestão de equipe.

> Este projeto nasceu como uma adaptação de um sistema de prontuário para
> clínicas de terapia — a base técnica (Next.js, Prisma, autenticação,
> financeiro, mensageria) foi mantida, e o domínio de dados e a identidade
> visual foram totalmente reconstruídos para odontologia. Veja
> `docs/DESIGN_SYSTEM.md` para a identidade visual e `ARCHITECTURE.md` para
> os princípios de arquitetura.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Prisma** + **PostgreSQL**
- **Tailwind CSS v4** + **shadcn/ui** (design system próprio em `src/clinic-ui`)
- Autenticação por JWT em cookie (login, cadastro, recuperação de senha)
- E-mail transacional via **Resend** (opcional — sem chave configurada, cai
  em modo desenvolvimento e só imprime no console)
- Lembretes de consulta via **WhatsApp Cloud API** (opcional, mesmo esquema)
- Geração de recibo em **PDF** (`@react-pdf/renderer`)

## Como rodar localmente

```bash
npm install
cp .env.example .env   # preencha DATABASE_URL com seu Postgres
npx prisma migrate deploy
npx prisma db seed     # opcional: dados de exemplo (pacientes, procedimentos...)
npm run dev
```

Login de exemplo criado pelo seed: `admin@clinica.com` / `clinica123`.

As variáveis de e-mail, WhatsApp e cron são todas opcionais para
desenvolvimento local — veja os comentários em `.env.example` para o passo a
passo de cada uma quando for para produção.

## Estrutura

- `src/app` — rotas (App Router) e endpoints de API
- `src/features` — lógica de negócio organizada por domínio (patients,
  procedures, agenda, financial, auth, reports...), cada uma com seus
  `types`, `schemas` (Zod), `repositories` (Prisma), `services` e
  `components`
- `src/clinic-ui` — design system próprio (cards, tabelas, formulários,
  layout) usado em todas as telas
- `prisma/schema.prisma` — modelo de dados
- `public/brand` — ativos da identidade visual (logo, ícone)

## Domínio de dados (resumo)

- **Patient** — cadastro do paciente (CPF, convênio, contato)
- **Anamnesis** — ficha clínica odontológica (condições sistêmicas,
  alergias, bruxismo, histórico odontológico, higiene bucal...)
- **Procedure** — catálogo de procedimentos da clínica (nome, categoria,
  preço e duração padrão)
- **TreatmentPlan** / **TreatmentPlanItem** — plano de tratamento como uma
  lista de procedimentos planejados, cada um com dente (notação FDI), face,
  status e custo estimado
- **Appointment** — consulta agendada, vinculada a paciente, dentista
  responsável e procedimento
- **FinancialEntry** / **RecurringCharge** — financeiro do paciente
- **User** — usuários do sistema (Admin/Dentista), com CRO e especialidade
