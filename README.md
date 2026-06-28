# AI Tarot Companion

AI Tarot Companion is a full-stack AI tarot reading web app designed to support
emotional reflection and gentle personalized guidance. Tarot is used as an
interaction metaphor rather than a source of deterministic predictions.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Server-side AI API route planned for the MVP

## Current MVP scope

- Homepage entries for Ask a Question and Daily Tarot
- Relationship, career, and self question categories
- Optional AI-assisted question optimization
- One-card daily readings and manually drawn tarot spreads
- Three-card readings covering current situation, hidden cause, and action
  suggestion
- Warm, reflective AI interpretations without absolute predictions
- Result summaries, card details, guidance, disclaimer, and copy/share action
- The 3 most recent readings stored locally
- Mobile-first responsive experience

## Run locally

Prerequisite: a current Node.js release with npm.

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

To verify a production build:

```bash
npm run build
npm run preview
```

On Windows PowerShell systems that block `npm.ps1`, use `npm.cmd` in place of
`npm`.

## Environment variables

Copy `.env.example` to `.env` only when local variables are needed. AI API keys
must remain server-side and must never use Vite's client-exposed `VITE_` prefix.
Do not commit `.env` files or real credentials.

## Project status

Foundation verified. React, TypeScript, Vite, and Tailwind CSS are configured;
the initial structure and project rules are in place. Product features and the
full tarot flow have not been implemented yet.
