# ⚠️ DEPRECATED - This repository has moved

> **This repository is no longer maintained.**
>
> The AI Fluency Explorer has moved to **Diff AI Lab**:
>
> **➡️ https://github.com/difflabai/ai-fluency-explorer**
>
> Please use the new repository for the latest code, issues, and contributions.
> This repo is kept for historical reference only.

---

# AI Fluency Assessment Platform

An interactive platform to test and evaluate understanding of AI concepts through adaptive assessments.

## Features

- **Two Assessment Types**: Quick (15 questions) and Comprehensive (all questions)
- **5 Difficulty Levels**: Novice → Advanced Beginner → Competent → Proficient → Expert
- **4 Knowledge Categories**: Prompt Engineering, AI Ethics, Technical Concepts, Practical Applications
- **Detailed Results**: Category breakdowns, score analysis, fluency tier placement
- **Public Leaderboard**: Compare results with other users
- **Shareable Results**: Unique links for sharing assessment outcomes
- **Admin Panel**: Data management, system diagnostics, user role management

## Tech Stack

| Layer     | Technology                  |
| --------- | --------------------------- |
| Framework | React 18 + TypeScript       |
| Build     | Vite 5 (SWC)                |
| Styling   | TailwindCSS + shadcn-ui     |
| State     | React Query + React Context |
| Backend   | Supabase (Postgres, Auth)   |
| Charts    | Recharts                    |
| Testing   | Vitest                      |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun
- Docker Desktop (for local Supabase)
- Supabase CLI: `brew install supabase/tap/supabase`

### Quick Start (Hosted Supabase)

```bash
# Clone the repo (NEW LOCATION)
git clone https://github.com/difflabai/ai-fluency-explorer.git
cd ai-fluency-explorer

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

App runs at http://localhost:8080

### Local Supabase Development

For offline development or to run your own instance:

```bash
# 1. Start local Supabase (requires Docker)
npm run supabase:start

# 2. Update .env to use local Supabase
# VITE_SUPABASE_URL=http://localhost:54321
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# 3. Start the app
npm run dev

# 4. Seed questions (in browser console)
window.devUtils.migrateJsonData()

# 5. Make yourself admin (in Supabase Studio SQL editor at localhost:54323)
SELECT public.add_user_role('your@email.com', 'admin');
```

#### Supabase Commands

```bash
npm run supabase:start    # Start local Supabase
npm run supabase:stop     # Stop local Supabase
npm run supabase:status   # Check status
npm run supabase:reset    # Reset database (runs migrations + seed)
npm run supabase:migrate  # Run pending migrations
```

## Project Structure

```
src/
├── pages/           # Route-level components
├── components/      # Feature-organized components
│   ├── ui/          # shadcn-ui primitives
│   ├── auth/        # Auth forms, protected routes
│   ├── admin/       # Admin panel controls
│   └── leaderboard/ # Leaderboard components
├── contexts/        # React Context providers
├── hooks/           # Custom React hooks
├── services/        # Supabase data access
├── utils/           # Business logic, scoring
├── integrations/    # External service configs
└── data/            # Question seed data (JSON)

supabase/
├── config.toml      # Local Supabase config
├── migrations/      # Database schema migrations
└── seed.sql         # Initial seed data
```

## Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run test         # Run tests
npm run test:watch   # Tests in watch mode
```

## Database Schema

- **categories** — Question categories (Prompt Engineering, AI Ethics, etc.)
- **questions** — Assessment questions with difficulty and versioning
- **test_types** — Quick vs Comprehensive assessment configs
- **test_questions_map** — Maps questions to test types
- **test_results** — Completed assessment results
- **user_answers** — Individual question responses
- **user_roles** — Admin role assignments

## Documentation

- [SPEC.md](SPEC.md) — System design and architecture
- [CLAUDE.md](CLAUDE.md) — AI assistant context for this project
- [AGENTS.md](AGENTS.md) — Multi-agent workflow instructions

## Contributing

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make changes and test
3. Run `npm run lint && npm run test`
4. Commit with conventional commits: `git commit -m "feat: add feature"`
5. Push and create PR

## License

Private — Diff AI Lab (formerly Catalyst AI Services)
