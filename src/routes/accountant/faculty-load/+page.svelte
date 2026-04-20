<script lang="ts">
	import { createColumns } from './table/columns.ts';
	import DataTable from './table/data-table.svelte';
	import { toast } from 'svelte-sonner';
	import AddFacultyLoad from '$lib/components/dialogs/faculty-load/add-faculty-load.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import ExportFacultyLoads from '$lib/components/exports/export-faculty-loads.svelte';

	type FacultyLoad = {
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

	// let loads: FacultyLoad[] = $state([]);
	let loads: FacultyLoad[] = $state([
		{
			load_id: 1,
			employee_id: 101,
			fullname: 'Juan Dela Cruz',
			subject_code: 'MATH101',
			subject_name: 'Basic Mathematics',
			semester: '1st',
			school_year: '2024-2025',
			schedules: [
				{ day: 'Monday', time_start: '08:00 AM', time_end: '09:30 AM' },
				{ day: 'Wednesday', time_start: '08:00 AM', time_end: '09:30 AM' }
			],
			created_at: 'January 01, 2025'
		},
		{
			load_id: 2,
			employee_id: 102,
			fullname: 'Maria Santos',
			subject_code: 'ENG201',
			subject_name: 'English Communication',
			semester: '1st',
			school_year: '2024-2025',
			schedules: [
				{ day: 'Tuesday', time_start: '10:00 AM', time_end: '11:30 AM' },
				{ day: 'Thursday', time_start: '10:00 AM', time_end: '11:30 AM' }
			],
			created_at: 'January 02, 2025'
		},
		{
			load_id: 3,
			employee_id: 103,
			fullname: 'Roberto Reyes',
			subject_code: 'SCI301',
			subject_name: 'General Science',
			semester: '1st',
			school_year: '2024-2025',
			schedules: [{ day: 'Friday', time_start: '01:00 PM', time_end: '04:00 PM' }],
			created_at: 'January 03, 2025'
		},
		{
			load_id: 4,
			employee_id: 104,
			fullname: 'Ana Gonzales',
			subject_code: 'IT401',
			subject_name: 'Introduction to Programming',
			semester: '2nd',
			school_year: '2024-2025',
			schedules: [
				{ day: 'Monday', time_start: '01:00 PM', time_end: '02:30 PM' },
				{ day: 'Wednesday', time_start: '01:00 PM', time_end: '02:30 PM' },
				{ day: 'Friday', time_start: '01:00 PM', time_end: '02:30 PM' }
			],
			created_at: 'January 04, 2025'
		},
		{
			load_id: 5,
			employee_id: 105,
			fullname: 'Carlos Mendoza',
			subject_code: 'FIL101',
			subject_name: 'Filipino 1',
			semester: '2nd',
			school_year: '2024-2025',
			schedules: [
				{ day: 'Tuesday', time_start: '07:30 AM', time_end: '09:00 AM' },
				{ day: 'Saturday', time_start: '07:30 AM', time_end: '09:00 AM' }
			],
			created_at: 'January 05, 2025'
		}
	]);
	let semester_value = $state('');
	let year_value = $state('');
	let show_table = $state(false);

	const currentYear = new Date().getFullYear();

	const SEMESTERS = [
		{ value: '1st', label: '1st Semester' },
		{ value: '2nd', label: '2nd Semester' },
		{ value: 'Summer', label: 'Summer' }
	];

	const SCHOOL_YEARS = Array.from({ length: currentYear - 2014 + 1 }, (_, i) => {
		const y = 2014 + i;
		return { value: `${y}-${y + 1}`, label: `${y}-${y + 1}` };
	}).reverse();

	const triggerContentSemester = $derived(
		SEMESTERS.find((s) => s.value === semester_value)?.label ?? 'Select a semester'
	);

	const triggerContentYear = $derived(
		SCHOOL_YEARS.find((y) => y.value === year_value)?.label ?? 'Select a school year'
	);

	async function fetchLoads() {
		if (!semester_value || !year_value) return;
		const res = await fetch(
			`/API/GET/filter-faculty-load?sem=${semester_value}&year=${year_value}`
		);
		if (!res.ok) throw new Error('Failed to fetch');
		return res.json() as Promise<FacultyLoad[]>;
	}

	async function refresh() {
		if (!semester_value || !year_value) return;
		try {
			const data = await fetchLoads();
			loads = data ?? [];
			show_table = true;
		} catch (e: any) {
			toast.error(e?.message || 'Failed to get faculty loads');
		}
	}

	$effect(() => {
		if (semester_value && year_value) refresh();
	});
</script>

<div class="min-h-screen space-y-8 bg-slate-50 p-6 md:p-10">
	<!-- Header -->
	<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
		<div class="space-y-1.5">
			<h1 class="text-4xl font-extrabold tracking-tight text-slate-900">Faculty Loads</h1>
			<p class="text-sm font-medium text-slate-500">
				Add faculty loads for a part time instructors
			</p>
		</div>
		<div class="flex shrink-0 items-center gap-2.5">
			<ExportFacultyLoads {loads} semester={semester_value} school_year={year_value} />
			<AddFacultyLoad onRefresh={refresh} />
		</div>
	</div>

	<!-- Selector -->
	<div>
		<p class="mb-3 text-sm font-medium">Filter faculty load by semester and school year.</p>
		<div class="flex flex-row gap-2">
			<Select.Root type="single" name="semester_input" bind:value={semester_value}>
				<Select.Trigger class="w-[180px] bg-white">
					{triggerContentSemester}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Semester</Select.Label>
						{#each SEMESTERS as s (s.value)}
							<Select.Item value={s.value} label={s.label}>
								{s.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>

			<Select.Root type="single" name="year_input" bind:value={year_value}>
				<Select.Trigger class="w-[180px] bg-white">
					{triggerContentYear}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>School Year</Select.Label>
						{#each SCHOOL_YEARS as y (y.value)}
							<Select.Item value={y.value} label={y.label}>
								{y.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	{#if show_table}
		<DataTable
			onRefresh={refresh}
			//@ts-ignore
			columns={createColumns(refresh)}
			data={loads}
			filterColumn="instructor"
			searchPlaceholder="Search instructor..."
			sem={semester_value}
		/>
	{/if}
</div>
