import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableActions from './data-table-actions.svelte';
import DataTableActionsBreakdown from "./data-table-actions-breakdown.svelte";

export type Employee = {
    id: number;
    employee_id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    designation: string;
    classification: 'full-time' | 'part-time';
    salary: number;
    created_at: string;
    hours?: number | null;
    minutes?: number | null;
};

type TableMeta = {
    month: string;
    year: string;
    semester: string;
    onSaved: () => void;
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
        id: 'hours-render',
        header: 'Hours Rendered',
        size: 80,
        cell: ({ row, table }) => {
            const { month, year, semester, onSaved } = table.options.meta as TableMeta;
            return renderComponent(DataTableActions, { employee: row.original, month, year, semester, onSaved });
        }
    },
    {
        id: 'breakdown',
        header: 'Breakdown',
        size: 80,
        cell: ({ row, table }) => {
            const { month, year, semester, onSaved } = table.options.meta as TableMeta;
            return renderComponent(DataTableActionsBreakdown, { employee: row.original, month, year, semester, onSaved});
        }
    }
];