
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist-- Drop existing tables if they exist in the correct order
DROP TABLE IF EXISTS card_ability CASCADE;
DROP TABLE IF EXISTS ability CASCADE;
DROP TABLE IF EXISTS card_edition CASCADE;
DROP TABLE IF EXISTS card CASCADE;
DROP TABLE IF EXISTS edition CASCADE;
DROP TABLE IF EXISTS set_tag CASCADE;
DROP TABLE IF EXISTS tag CASCADE;
DROP TABLE IF EXISTS card_set CASCADE;

-- Table for card sets
CREATE TABLE card_set (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at BIGINT NOT NULL,
  modified_at BIGINT NOT NULL
);

-- Table for editions
CREATE TABLE edition (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  set_uuid UUID NOT NULL,
  description TEXT,
  version VARCHAR(16) NOT NULL,
  edition VARCHAR(16),
  author VARCHAR(255),
  released_at BIGINT,
  created_at BIGINT NOT NULL,
  modified_at BIGINT NOT NULL,
  FOREIGN KEY (set_uuid) REFERENCES card_set (uuid) ON DELETE CASCADE
);

-- Table for cards
CREATE TABLE card (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  suite VARCHAR(255) NOT NULL,
  created_at BIGINT NOT NULL,
  modified_at BIGINT NOT NULL
);

-- Table to link cards to editions
CREATE TABLE card_edition (
  card_uuid UUID NOT NULL,
  edition_uuid UUID NOT NULL,
  created_at BIGINT NOT NULL,
  modified_at BIGINT NOT NULL,
  PRIMARY KEY (card_uuid, edition_uuid),
  FOREIGN KEY (card_uuid) REFERENCES card (uuid) ON DELETE CASCADE,
  FOREIGN KEY (edition_uuid) REFERENCES "edition" (uuid) ON DELETE CASCADE
);

-- Table for tags
CREATE TABLE tag (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(255) NOT NULL,
  created_at BIGINT NOT NULL,
  modified_at BIGINT NOT NULL
);

-- Index for searching by tag name
CREATE INDEX idx_tag_name ON tag (name);

-- Table to link sets to tags
CREATE TABLE set_tag (
  set_uuid UUID NOT NULL,
  tag_uuid UUID NOT NULL,
  created_at BIGINT NOT NULL,
  modified_at BIGINT NOT NULL,
  PRIMARY KEY (set_uuid, tag_uuid),
  FOREIGN KEY (set_uuid) REFERENCES card_set (uuid) ON DELETE CASCADE,
  FOREIGN KEY (tag_uuid) REFERENCES tag (uuid) ON DELETE CASCADE
);

-- Table for abilities
CREATE TABLE ability (
  uuid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at BIGINT NOT NULL,
  modified_at BIGINT NOT NULL
);

-- Table to link cards to abilities
CREATE TABLE card_ability (
  card_uuid UUID NOT NULL,
  ability_uuid UUID NOT NULL,
  value VARCHAR(255),
  created_at BIGINT NOT NULL,
  modified_at BIGINT NOT NULL,
  PRIMARY KEY (card_uuid, ability_uuid),
  FOREIGN KEY (card_uuid) REFERENCES card (uuid) ON DELETE CASCADE,
  FOREIGN KEY (ability_uuid) REFERENCES ability (uuid) ON DELETE NO ACTION
);

-- Function to set timestamps
CREATE OR REPLACE FUNCTION set_timestamps() RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at := COALESCE(NEW.created_at, EXTRACT(EPOCH FROM NOW())::BIGINT);
  NEW.modified_at := EXTRACT(EPOCH FROM NOW())::BIGINT;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set timestamps on insert
CREATE TRIGGER set_timestamps_before_insert
BEFORE INSERT ON card_set
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

CREATE TRIGGER set_timestamps_before_insert
BEFORE INSERT ON edition
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

CREATE TRIGGER set_timestamps_before_insert
BEFORE INSERT ON card
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

CREATE TRIGGER set_timestamps_before_insert
BEFORE INSERT ON card_edition
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

CREATE TRIGGER set_timestamps_before_insert
BEFORE INSERT ON tag
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

CREATE TRIGGER set_timestamps_before_insert
BEFORE INSERT ON set_tag
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

CREATE TRIGGER set_timestamps_before_insert
BEFORE INSERT ON ability
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

CREATE TRIGGER set_timestamps_before_insert
BEFORE INSERT ON card_ability
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

-- Trigger to update modified_at on update
CREATE TRIGGER set_timestamps_before_update
BEFORE UPDATE ON card_set
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

CREATE TRIGGER set_timestamps_before_update
BEFORE UPDATE ON edition
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

CREATE TRIGGER set_timestamps_before_update
BEFORE UPDATE ON card
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

CREATE TRIGGER set_timestamps_before_update
BEFORE UPDATE ON card_edition
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

CREATE TRIGGER set_timestamps_before_update
BEFORE UPDATE ON tag
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

CREATE TRIGGER set_timestamps_before_update
BEFORE UPDATE ON set_tag
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

CREATE TRIGGER set_timestamps_before_update
BEFORE UPDATE ON ability
FOR EACH ROW EXECUTE FUNCTION set_timestamps();

CREATE TRIGGER set_timestamps_before_update
BEFORE UPDATE ON card_ability
FOR EACH ROW EXECUTE FUNCTION set_timestamps();
