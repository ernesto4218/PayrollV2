import { getDeductionsByIdMonthYear, insertDeductions, updateDeductions } from "../repositories/deductions.repo";


export async function InsertDeductions(
    employee_id: number, sss:number, pagibig: number, microdev:number, month:string, year: string
) {
    
    const result = await insertDeductions(employee_id, sss, pagibig, microdev, month, year);

    if (result) {
        return { state: true, message: "Dtr added successfully." };
    } else {
        return { state: false, message: "Failed to add dtr." };
    }
}

export async function UpdateDeductions(employee_id: number, sss: number, pagibig: number, microdev:number, month: string, year: string) {
    const result = await updateDeductions(employee_id, sss, pagibig, microdev, month, year);

    if (result) {
        return { state: true, message: "Deductions updated successfully." };
    } else {
        return { state: false, message: "Failed to update Deductions." };
    }
}

export async function GetDeductionsByIdMonthYear(employee_id: number, month: string, year: string) {
    const result = await getDeductionsByIdMonthYear(employee_id, month, year);

    if (result) {
        return { state: true, data: result, message: "Deductions fetched successfully." };
    } else {
        return { state: false, data: null, message: "Deductions not found." };
    }
}

