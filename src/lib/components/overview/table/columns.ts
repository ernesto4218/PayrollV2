import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import HoursCell from "./HoursCell.svelte";
import BreakdownCell from "./BreakdownCell.svelte";
export type Employee = {
    employee_id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    designation: string;
    classification: string;
    salary: number;
    hours: number;
    minutes: number;
    sss: number;
    pag_ibig: number;
    microdev: number;
    'wh-tax': number;
    travel_credit: number;
    monthly_hours: number;
    hourly_rate: number;
    net_hours: number;
    net_minutes: number;
    undertime_deduction: number;
    gross: number;
    total_deductions: number;
    net: number;
    total_worked_hours: number;
    daysInMonth:number;
};

const formatPHP = (val: number) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val || 0);

export const columns: ColumnDef<Employee>[] = [
    {
        accessorKey: 'employee_id',
        header: 'ID',
        size: 80,
    },
    {
        id: 'full_name',
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        header: 'Full Name',
    },
    {
        header: 'Undertime',
        columns: [
            {
                id: 'net_hours',
                header: 'Net Hrs',
                accessorFn: (row) => row.net_hours,
                cell: ({ row }) => renderComponent(HoursCell, {
                    rawHours: Number(row.original.hours) || 0,
                    credit: Number(row.original.travel_credit) || 0,
                    net: row.original.net_hours
                }),
                size: 120
            },
            { accessorKey: 'minutes', header: 'Mins', size: 80 },
        ],
    },
    {
        header: 'Deductions',
        columns: [
            { accessorKey: 'sss', header: 'SSS', cell: ({ getValue }) => formatPHP(getValue() as number) },
            { accessorKey: 'pag_ibig', header: 'PAG-IBIG', cell: ({ getValue }) => formatPHP(getValue() as number) },
            { accessorKey: 'microdev', header: 'MICRODEV', cell: ({ getValue }) => formatPHP(getValue() as number) },
        ],
    },
    {
        accessorKey: 'gross',
        header: 'Gross Pay',
        cell: ({ getValue }) => formatPHP(getValue() as number),
    },
    {
        accessorKey: 'net',
        header: 'Net Pay',
        cell: ({ getValue }) => formatPHP(getValue() as number),
    },
    {
        id: 'breakdown',
        header: 'Breakdown',
        cell: ({ row }) => renderComponent(BreakdownCell, {
            data: row.original
        }),
        size: 100
    },
];