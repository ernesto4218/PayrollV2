import { query } from "../query";

export async function insertUndertime(
    employee_id: number, hours: number, minutes: number, month: string, year: string
) {
    const result = await query(
        `INSERT INTO undertime (employee_id, hours, minutes, month, year)
         VALUES (?, ?, ?, ?, ?)`,
        [employee_id, hours, minutes, month, year]
    );
    return result;
}

export async function updateUndertime(employee_id: number, hours: number, minutes: number, month: string, year: string) {
    const result = await query(
        `UPDATE undertime 
         SET hours = ?, minutes = ?, month = ?, year = ?
         WHERE employee_id = ? AND month = ? AND year = ?`,
        [hours, minutes, month, year, employee_id, month, year]
    );
    return result;
}

export async function getUndertimeByIdMonthYear(employee_id: number, month: string, year: string) {
    const result = await query(
        `SELECT * FROM undertime 
         WHERE employee_id = ? AND month = ? AND year = ?`,
        [employee_id, month, year]
    );
    return result[0] ?? null;
}

export async function upsertDtrEntry(
    employee_id: number,
    month: number,
    year: number,
    day: number,
    hours: number,
    minutes: number
) {
    const result = await query(
        `INSERT INTO dtr (employee_id, month, year, day, hours, minutes)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            hours = VALUES(hours),
            minutes = VALUES(minutes)`,
        [employee_id, month, year, day, hours, minutes]
    );
    return result;
}

export async function getDtrByEmployeeMonthYear(
    employee_id: number,
    month: number,
    year: number
) {
    const rows = await query(
        `SELECT * FROM dtr 
         WHERE employee_id = ? AND month = ? AND year = ?
         ORDER BY day ASC`,
        [employee_id, month, year]
    );
    return rows || [];
}


export async function getEmployeeDtr(employee_id:string, month: number, year: number) {
        const rows = await query(
        `SELECT * FROM hours_rendered 
         WHERE employee_id = ? AND month = ? AND year = ?`,
        [employee_id, month, year]
    );
    return rows || [];
}

export async function getPartTimeEmployeeDtr(employee_id:string, month: number, year: number) {
        const rows = await query(
        `SELECT * FROM dtr_part_time 
         WHERE employee_id = ? AND month = ? AND year = ?`,
        [employee_id, month, year]
    );
    return rows || [];
}

export async function getTotalHoursRendered(employee_id: number, month: number, year: number) {
    const rows = await query(
        `SELECT 
            SUM(hours) AS total_hours,
            SUM(minutes) AS total_minutes
         FROM hours_rendered
         WHERE employee_id = ? AND month = ? AND year = ?`,
        [employee_id, month, year]
    );

    const raw = rows[0];
    const extraHours = Math.floor((raw.total_minutes ?? 0) / 60);
    const remainingMinutes = (raw.total_minutes ?? 0) % 60;

    return {
        hours: (raw.total_hours ?? 0) + extraHours,
        minutes: remainingMinutes
    };
}

export async function upsertDtrEntryPartTime(
    employee_id: number,
    month: number,
    year: number,
    day: number,
    hours: number,
    minutes: number
) {
    const existing = await query(
        `SELECT id FROM hours_rendered
         WHERE employee_id = ? AND month = ? AND year = ? AND day = ?`,
        [employee_id, month, year, day]
    );

    if (existing && existing.length > 0) {
        return await query(
            `UPDATE hours_rendered
             SET hours = ?, minutes = ?
             WHERE employee_id = ? AND month = ? AND year = ? AND day = ?`,
            [hours, minutes, employee_id, month, year, day]
        );
    } else {
        return await query(
            `INSERT INTO hours_rendered (employee_id, month, year, day, hours, minutes)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [employee_id, month, year, day, hours, minutes]
        );
    }
}

export async function totalPartTimeHoursWorked(month: number, year: number) {
    const rows = await query(
        `SELECT 
            e.employee_id,
            e.first_name,
            e.middle_name,
            e.last_name,
            h.hours,
            h.minutes
         FROM employees e
         LEFT JOIN hours_rendered h ON e.employee_id = h.employee_id
            AND h.month = ?
            AND h.year = ?
         WHERE e.classification = 'part-time'`,
        [month.toString(), year]
    );

    const employeeMap = new Map<number, any>();

    for (const row of rows || []) {
        if (!employeeMap.has(row.employee_id)) {
            employeeMap.set(row.employee_id, {
                employee_id: row.employee_id,
                first_name: row.first_name,
                middle_name: row.middle_name,
                last_name: row.last_name,
                total_minutes: 0
            });
        }

        const emp = employeeMap.get(row.employee_id);
        emp.total_minutes += (row.hours ?? 0) * 60 + (row.minutes ?? 0);
    }

    return Array.from(employeeMap.values()).map((emp) => ({
        employee_id: emp.employee_id,
        first_name: emp.first_name,
        middle_name: emp.middle_name,
        last_name: emp.last_name,
        hours: Math.floor(emp.total_minutes / 60),
        minutes: emp.total_minutes % 60
    }));
}

export async function upsertDtrPartTime(
    employee_id: number,
    month: string,
    year: number,
    day: number,
    am_in: string | null,
    am_out: string | null,
    pm_in: string | null,
    pm_out: string | null,
    hours: number,
    minutes: number
) {
    return await query(
        `INSERT INTO dtr_part_time 
            (employee_id, month, year, day, am_in, am_out, pm_in, pm_out, hours, minutes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            am_in = VALUES(am_in),
            am_out = VALUES(am_out),
            pm_in = VALUES(pm_in),
            pm_out = VALUES(pm_out),
            hours = VALUES(hours),
            minutes = VALUES(minutes)`,
        [employee_id, month, year, day, am_in, am_out, pm_in, pm_out, hours, minutes]
    );
}

export async function upsertHoursRendered(
    employee_id: number,
    month: string,
    year: number,
    day: number,
    hours: number,
    minutes: number
) {
    return await query(
        `INSERT INTO hours_rendered
            (employee_id, month, year, day, hours, minutes)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            hours = VALUES(hours),
            minutes = VALUES(minutes)`,
        [employee_id, month, year, day, hours, minutes]
    );
}