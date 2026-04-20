import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableActions from "./data-table-actions.svelte";

export type Employee = {
    employee_id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    purpose: string;
    message: string | "";
    date_from: Date | null;
    date_to: Date | null;
    date_updated: string | null;
    travel_order_id: number;
};

export function createColumns(onRefresh: () => void): ColumnDef<Employee>[] {
    return [
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
            id: 'travel_duration',
            header: 'Travel Duration',
            size: 250,
            accessorFn: (row) => `${row.date_from} → ${row.date_to}`,
            cell: ({ row }) => `${row.original.date_from ?? '—'} → ${row.original.date_to ?? '—'}`
        },
        {
            accessorKey: 'purpose',
            header: 'Purpose',
        },
        {
            accessorKey: 'message',
            header: 'Message',
        },
        {
            accessorKey: 'action',
            header: 'Action',
            size: 120,
            cell: ({ row }) => renderComponent(DataTableActions, {
                employee: row.original,
                onRefresh
            })
        },
    ];
}