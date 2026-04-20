import { query } from "../query";

export async function getSubjectByCode(code: string) {
  const rows = await query("SELECT * FROM subjects WHERE code = ?", [code]);
  return rows[0] || null;
}

export async function insertSubject(
    code: string,
    name: string,
   
) {
    const result = await query(
        `INSERT INTO subjects (code, name)
         VALUES (?, ?)`,
        [code, name]
    );
    return result;
}


export async function getAllSubjects() {
  const rows = await query(`
    SELECT 
      id,
      code, 
      name, 
      DATE_FORMAT(updated_at, '%M %d, %Y') AS created_at
    FROM subjects
    ORDER BY updated_at DESC
  `);

  return rows || null;
}

export async function deleteSubjectQ(id: number) {
    const result = await query(
        `DELETE FROM subjects WHERE id = ?`,
        [id]
    );
    return result;
}

export async function getSubjectByName(name: string) {
  const rows = await query(`
    SELECT  
      id,
      code, 
      name,
      DATE_FORMAT(updated_at, '%M %d, %Y') AS updated_at
    FROM subjects
    WHERE 
      CONCAT(name) LIKE ?
      OR CONCAT(code) LIKE ?
    ORDER BY updated_at DESC
  `, [`%${name}%`, `%${name}%`]);

  return rows || null;
}