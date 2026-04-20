<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Download } from 'lucide-svelte';
	import { columns } from './table/columns.ts';
	import DataTable from './table/data-table.svelte';
	import { toast } from 'svelte-sonner';
	import ExportUndertime from '$lib/components/exports/export-undertime.svelte';

	// ── Constants ────────────────────────────────────────────────────────────────
	const currentYear = new Date().getFullYear();

	const MONTHS = [
		{ value: 'january', label: 'January' },
		{ value: 'february', label: 'February' },
		{ value: 'march', label: 'March' },
		{ value: 'april', label: 'April' },
		{ value: 'may', label: 'May' },
		{ value: 'june', label: 'June' },
		{ value: 'july', label: 'July' },
		{ value: 'august', label: 'August' },
		{ value: 'september', label: 'September' },
		{ value: 'october', label: 'October' },
		{ value: 'november', label: 'November' },
		{ value: 'december', label: 'December' }
	];

	const SEMESTERS = [
		{ value: '1st', label: '1st Semester' },
		{ value: '2nd', label: '2nd Semester' },
		{ value: 'Summer', label: 'Summer' }
	];

	const SCHOOL_YEARS = Array.from({ length: currentYear - 2014 + 1 }, (_, i) => {
		const y = 2014 + i;
		return { value: `${y}-${y + 1}`, label: `${y}-${y + 1}` };
	}).reverse();

	// ── State ────────────────────────────────────────────────────────────────────
	let semester_value = $state('');
	let school_year_value = $state('');
	let month_value = $state('');
	let show_table = $state(false);

	type Employee = {
		id: number;
		employee_id: number;
		first_name: string;
		middle_name: string | null;
		last_name: string;
		designation: string;
		classification: 'full-time' | 'part-time';
		salary: number;
		created_at: string;
	};

	type FacultyLoad = Record<string, any>;

	let employees = $state<Employee[]>([]);
	let loads = $state<FacultyLoad[]>([]);

	const tableData = $derived([...employees]);

	// ── Derived labels ───────────────────────────────────────────────────────────
	const triggerContentSemester = $derived(
		SEMESTERS.find((s) => s.value === semester_value)?.label ?? 'Select a semester'
	);
	const triggerContentSchoolYear = $derived(
		SCHOOL_YEARS.find((y) => y.value === school_year_value)?.label ?? 'Select a school year'
	);
	const triggerContentMonth = $derived(
		MONTHS.find((m) => m.value === month_value)?.label ?? 'Select a month'
	);

	// ── Derived flags ────────────────────────────────────────────────────────────
	const semesterReady = $derived(!!(semester_value && school_year_value));
	const monthReady = $derived(!!(semesterReady && month_value));

	// ── Page title ───────────────────────────────────────────────────────────────
	const segments = $derived($page.url.pathname.split('/').filter(Boolean));
	const pageTitle = $derived(
		$page.data.folder?.name ??
			[...segments]
				.pop()
				?.replace(/-/g, ' ')
				.replace(/\b\w/g, (c) => c.toUpperCase()) ??
			'Dashboard'
	);

	// ── Effects ──────────────────────────────────────────────────────────────────

	function refetch() {
		console.log('refetch');
		fetch(
			`/API/GET/all-part-time-employees-hours-rendered?month=${month_value}&year=${school_year_value}`
		)
			.then((res) => {
				if (!res.ok) throw new Error('Failed to fetch');
				return res.json();
			})
			.then((data) => {
				employees = data;
			})
			.catch((e) => {
				toast.error(e?.message || 'Failed to get hours rendered');
			});
	}

	// Step 1 — fetch faculty loads whenever semester + school year are both set
	$effect(() => {
		if (!semesterReady) return;
	});

	// Step 2 — fetch hours rendered whenever month is also set
	$effect(() => {
		if (!monthReady) return;
		fetch(
			`/API/GET/all-part-time-employees-hours-rendered?month=${month_value}&year=${school_year_value}`
		)
			.then((res) => {
				if (!res.ok) throw new Error('Failed to fetch');
				return res.json();
			})
			.then((data) => {
				employees = data;
				show_table = true;
			})
			.catch((e) => {
				toast.error(e?.message || 'Failed to get hours rendered');
			});
	});
</script>

<div class="min-h-screen space-y-8 bg-slate-50 p-6 md:p-10">
	<!-- Header -->
	<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
		<div class="space-y-1.5">
			<h1 class="text-4xl font-extrabold tracking-tight text-slate-900">{pageTitle}</h1>
			<p class="text-sm font-medium text-slate-500">Edit part-time employee hours rendered</p>
		</div>
	</div>

	<!-- Step 1 — Semester & School Year -->
	<div>
		<p class="mb-3 text-sm font-medium">
			<span
				class="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white"
				>1</span
			>
			Select semester and school year.
		</p>
		<div class="flex flex-row gap-2">
			<Select.Root type="single" name="semester_input" bind:value={semester_value}>
				<Select.Trigger class="w-[180px] bg-white">
					{triggerContentSemester}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Semester</Select.Label>
						{#each SEMESTERS as s (s.value)}
							<Select.Item value={s.value} label={s.label}>{s.label}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>

			<Select.Root type="single" name="school_year_input" bind:value={school_year_value}>
				<Select.Trigger class="w-[180px] bg-white">
					{triggerContentSchoolYear}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>School Year</Select.Label>
						{#each SCHOOL_YEARS as y (y.value)}
							<Select.Item value={y.value} label={y.label}>{y.label}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	<!-- Step 2 — Month (only enabled after semester + school year are selected) -->
	<div>
		<p class="mb-3 text-sm font-medium {!semesterReady ? 'text-slate-400' : ''}">
			<span
				class="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white
				       {semesterReady ? 'bg-slate-900' : 'bg-slate-300'}">2</span
			>
			Select month to view hours rendered.
		</p>
		<div class="flex flex-row gap-2">
			<Select.Root
				type="single"
				name="month_input"
				bind:value={month_value}
				disabled={!semesterReady}
			>
				<Select.Trigger
					class="w-[180px] bg-white {!semesterReady ? 'cursor-not-allowed opacity-50' : ''}"
				>
					{triggerContentMonth}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Month</Select.Label>
						{#each MONTHS as m (m.value)}
							<Select.Item value={m.value} label={m.label}>{m.label}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	{#if show_table}
		<DataTable
			month={month_value}
			year={school_year_value}
			data={tableData}
			{columns}
			semester={semester_value}
			onSaved={refetch}
		/>
	{/if}
</div>
