import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteTravelOrderQ } from '$lib/server/db/repositories/travel-order.repo';

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return json({ message: 'Invalid travel order ID.' }, { status: 400 });
        }

        await deleteTravelOrderQ(id);
        return json({ message: 'Travel order deleted successfully.' });
    } catch (e) {
        console.error(e);
        return json({ message: 'Internal server error.' }, { status: 500 });
    }
};