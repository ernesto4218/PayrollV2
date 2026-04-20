import { json } from '@sveltejs/kit';
import type { ResultSetHeader } from 'mysql2';
import { updateFacultyLoad } from '$lib/server/db/services/faculty_load_services';

export async function PUT({ params, request }) {
    const id = Number(params.id);
    const { employee_id, subject_id, semester, school_year, schedules } = await request.json();

    if (!employee_id || !subject_id || !semester || !school_year || !schedules?.length) {
        return json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const result = await updateFacultyLoad(id, employee_id, subject_id, semester, school_year, schedules);
    console.log("REsult ", result);
    return json({ message: result.message }, { status: result.state ? 200 : 500 });
}