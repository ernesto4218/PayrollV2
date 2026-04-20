import { query } from "../query";

export async function getEmployeeById(employeeId: number) {
  const rows = await query("SELECT * FROM employees WHERE employee_id = ?", [employeeId]);
  return rows[0] || null;
}

export async function insertEmployee(
    employee_id: number,
    first_name: string,
    middle_name: string | null,
    last_name: string,
    designation: string,
    classification: 'full-time' | 'part-time',
    salary: number,
) {
    const result = await query(
        `INSERT INTO employees (employee_id, first_name, middle_name, last_name, designation, classification, salary)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [employee_id, first_name, middle_name || null, last_name, designation, classification, salary]
    );
    return result;
}

export async function getAllEmployees() {
  const rows = await query(`
    SELECT 
      employee_id, 
      first_name, 
      middle_name, 
      last_name, 
      designation,
      classification, 
      salary, 
      DATE_FORMAT(created_at, '%M %d, %Y') AS created_at
    FROM employees
    ORDER BY created_at DESC
  `);

  return rows || null;
}

export async function getPartTimeEmployees() {
  const rows = await query(`
    SELECT 
      employee_id, 
      first_name, 
      middle_name, 
      last_name, 
      designation,
      classification, 
      salary, 
      DATE_FORMAT(created_at, '%M %d, %Y') AS created_at
    FROM employees
    WHERE classification = 'part-time'
    ORDER BY created_at DESC
  `);

  return rows || [];
}

export async function getEmployeeByName(name: string) {
  const rows = await query(`
    SELECT 
      employee_id, 
      first_name,
      middle_name,
      last_name,
      CONCAT(first_name, ' ', COALESCE(middle_name, ''), ' ', last_name) AS fullname,
      classification, 
      salary, 
      DATE_FORMAT(created_at, '%M %d, %Y') AS created_at
    FROM employees
    WHERE 
      CONCAT(first_name, ' ', COALESCE(middle_name, ''), ' ', last_name) LIKE ?
    ORDER BY created_at DESC
  `, [`%${name}%`]);

  return rows || null;
}

export async function getAllEmployeesUndertime(month: string, year: string) {
  const rows = await query(`
    SELECT 
      e.employee_id, 
      e.first_name, 
      e.middle_name, 
      e.last_name, 
      DATE_FORMAT(e.created_at, '%M %d, %Y') AS created_at,
      u.id AS undertime_id,
      u.hours,
      u.minutes,
      u.month,
      u.year,
      DATE_FORMAT(u.date_updated, '%M %d, %Y') AS date_updated
    FROM employees e
    LEFT JOIN undertime u ON e.employee_id = u.employee_id
      AND u.month = ?
      AND u.year = ?
  `, [month, year]);
  return rows || null;
}


export async function getAllPartTimeEmployees() {
  const rows = await query(`
    SELECT 
      e.employee_id, 
      e.first_name, 
      e.middle_name, 
      e.last_name, 
      DATE_FORMAT(e.created_at, '%M %d, %Y') AS created_at
    FROM employees e
    WHERE e.classification = 'part-time'
    ORDER BY e.last_name ASC
  `, []);

  return rows || [];
}

export async function getAllEmployeesDeductions(month: string, year: string) {
  const rows = await query(`
    SELECT 
      e.employee_id, 
      e.first_name, 
      e.middle_name, 
      e.last_name, 
      DATE_FORMAT(e.created_at, '%M %d, %Y') AS created_at,
      d.id AS deduction_id,
      d.sss,
      d.pagibig,
      d.microdev,
      d.month,
      d.year,
      DATE_FORMAT(d.date_updated, '%M %d, %Y') AS date_updated
    FROM employees e
    LEFT JOIN deductions d ON e.employee_id = d.employee_id
      AND d.month = ?
      AND d.year = ?
  `, [month, year]);
  return rows || null;
}

export async function updateEmployee(
    employee_id: number,
    first_name: string,
    middle_name: string | null,
    last_name: string,
    designation: string,
    classification: 'full-time' | 'part-time',
    salary: number
) {
    const result = await query(
        `UPDATE employees
         SET first_name = ?, middle_name = ?, last_name = ?, designation = ?, classification = ?, salary = ?
         WHERE employee_id = ?`,
        [first_name, middle_name || null, last_name, designation, classification, salary, employee_id]
    );
    return result;
}

export async function getPartTimePayrollData(month: string, year: string) {
  const rows = await query(`
    SELECT 
      e.employee_id, 
      e.first_name, 
      e.middle_name, 
      e.last_name, 
      e.designation,
      e.classification,
      e.salary,
      DATE_FORMAT(e.created_at, '%M %d, %Y') AS created_at,
      
      -- Undertime Fields
      COALESCE(u.hours, 0) as hours,
      COALESCE(u.minutes, 0) as minutes,
      
      -- Deduction Fields (Mapped to match your Column Keys)
      COALESCE(d.sss, 0) as sss,
      COALESCE(d.pagibig, 0) as pag_ibig,
      COALESCE(d.microdev, 0) as microdev,
      
      -- Calculated Fields (Optional, but handy for your Gross/Net columns)
      (e.salary - COALESCE(d.sss, 0) - COALESCE(d.pagibig, 0) - COALESCE(d.microdev, 0)) as net
      
    FROM employees e
    
    -- Join Undertime for specific period
    LEFT JOIN undertime u ON e.employee_id = u.employee_id 
      AND u.month = ? 
      AND u.year = ?
      
    -- Join Deductions for specific period
    LEFT JOIN deductions d ON e.employee_id = d.employee_id 
      AND d.month = ? 
      AND d.year = ?
      
    WHERE e.classification = 'full-time'
    ORDER BY e.last_name ASC
  `, [month, year, month, year]);

  return rows || [];
}