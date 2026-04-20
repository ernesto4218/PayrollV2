import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { addSubject } from '$lib/server/db/services/subject.services';

export const POST: RequestHandler = async ({ request }) => {
    const body = await request.json();

    const { code, name } = body;

    if (!code || !name) {
        return json({ message: 'Missing required fields.' }, { status: 400 });
    }

    try {
        const result = await addSubject(code, name);

        if (!result.state) {
            return json({ message: result.message }, { status: 409 });
        }

        return json({ message: result.message }, { status: 201 });

    } catch (e: any) {
        console.error(e);
        return json({ message: 'Internal server error.' }, { status: 500 });
    }
};