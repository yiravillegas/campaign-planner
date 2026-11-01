import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { ArrowUpRight, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Download, FileText, LayoutGrid, Lightbulb, LogIn, Menu, MoreHorizontal, Plus, Save, Search, Settings2, Sparkles, Target, Users, WandSparkles, X } from 'lucide-react';
import './styles.css';

const env = import.meta.env;
const supabase = env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY
  ? createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
  : null;
const today = new Date();
const isoDate = (date) => new Date(date).toISOString().slice(0, 10);
const addDays = (date, days) => { const next = new Date(`${date}T12:00:00`); next.setDate(next.getDate() + days); return isoDate(next); };
const shortDate = (date) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${date}T12:00:00`));
const defaultCampaign = {
  id: 'demo-cleaning-30-day', name: 'Spring quote requests', business: 'BrightNest Cleaning is a family-owned home cleaning company serving the west side of Chicago. Known for careful, pet-friendly service and easy online quotes.',
  audience: 'Busy homeowners and renters in Oak Park, Forest Park, and Berwyn who want a reliably clean home without giving up their weekends.',
  goal: 'Generate 12 qualified quote requests over 30 days', offer: 'First-time customers can request a free home estimate.', channels: ['Instagram', 'Facebook'],
  start: isoDate(today), duration: 30, cadence: 3, status: 'Draft plan',
  posts: [
    { id: 'p1', day: 0, channel: 'Instagram', format: 'Carousel', stage: 'Introduce', idea: 'A calmer Sunday starts with a clean home', copy: 'Get your weekend back. BrightNest brings thoughtful, pet-friendly home cleaning to Oak Park, Forest Park, and Berwyn. Tell us what your home needs and we’ll send a free estimate.', cta: 'Request a free estimate', visual: 'A warm, lived-in living room in soft afternoon light, with a relaxed dog curled on the sofa.', script: '', status: 'Ready to review' },
    { id: 'p2', day: 2, channel: 'Facebook', format: 'Short video', stage: 'Build trust', idea: 'What our first visit looks like', copy: 'New to BrightNest? Here’s how a first visit works: we learn what matters to your household, agree on a plan, then take care of the details. No guesswork, no pressure.', cta: 'See how it works', visual: 'Friendly cleaner arriving at a bright home, introducing the simple three-step process.', script: 'Open: “Wondering what to expect from your first clean?” Show a quick welcome, a simple checklist, and the finished space. Close: “Tell us what your home needs and we’ll make a plan together.”', status: 'Ready to review' },
    { id: 'p3', day: 5, channel: 'Instagram', format: 'Single image', stage: 'Build trust', idea: 'A cleaner home that works for pets too', copy: 'Clean should feel comfortable for every member of the family. Ask us about our pet-friendly approach when you request your estimate.', cta: 'Ask about our pet-friendly service', visual: 'A curious cat watching a cleaner organize supplies in a sunlit kitchen.', script: '', status: 'Ready to review' },
    { id: 'p4', day: 8, channel: 'Facebook', format: 'Story', stage: 'Invite action', idea: 'The free-estimate reminder', copy: 'Thinking about a little extra help at home? BrightNest offers free estimates across Oak Park, Forest Park, and Berwyn. We’ll help you find a plan that fits.', cta: 'Request your free estimate', visual: 'Simple map graphic highlighting the three service areas with a friendly home icon.', script: 'Frame 1: “Could home feel a little easier?” Frame 2: “Free estimates in Oak Park, Forest Park & Berwyn.” Frame 3: “Tell us what you need.”', status: 'Ready to review' },
  ],
};

function readSaved() {
  try { return JSON.parse(localStorage.getItem('campaign-planner-demo')) || defaultCampaign; } catch { return defaultCampaign; }
}

function App() {
  const [campaign, setCampaign] = useState(readSaved);
  const [selectedId, setSelectedId] = useState(campaign.posts[0]?.id);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [showBrief, setShowBrief] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const [account, setAccount] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('sign-in');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const selected = selectedId ? campaign.posts.find((post) => post.id === selectedId) : null;
  const filtered = useMemo(() => campaign.posts.filter((post) => `${post.idea} ${post.channel} ${post.copy}`.toLowerCase().includes(query.toLowerCase())), [campaign.posts, query]);
  const month = new Date(`${campaign.start}T12:00:00`); month.setMonth(month.getMonth() + monthOffset);
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(month);
  const plannedCount = campaign.posts.length;

  React.useEffect(() => {
    if (supabase) supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user || null;
      setAccount(user);
      if (user) await loadLatestCampaign();
    });
  }, []);
  async function loadLatestCampaign() {
    if (!supabase) return;
    const { data, error } = await supabase.from('campaigns').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle();
    if (error || !data) return;
    const loaded = { id: data.id, name: data.name, business: data.business_brief, audience: data.audience, goal: data.goal, offer: data.offer, channels: data.channels, start: data.start_date, duration: data.duration_days, cadence: data.posts_per_week, strategy: data.strategy, posts: data.content || [], status: data.status === 'approved' ? 'Approved plan' : data.status === 'ready_for_review' ? 'Ready for review' : 'Draft plan' };
    setCampaign(loaded); localStorage.setItem('campaign-planner-demo', JSON.stringify(loaded)); setSelectedId(loaded.posts[0]?.id || null);
  }
  const updateCampaign = (change, message) => {
    setCampaign((current) => {
      const next = typeof change === 'function' ? change(current) : { ...current, ...change };
      localStorage.setItem('campaign-planner-demo', JSON.stringify(next));
      return next;
    });
    if (message) { setNotice(message); window.setTimeout(() => setNotice(''), 3000); }
  };
  const updatePost = (id, change) => updateCampaign((current) => ({ ...current, posts: current.posts.map((post) => post.id === id ? { ...post, ...change } : post) }));

  async function saveToCloud() {
    if (!supabase) { setNotice('Saved in this browser. Add Supabase settings to save across devices.'); window.setTimeout(() => setNotice(''), 4000); return; }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setAuthOpen(true); setNotice('Sign in to save your campaign to your account.'); return; }
    setBusy(true);
    const { data, error } = await supabase.from('campaigns').upsert({ id: campaign.id.startsWith('demo-') ? undefined : campaign.id, owner_id: session.user.id, name: campaign.name, business_brief: campaign.business, audience: campaign.audience, goal: campaign.goal, offer: campaign.offer, channels: campaign.channels, start_date: campaign.start, duration_days: campaign.duration, posts_per_week: campaign.cadence, strategy: campaign.strategy || null, content: campaign.posts, status: 'draft' }).select('id').single();
    setBusy(false);
    if (error) { setNotice(`Cloud save failed: ${error.message}`); return; }
    const next = { ...campaign, id: data.id };
    localStorage.setItem('campaign-planner-demo', JSON.stringify(next)); setCampaign(next);
    setNotice('Campaign saved to your account.'); window.setTimeout(() => setNotice(''), 3000);
  }

  async function generatePlan() {
    if (!campaign.business.trim() || !campaign.audience.trim() || !campaign.goal.trim()) { setShowBrief(true); setNotice('Add a business brief, audience, and goal to create the plan.'); return; }
    if (!supabase || !account) { setNotice('Demo plan is ready to edit. Sign in and connect AI to generate a new plan.'); window.setTimeout(() => setNotice(''), 4500); return; }
    setBusy(true); setNotice('Building your campaign direction and calendar…');
    const { data, error } = await supabase.functions.invoke('generate-campaign-plan', { body: { businessBrief: campaign.business, targetAudience: campaign.audience, campaignGoal: campaign.goal, offer: campaign.offer, channels: campaign.channels, startDate: campaign.start, durationDays: campaign.duration, postsPerWeek: campaign.cadence } });
    setBusy(false);
    if (error || !data?.posts?.length) { setNotice(error?.message || 'The plan could not be generated. Your brief is still saved.'); return; }
    updateCampaign((current) => ({ ...current, strategy: data.strategy, status: 'Ready for review', posts: data.posts.map((post, index) => ({ ...post, id: post.id || `ai-${Date.now()}-${index}`, status: 'Ready to review' })) }));
    setSelectedId(null); setNotice('Your campaign draft is ready to review. Nothing will publish automatically.');
  }

  async function handleAuth(event) {
    event.preventDefault(); if (!supabase) return;
    setBusy(true);
    const result = authMode === 'sign-up'
      ? await supabase.auth.signUp({ email: authEmail, password: authPassword })
      : await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    setBusy(false);
    if (result.error) { setNotice(result.error.message); return; }
    setAccount(result.data.session?.user || null); setAuthOpen(false);
    if (result.data.session) await loadLatestCampaign();
    setNotice(authMode === 'sign-up' && !result.data.session ? 'Check your email to finish creating your account.' : 'Signed in. Your campaign is ready to save.');
  }

  function addPost() {
    const id = `manual-${Date.now()}`;
    const post = { id, day: Math.min(campaign.posts.length * 3, campaign.duration - 1), channel: campaign.channels[0] || 'Instagram', format: 'Single image', stage: 'Introduce', idea: 'New campaign idea', copy: 'Add your campaign copy here.', cta: 'Choose an action', visual: '', script: '', status: 'Draft' };
    updateCampaign((current) => ({ ...current, posts: [...current.posts, post] }), 'New draft added to the calendar.'); setSelectedId(id);
  }

  function exportCsv() {
    const rows = [['Planned date', 'Channel', 'Format', 'Content idea', 'Campaign copy', 'Reader action', 'Status'], ...campaign.posts.map((post) => [addDays(campaign.start, post.day), post.channel, post.format, post.idea, post.copy, post.cta, post.status])];
    const csv = rows.map((row) => row.map((value) => `"${String(value || '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = `${campaign.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.csv`; link.click(); URL.revokeObjectURL(link.href);
  }

  return <div className="app-shell">
    <aside className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Sparkles size={18} fill="currentColor" /></span><span>campaign<span className="brand-light">planner</span></span><button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18}/></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <button className="workspace-switch"><span className="workspace-avatar">B</span><span className="workspace-meta"><b>BrightNest Cleaning</b><small>Starter workspace</small></span><ChevronDown size={15}/></button>
      <nav className="nav-list">
        <div className="nav-section">PLAN</div>
        <button className="nav-link active"><LayoutGrid size={17}/> Campaign calendar <span className="nav-count">{plannedCount}</span></button>
        <button className="nav-link" onClick={() => setShowBrief(true)}><FileText size={17}/> Campaign brief</button>
        <button className="nav-link" onClick={addPost}><Plus size={17}/> Add content idea</button>
        <div className="nav-section nav-gap">WORKSPACE</div>
        <button className="nav-link" onClick={() => setShowBrief(true)}><Users size={17}/> Audience & goals</button>
        <button className="nav-link" onClick={() => setAuthOpen(true)}><Settings2 size={17}/> Settings</button>
      </nav>
      <div className="sidebar-bottom"><div className="help-card"><span className="help-icon"><CircleHelp size={16}/></span><div><b>Need a hand?</b><small>Your plan is a starting point.<br/>Edit anything that needs a tweak.</small></div></div><button className="profile-row" onClick={() => setAuthOpen(true)}><span className="profile-avatar">{account?.email?.[0]?.toUpperCase() || 'G'}</span><span><b>{account?.email || 'Guest planner'}</b><small>{account ? 'Signed in' : 'Demo workspace'}</small></span><MoreHorizontal size={17}/></button></div>
    </aside>

    <main className="main-area">
      <header className="topbar"><button className="menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={20}/></button><div className="breadcrumb">Campaigns <ChevronRight size={14}/> <b>{campaign.name}</b></div><div className="top-actions"><span className="saved-label"><span className="save-dot"/> {supabase && account ? 'Cloud ready' : 'Saved on this device'}</span><button className="top-icon" aria-label="Help"><CircleHelp size={17}/></button><button className="avatar-button" onClick={() => setAuthOpen(true)}>{account?.email?.[0]?.toUpperCase() || 'G'}</button></div></header>

      <div className="content-wrap">
        <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> YOUR CAMPAIGN WORKSPACE</div><h1>Make the next move count.</h1><p>Turn your business goals into a campaign you can actually use.</p></div><div className="heading-actions"><button className="button button-soft" onClick={() => setShowBrief(true)}><FileText size={16}/> Edit brief</button><button className="button button-primary" onClick={generatePlan} disabled={busy}><WandSparkles size={16}/>{busy ? 'Working…' : 'Build my campaign'}</button></div></div>

        {notice && <div className="toast" role="status"><Check size={16}/>{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15}/></button></div>}

        <section className="campaign-summary"><div className="summary-main"><div className="summary-top"><span className="status-pill"><span/>{campaign.status}</span><button className="text-action" onClick={() => setShowBrief(true)}>Edit details <ArrowUpRight size={14}/></button></div><h2>{campaign.name}</h2><p className="summary-goal"><Target size={16}/><span>{campaign.goal}</span></p><div className="summary-meta"><div><small>WHO IT'S FOR</small><span>{campaign.audience}</span></div><div><small>CAMPAIGN WINDOW</small><span>{shortDate(campaign.start)} – {shortDate(addDays(campaign.start, campaign.duration - 1))} <i>· {campaign.duration} days</i></span></div><div><small>CHANNELS</small><span className="channel-list">{campaign.channels.map(channel => <em key={channel}>{channel}</em>)}</span></div></div></div><div className="summary-aside"><div className="aside-art"><div className="art-sun"/><div className="art-window"><span/><span/><span/><span/></div><div className="art-leaf leaf-one"/><div className="art-leaf leaf-two"/><div className="art-book"><span/><span/><span/></div><div className="art-plant"><i/><i/><i/><i/><b/></div></div><div className="summary-kicker"><Sparkles size={14}/> A little more room to grow</div></div></section>

        <section className="metric-row"><div className="metric-card"><span className="metric-icon purple"><CalendarDays size={17}/></span><div><b>{plannedCount}</b><small>planned pieces</small></div><span className="metric-note">in this plan</span></div><div className="metric-card"><span className="metric-icon green"><Check size={17}/></span><div><b>{campaign.posts.filter(p => p.status === 'Approved').length}</b><small>approved</small></div><span className="metric-note">ready for handoff</span></div><div className="metric-card"><span className="metric-icon amber"><Clock3 size={17}/></span><div><b>{campaign.posts.filter(p => p.status !== 'Approved').length}</b><small>need a review</small></div><span className="metric-note">your next step</span></div><div className="metric-card metric-hint"><span className="metric-icon yellow"><Lightbulb size={17}/></span><div><b>Nothing goes live on its own.</b><small>Approve the work, then choose who publishes it.</small></div></div></section>

        <section className="calendar-section"><div className="calendar-head"><div><div className="section-eyebrow">YOUR CONTENT PLAN</div><h2>Campaign calendar <span>{plannedCount}</span></h2><p>Planned content, ready for your review and edits.</p></div><div className="calendar-tools"><label className="search-box"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a post"/></label><button className="button button-soft export-button" onClick={exportCsv}><Download size={15}/> Export</button><button className="button button-primary add-button" onClick={addPost}><Plus size={16}/> New idea</button></div></div>
          <div className="calendar-toolbar"><div className="month-control"><button onClick={() => setMonthOffset(m => m - 1)} aria-label="Previous month"><ChevronLeft size={17}/></button><b>{monthLabel}</b><button onClick={() => setMonthOffset(m => m + 1)} aria-label="Next month"><ChevronRight size={17}/></button><button className="today-button" onClick={() => setMonthOffset(0)}>Today</button></div><div className="legend"><span><i className="legend-dot lavender"/> Social content</span><span><i className="legend-dot peach"/> Short video</span><span><i className="legend-dot blue"/> Story</span></div></div>
          <div className="calendar-grid"><div className="day-head">SUN</div><div className="day-head">MON</div><div className="day-head">TUE</div><div className="day-head">WED</div><div className="day-head">THU</div><div className="day-head">FRI</div><div className="day-head">SAT</div>{renderCalendar(month, campaign, selectedId, setSelectedId, monthOffset)}</div>
          <div className="calendar-foot"><span><span className="mini-check"><Check size={11}/></span> Drafts are saved as you edit.</span><button onClick={addPost}><Plus size={14}/> Add an idea</button></div>
        </section>

        {campaign.strategy && <section className="strategy-card"><div className="strategy-icon"><Sparkles size={18}/></div><div><div className="section-eyebrow">THE THINKING BEHIND THE PLAN</div><h3>Campaign direction</h3><p>{campaign.strategy}</p></div></section>}

        <footer className="page-footer"><span>Made for thoughtful marketing.</span><span>Planning target only · No guaranteed results · Nothing is published automatically</span></footer>
      </div>
    </main>

    {selected && <aside className="detail-panel"><div className="detail-top"><div><span className="detail-label">CONTENT DRAFT</span><h2>Review this idea</h2></div><button className="panel-close" onClick={() => setSelectedId(null)} aria-label="Close post"><X size={18}/></button></div><div className="detail-date"><span className="date-square"><CalendarDays size={17}/></span><div><b>{new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date(`${addDays(campaign.start, selected.day)}T12:00:00`))}</b><small>Planned date · Your local time</small></div><button className="more-btn"><MoreHorizontal size={18}/></button></div><div className="detail-tags"><span className={`format-chip ${selected.format.includes('video') || selected.format === 'Story' ? 'peach' : 'lilac'}`}>{selected.channel}</span><span className="format-chip neutral">{selected.format}</span><span className="stage-chip">{selected.stage}</span></div><label className="edit-label">CONTENT IDEA<input value={selected.idea} onChange={e => updatePost(selected.id, { idea: e.target.value })}/></label><label className="edit-label">CAMPAIGN COPY<textarea rows="6" value={selected.copy} onChange={e => updatePost(selected.id, { copy: e.target.value })}/></label><label className="edit-label">WHAT THE READER CAN DO<input value={selected.cta} onChange={e => updatePost(selected.id, { cta: e.target.value })}/></label><div className="visual-brief"><div className="visual-brief-head"><span><Lightbulb size={14}/> VISUAL DIRECTION</span><button onClick={() => navigator.clipboard?.writeText(selected.visual || '')}>Copy</button></div><textarea rows="3" value={selected.visual || ''} onChange={e => updatePost(selected.id, { visual: e.target.value })} placeholder="Add guidance for the designer, photographer, or video creator."/></div>{selected.script && <details className="script-details"><summary>Video or ad script <ChevronDown size={14}/></summary><textarea rows="4" value={selected.script} onChange={e => updatePost(selected.id, { script: e.target.value })}/></details>}<div className="review-row"><span className={`review-status ${selected.status === 'Approved' ? 'is-approved' : ''}`}><span/>{selected.status}</span><button onClick={() => updatePost(selected.id, { status: selected.status === 'Approved' ? 'Ready to review' : 'Approved' })}>{selected.status === 'Approved' ? 'Undo approval' : 'Approve draft'}</button></div><div className="detail-bottom"><button className="button button-primary save-button" onClick={() => { updatePost(selected.id, {}); saveToCloud(); }} disabled={busy}><Save size={15}/>{busy ? 'Saving…' : 'Save changes'}</button><span>Saved automatically on this device</span></div></aside>}

    {showBrief && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowBrief(false)}><form className="modal-card" onSubmit={e => { e.preventDefault(); setShowBrief(false); updateCampaign({}, 'Your campaign brief is updated.'); }}><div className="modal-head"><div><div className="section-eyebrow">START WITH WHAT YOU KNOW</div><h2>Your campaign brief</h2><p>We’ll use this to shape the plan. You can delegate channel and content choices.</p></div><button type="button" className="panel-close" onClick={() => setShowBrief(false)} aria-label="Close"><X size={18}/></button></div><label className="modal-field">CAMPAIGN NAME<input required value={campaign.name} onChange={e => updateCampaign({ name: e.target.value })}/></label><label className="modal-field">WHAT DOES THE BUSINESS DO?<textarea required rows="3" value={campaign.business} onChange={e => updateCampaign({ business: e.target.value })}/><small>Include services, location, what makes you different, and anything we should avoid saying.</small></label><label className="modal-field">WHO DO YOU WANT TO REACH?<textarea required rows="2" value={campaign.audience} onChange={e => updateCampaign({ audience: e.target.value })}/></label><label className="modal-field">WHAT WOULD YOU LIKE THIS CAMPAIGN TO HELP WITH?<textarea required rows="2" value={campaign.goal} onChange={e => updateCampaign({ goal: e.target.value })}/><small>A planning target helps guide the content. Results depend on many factors.</small></label><div className="modal-grid"><label className="modal-field">START DATE<input type="date" value={campaign.start} onChange={e => updateCampaign({ start: e.target.value })}/></label><label className="modal-field">DURATION<select value={campaign.duration} onChange={e => updateCampaign({ duration: Number(e.target.value) })}><option value="14">14 days</option><option value="30">30 days</option><option value="60">60 days</option></select></label><label className="modal-field">POSTS PER WEEK<select value={campaign.cadence} onChange={e => updateCampaign({ cadence: Number(e.target.value) })}><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></label></div><label className="modal-field">OFFER OR IMPORTANT DETAIL<input value={campaign.offer} onChange={e => updateCampaign({ offer: e.target.value })}/></label><div className="channel-chooser"><div className="modal-field-title">WHERE SHOULD WE SHOW UP?</div>{['Instagram', 'Facebook', 'TikTok', 'Email'].map(channel => <label key={channel}><input type="checkbox" checked={campaign.channels.includes(channel)} onChange={e => updateCampaign({ channels: e.target.checked ? [...campaign.channels, channel] : campaign.channels.filter(c => c !== channel) })}/>{channel}</label>)}</div><div className="modal-actions"><button type="button" className="button button-soft" onClick={() => setShowBrief(false)}>Cancel</button><button className="button button-primary"><Check size={15}/> Save brief</button></div></form></div>}

    {authOpen && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setAuthOpen(false)}><form className="modal-card auth-card" onSubmit={handleAuth}><div className="modal-head"><div><div className="section-eyebrow">YOUR WORKSPACE</div><h2>{authMode === 'sign-in' ? 'Welcome back' : 'Create your account'}</h2><p>Sign in to save campaigns to Supabase and keep your work across devices.</p></div><button type="button" className="panel-close" onClick={() => setAuthOpen(false)} aria-label="Close"><X size={18}/></button></div>{!supabase && <div className="setup-note">Connect your Supabase project in <code>.env.local</code> to enable account sign-in and cloud saves.</div>}<label className="modal-field">EMAIL ADDRESS<input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)}/></label><label className="modal-field">PASSWORD<input type="password" minLength="8" required value={authPassword} onChange={e => setAuthPassword(e.target.value)}/></label><div className="modal-actions"><button type="button" className="text-action" onClick={() => setAuthMode(authMode === 'sign-in' ? 'sign-up' : 'sign-in')}>{authMode === 'sign-in' ? 'Create account' : 'I already have an account'}</button><button className="button button-primary" disabled={!supabase || busy}><LogIn size={15}/>{busy ? 'Working…' : authMode === 'sign-in' ? 'Sign in' : 'Create account'}</button></div></form></div>}

    {showNew && <div className="modal-backdrop"><div className="modal-card"><div className="modal-head"><h2>Start a new campaign?</h2><button className="panel-close" onClick={() => setShowNew(false)}><X size={18}/></button></div><p>Your current campaign is saved in this browser. Create a new brief to begin another.</p><div className="modal-actions"><button className="button button-soft" onClick={() => setShowNew(false)}>Keep current plan</button><button className="button button-primary" onClick={() => { setCampaign({ ...defaultCampaign, id: `demo-${Date.now()}`, name: 'New campaign', start: isoDate(today) }); setShowNew(false); setShowBrief(true); }}>New campaign</button></div></div></div>}
  </div>;
}

function renderCalendar(month, campaign, selectedId, setSelectedId, offset) {
  const year = month.getFullYear(); const monthIndex = month.getMonth();
  const first = new Date(year, monthIndex, 1); const startOffset = first.getDay(); const days = new Date(year, monthIndex + 1, 0).getDate();
  const previousDays = new Date(year, monthIndex, 0).getDate();
  const cells = [];
  for (let index = 0; index < 42; index++) {
    let day; let other = false;
    if (index < startOffset) { day = previousDays - startOffset + index + 1; other = true; }
    else if (index >= startOffset + days) { day = index - startOffset - days + 1; other = true; }
    else day = index - startOffset + 1;
    const date = new Date(year, monthIndex + (index < startOffset ? -1 : index >= startOffset + days ? 1 : 0), day);
    const posts = !other ? campaign.posts.map(post => ({ ...post, actualDate: addDays(campaign.start, post.day) })).filter(post => { const d = new Date(`${post.actualDate}T12:00:00`); return d.getFullYear() === year && d.getMonth() === monthIndex && d.getDate() === day; }) : [];
    cells.push(<div key={`${offset}-${index}`} className={`calendar-cell ${other ? 'other-month' : ''} ${isoDate(date) === isoDate(today) ? 'is-today' : ''}`}><span className="calendar-day">{day}</span>{posts.map(post => <button key={post.id} className={`calendar-event ${post.format.includes('video') || post.format === 'Story' ? 'event-peach' : post.channel === 'Facebook' ? 'event-blue' : 'event-lilac'} ${post.id === selectedId ? 'event-selected' : ''}`} onClick={() => setSelectedId(post.id)}><span className="event-channel">{post.channel === 'Instagram' ? 'IG' : post.channel === 'Facebook' ? 'f' : post.channel.slice(0, 2).toUpperCase()}</span><span className="event-copy"><b>{post.idea}</b><small>{post.format} · {post.status}</small></span></button>)}</div>);
  }
  return cells;
}

createRoot(document.getElementById('root')).render(<App/>);
