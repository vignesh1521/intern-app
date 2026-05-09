import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "sql12.freesqldatabase.com",
  user: "sql12825797",
  password: "VRqpThB4vg",
  database: "sql12825797",
});

export default pool;