import { env } from '$env/dynamic/private';

import mysql from "mysql2/promise";

export const db = await mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: "",
  database: env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10
});
