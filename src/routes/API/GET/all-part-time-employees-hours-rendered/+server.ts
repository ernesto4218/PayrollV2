import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { totalPartTimeHoursWorked } from '$lib/server/db/repositories/dtr.repo';

const VALID_MONTHS = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
];

export const GET: RequestHandler = async ({ url }) => {
    try {
        const month = url.searchParams.get('month')?.toLowerCase() ?? '';
        const year = url.searchParams.get('year') ?? '';
        const monthNum = new Date(`${month} 1, ${year}`).getMonth() + 1;
        const semester = url.searchParams.get('semester') ?? '';
        
        if (!month || !year) {
            return json({ message: 'Month and year are required.' }, { status: 400 });
        }

        if (!VALID_MONTHS.includes(month)) {
            return json({ message: 'Invalid month.' }, { status: 400 });
        }

        const yearNum = parseInt(year);

        if (isNaN(yearNum) || yearNum < 2014 || yearNum > new Date().getFullYear()) {
            return json({ message: `Invalid year. Must be between 2014 and ${new Date().getFullYear()}.` }, { status: 400 });
        }

        const data = await totalPartTimeHoursWorked(monthNum, yearNum);
        console.log(data);
        return json(data);
    } catch (e) {
        console.error(e);
        return json({ message: 'Internal server error.' }, { status: 500 });
    }
};