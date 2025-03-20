import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'risk_management',
  password: process.env.DB_PASSWORD || 'toor',
  port: process.env.DB_PORT || 5432,
});

const db = {
  query: (text, params) => pool.query(text, params),
  pool,
};

export default db;
