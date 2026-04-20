import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableActions from './data-table-actions.svelte';

export type Employee = {
    id: number;
    employee_id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    designation: string,
    classification: 'full-time' | 'part-time';
    salary: number;
    created_at: string;
};

export const columns: ColumnDef<Employee>[] = [
    { accessorKey: 'employee_id', header: 'Employee ID' },
    {
        id: 'full_name',
        accessorFn: (row) => `${row.first_name} ${row.middle_name ?? ''} ${row.last_name}`.trim(),
        header: 'Full Name',
        cell: ({ row }) => `${row.original.first_name} ${row.original.middle_name ?? ''} ${row.original.last_name}`.trim()
    },
     { 
        accessorKey: 'designation', 
        header: 'Designation',
        filterFn: 'equals'
    },
    { 
        accessorKey: 'classification', 
        header: 'Classification',
        filterFn: 'equals'
    },
    {
        accessorKey: 'salary',
        header: 'Salary',
        cell: ({ row }) => Number(row.original.salary).toLocaleString('en-PH', {
						style: 'currency',
						currency: 'PHP',
						minimumFractionDigits: 0,
						maximumFractionDigits: 0
				})
    },
    { accessorKey: 'created_at', header: 'Date Employed' },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => renderComponent(DataTableActions, { employee: row.original })
    }
];