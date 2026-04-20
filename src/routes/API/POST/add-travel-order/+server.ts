import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addEmployee } from '$lib/server/db/services/employee.services';
import { addTravelOrder } from '$lib/server/db/services/add_travel-order.services';

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();

    const { employee_id, travel_purpose, message, from, to, classification } = body;
    console.log(employee_id);
    console.log(travel_purpose);
    console.log(message);
    console.log(from);
    console.log(to);

    if (!employee_id || !travel_purpose || !from || !to || !classification) {
        return json({ message: 'Missing required fields.' }, { status: 400 });
    }

    try {
        const result = await addTravelOrder(employee_id, travel_purpose, message ?? null, from, to, classification);

        if (!result.state) {
            return json({ message: result.message }, { status: 409 });
        }

        return json({ message: result.message }, { status: 201 });

    } catch (e: any) {
        console.error(e);
        return json({ message: 'Internal server error.' }, { status: 500 });
    }
};