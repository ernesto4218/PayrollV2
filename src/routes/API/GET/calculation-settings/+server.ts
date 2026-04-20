import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCalculationSettings } from '$lib/server/db/repositories/settings.repo';

export const GET: RequestHandler = async ({ url }) => {
    try {
       
        const data = await getCalculationSettings();
        return json(data);
    } catch (e) {
        console.error(e);
        return json({ message: 'Internal server error.' }, { status: 500 });
    }
};