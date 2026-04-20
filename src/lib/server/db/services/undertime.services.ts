import { getUndertimeByIdMonthYear, insertUndertime, updateUndertime } from "../repositories/dtr.repo";


export async function InsertUndertime(
    employee_id: number, hours:number, minutes: number, month:string, year: string
) {
    
    const result = await insertUndertime(employee_id, hours, minutes, month, year);

    if (result) {
        return { state: true, message: "Dtr added successfully." };
    } else {
        return { state: false, message: "Failed to add dtr." };
    }
}

export async function UpdateUndertime(employee_id: number, hours: number, minutes: number, month: string, year: string) {
    const result = await updateUndertime(employee_id, hours, minutes, month, year);

    if (result) {
        return { state: true, message: "Undertime updated successfully." };
    } else {
        return { state: false, message: "Failed to update undertime." };
    }
}

export async function GetUndertimeByIdMonthYear(employee_id: number, month: string, year: string) {
    const result = await getUndertimeByIdMonthYear(employee_id, month, year);

    if (result) {
        return { state: true, data: result, message: "Undertime fetched successfully." };
    } else {
        return { state: false, data: null, message: "Undertime not found." };
    }
}

