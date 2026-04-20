import { getEmployeeDtr, getTotalHoursRendered, upsertDtrEntry, upsertDtrEntryPartTime, upsertDtrPartTime, upsertHoursRendered } from "../repositories/dtr.repo";
import { getAllPartTimeEmployees } from "../repositories/employee.repo";

type DtrEntry = {
    employee_id: number;
    month: number;
    year: number;
    day: number;
    hours: number;
    minutes: number;
};

export async function saveDtr(payload: DtrEntry[]): Promise<{ state: boolean; message: string }> {
    try {
        for (const entry of payload) {
            await upsertDtrEntry(
                entry.employee_id,
                entry.month,
                entry.year,
                entry.day,
                entry.hours,
                entry.minutes
            );
        }
        return { state: true, message: "DTR saved successfully." };
    } catch (e: any) {
        console.error(e);
        return { state: false, message: e?.message ?? "Failed to save DTR." };
    }
}

export async function saveDtrPartTime(payload: {
    employee_id: number;
    month: string;
    year: string;
    day: number;
    am_in: string;
    am_out: string;
    pm_in: string;
    pm_out: string;
    hours: number;
    minutes: number;
}[]) {
    try {
        for (const entry of payload) {
            const startYear = parseInt(entry.year.split('-')[0]);

            await upsertDtrPartTime(
                entry.employee_id,
                entry.month,
                startYear,
                entry.day,
                entry.am_in || null,
                entry.am_out || null,
                entry.pm_in || null,
                entry.pm_out || null,
                entry.hours,
                entry.minutes
            );

            await upsertHoursRendered(
                entry.employee_id,
                entry.month,
                startYear,
                entry.day,
                entry.hours,
                entry.minutes
            );
        }

        return { state: true, message: 'DTR saved successfully.' };
    } catch (e: any) {
        console.error(e);
        return { state: false, message: e.message ?? 'Failed to save DTR.' };
    }
}
