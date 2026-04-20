import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { saveDtrPartTime } from '$lib/server/db/services/dtr.services';

type DtrEntry = {
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
};

export const POST: RequestHandler = async ({ request }) => {
    const payload: DtrEntry[] = await request.json();

    if (!Array.isArray(payload) || payload.length === 0) {
        return json({ message: 'No records to save.' }, { status: 400 });
    }

    for (const entry of payload) {
        if (!entry.employee_id || !entry.month || !entry.year || !entry.day) {
            return json({ message: 'Missing required fields in one or more entries.' }, { status: 400 });
        }
        if (entry.hours < 0 || entry.hours > 23) {
            return json({ message: `Invalid hours for day ${entry.day}.` }, { status: 400 });
        }
        if (entry.minutes < 0 || entry.minutes > 59) {
            return json({ message: `Invalid minutes for day ${entry.day}.` }, { status: 400 });
        }
    }

    try {
        const result = await saveDtrPartTime(payload);
        if (!result.state) {
            return json({ message: result.message }, { status: 409 });
        }
        return json({ message: result.message }, { status: 201 });
    } catch (e: any) {
        console.error(e);
        return json({ message: 'Internal server error.' }, { status: 500 });
    }
};