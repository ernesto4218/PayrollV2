import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllEmployees } from '$lib/server/db/repositories/employee.repo';

export const GET: RequestHandler = async () => {
    try {
        const employees = await getAllEmployees();
        return json(employees, { status: 200 });
    } catch (e) {
        console.error(e);
        return json({ message: 'Internal server error.' }, { status: 500 });
    }
};