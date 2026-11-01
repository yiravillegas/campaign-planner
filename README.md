# Campaign Planner

A fresh campaign calendar MVP for small-business owners. This standalone app carries forward the customer lessons from Campaign Champ: start with the business and desired result, use plain language, keep drafts editable, and never treat approval as publication.

## Current app

The app opens on fictional BrightNest Cleaning sample content, so the calendar can be explored without credentials. Edits save to the current browser. Supabase Auth, owner-only saved campaigns, and OpenAI campaign generation are available after setup.

- Frontend: Vite + React
- Backend and saved campaigns: Supabase Auth, Postgres with row-level security, and an Edge Function
- AI: OpenAI API called server-side from the Edge Function
- Authentication: Supabase email/password; no Clerk
- No automatic publishing, ad buying, performance promises, or real customer data

## Start the app

Import this repository into Bolt as a Vite + React project, or run locally:

```sh
npm install
cp .env.example .env.local
npm run dev
```

The sample calendar works before Supabase is connected. To enable accounts and cloud saves, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`. Keep the OpenAI key out of browser environment variables.

## Supabase setup

1. Create a Supabase project and enable email/password sign-in.
2. Run `supabase/migrations/20261101000100_campaign_planner_mvp.sql`.
3. Add `OPENAI_API_KEY` as an Edge Function secret. Optional settings: `OPENAI_CAMPAIGN_MODEL` and `APP_ORIGIN`.
4. Deploy `supabase/functions/generate-campaign-plan` with JWT verification enabled.
5. Restart the app after setting the public Supabase URL and anon/publishable key.

The database policy checks each row against the signed-in user. AI returns drafts for review. The user chooses when and where to publish outside this app.

## Product docs

- [MVP scope and requirements](docs/PRD.md)
- [Bolt starting prompt](docs/BOLT-STARTER-PROMPT.md)
- [Fresh app setup](docs/MVP-IMPORT.md)
- [Solo contribution flow](CONTRIBUTING.md)

## Ownership

This is a solo project. Yira owns the scope, repository, implementation, review, and submission. The repository is public, so use only fictional demo content and never commit API keys, passwords, tokens, `.env` files, or private client/customer data.
