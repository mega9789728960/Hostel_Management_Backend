import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: "postgres.fcwajthkxusymctcsmhx",   // ✅ pooler user
  host: "aws-1-ap-southeast-1.pooler.supabase.com",
  database: "postgres",
  password: "KQ1oXjMaLnZjs0QM",      // ✅ from env
  port: 5432,                             // ✅ 5432 for shared pooler
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export default pool;
