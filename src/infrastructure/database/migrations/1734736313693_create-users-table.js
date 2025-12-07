exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL, 
      confirmed_at TIMESTAMP,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP
    );
  `);

  pgm.sql(`
    CREATE UNIQUE INDEX idx_users_email_unique
    ON users (email) WHERE deleted_at IS NULL; 
  `);

  pgm.sql(`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TRIGGER set_timestamp ON users;`);

  pgm.sql(`DROP INDEX idx_users_email_unique;`);

  pgm.sql(`DROP TABLE users;`);
};
