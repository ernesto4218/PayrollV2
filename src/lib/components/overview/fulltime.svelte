<script lang="ts">
	import * as Select from '$lib/components/ui/select/index.js';
	import DataTable from '$lib/components/table/data-table.svelte';
	import { columns } from './table/columns';
	import { toast } from 'svelte-sonner';

	let month_value = $state('');
	let year_value = $state('');
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
		hours: number;
		minutes: number;
		sss: number;
		pag_ibig: number;
		microdev: number;
		gross: number;
		'wh-tax': number;
		net: number;
		travel_credit: number; // Added to match the merged API data
		created_at: string;
	};

	const month = [
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

	const currentYear = new Date().getFullYear();
	const year = Array.from({ length: currentYear - 2014 + 1 }, (_, i) => {
		const y = String(2014 + i);
		return { value: y, label: y };
	});

	const triggerContentMonth = $derived(
		month.find((f) => f.value === month_value)?.label ?? 'Select a month'
	);
	const triggerContentYear = $derived(
		year.find((f) => f.value === year_value)?.label ?? 'Select a year'
	);

	let employees = $state<Employee[]>([]);
	const tableData = $derived([...employees]);

	// Reactive Fetching
	$effect(() => {
		if (month_value && year_value) {
			// Note: Ensure the API path matches your +server.ts location
			fetch(`/API/GET/full-time-overview-payroll?month=${month_value}&year=${year_value}`)
				.then(async (res) => {
					const result = await res.json();
					if (!res.ok) throw new Error(result.message || 'Failed to fetch');
					return result;
				})
				.then((data) => {
					// data is the processedData array from our previous +server.ts logic
					// If you returned json({ payroll: processedData }), use data.payroll
					// Based on your specific setup, we assume data is the direct array:
					employees = data;
					show_table = true;
					toast.success(`Loaded records for ${month_value} ${year_value}`);
				})
				.catch((e) => {
					show_table = false;
					toast.error(e?.message || 'Failed to get payroll data');
				});
		}
	});
</script>

<div class="mt-4 flex w-full flex-col gap-6 border-t border-slate-300 pt-5">
	<div class="px-1">
		<p class="mb-3 text-sm font-semibold tracking-tight text-slate-700 uppercase">
			Filter Payroll Period
		</p>
		<div class="flex flex-row gap-3">
			<Select.Root type="single" name="month_input" bind:value={month_value}>
				<Select.Trigger
					class="w-52 border-slate-200 bg-white shadow-sm transition-all hover:border-violet-300"
				>
					{triggerContentMonth}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Month</Select.Label>
						{#each month as m (m.value)}
							<Select.Item value={m.value} label={m.label}>{m.label}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>

			<Select.Root type="single" name="year_input" bind:value={year_value}>
				<Select.Trigger
					class="w-40 border-slate-200 bg-white shadow-sm transition-all hover:border-violet-300"
				>
					{triggerContentYear}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Year</Select.Label>
						{#each year as y (y.value)}
							<Select.Item value={y.value} label={y.label}>{y.label}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	{#if show_table}
		<DataTable data={tableData} {columns} />
	{:else if month_value && year_value}
		<div
			class="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200"
		>
			<p class="text-sm text-slate-400 italic">Fetching payroll records...</p>
		</div>
	{/if}
</div>
