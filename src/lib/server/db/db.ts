
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_USER
} from '$env/static/private';

import mysql from "mysql2/promise";

export const db = await mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: "",
  database: DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10
});
