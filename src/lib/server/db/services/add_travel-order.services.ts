import { getEmployeeById, insertEmployee } from "../repositories/employee.repo";
import { addTravelOrderQ } from "../repositories/travel-order.repo";

export async function addTravelOrder(
    employee_id: number,
    travel_purpose: string,
    message: string | null,
    from: Date,
    to: Date,
    classification: string,
) {
    const existing = await getEmployeeById(employee_id);

    if (!existing) {
        return { state: false, message: "Employee doesnt exists." };
    }

    const result = await addTravelOrderQ(employee_id, travel_purpose, message, from, to, classification);

    if (result) {
        return { state: true, message: "Travel order added successfully." };
    } else {
        return { state: false, message: "Failed to add travel order." };
    }
}