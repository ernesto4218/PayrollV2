import { query } from "../query";

export async function addTravelOrderQ(
    employee_id: number,
    travel_purpose: string,
    message: string | null,
    from: Date,
    to: Date,
    classification: string,
) {
    const result = await query(
        `INSERT INTO travel_order (employee_id, purpose, message, \`from\`, \`to\`, classification)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [employee_id, travel_purpose, message || null, from, to, classification]
    );
    return result;
}

export async function getAllEmployeesTravelOrder(month: number, year: number) {
  const rows = await query(`
    SELECT 
      tr.id AS travel_order_id,
      tr.purpose,
      tr.message,
      tr.classification,
      DATE_FORMAT(tr.\`from\`, '%M %d, %Y') AS date_from,
      DATE_FORMAT(tr.\`to\`, '%M %d, %Y') AS date_to,
      DATE_FORMAT(tr.date_updated, '%M %d, %Y') AS date_updated,
      e.employee_id,
      e.first_name,
      e.middle_name,
      e.last_name
    FROM travel_order tr
    INNER JOIN employees e ON tr.employee_id = e.employee_id
    WHERE MONTH(tr.\`from\`) = ? AND YEAR(tr.\`from\`) = ?
    ORDER BY tr.date_updated DESC
  `, [month, year]);
  return rows || null;
}

export async function deleteTravelOrderQ(id: number) {
    const result = await query(
        `DELETE FROM travel_order WHERE id = ?`,
        [id]
    );
    return result;
}