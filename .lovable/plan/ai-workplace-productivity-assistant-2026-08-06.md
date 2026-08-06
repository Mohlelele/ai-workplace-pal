# AI Workplace Productivity Assistant

A session-only SaaS dashboard with three AI tools: Smart Email Generator, AI Task Planner, and AI Chatbot. No login, no database, no persistence — everything lives in React state and disappears on refresh.

## Design

- Light Blue primary, Soft Yellow accent, white background, dark gray text — all as semantic tokens in `src/styles.css` (light + dark).
- Left sidebar nav (Dashboard, Email Generator, Task Planner, Chatbot) that collapses to icons on desktop and to an off-canvas drawer on mobile.
- Top bar with page title, disclaimer badge, and sidebar toggle.
- Card-based layout, rounded corners, subtle shadows, professional type pairing (geometric sans headings + neutral sans body loaded via a font link in the root route).

## Pages

**Dashboard home** — greeting, three tool cards with descriptions and CTAs, quick-usage tips, disclaimer banner.

**Email Generator** — Recipient, Purpose, Additional Context inputs plus a tone selector (Formal / Friendly / Persuasive). Generated email renders in an editable textarea with Copy and Regenerate buttons.

**Task Planner** — Goal, Planning Period (Daily/Weekly), Priority (High/Medium/Low), Available Working Hours. Output is an editable schedule (time-blocked list rendered as editable markdown/text) with Copy and Regenerate.

**Chatbot** — session-only message thread, streaming assistant replies, each assistant message editable in place and copyable, plus Clear chat.

## AI

- Lovable AI powers all three tools; the API key stays server-side, so no keys or model calls in the browser.
- Each feature has its own structured internal prompt that turns the form fields into a specific instruction (role, tone, constraints, output format) so results are consistent.
- Errors are surfaced clearly in the UI: rate limit, credits exhausted, and network failures each get their own message, with the user's inputs preserved.

## Responsible AI

The disclaimer appears on every page (top bar badge + a footer/inline notice on each tool):
"AI-generated content may contain inaccuracies. Always review and verify outputs before using them for professional or business purposes. Do not enter confidential or sensitive information."

## Technical notes

- TanStack Start routes: `src/routes/index.tsx` (dashboard), `email.tsx`, `planner.tsx`, `chat.tsx`, with shared sidebar/topbar chrome in `__root.tsx`. Each route gets its own `head()` metadata.
- Email and Planner call `createServerFn` handlers in `src/lib/ai.functions.ts` (streamed server-side, single result returned). Chat uses a streaming server route at `src/routes/api/chat.ts` with `useChat` on the client.
- Model: `openai/gpt-5.6-sol` via the Lovable AI Gateway Responses API, streamed.
- State: local component state only; no localStorage, no tables, no Cloud database.
- Reusable pieces: `ToolShell` (card + disclaimer wrapper), `GeneratedOutput` (editable textarea + Copy/Regenerate), shadcn form/select/button/toast primitives.
