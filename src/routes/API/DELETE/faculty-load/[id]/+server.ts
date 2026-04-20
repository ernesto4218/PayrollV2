import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteFacultyLoadQ } from '$lib/server/db/repositories/faculty-load.repo';

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return json({ message: 'Invalid subject ID.' }, { status: 400 });
        }

        await deleteFacultyLoadQ(id);
        return json({ message: 'Faculty load deleted successfully.' });
    } catch (e) {
        console.error(e);
        return json({ message: 'Internal server error.' }, { status: 500 });
    }
};