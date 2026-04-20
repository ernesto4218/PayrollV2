import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GetUndertimeByIdMonthYear, InsertUndertime, UpdateUndertime } from '$lib/server/db/services/undertime.services';

export type Employee = {
    employee_id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    undertime_id: number | null;
    hours: number | 0;
    minutes: number | 0;
    month: string | "";
    year: number | "";
    date_updated: string | null;
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { rows, month, year }: { rows: Employee[]; month: string; year: string } = await request.json();

        if (!rows || !Array.isArray(rows)) {
            return json({ message: 'Invalid data' }, { status: 400 });
        }

        for (const employee of rows) {
            const { employee_id, undertime_id, hours, minutes } = employee;
            const exists = await GetUndertimeByIdMonthYear(employee_id, month, year);

            if (exists.state) {
                await UpdateUndertime(employee_id, hours, minutes, month, year);
            } else {
                await InsertUndertime(employee_id, hours, minutes, month, year);
            }
        }

        return json({ message: 'Undertime saved successfully' }, { status: 200 });

    } catch (e) {
        console.error(e);
        return json({ message: 'Failed to save undertime' }, { status: 500 });
    }
};