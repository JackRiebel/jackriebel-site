CREATE TABLE IF NOT EXISTS reaction_votes (
  post_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  reaction_type TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (post_id, visitor_id, reaction_type)
);

CREATE INDEX IF NOT EXISTS idx_reaction_votes_post
  ON reaction_votes (post_id, reaction_type);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id TEXT NOT NULL,
  name TEXT NOT NULL,
  link TEXT,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'published'
);

CREATE INDEX IF NOT EXISTS idx_comments_post_status_created
  ON comments (post_id, status, created_at);
