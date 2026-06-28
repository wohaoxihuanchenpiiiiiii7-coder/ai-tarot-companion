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

## EdgeSpark deployment

The repository keeps the existing Vite app at the project root and the Hono
worker in `server/`. `edgespark.toml.example` documents those paths. The real
`edgespark.toml` must be generated during EdgeSpark project initialization so it
contains the platform-issued project ID; commit that generated file, but never
commit `.env`.

### Local checks

```powershell
npm.cmd install
npm.cmd run lint
npm.cmd run build
cd server
npm.cmd install
cd ..
```

### Initialize EdgeSpark

The Windows PowerShell execution policy may block `edgespark.ps1`, so use the
`.cmd` executable:

```powershell
npm.cmd install -g @edgespark/cli
edgespark.cmd --version
edgespark.cmd login
cd ..
edgespark.cmd init ai-tarot-companion-edge --agent codex --template github:wohaoxihuanchenpiiiiiii7-coder/ai-tarot-companion
cd ai-tarot-companion-edge
```

Run initialization only after the reviewed deployment files have been committed
and pushed. Using the GitHub repository as the template ensures ignored local
files such as `.env` are not copied into the EdgeSpark project.

Keep the generated `project_id` and make sure its `edgespark.toml` uses the
paths shown in `edgespark.toml.example`: server path `server`, web path `.`, and
web output path `dist`.

### Configure production AI settings

Set non-sensitive values as EdgeSpark vars:

```powershell
edgespark.cmd var set AI_PROVIDER=deepseek AI_BASE_URL=https://api.deepseek.com AI_MODEL=deepseek-chat
```

Register the sensitive key separately:

```powershell
edgespark.cmd secret set AI_API_KEY
```

The secret command prints a secure EdgeSpark URL where the project owner enters
the value. Do not put the real key in a command, repository file, or chat.

### Validate and deploy

Run the non-deploying validation first:

```powershell
edgespark.cmd deploy --dry-run
```

Only after reviewing the reported build and public API routes, deploy to the
current live environment:

```powershell
edgespark.cmd deploy
edgespark.cmd log tail
```

Open the deployment URL returned by the CLI. Verify the homepage and card
images, then complete question optimization, an Ask a Question reading, and a
Daily Tarot reading. Confirm `/api/public/optimize-question` and
`/api/public/tarot-reading` return successful responses and that no server error
appears in `edgespark.cmd log tail`.
