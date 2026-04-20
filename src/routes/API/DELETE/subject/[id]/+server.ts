import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteSubjectQ } from '$lib/server/db/repositories/subjects.repo';

export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            return json({ message: 'Invalid subject ID.' }, { status: 400 });
        }

        await deleteSubjectQ(id);
        return json({ message: 'Subject deleted successfully.' });
    } catch (e: any) {
        console.error(e);

        if (e.code === 'ER_ROW_IS_REFERENCED_2') {
            return json(
                { message: 'Cannot delete this subject because it is assigned to a faculty load. Remove the faculty load first before deleting the subject.' },
                { status: 409 }
            );
        }

        return json({ message: 'Internal server error.' }, { status: 500 });
    }
};