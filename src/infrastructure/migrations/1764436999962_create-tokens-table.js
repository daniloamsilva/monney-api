exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE tokens (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL,
      type TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );  
  `);

  pgm.sql(`
    CREATE INDEX idx_tokens_user_id
    ON tokens (user_id);
  `);

  pgm.sql(`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON tokens
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TRIGGER set_timestamp ON tokens;`);

  pgm.sql(`DROP INDEX idx_tokens_user_id;`);

  pgm.sql(`DROP TABLE tokens;`);
};
