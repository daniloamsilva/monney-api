exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      confirmed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP
    );
  `);

  pgm.sql(`
    CREATE UNIQUE INDEX idx_users_email_unique
    ON users (email); 
  `);
};

exports.down = (pgm) => {
  pgm.sql('DROP TABLE users');
};
