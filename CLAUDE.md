# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (Vite HMR)
pnpm build            # Type-check + build for production
pnpm build-only       # Build without type-check
pnpm type-check       # Run vue-tsc type checking
pnpm lint             # Run oxlint then eslint (both with --fix)
pnpm format           # Format src/ with Prettier
pnpm preview          # Preview production build
```

**Requirements:** Node ^20.19.0 || >=22.12.0, pnpm@10.10.0

## Architecture

Vue 3 + TypeScript admin dashboard for a business directory service. Built with Vite.

**Key libraries:**

- **UI:** shadcn-vue (New York style, 60+ components in `src/components/ui/`) + Reka UI primitives
- **Styling:** Tailwind CSS 4 (via `@tailwindcss/vite` plugin, no separate config file)
- **State:** Pinia stores in `src/stores/`
- **Routing:** Vue Router 5, routes defined in `src/router/index.ts`
- **Forms:** vee-validate + Zod schemas
- **Tables:** @tanstack/vue-table
- **Charts:** @unovis/vue
- **Utilities:** @vueuse/core, vue-sonner (toasts)

**Path alias:** `@/` → `src/`

**Code style (Prettier):** No semicolons, single quotes, 100-char line width.

## Domain Model

All business domain types are defined in `src/types.ts`:

- **User roles:** Admin, BusinessOwner
- **Business:** categories, locations, services, facilities, payment methods, features, operating hours, media, status
- **Geography:** Country → Division → District → Upazila hierarchy

## Component Conventions

- Use `<script setup lang="ts">` (Composition API)
- shadcn-vue components are in `src/components/ui/` — prefer these over installing new UI libraries
- CSS class merging via `cn()` utility from `src/lib/utils.ts` (clsx + tailwind-merge)

## Forms

- Always use native `<form @submit.prevent="onSubmit">` — never `<Form @submit>` from shadcn-vue
- `onSubmit` must be `form.handleSubmit(cb)` from `useForm()` — the two are only compatible with native form elements
- Never import the `Form` component from `@/components/ui/form` in pages/views; `useForm()` provides context via inject

## Instructions for Claude Code

- Do not explain unless asked
- Output only necessary code
- Reuse existing types from src/types.ts
- Do not create duplicate types
- Follow project structure
- Use shadcn-vue components
- Use Pinia for state logic
- Use Supabase client for API
- Keep files modular and clean
- Prefer composables for reusable logic
- Use TanStack Table for tables
- Use Unovis for charts
