exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE wallets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      name VARCHAR(100) NOT NULL,
      initial_balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
      is_default BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP
    );
  `);

  pgm.sql(`
    CREATE INDEX idx_wallets_user_id
    ON wallets (user_id);
  `);

  pgm.sql(`
    CREATE UNIQUE INDEX idx_wallets_default_per_user
    ON wallets (user_id)
    WHERE is_default = true AND deleted_at IS NULL;
  `);
};

exports.down = (pgm) => {
  pgm.sql('DROP TABLE wallets');
};
