# Design System — OdontoFlow

Identidade visual aplicada a partir dos arquivos de marca (`OdontoFlow_logo_arquivos.zip`).

## Paleta

| Token CSS | Uso | Hex aproximado |
|---|---|---|
| `--brand-navy` | Texto de marca, títulos escuros | `#08256B` |
| `--brand-navy-deep` | Fundo da sidebar (navy profundo) | `#0D1F42` |
| `--brand-blue` | Cor primária (botões, links, ícones ativos) — mapeada em `--primary` | `#0248BF` |
| `--brand-cyan` | Destaque/accent (item ativo na sidebar, gráficos) | `#0DCFF8` |

Os tokens ficam em `src/app/globals.css`, dentro de `:root`, e são expostos ao Tailwind via `@theme inline`
(`bg-brand-navy`, `text-brand-cyan`, etc.), além de alimentarem os tokens shadcn padrão (`--primary`,
`--sidebar`, `--chart-1` a `--chart-5`).

Os status coloridos do `StatusBadge` (`bg-blue-100`, `bg-green-100`, `bg-amber-100`...) usam a paleta
categórica padrão do Tailwind de propósito — **não** devem ser trocados pela cor de marca, pois cada cor
tem um significado semântico (pendente, pago, atrasado etc.) independente da marca.

## Logotipo

Arquivos em `public/brand/`, todos com fundo transparente (as versões originais enviadas tinham fundo
sólido; foram processadas para remover o fundo via chroma key):

- `icon-square.png` — símbolo do dente sozinho, enquadrado em canvas quadrado. Usado em favicons, cards de
  autenticação (login/cadastro/recuperação de senha) e no recibo em PDF.
- `logo-horizontal-dark-text.png` — logotipo completo (símbolo + "OdontoFlow" + tagline), texto em navy.
  Usar sobre fundos claros.
- `logo-horizontal-white-text.png` — mesma composição, texto em branco. Usar sobre fundos escuros
  (ex.: sidebar navy).
- `icon-original-crop.png` — recorte original do ícone, sem centralização em canvas quadrado (referência).

O board de referência original (com as 4 variações lado a lado) está em `docs/brand-board.png`.

### Favicon / ícone do app

Gerados a partir de `icon-square.png`:

- `src/app/icon.png` — favicon transparente (convenção do Next.js App Router).
- `src/app/apple-icon.png` — 180×180, fundo navy sólido (iOS não deve receber PNG transparente).
- `src/app/favicon.ico` — multi-tamanho (16/32/48), fundo navy para legibilidade em tamanhos pequenos.

## Onde a marca aparece

- **Sidebar** (`src/components/layout/Sidebar.tsx`): fundo `--brand-navy-deep`, logo horizontal branca,
  item ativo em ciano (`--sidebar-primary`).
- **Telas de autenticação** (login, cadastro, esqueci senha, redefinir senha): ícone quadrado centralizado
  no topo do card.
- **Recibo em PDF** (`ReceiptDocument.tsx`): ícone no cabeçalho, título em `--brand-blue`.
- **E-mail de redefinição de senha** (`authService.ts`): cabeçalho com o wordmark "OdontoFlow" e botão na
  cor primária.
- **Botões, links e badges de destaque**: herdam `--primary` automaticamente via componentes shadcn
  (`Button`, links `text-primary`, avatar do usuário no `Header`).

## Tipografia

O projeto mantém a fonte padrão (Geist Sans/Mono) já configurada em `src/app/layout.tsx` — os arquivos de
marca usam uma geométrica sans-serif similar para o wordmark, então não foi necessário trocar a fonte do
produto, só a paleta de cores.
