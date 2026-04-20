import { getEmployeeById, insertEmployee, updateEmployee } from "../repositories/employee.repo";

export async function addEmployee(
    employee_id: number,
    first_name: string,
    middle_name: string | null,
    last_name: string,
    designation: string,
    classification: 'full-time' | 'part-time',
    salary: number
) {
    const existing = await getEmployeeById(employee_id);

    if (existing) {
        return { state: false, message: "Employee already exists." };
    }

    const result = await insertEmployee(employee_id, first_name, middle_name, last_name, designation, classification, salary);

    if (result) {
        return { state: true, message: "Employee added successfully." };
    } else {
        return { state: false, message: "Failed to add employee." };
    }
}

export async function editEmployee(
    employee_id: number,
    first_name: string,
    middle_name: string | null,
    last_name: string,
    designation: string,
    classification: 'full-time' | 'part-time',
    salary: number
) {
    const existing = await getEmployeeById(employee_id);

    if (!existing) {
        return { state: false, message: "Employee not found." };
    }

    const result = await updateEmployee(employee_id, first_name, middle_name, last_name, designation, classification, salary);

    if (result) {
        return { state: true, message: "Employee updated successfully." };
    } else {
        return { state: false, message: "Failed to update employee." };
    }
}