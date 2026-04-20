import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableActions from "./data-table-actions.svelte";

export type Subject = {
    id: number;
    code: string;
    name: string;
};

export function createColumns(onRefresh: () => void): ColumnDef<Subject>[] {
    return [
        {
            accessorKey: 'code',
            header: 'Code',
            size: 120,
        },
        {
            accessorKey: 'name',
            header: 'Subject Name',
            size: 200,
        },
        {
            id: 'actions',
            header: 'Actions',
            size: 120,
            cell: ({ row }) => renderComponent(DataTableActions, {
                subject: row.original,
                onDeleted: onRefresh
            })
        },
    ];
}