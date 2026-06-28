# AGENTS.md

## Project

AI Tarot Companion is a full-stack AI tarot reading web app for young users who
want emotional support, self-reflection, and gentle personalized guidance.

## Product positioning

This is not a deterministic fortune-telling tool. It is an AI emotional
companion and self-exploration product using tarot as an interaction metaphor.

## Development rules

- Use React + TypeScript.
- Use Tailwind CSS.
- Use reusable components.
- Keep styles modular and easy to replace later with Figma design.
- Use central theme variables for colors, spacing, border radius, and shadows
  where possible.
- Do not expose any AI API key in frontend code.
- AI calls must go through a server-side API route.
- Save the most recent 3 readings with `localStorage` for the MVP.
- Use mobile-first responsive design.
- Keep code readable and avoid unnecessary complexity.

## Product rules

- The homepage has two entries: Ask a Question and Daily Tarot.
- The Ask a Question flow includes category selection, question input, optional
  AI question optimization, spread selection, manual card drawing, and AI
  interpretation.
- Categories are relationship, career, and self.
- The Daily Tarot flow directly lets users draw one card and receive a daily
  reading.
- The three-card spread structure is current situation, hidden cause, and action
  suggestion.
- The result page includes a one-sentence summary, personalized interpretation,
  emotional support, action suggestion, card name and orientation,
  click-to-expand traditional meaning, copy/share icon, and bottom disclaimer.
- AI output must not make absolute predictions.
- AI should use warm, reflective, possibility-based language.

## Visual direction

- Main color: purple.
- Accent color: yellow.
- Style: minimal, soft vintage, gentle, and slightly mysterious.
- Avoid heavy gothic, cyberpunk, or overly dark styles.
- Keep the layout clean and easy to restyle after the Figma design is finalized.

## Repository structure

- Reusable UI: `src/components`
- Route-level views: `src/pages`
- Static domain data: `src/data`
- Shared helpers: `src/lib`
- Global and theme styles: `src/styles`
- Shared TypeScript definitions: `src/types`
- Product and implementation documentation: `docs`

## Quality and security

- Never commit secrets, API keys, `.env` files, dependencies, or build output.
- Keep browser-exposed variables free of secrets; Vite variables prefixed with
  `VITE_` are included in client bundles.
- Run `npm run build` and `npm run lint` before committing functional changes.
