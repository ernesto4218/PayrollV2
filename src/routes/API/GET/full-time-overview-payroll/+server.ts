import { json } from '@sveltejs/kit';
import { calculateEmployeePayroll } from '$lib/utils';
import { getPartTimePayrollData } from '$lib/server/db/repositories/employee.repo';
import { getAllEmployeesTravelOrder } from '$lib/server/db/repositories/travel-order.repo';
import { getCalculationSettings } from '$lib/server/db/repositories/settings.repo.js';

export const GET = async ({ url }) => {
    try {
        const monthStr = url.searchParams.get('month')?.toLowerCase() ?? '';
        const yearStr = url.searchParams.get('year') ?? '';
        const monthNum = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ].indexOf(monthStr) + 1;

        const payroll = await getPartTimePayrollData(monthStr, yearStr);
        const travelOrders = await getAllEmployeesTravelOrder(monthNum, parseInt(yearStr));
        const total_worked_hours_data = await getCalculationSettings().catch(() => []);
        const total_worked_hours = Number(
            total_worked_hours_data.find((s: any) => s.name === 'total_worked_hours')?.value
        ) || 8;
        const processedData = payroll.map(emp => {
            const empOrders = travelOrders.filter(to => to.employee_id === emp.employee_id);

            let travelCreditHours = 0;

            empOrders.forEach(order => {
                const type = order.classification?.toLowerCase();

                if (type === 'half-day') {
                    travelCreditHours += 4;
                } else {
                    const start = new Date(order.date_from);
                    const end = new Date(order.date_to);
                    const diffTime = Math.abs(end.getTime() - start.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    travelCreditHours += diffDays * 8;
                }
            });

            // ✅ Now actually call calculateEmployeePayroll
            const computed = calculateEmployeePayroll({
                salary: emp.salary,
                hours: emp.hours,
                minutes: emp.minutes,
                travel_credit: travelCreditHours,
                sss: emp.sss,
                pag_ibig: emp.pag_ibig,
                microdev: emp.microdev,
                'wh-tax': emp['wh-tax'],
                total_worked_hours: total_worked_hours,
                month: monthNum,
                year: parseInt(yearStr)
            });

            return {
                ...emp,
                travel_credit: travelCreditHours,
                ...computed, // net_hours, undertime_deduction, gross, total_deductions, net
            };
        });

        console.log(processedData);
        return json(processedData);
    } catch (e) {
        console.error(e); // ✅ Log the actual error so you can debug
        return json({ message: 'Error' }, { status: 500 });
    }
};