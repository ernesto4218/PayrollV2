import { query } from "../query";
import type { ResultSetHeader } from 'mysql2';

export async function insertFacultyLoad(
    employee_id: number,
    subject_id: number,
    semester: string,
    school_year: string
) {
    const result = await query(
        `INSERT INTO faculty_loads (employee_id, subject_id, semester, school_year)
         VALUES (?, ?, ?, ?)`,
        [employee_id, subject_id, semester, school_year]
    );

    //@ts-ignore
    return result?.insertId ?? null;
}

export async function insertFacultyLoadSchedules(
    load_id: number,
    schedules: { day: string; time_start: string; time_end: string }[]
) {
    for (const s of schedules) {
        await query(
            `INSERT INTO faculty_load_schedules (load_id, day, time_start, time_end)
             VALUES (?, ?, ?, ?)`,
            [load_id, s.day, s.time_start, s.time_end]
        );
    }
    return true;
}

export async function getFacultyLoads(semester: string, school_year: string) {
    const rows = await query(
        `SELECT 
            fl.id AS load_id,
            e.employee_id,
            CONCAT(
                e.first_name, ' ',
                COALESCE(NULLIF(e.middle_name, ''), ''),
                ' ', e.last_name
            ) AS fullname,
            s.id AS subject_id,
            s.code AS subject_code,
            s.name AS subject_name,
            fl.semester,
            fl.school_year,
            DATE_FORMAT(fl.created_at, '%M %d, %Y') AS created_at
         FROM faculty_loads fl
         JOIN employees e ON fl.employee_id = e.employee_id
         JOIN subjects s ON fl.subject_id = s.id
         WHERE fl.semester = ? AND fl.school_year = ?
         ORDER BY e.last_name ASC`,
        [semester, school_year]
    );

    return rows as any[];
}

export async function getFacultyLoadSchedules(load_id: number) {
    const rows = await query(
        `SELECT 
            day,
            time_start,
            time_end
         FROM faculty_load_schedules
         WHERE load_id = ?
         ORDER BY FIELD(day, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday')`,
        [load_id]
    );

    return rows as any[];
}

export async function getFacultyLoadsByTeacher(semester: string, school_year: string, employee_id?: string) {
    const conditions = ['fl.semester = ?', 'fl.school_year = ?'];
    const params: any[] = [semester, school_year];

    if (employee_id) {
        conditions.push('fl.employee_id = ?');
        params.push(employee_id);
    }

    const rows = await query(
        `SELECT 
            fl.id AS load_id,
            e.employee_id,
            CONCAT(
                e.first_name, ' ',
                COALESCE(NULLIF(e.middle_name, ''), ''),
                ' ', e.last_name
            ) AS fullname,
            s.id AS subject_id,
            s.code AS subject_code,
            s.name AS subject_name,
            fl.semester,
            fl.school_year,
            DATE_FORMAT(fl.created_at, '%M %d, %Y') AS created_at,
            fls.day AS schedule_day,
            fls.time_start AS schedule_time_start,
            fls.time_end AS schedule_time_end
        FROM faculty_loads fl
        JOIN employees e ON fl.employee_id = e.employee_id
        JOIN subjects s ON fl.subject_id = s.id
        LEFT JOIN faculty_load_schedules fls ON fls.load_id = fl.id
        WHERE ${conditions.join(' AND ')}
        ORDER BY e.last_name ASC`,
        params
    );

    const loadsMap = new Map<number, any>();
    for (const row of rows as any[]) {
        if (!loadsMap.has(row.load_id)) {
            loadsMap.set(row.load_id, {
                load_id: row.load_id,
                subject_code: row.subject_code,
                subject_name: row.subject_name,
                schedules: []
            });
        }
        if (row.schedule_day) {
            loadsMap.get(row.load_id).schedules.push({
                day: row.schedule_day,
                time_start: row.schedule_time_start,
                time_end: row.schedule_time_end
            });
        }
    }

    return Array.from(loadsMap.values());
}

export async function deleteFacultyLoadQ(id: number) {
    const result = await query(
        `DELETE FROM faculty_loads WHERE id = ?`,
        [id]
    );
    return result;
}

export async function updateFacultyLoadRecord(
    load_id: number,
    employee_id: number,
    subject_id: number,
    semester: string,
    school_year: string
) {
    const result = await query(
    `UPDATE faculty_loads 
     SET employee_id = ?, subject_id = ?, semester = ?, school_year = ?
     WHERE id = ?`,
    [employee_id, subject_id, semester, school_year, load_id]
) as unknown as ResultSetHeader;
    return result?.affectedRows > 0;
}

export async function replaceSchedules(
    load_id: number,
    schedules: { day: string; time_start: string; time_end: string }[]
) {
    // Delete old schedules
    await query(`DELETE FROM faculty_load_schedules WHERE load_id = ?`, [load_id]);

    // Insert new ones
    for (const s of schedules) {
        await query(
            `INSERT INTO faculty_load_schedules (load_id, day, time_start, time_end)
             VALUES (?, ?, ?, ?)`,
            [load_id, s.day, s.time_start, s.time_end]
        );
    }

    return true;
}