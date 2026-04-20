import { query } from "../query";

export async function insertDeductions(
    employee_id: number, sss: number, pagibig: number, microdev: number, month: string, year: string
) {
    const result = await query(
        `INSERT INTO deductions (employee_id, sss, pagibig, microdev, month, year)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [employee_id, sss, pagibig, microdev, month, year]
    );
    return result;
}

export async function updateDeductions(employee_id: number, sss: number, pagibig: number, microdev:number, month: string, year: string) {
    const result = await query(
        `UPDATE deductions 
         SET sss = ?, pagibig = ?, microdev = ?, month = ?, year = ?
         WHERE employee_id = ? AND month = ? AND year = ?`,
        [sss, pagibig, microdev, month, year, employee_id, month, year]
    );
    return result;
}

export async function getDeductionsByIdMonthYear(employee_id: number, month: string, year: string) {
    const result = await query(
        `SELECT * FROM deductions 
         WHERE employee_id = ? AND month = ? AND year = ?`,
        [employee_id, month, year]
    );
    return result[0] ?? null;
}