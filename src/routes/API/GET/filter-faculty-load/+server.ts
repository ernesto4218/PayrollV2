import { json } from '@sveltejs/kit';
import { getAllFacultyLoads } from '$lib/server/db/services/faculty_load_services';

export async function GET({ url }) {
    const sem = url.searchParams.get('sem');
    const year = url.searchParams.get('year');

    if (!sem || !year) {
        return json({ message: 'Semester and school year are required.' }, { status: 400 });
    }

    try {
        const data = await getAllFacultyLoads(sem, year);
        return json(data);
    } catch (e: any) {
        return json({ message: e.message || 'Internal server error.' }, { status: 500 });
    }
}