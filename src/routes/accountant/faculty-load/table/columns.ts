import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableActions from "./data-table-actions.svelte";
import InstructorCell from "./instructor-cell.svelte";
import SubjectCell from "./subject-cell.svelte";
import SemesterCell from "./semester-cell.svelte";
import ScheduleCell from "./schedule-cell.svelte";

export type FacultyLoad = {
	subject_id: any;
    load_id: number;
    employee_id: number;
    fullname: string;
    subject_code: string;
    subject_name: string;
    semester: string;
    school_year: string;
    schedules: { day: string; time_start: string; time_end: string }[];
    created_at: string;
};

export function createColumns(onRefresh: () => void): ColumnDef<FacultyLoad, unknown>[] {
    return [
        {
            id: 'instructor',
            header: 'Instructor',
            size: 220,
            cell: ({ row }) => renderComponent(InstructorCell, {
                fullname: row.original.fullname,
                employee_id: row.original.employee_id
            })
        },
        {
            id: 'subject',
            header: 'Subject',
            size: 220,
            cell: ({ row }) => renderComponent(SubjectCell, {
                subject_code: row.original.subject_code,
                subject_name: row.original.subject_name
            })
        },
        {
            id: 'semester',
            header: 'Semester',
            size: 140,
            cell: ({ row }) => renderComponent(SemesterCell, {
                semester: row.original.semester,
                school_year: row.original.school_year
            })
        },
        {
            id: 'schedules',
            header: 'Schedule',
            size: 280,
            cell: ({ row }) => renderComponent(ScheduleCell, {
                schedules: row.original.schedules
            })
        },
        {
            id: 'actions',
            header: 'Actions',
            size: 100,
            cell: ({ row }) => renderComponent(DataTableActions, {
                load: row.original,
                onDeleted: onRefresh
            })
        },
    ];
}