# Fresh Campaign Calendar app setup

This is a solo, clean-start build for a small-business Campaign Calendar. It does not import or reconnect Campaign Champ, Netlify, or Clerk. The customer lessons carried forward are plain-language intake, a clear business goal and audience, editable drafts, and honest planned-versus-published states.

## Build path

1. Import the repository root into Bolt as a Vite + React project.
2. Keep the first flow focused: business brief → campaign calendar → edit a draft → save or export.
3. Use the fictional BrightNest Cleaning example in [the PRD](PRD.md).
4. Configure Supabase Auth and the owner-only campaigns table before enabling cloud saves.
5. Configure the OpenAI key as a Supabase Edge Function secret before enabling AI generation.
6. Keep secrets out of browser code and this public repository.
7. Work on a short-lived branch. A pull request can be used as a review checkpoint, but no other reviewer is assumed.

## First demo check

A first-time user can understand the brief, inspect a calendar, edit one item, and export the plan within five minutes. The user sees drafts and planned dates. Nothing is automatically published or charged.

Follow the repository [README](../README.md) for local and Supabase setup. Do not paste API key values into repository files or chat.
