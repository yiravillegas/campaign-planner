# Bolt starter prompt

Build a fresh, focused React + Vite app called Campaign Calendar for small-business owners. Use the existing files and scope in this project. Do not import or recreate Campaign Champ, Clerk, Netlify-specific settings, or agency CRM features.

The product promise is: turn a business goal and audience into a useful, editable marketing calendar. Keep one end-to-end flow polished: brief → calendar → edit a content draft → save or export.

The primary user knows their business but may not know marketing jargon. Use plain labels such as “What the reader can do” and “Visual direction”. Make the campaign goal, audience, offer, channels, and date range visible above the calendar. Content should include a planned date, channel, format, idea, copy, reader action, and visual direction; video or ad formats can include a short script. Mark all generated work as a draft ready for review. Never call an approved draft published.

Build with Vite, React, Supabase Auth and database, and a Supabase Edge Function that calls OpenAI. Store the OpenAI secret only in Supabase. Use the supplied migration and function as the starting backend. Turn on row-level security and restrict saved records to their owner. The demo sample must work without credentials and must be labeled as sample content. If credentials are absent, say cloud save or AI generation needs setup; do not silently fake a successful backend action.

Use the fictional BrightNest Cleaning sample plan only. Do not invent customer testimonials, claims, guaranteed results, or live analytics. The app must never publish content or spend money automatically.

Keep the interface simple and responsive: a compact workspace navigation, campaign summary, calendar, and editable selected-draft panel. Avoid adding dashboards, billing, chat, social integrations, or analytics in this first build. Prioritize readable type, visible focus states, accessible labels, sensible empty states, and a mobile layout. Make actions work: brief fields edit, calendar items open, content fields save, approve toggles only a draft review status, and CSV export downloads planned content.

Before changing files, inspect this repository and preserve the README, team docs, and any existing project decisions. At the end, list what works, what needs Supabase secrets, and what should be checked manually.
