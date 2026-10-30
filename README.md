# Campaign Planner

Campaign planning for a marketing agency serving small-business clients. The calendar is part of the planner.

## Product flow

Client brief and research -> proposed strategy -> scheduled activities -> editable content -> saved, shareable plan.

The hackathon goal is one reliable flow demonstrated with one business. Build on Andy's existing MVP.

## Current status

This repository contains collaboration documents. The application code has not yet been imported. Setup commands and deployment instructions will be added after Andy imports the existing MVP.

## Team

- Yira: project coordination, repository administration, scope and submission tracking.
- Andy: existing MVP, core logic, authentication, backend and AI integration; proposed technical reviewer.
- Frederick: competitive research, Google review insights, campaign messaging and demo content.
- Mujales: independently scoped improvements and interface polish, as availability allows.

GitHub usernames and collaborator invitations are pending. Public visibility allows reading; direct contributions require collaborator access or a fork and pull request.

## Branches

- `main`: reviewed, integrated work. Initially contains setup documentation.
- `codex/import-existing-mvp`: import Andy's current application first.
- `codex/research-and-demo`: research summaries and demonstration content.
- New implementation tasks: create a short-lived branch from the latest `main` after the MVP import, for example `codex/editable-calendar` or `codex/ui-polish`.

## Applying changes

1. Open an issue describing the task, proposed owner, and completion check.
2. Start a task branch from current `main`. Coordinate with Andy before editing application files.
3. Make a small change and commit it with a descriptive message.
4. Push the branch and open a pull request into `main`.
5. Explain what changed and how you checked it. Ask Andy or another technical teammate to review code changes. Yira coordinates priorities and readiness.
6. Resolve feedback and conflicts. Merge approved work one pull request at a time.
7. Check the integrated application. Refresh your local `main` before starting the next task.

No direct pushes to `main` after initial setup. See [CONTRIBUTING.md](CONTRIBUTING.md) for steps and recovery guidance.

## Public repository

Never commit API keys, passwords, access tokens, `.env` files, or private client/customer data. Use sanitized examples. Configure credentials through the development platform's secret settings. Do not paste secrets into issues or pull requests.

## Getting started

Read [the MVP import guide](docs/MVP-IMPORT.md) before connecting a builder platform, and [the team process](CONTRIBUTING.md) before making changes.
