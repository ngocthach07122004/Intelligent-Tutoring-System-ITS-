DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;

DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;

ALTER TABLE conversations
DROP COLUMN IF EXISTS topic,
DROP COLUMN IF EXISTS avatar;
