import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSubjectByName } from '$lib/server/db/repositories/subjects.repo';

export const GET: RequestHandler = async ({ url }) => {
    try {
        const q = url.searchParams.get('q')?.toLowerCase() ?? '';

        const data = await getSubjectByName(q);
        return json(data);
    } catch (e) {
        console.error(e);
        return json({ message: 'Internal server error.' }, { status: 500 });
    }
};