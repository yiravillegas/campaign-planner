# Team collaboration

## Quick process

Task -> branch -> small commits -> pull request -> review -> merge -> check the app.

Yira coordinates work and repository access. Andy is the proposed technical reviewer. Review arrangements should be confirmed by the team.

## GitHub website

1. Open the repository and select `main` in the branch selector.
2. Type a new task branch name such as `codex/ui-polish`, then create it from `main`.
3. Make and commit your changes on that branch. Andy should confirm how the existing development platform exports or synchronizes code before anyone edits it independently.
4. Select Compare & pull request. Set base to `main` and compare to your task branch.
5. Fill in the pull request template and request a technical review.
6. After approval and resolving conflicts, merge one pull request at a time. Check the integrated application before merging the next.

Public access does not grant push access. Until invited, teammates can fork the repository and submit a pull request from their fork. Prefer collaborator access for this small team once usernames are available.

## Local Git example

After collaborator access is granted, clone the repository once:

```sh
git clone https://github.com/yiravillegas/campaign-planner.git
cd campaign-planner
```

For each new task, first finish or save any current work, then:

```sh
git switch main
git pull --ff-only origin main
git switch -c codex/your-task
```

Edit the files, inspect the changes, and stage only the intended files:

```sh
git status
git diff
git add path/to/changed-file
git commit -m "Describe the change"
git push -u origin codex/your-task
```

Replace the example path and branch with your actual file and task. Open a pull request on GitHub. Branches that were created earlier need the latest `main` incorporated before work continues; ask Andy for help with conflicts.

## Coordination

- One task and owner per issue; list what must work for completion.
- Keep changes small. Do not change another person's assigned feature without coordinating.
- Feature work starts after Andy's existing MVP is imported.
- Include screenshots for visible changes and describe checks honestly.
- Yira confirms priority and scope; a technical teammate checks code behavior.
- Preserve learning-session time; use Eastern Time when recording team checkpoints.

## Protecting main

Use pull requests for team work. Branch-rule enforcement status is reported separately by Yira; this document alone does not enforce it. A repository owner may have an emergency bypass depending on settings. Do not use it for routine changes.

## If a merge breaks the app

Stop further merges. Notify Yira and Andy. Use GitHub's Revert action on the offending merged pull request to propose a reversal, review it, merge it, and check the application. Some merges require a manual revert by the technical lead. Do not force-push or delete shared history.

## Public data

Never upload credentials or private client/customer records. Use sanitized research and demo examples. A public repository does not grant others a software license; any license decision remains with the team.
