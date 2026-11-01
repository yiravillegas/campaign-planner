import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('APP_ORIGIN') || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Use POST.' }, 405);

  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return json({ error: 'Sign in before generating a campaign.' }, 401);
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: 'Your session expired. Sign in again.' }, 401);

  let input: Record<string, unknown>;
  try { input = await request.json(); } catch { return json({ error: 'Send the campaign brief as JSON.' }, 400); }
  const businessBrief = clean(input.businessBrief, 7000);
  const audience = clean(input.targetAudience, 1800);
  const goal = clean(input.campaignGoal, 800);
  const offer = clean(input.offer, 800);
  const channels = Array.isArray(input.channels) ? input.channels.filter((x): x is string => typeof x === 'string').slice(0, 4) : [];
  const startDate = typeof input.startDate === 'string' ? input.startDate : '';
  const durationDays = Number(input.durationDays);
  const cadence = Number(input.postsPerWeek);
  if (businessBrief.length < 20 || audience.length < 3 || goal.length < 3 || !channels.length) {
    return json({ error: 'Add a business brief, target audience, goal, and at least one channel.' }, 400);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || durationDays < 7 || durationDays > 90 || cadence < 1 || cadence > 7) {
    return json({ error: 'Choose a start date, 7–90 day duration, and 1–7 posts per week.' }, 400);
  }

  const key = Deno.env.get('OPENAI_API_KEY');
  if (!key) return json({ error: 'Campaign generation is not connected yet. Your brief is safe; try again later.' }, 503);
  const total = Math.min(60, Math.max(4, Math.ceil(durationDays * cadence / 7)));
  const completion = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: Deno.env.get('OPENAI_CAMPAIGN_MODEL') || 'gpt-4o-mini',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are a thoughtful marketing partner for small businesses. Use only the supplied facts. Never invent proof, guarantees, prices, credentials, or offers. Write specific, useful drafts in plain language. Respect the stated audience and channels. The business goal is a planning target, not a promised result. Nothing publishes automatically. Vary the content purpose and format. For video formats, include a concise spoken script; otherwise use an empty script. Include visual direction. Space posts across the campaign dates.' },
        { role: 'user', content: JSON.stringify({ businessBrief, audience, goal, offer, channels, startDate, durationDays, cadence, numberOfPosts: total }) },
      ],
    }),
  });
  const result = await completion.json();
  if (!completion.ok) return json({ error: 'The campaign draft could not be generated. Your brief is still here; please try again.' }, 502);
  try {
    const parsed = JSON.parse(result.choices[0].message.content);
    const posts = parsed.posts.map((post: Record<string, unknown>, index: number) => ({ ...post, id: crypto.randomUUID(), status: 'Ready to review', sort_order: index }));
    return json({ strategy: parsed.strategy, posts });
  } catch {
    return json({ error: 'The campaign response was incomplete. Your brief is still here; please try again.' }, 502);
  }
});

function clean(value: unknown, max: number) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }
function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
