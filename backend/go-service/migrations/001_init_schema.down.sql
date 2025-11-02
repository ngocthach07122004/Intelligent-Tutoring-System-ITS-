-- Drop tables in reverse order (respecting foreign keys)
DROP TABLE IF EXISTS outbox;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversation_participants;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS class_members;
DROP TABLE IF EXISTS classes;

-- Drop functions
DROP FUNCTION IF EXISTS assign_message_seq();
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop types
DROP TYPE IF EXISTS event_status;
DROP TYPE IF EXISTS notification_type;
DROP TYPE IF EXISTS message_type;
DROP TYPE IF EXISTS conversation_type;
DROP TYPE IF EXISTS class_member_role;

-- Drop extensions (optional, comment out if other databases use them)
-- DROP EXTENSION IF EXISTS "pg_trgm";
-- DROP EXTENSION IF EXISTS "uuid-ossp";
