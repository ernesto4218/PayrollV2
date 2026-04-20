import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableActions from './data-table-actions.svelte';

export type Employee = {
    employee_id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    undertime_id: number | null;
    hours: number | null;
    minutes: number | null;
    month: string | null;
    year: number | null;
    date_updated: string | null;
};

export const columns: ColumnDef<Employee>[] = [
    {
        accessorKey: 'employee_id',
        header: 'Employee ID',
        size: 120,
    },
    {
        id: 'full_name',
        accessorFn: (row) => `${row.first_name} ${row.middle_name ?? ''} ${row.last_name}`.trim(),
        header: 'Full Name',
        size: 200,
        cell: ({ row }) => `${row.original.first_name} ${row.original.middle_name ?? ''} ${row.original.last_name}`.trim()
    },
    {
        id: 'undertime',
        header: 'Undertime',
        size: 80,
        cell: ({ row }) => renderComponent(DataTableActions, { employee: row.original })
    }
];