import { query } from "../query";

export async function getUserById(id: string) {
  const rows = await query("SELECT * FROM users WHERE employee_id = ?", [id]);
  return rows[0] || null;
}
