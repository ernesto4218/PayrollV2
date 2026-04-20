import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };


// payroll
export interface PayrollInput {
    salary: number | string;
    hours: number | string;
    minutes: number | string;
    travel_credit: number | string;
    sss: number | string;
    pag_ibig: number | string;
    microdev: number | string;
    'wh-tax': number | string;
    total_worked_hours: number; // custom daily hours (e.g. 8)
    month?: number; // 1-12, defaults to current month
    year?: number;  // defaults to current year
}

export function calculateEmployeePayroll(data: PayrollInput) {
    const salary = Number(data.salary) || 0;
    const rawHours = Number(data.hours) || 0;
    const minutes = Number(data.minutes) || 0;
    const travelCredit = Number(data.travel_credit) || 0;

    const sss = Number(data.sss) || 0;
    const pag_ibig = Number(data.pag_ibig) || 0;
    const microdev = Number(data.microdev) || 0;
    const whTax = Number(data['wh-tax']) || 0;

    const dailyHours = Number(data.total_worked_hours) || 8;

    // 1. Get total working hours for the month (days in month × daily hours)
    const now = new Date();
    const year = data.year ?? now.getFullYear();
    const month = data.month ?? (now.getMonth() + 1);
    const daysInMonth = new Date(year, month, 0).getDate(); // e.g. 31 for January
    const monthlyHours = daysInMonth * dailyHours;           // e.g. 31 * 8 = 248

    // 2. Hourly Rate based on actual month hours
    const hourlyRate = salary / monthlyHours;

    // 3. Net Undertime (convert everything to minutes, subtract credit, convert back)
    const totalRawMinutes = (rawHours * 60) + minutes;
    const travelCreditMinutes = travelCredit * 60;
    const netTotalMinutes = Math.max(0, totalRawMinutes - travelCreditMinutes);

    const netHours = Math.floor(netTotalMinutes / 60);
    const netMinutes = netTotalMinutes % 60;

    // 4. Gross Pay Calculation
    const undertimeDeduction = (netHours * hourlyRate) + (netMinutes * (hourlyRate / 60));
    const gross = Math.max(0, salary - undertimeDeduction);

    // 5. Net Pay Calculation
    const totalDeductions = sss + pag_ibig + microdev + whTax;
    const net = Math.max(0, gross - totalDeductions);

    return {
        monthly_hours: monthlyHours,
        hourly_rate: hourlyRate,
        net_hours: netHours,
        net_minutes: netMinutes,       // ← now returning net minutes too
        undertime_deduction: undertimeDeduction,
        gross,
        total_deductions: totalDeductions,
        net,
        total_worked_hours: data.total_worked_hours,
        daysInMonth,
    };
}