const ALLOWED_POSTS = new Set([
  'cisco-live-2026',
  'mcp-c-suite-to-noc',
  'agent-shadow-it',
  'ai-jobs-impact',
]);

const ALLOWED_REACTIONS = new Set(['like', 'insightful']);

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function cleanText(value, maxLength) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function cleanBody(value) {
  return String(value || '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, 1200);
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeLink(value) {
  const raw = cleanText(value, 240);
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url.href.slice(0, 240);
  } catch (_err) {
    return null;
  }
}

function validPost(postId) {
  return ALLOWED_POSTS.has(postId);
}

async function ensureSchema(db) {
  await db.prepare(
    'CREATE TABLE IF NOT EXISTS reaction_votes (post_id TEXT NOT NULL, visitor_id TEXT NOT NULL, reaction_type TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (post_id, visitor_id, reaction_type))'
  ).run();
  await db.prepare(
    'CREATE INDEX IF NOT EXISTS idx_reaction_votes_post ON reaction_votes (post_id, reaction_type)'
  ).run();
  await db.prepare(
    "CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id TEXT NOT NULL, name TEXT NOT NULL, link TEXT, body TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, status TEXT NOT NULL DEFAULT 'published')"
  ).run();
  await db.prepare(
    'CREATE INDEX IF NOT EXISTS idx_comments_post_status_created ON comments (post_id, status, created_at)'
  ).run();
}

async function loadEngagement(db, postId, visitorId) {
  const reactionRows = await db.prepare(
    'SELECT reaction_type, COUNT(*) AS count FROM reaction_votes WHERE post_id = ? GROUP BY reaction_type'
  ).bind(postId).all();

  const counts = { like: 0, insightful: 0 };
  for (const row of reactionRows.results || []) {
    if (ALLOWED_REACTIONS.has(row.reaction_type)) counts[row.reaction_type] = Number(row.count || 0);
  }

  let viewerReactions = [];
  if (visitorId) {
    const viewerRows = await db.prepare(
      'SELECT reaction_type FROM reaction_votes WHERE post_id = ? AND visitor_id = ?'
    ).bind(postId, visitorId).all();
    viewerReactions = (viewerRows.results || []).map((row) => row.reaction_type);
  }

  const commentRows = await db.prepare(
    "SELECT id, name, link, body, created_at FROM comments WHERE post_id = ? AND status = 'published' ORDER BY datetime(created_at) DESC LIMIT 50"
  ).bind(postId).all();

  const comments = (commentRows.results || []).map((row) => ({
    id: row.id,
    name: row.name,
    link: row.link || null,
    body: row.body,
    createdAt: row.created_at,
  }));

  return { postId, counts, viewerReactions, comments };
}

export async function onRequestGet(context) {
  const db = context.env.DB;
  if (!db) return json({ error: 'Engagement database is not configured.' }, 503);

  const url = new URL(context.request.url);
  const postId = cleanText(url.searchParams.get('post'), 80);
  const visitorId = cleanText(url.searchParams.get('visitor'), 120);

  if (!validPost(postId)) return json({ error: 'Unknown post.' }, 400);

  await ensureSchema(db);
  return json(await loadEngagement(db, postId, visitorId));
}

export async function onRequestPost(context) {
  const db = context.env.DB;
  if (!db) return json({ error: 'Engagement database is not configured.' }, 503);

  let payload;
  try {
    payload = await context.request.json();
  } catch (_err) {
    return json({ error: 'Invalid JSON.' }, 400);
  }

  const action = cleanText(payload.action, 40);
  const postId = cleanText(payload.postId, 80);
  const visitorId = cleanText(payload.visitorId, 120);

  if (!validPost(postId)) return json({ error: 'Unknown post.' }, 400);
  await ensureSchema(db);

  if (action === 'reaction') {
    const reaction = cleanText(payload.reaction, 40);
    if (!ALLOWED_REACTIONS.has(reaction)) return json({ error: 'Unknown reaction.' }, 400);
    if (!visitorId || visitorId.length < 12) return json({ error: 'Missing visitor.' }, 400);

    const existing = await db.prepare(
      'SELECT 1 FROM reaction_votes WHERE post_id = ? AND visitor_id = ? AND reaction_type = ?'
    ).bind(postId, visitorId, reaction).first();

    if (existing) {
      await db.prepare(
        'DELETE FROM reaction_votes WHERE post_id = ? AND visitor_id = ? AND reaction_type = ?'
      ).bind(postId, visitorId, reaction).run();
    } else {
      await db.prepare(
        'INSERT INTO reaction_votes (post_id, visitor_id, reaction_type) VALUES (?, ?, ?)'
      ).bind(postId, visitorId, reaction).run();
    }

    return json(await loadEngagement(db, postId, visitorId));
  }

  if (action === 'comment') {
    if (cleanText(payload.website, 120)) return json({ ok: true });

    const formStartedAt = Number(payload.formStartedAt || 0);
    if (!Number.isFinite(formStartedAt) || Date.now() - formStartedAt < 2500) {
      return json({ error: 'Please take another moment before posting.' }, 400);
    }

    const name = escapeHtml(cleanText(payload.name, 80));
    const body = escapeHtml(cleanBody(payload.body));
    const link = normalizeLink(payload.link);

    if (name.length < 2) return json({ error: 'Name is required.' }, 400);
    if (body.length < 3) return json({ error: 'Comment is required.' }, 400);
    if (payload.link && !link) return json({ error: 'Use a valid http or https link.' }, 400);

    await db.prepare(
      "INSERT INTO comments (post_id, name, link, body, status) VALUES (?, ?, ?, ?, 'published')"
    ).bind(postId, name, link, body).run();

    return json(await loadEngagement(db, postId, visitorId));
  }

  return json({ error: 'Unknown action.' }, 400);
}
