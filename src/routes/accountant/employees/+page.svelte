<script>
	import DataTable from './table/data-table.svelte';
	import { columns } from './table/columns.ts';
	import {
		Users,
		UserCheck,
		Clock,
		FileText,
		Download,
		Plus,
		Search,
		TrendingUp,
		User,
		Hash,
		Bookmark,
		Banknote
	} from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import AddEmployee from '$lib/components/dialogs/employee/add-employee.svelte';
	import ExportEmployees from '$lib/components/exports/export-employees.svelte';

	let { data } = $props();
	// svelte-ignore state_referenced_locally
	let employees = $state(data.employees);

	const fullTime = $derived(
		employees.filter(
			(/** @type {{ classification: string; }} */ e) => e.classification === 'full-time'
		).length
	);
	const partTime = $derived(
		employees.filter(
			(/** @type {{ classification: string; }} */ e) => e.classification === 'part-time'
		).length
	);

	const stats = $derived([
		{
			label: 'Total Employees',
			value: employees.length,
			icon: Users,
			gradient: 'from-violet-500 to-indigo-600',
			iconColor: 'text-white'
		},
		{
			label: 'Full-time',
			value: fullTime,
			icon: UserCheck,
			change: 'Permanent staff',
			gradient: 'from-emerald-400 to-teal-600',
			iconColor: 'text-white'
		},
		{
			label: 'Part-time',
			value: partTime,
			icon: Clock,
			change: 'Flexible schedule',
			gradient: 'from-amber-400 to-orange-500',
			iconColor: 'text-white'
		}
	]);
</script>

<div class="min-h-screen space-y-8 bg-slate-50 p-6 md:p-10">
	<!-- Header -->
	<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
		<div class="space-y-1.5">
			<h1 class="text-4xl font-extrabold tracking-tight text-slate-900">Employee Directory</h1>
			<p class="text-sm font-medium text-slate-500">
				Manage and oversee your entire workforce from one place.
			</p>
		</div>
		<div class="flex shrink-0 items-center gap-2.5">
			<ExportEmployees {employees} />

			<AddEmployee />
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
		{#each stats as stat, i}
			<Card.Root
				class="bg-linear-to-br {stat.gradient} overflow-hidden rounded-2xl border-0 shadow-md shadow-slate-200/80"
			>
				<Card.Content class="p-0 ">
					<div class="p-5">
						<div class="flex items-start justify-between">
							<div class="space-y-1">
								<p class="text-xs font-semibold tracking-wider text-white/70 uppercase">
									{stat.label}
								</p>
								<p class="text-4xl leading-none font-black text-white">{stat.value}</p>
							</div>
							<div class="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
								<!-- svelte-ignore svelte_component_deprecated -->
								<svelte:component this={stat.icon} class="size-5 text-white" />
							</div>
						</div>
						<div class="mt-4 flex items-center gap-1.5">
							{#if stat.change}
								<TrendingUp class="size-3 text-white/70" />
								<p class="text-xs font-medium text-white/70">{stat.change}</p>
							{/if}
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	<!-- Table Section -->
	<DataTable data={employees} {columns} />
</div>
