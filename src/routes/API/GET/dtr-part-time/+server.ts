import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPartTimeEmployeeDtr } from '$lib/server/db/repositories/dtr.repo';
import { getFacultyLoadsByTeacher, getFacultyLoadSchedules } from '$lib/server/db/repositories/faculty-load.repo';

export const GET: RequestHandler = async ({ url }) => {
    try {
        const employeeId = url.searchParams.get('employee_id') ?? '';
        const month = url.searchParams.get('month')?.toLowerCase() ?? '';
        const year = url.searchParams.get('year') ?? '';
        const sem =  url.searchParams.get('semester') ?? '';

        console.log("sem ", sem);
        console.log("month ", month);
        console.log("year ", year);

        if (!employeeId || !month || !year) {
            return json({ message: 'Employee ID, month, and year are required.' }, { status: 400 });
        }

        const yearNum = parseInt(year);

        if (isNaN(yearNum) || yearNum < 2014 || yearNum > new Date().getFullYear()) {
            return json({ message: `Invalid year. Must be between 2014 and ${new Date().getFullYear()}.` }, { status: 400 });
        }

        //@ts-ignore
        const data = await getPartTimeEmployeeDtr(employeeId, month, year);
        const loads = await getFacultyLoadsByTeacher(sem, year, employeeId);
        
        return json({
            data,
            loads
        });

    } catch (e) {
        console.error(e);
        return json({ message: 'Internal server error.' }, { status: 500 });
    }
};