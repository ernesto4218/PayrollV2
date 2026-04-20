import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addFacultyLoad } from '$lib/server/db/services/faculty_load_services';


export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();
    const { employee_id, subject_id, semester, school_year, schedules } = body;

    if (!employee_id || !subject_id || !semester || !school_year || !schedules?.length) {
        return json({ message: 'Missing required fields.' }, { status: 400 });
    }

    try {
        const result = await addFacultyLoad(employee_id, subject_id, semester, school_year, schedules);
        return json({ message: result.message }, { status: result.state ? 201 : 500 });
    } catch (e: any) {
        console.error(e);
        return json({ message: 'Internal server error.' }, { status: 500 });
    }
};
