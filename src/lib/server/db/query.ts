import { db } from "./db";
import type { RowDataPacket } from 'mysql2';

export async function query<T extends RowDataPacket = RowDataPacket>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  const [rows] = await db.execute<T[]>(sql, params);
  return rows;
}
