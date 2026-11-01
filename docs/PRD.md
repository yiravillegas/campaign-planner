# Campaign Calendar MVP

## Product statement

For small-business owners who need a practical marketing plan, Campaign Calendar turns a business goal and audience into an editable content calendar they can review and use.

## User and problem

The primary user is a capable owner of a local or small business. They know their customers, offer, and service area, but may not know which channels, formats, or cadence to choose. Starting with jargon or an empty calendar makes the tool feel like more marketing work.

**Problem statement:** Small-business owners need a quick way to turn what they know about their business into useful, editable marketing content without having to become marketing strategists first.

## Five whys summary

1. Content is inconsistent because planning and writing compete with daily business work.
2. Planning is slow because an owner must choose channels, themes, formats, and timing before drafting.
3. General-purpose tools often expect the user to supply that strategy or assemble disconnected outputs.
4. The owner is still stuck translating business facts into repeated content decisions.
5. A focused first calendar can make the next marketing action clear while keeping the owner in control.

This is a working product hypothesis for the hackathon. Validate it with business owners before expanding scope.

## MVP success

**Demo metric:** A first-time user can enter or understand a business brief, see a campaign calendar, edit one content item, and save or export the plan in five minutes.

## MoSCoW scope

| Priority | Feature | Reason |
| --- | --- | --- |
| Must | Business brief, audience, campaign goal, dates, channels | Provides enough context to make the calendar relevant |
| Must | Calendar with content ideas, copy, CTA, visual direction, and scripts where useful | Delivers the product promise in one screen |
| Must | Edit drafts and save/export the plan | Makes the output usable after generation |
| Must | Plain-language states for draft, review, and approval | Keeps planning distinct from publication |
| Should | AI campaign generation from a server-side function | Saves first-draft effort while protecting the API key |
| Should | Supabase sign-in and owner-only saved campaigns | Lets users return to their work |
| Could | Channel-by-channel analytics, team comments, recurring schedules | Useful after the core flow has been validated |
| Won't now | Auto-publishing, ad buying, guaranteed performance, agency CRM | Adds risk and work beyond a one-hour MVP |

## Core flow

1. Open the sample plan or create a brief.
2. Describe the business, audience, goal, offer, channels, and campaign duration.
3. Generate or inspect draft ideas on the calendar.
4. Open a calendar item and edit its idea, copy, reader action, visual direction, or script.
5. Save to the signed-in Supabase account or export a CSV.
6. The owner decides whether and when to publish outside the app.

## Product language and trust

- Use “planned”, “draft”, “ready to review”, and “approved”. Approval does not mean published.
- “What the reader can do” replaces “CTA”.
- “Visual direction” replaces “creative brief”.
- A campaign goal is a planning target; never promise that the plan will achieve it.
- Nothing publishes automatically and no ad spend is authorized.
- Use a fictional business for demos and sanitized examples in the public repository.

## Architecture

- Frontend: Vite, React, Supabase JS client.
- Authentication: Supabase Auth email/password; no Clerk.
- Data: Supabase `campaigns` table with a JSON content array and row-level security based on `auth.uid()`.
- AI: Supabase Edge Function calls OpenAI using a server secret; the browser never sees the OpenAI key.
- Demo: localStorage sample content works without credentials. Cloud save and AI generation are clearly gated on setup.

## Main data record

`campaigns`: `id`, `owner_id`, `name`, `business_brief`, `audience`, `goal`, `offer`, `channels`, `start_date`, `duration_days`, `posts_per_week`, `strategy`, `content`, `status`, `created_at`, `updated_at`.

Each content draft stores planned day, channel, format, purpose, idea, copy, reader action, visual direction, script, status, and stable ID.

## Out of scope

Automated publishing, ad purchasing, external analytics, client/agency permissions, comments, approval audit trails, multiple campaign switching, and production launch configuration.

## Acceptance scenario

Use the fictional BrightNest Cleaning example: a neighborhood cleaning business wants 12 qualified quote requests over 30 days. Open a draft, change its copy and reader action, save, refresh, and export the CSV. Confirm the goal appears as a target, each item says planned, and the app does not claim publication or results.
