import { query } from "../query";

export async function getCalculationSettings() {
  const rows = await query(`
    SELECT 
      id,
      name, 
      value, 
      DATE_FORMAT(date_updated, '%M %d, %Y') AS date_updated
    FROM calculation_settings
    ORDER BY date_updated DESC
  `);

  return rows || null;
}

export async function saveCalculationSetting(name: string, value: number) {
  const existing = await query(`
    SELECT id FROM calculation_settings WHERE name = ? LIMIT 1
  `, [name]);

  if (existing.length === 0) {
    return await query(`
      INSERT INTO calculation_settings (name, value)
      VALUES (?, ?)
    `, [name, value]);
  }

  return await query(`
    UPDATE calculation_settings
    SET value = ?,
        date_updated = NOW()
    WHERE name = ? 
    LIMIT 1
  `, [value, name]);
}