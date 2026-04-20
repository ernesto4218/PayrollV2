import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { saveCalculationSetting } from '$lib/server/db/repositories/settings.repo';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const { name, value } = body;

        if (!name || value === undefined) {
            return json({ message: 'Missing required fields' }, { status: 400 });
        }

        await saveCalculationSetting(name, Number(value));
        return json({ message: 'Settings saved successfully' }, { status: 200 });

    } catch (e) {
        console.error(e);
        return json({ message: 'Failed to save settings' }, { status: 500 });
    }
};