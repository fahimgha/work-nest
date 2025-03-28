import postgres from "postgres";

//crée une connexion avec la base de données postgresSQl
const sql = postgres({
  host: "localhost",
  port: 5432,
  database: "postgres",
  username: "postgres",
  password: "",
});
export default sql;
