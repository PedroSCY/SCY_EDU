# Link Redirect

Hub de redirecionamento de links educacionais. Crio links curtos por categoria para meus alunos acessarem materiais, vídeos, questionários e documentos com um clique — e gerencio tudo por um painel privado.

## Motivação

Todo início de semestre eu compartilhava dezenas de links com os alunos: formulários, videoaulas, PDFs, quizzes. Cada um num lugar diferente, cada turma com seu conjunto. Os alunos não tem acesso a contas individuais, então eles precisavam digitar links diferentes ou acessar multiplos paines até chegar em um determinado lugar de forma anonima.

Montei essa ferramenta pra resolver isso. Um lugar só onde eu cadastro e organizo os links por categoria, e os alunos acessam pela página inicial com filtros. Se um link sai do ar ou não faz mais sentido pro momento, eu desativo — sem perder o registro pra reativar depois.

## Funcionalidades

- **Página pública** com grid de cards, cada um com ícone e cor identificando o tipo de conteúdo (vídeo, documento, questionário, imagem, áudio, link)
- **Filtro por categoria** pra navegar rápido
- **Painel do professor** com dashboard, CRUD de links e categorias, ativar/desativar link
- **Redirecionamento** com página de confirmação antes de abrir o link externo
- **Autenticação** por email/senha via Supabase Auth, sessão mantida entre páginas

## Stack

| Camada | Escolha |
|--------|---------|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| UI | Tailwind CSS v4 + shadcn/ui |
| Autenticação | Supabase Auth (email/password) |
| Banco de dados | Supabase (PostgreSQL com RLS) |
| Testes | Vitest |
| Ícones | Lucide React |

## Como rodar

```bash
cp .env.example .env
# preencha SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY

npm install
npm run dev
```

Cria o primeiro admin:

```bash
# configure no .env
SEED_ADMIN_EMAIL="seu-email@provedor.com"
SEED_ADMIN_PASSWORD="sua-senha"

npx tsx scripts/seed-admin.ts
```

> O script usa a `SUPABASE_SERVICE_ROLE_KEY` (service_role, não a anon) pra criar o usuário via Admin API. Adicione também essa chave no `.env` apenas pra rodar o seed.

## Estrutura

```
src/
├── app/
│   ├── (public)/        # rotas públicas: /, /login, /r/[slug]
│   └── admin/           # rotas protegidas: dashboard, CRUD
├── components/
│   ├── ui/              # shadcn/ui (Button, Card, Badge, Dialog)
│   ├── confirm-dialog.tsx
│   └── link-type-config.tsx
├── core/
│   ├── entities/        # Link, Category, User
│   ├── repositories/    # interfaces
│   └── use-cases/       # regras de negócio
├── infra/supabase/      # implementação dos repositórios
└── shared/utils/        # validação, sanitização
```

## Deploy na Vercel

Conecte o repositório na Vercel, adicione as mesmas env vars do `.env` e o schema SQL é aplicado diretamente pelo Supabase Dashboard.

```sql
-- conteúdo do supabase-schema.sql
```
