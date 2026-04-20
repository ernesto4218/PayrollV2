import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllSubjects } from '$lib/server/db/repositories/subjects.repo';

export const GET: RequestHandler = async () => {
    try {
        const subjects = await getAllSubjects();
        return json(subjects, { status: 200 });
    } catch (e) {
        console.error(e);
        return json({ message: 'Internal server error.' }, { status: 500 });
    }
};
