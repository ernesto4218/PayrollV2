import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GetDeductionsByIdMonthYear, InsertDeductions, UpdateDeductions } from '$lib/server/db/services/deductions.services';

export type Employee = {
    employee_id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    deduction_id: number | null;
    sss: number | 0;
    pagibig: number | 0;
    microdev: number | 0;
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
            const { employee_id, sss, pagibig, microdev } = employee;
            const exists = await GetDeductionsByIdMonthYear(employee_id, month, year);

            if (exists.state) {
                await UpdateDeductions(employee_id, sss, pagibig, microdev, month, year);
            } else {
                await InsertDeductions(employee_id, sss, pagibig, microdev, month, year);
            }
        }

        return json({ message: 'Undertime saved successfully' }, { status: 200 });

    } catch (e) {
        console.error(e);
        return json({ message: 'Failed to save undertime' }, { status: 500 });
    }
};