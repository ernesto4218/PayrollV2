<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Download } from 'lucide-svelte';
	import { createColumns } from './table/columns.ts';
	import DataTable from './table/data-table.svelte';
	import { toast } from 'svelte-sonner';
	import ExportTravelOrder from '$lib/components/exports/export-travel-order.svelte';
	import AddTravelOrder from '$lib/components/dialogs/travel-order/add-travel-order.svelte';
	import { fetchTravelOrders } from '$lib/helper/travel-order/fetch';

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

	let month_value = $state('');
	let year_value = $state('');
	let show_table = $state(false);

	const triggerContentMonth = $derived(
		month.find((f) => f.value === month_value)?.label ?? 'Select a month'
	);

	const triggerContentYear = $derived(
		year.find((f) => f.value === year_value)?.label ?? 'Select a year'
	);

	type EmployeeTravelOrder = {
		employee_id: number;
		first_name: string;
		middle_name: string | null;
		last_name: string;
		purpose: string;
		message: string | '';
		date_from: Date | null;
		date_to: Date | null;
		date_updated: string | null;
		travel_order_id: number;
	};

	let employees = $state<EmployeeTravelOrder[]>([]);
	const tableData = $derived([...employees]);

	// functions
	function loadTravelOrders() {
		if (!month_value || !year_value) return;
		fetchTravelOrders(month_value, year_value)
			.then((data) => {
				employees = data;
				show_table = true;
			})
			.catch((e) => toast.error(e?.message || 'Failed to get travel orders'));
	}

	$effect(() => {
		if (month_value && year_value) loadTravelOrders();
	});
</script>

<div class="min-h-screen space-y-8 bg-slate-50 p-6 md:p-10">
	<!-- Header -->
	<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
		<div class="space-y-1.5">
			<h1 class="text-4xl font-extrabold tracking-tight text-slate-900">C.A/Travel Order</h1>
			<p class="text-sm font-medium text-slate-500">Edit full-time C.A/travel order</p>
		</div>

		<div class="flex shrink-0 items-center gap-2.5">
			<ExportTravelOrder {employees} month={month_value} year={year_value} />
			<AddTravelOrder
				onRefresh={() =>
					fetchTravelOrders(month_value, year_value).then((data) => (employees = data))}
			/>
		</div>
	</div>

	<!-- date selector -->
	<div>
		<p class="mb-3 text-sm font-medium">Filter C.A/travel order by month and year.</p>
		<div class="flex flex-row gap-2">
			<Select.Root type="single" name="month_input" bind:value={month_value}>
				<Select.Trigger class="w-45 bg-white">
					{triggerContentMonth}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Month</Select.Label>
						{#each month as m (m.value)}
							<Select.Item value={m.value} label={m.label}>
								{m.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>

			<Select.Root type="single" name="year_input" bind:value={year_value}>
				<Select.Trigger class="w-45 bg-white">
					{triggerContentYear}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Year</Select.Label>
						{#each year as y (y.value)}
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
			onRefresh={loadTravelOrders}
			month={month_value}
			year={year_value}
			data={tableData}
			columns={createColumns(loadTravelOrders)}
		/>
	{/if}
</div>
