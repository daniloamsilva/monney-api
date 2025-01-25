exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE tokens (
      id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      token UUID NOT NULL,
      type TEXT NOT NULL,
      used_at TIMESTAMP,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP
    );
  `);

  pgm.sql(`
    CREATE UNIQUE INDEX idx_tokens_token_unique
    ON tokens (token);  
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE tokens`);
};
