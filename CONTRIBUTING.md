# Solo project workflow

This is a solo project. Yira owns product decisions, implementation, repository administration, review, and submission. There are no assumed teammates or required external reviewers.

## Working on a change

1. Keep the product flow focused and make changes on a short-lived `codex/` branch from current `main`.
2. Inspect the changes and run the available checks before merging.
3. Use a pull request as a reviewable checkpoint when it helps. As the repository owner, Yira can merge when ready.
4. Check the integrated app after merging.

For the fresh Campaign Calendar app, the agreed direction is a Bolt-ready app using Supabase and OpenAI. It is not a Netlify import of Campaign Champ and does not use Clerk.

## Repository safety

Never upload credentials or private client/customer records. The repository is public. Use sanitized, fictional demo data and configure secrets in the development platform. Do not paste secrets into issues, commits, or pull requests. Do not force-push or rewrite shared history.
