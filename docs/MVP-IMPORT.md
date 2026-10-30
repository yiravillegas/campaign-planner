# Import the existing MVP

Proposed owner: Andy. Coordinator: Yira.

1. Confirm the builder platform and whether the application already has a GitHub repository. If it does, coordinate with Yira before duplicating or reconnecting it; preserve its existing history where practical.
2. Keep an untouched backup/export of the working MVP before changing its repository connection.
3. Inspect the export for credentials and private client data. Remove those from the export, and use platform secret settings for deployment. Do not commit `.env` files.
4. Import the existing application on `codex/import-existing-mvp`. Preserve its package manifest, lockfile, platform configuration and source layout. This repository does not prescribe a stack or a folder structure.
5. Keep the useful collaboration documents; combine ignore rules with the application's existing `.gitignore`.
6. Add exact install, run and deployment instructions to README.md. Document required environment-variable names without actual values; a sanitized `.env.example` is allowed.
7. Run the application using its actual instructions. Record what works for authentication, brief entry, AI generation, calendar editing, saving and deployment. Note the AI-credit dependency.
8. Open a pull request to `main`. Explain setup and known blockers. Obtain review before merging.
9. Verify the integrated app after merge. Confirm with Yira which branch the builder and deployment track, so automatic synchronization cannot overwrite reviewed changes.
10. Other builders start their task branches from the updated `main` after this import.

Completion: the existing MVP is available in the repository, another teammate can follow its setup instructions, and the team knows the live link and remaining blockers.
