import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { editEmployee } from '$lib/server/db/services/employee.services';

export const PUT: RequestHandler = async ({ request, params }) => {
    const employee_id = Number(params.id);

    if (!employee_id || isNaN(employee_id)) {
        return json({ message: 'Invalid employee ID.' }, { status: 400 });
    }

    const body = await request.json();
    const { first_name, middle_name, last_name, designation, classification, salary } = body;

    if (!first_name || !last_name || !designation || !classification || !salary) {
        return json({ message: 'Missing required fields.' }, { status: 400 });
    }

    if (!['full-time', 'part-time'].includes(classification)) {
        return json({ message: 'Invalid classification.' }, { status: 400 });
    }

    if (salary <= 0) {
        return json({ message: 'Salary must be greater than zero.' }, { status: 400 });
    }

    try {
        const result = await editEmployee(employee_id, first_name, middle_name ?? null, last_name, designation, classification, salary);

        if (!result.state) {
            return json({ message: result.message }, { status: 404 });
        }

        return json({ message: result.message }, { status: 200 });

    } catch (e: any) {
        console.error(e);
        return json({ message: 'Internal server error.' }, { status: 500 });
    }
};