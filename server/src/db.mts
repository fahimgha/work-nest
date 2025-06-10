console.log("📦 Connecting to Postgres...");
import postgres from "postgres";

//crée une connexion avec la base de données postgresSQl
const sql = postgres({
  host: "localhost",
  port: 5432,
  database: "postgres",
  username: "postgres",
  password: "faroudja",
});
console.log("✅ Connected to Postgres");

export default sql;
