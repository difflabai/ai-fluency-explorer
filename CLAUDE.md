# CLAUDE.md — AI Fluency Explorer

_Location: /CLAUDE.md (project root)_

> **Scope** – Project-specific instructions for the AI Fluency Explorer app.
> Inherits from `~/.claude/CLAUDE.md` unless overridden below.

---

## 0 · Project Overview

An interactive AI fluency assessment platform built with React + TypeScript + Supabase. Users take timed assessments (Quick: 20 questions, Comprehensive: 50+) across 4 AI knowledge categories and 5 difficulty levels, then view scored results with visualizations.

**Org:** Catalyst-AI-Services
**Repo:** `Catalyst-AI-Services/ai-fluency-explorer`

---

## 1 · Tech Stack

| Layer     | Technology                                                      |
| --------- | --------------------------------------------------------------- |
| Framework | React 18.3 + TypeScript 5.5                                     |
| Build     | Vite 5.4 (SWC)                                                  |
| Styling   | TailwindCSS 3.4 + shadcn-ui (Radix)                             |
| Routing   | React Router DOM 6.x                                            |
| State     | React Context (auth) + React Query 5.x (server) + hooks (local) |
| Backend   | Supabase (Postgres, Auth, Edge Functions)                       |
| Charts    | Recharts 2.x                                                    |
| Forms     | React Hook Form + Zod                                           |

---

## 2 · Key Commands

```bash
npm run dev        # Start dev server on :8080
npm run build      # Production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

---

## 3 · Architecture

```
src/
├── pages/          # Route-level components (Index, Auth, Admin, Leaderboard)
├── components/     # Feature-organized components
│   ├── ui/         # shadcn-ui primitives (don't edit directly)
│   ├── auth/       # Auth forms, protected routes
│   ├── admin/      # Admin panel controls
│   ├── leaderboard/
│   ├── question-breakdown/
│   └── shared-result/
├── contexts/auth/  # AuthContext + AuthProvider
├── hooks/          # useTestState, use-mobile, use-toast
├── services/       # Supabase data access layer
├── utils/
│   ├── scoring/    # Fluency tier calculation
│   ├── testData/   # Sample data generators
│   └── database/   # Migration utilities
├── integrations/supabase/  # Client init + generated types
└── data/           # questions.json seed data
```

### Routing

| Route                | Auth   | Component              |
| -------------------- | ------ | ---------------------- |
| `/`                  | Public | Index (landing + test) |
| `/auth`              | Public | Auth (login/signup)    |
| `/leaderboard`       | Public | Leaderboard            |
| `/shared/:shareId`   | Public | SharedResultView       |
| `/admin`             | Admin  | Admin panel            |
| `/admin/system-test` | Admin  | System diagnostics     |

---

## 4 · Supabase

**Current setup:** Hosted instance (credentials in `src/integrations/supabase/client.ts`).

**Database tables:** `categories`, `questions`, `test_types`, `test_questions_map`, `test_results`, `user_roles`

**Auth:** Email/password, magic links, password reset via Supabase Auth.

**Admin check:** Queries `user_roles` table or `is_admin()` RPC.

**Future:** Local Supabase dev via Docker (`supabase start`). Migration files exist in `supabase/migrations/`.

---

## 5 · Code Quality Rules

- **Commits:** Conventional (`feat:`, `fix:`, `chore:`, etc.) — enforced by commitlint
- **Pre-commit:** lint-staged runs ESLint + Prettier on staged files
- **Formatting:** Prettier (88 char, single quotes, trailing commas)
- **Linting:** ESLint with TypeScript + React Hooks rules
- **TypeScript:** Strict mode is OFF — `noImplicitAny: false`, `strictNullChecks: false`
- **No test framework** yet — adding Vitest is planned

---

## 6 · Known Issues & Tech Debt

- Supabase credentials hardcoded (should move to `.env`)
- TypeScript strict mode disabled
- No test coverage
- `lovable-tagger` dev dependency (artifact from Lovable platform generation)
- Some components have tight coupling (see TODO.md)
- Visual layout inconsistencies in shared results view

---

## 7 · PR Review & Collaboration

- Use `pr-review-loop` skill for iterating on PR feedback
- Use `gemini-peer-review` or `codex-peer-review` for architecture decisions
- Branch naming: `type/issue-id-slug` (e.g., `feat/explorer-a3f2dd-add-vitest`)
- Beads issue tracker initialized — use `bd ready` to find work

---

## 8 · Security

- Never commit `.env` files or Supabase service role keys
- The anon key in `client.ts` is a publishable key (safe in client code)
- Auth tokens managed by Supabase SDK — don't store manually
- Admin routes protected by `AdminRoute` component + server-side RPC check

---

_End of project instructions._
