# AI Tarot Companion

AI Tarot Companion is a full-stack AI tarot reading web app designed to support
emotional reflection and gentle personalized guidance. Tarot is used as an
interaction metaphor rather than a source of deterministic predictions.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Hono server API with a mock AI provider abstraction

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
npm.cmd install
npm.cmd run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

During local development, Vite serves the frontend and mounts the same Hono
handlers under `/api/*`. EdgeSpark can use `server/src/index.ts` as its worker
entry point later.

To verify a production build:

```bash
npm.cmd run build
npm.cmd run preview
```

On Windows PowerShell systems that block `npm.ps1`, use `npm.cmd` in place of
`npm`.

## Environment variables

Copy `.env.example` to `.env` only when local variables are needed. AI API keys
must remain server-side and must never use Vite's client-exposed `VITE_` prefix.
Do not commit `.env` files or real credentials.

The current default is `AI_PROVIDER=mock`; it makes no external AI request.

## Using DeepSeek locally

1. Create a local `.env` file from `.env.example`.
2. Configure the server-only values:

   ```env
   AI_PROVIDER=deepseek
   AI_API_KEY=your_own_deepseek_api_key
   AI_BASE_URL=https://api.deepseek.com
   AI_MODEL=deepseek-chat
   ```

3. Start the app with `npm.cmd run dev`.

Use your own DeepSeek API key and never commit `.env`. The browser continues to
call only the internal `/api/*` routes; the key is read by the local server
configuration and is never sent to frontend code. On Windows PowerShell, use
the `npm.cmd` commands above when `npm` is blocked by execution policy.

## Project status

The clickable MVP flow, local reading history, generation safeguards, internal
Hono API, mock provider, and optional DeepSeek provider are implemented. Real
provider use remains opt-in through local server-side environment variables.
