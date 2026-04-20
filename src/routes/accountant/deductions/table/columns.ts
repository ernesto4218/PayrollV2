import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableActionsSSS from './data-table-actions-sss.svelte';
import DataTableActionPagIBIG from './data-table-actions-pagibig.svelte';
import DataTableActionMicrodev from './data-table-actions-microdev.svelte';


export type Employee = {
    employee_id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    deduction_id: number | null;
    sss: number | null;
    pagibig: number | null;
    microdev: number | null;
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
        accessorKey: 'sss',
        header: 'SSS',
        size: 120,
        cell: ({ row }) => renderComponent(DataTableActionsSSS, { employee: row.original })
    },
    {
        accessorKey: 'pagibig',
        header: 'Pag-IBIG',
        size: 120,
        cell: ({ row }) => renderComponent(DataTableActionPagIBIG, { employee: row.original })
    },
    {
        accessorKey: 'microdev',
        header: 'Microdev',
        size: 120,
        cell: ({ row }) => renderComponent(DataTableActionMicrodev, { employee: row.original })
    },
   
];