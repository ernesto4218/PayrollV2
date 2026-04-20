<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Calculator } from 'lucide-svelte';
	import type { Employee } from './columns';

	let { data }: { data: Employee } = $props();

	const formatPHP = (val: number) =>
		new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val || 0);
</script>

<Popover.Root>
	<Popover.Trigger>
		<button
			class="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 shadow-sm transition-all hover:border-emerald-300 hover:text-emerald-600"
		>
			<Calculator class="size-3" />
			View
		</button>
	</Popover.Trigger>
	<Popover.Content class="mr-10 w-72 p-4">
		<p class="mb-3 text-sm font-semibold text-slate-800">Salary Breakdown</p>

		<div class="flex flex-col gap-2 text-xs text-slate-600">
			<!-- Rate Info -->
			<div class="rounded-md bg-slate-50 p-2">
				<p class="mb-1 text-[10px] font-medium tracking-wide text-slate-500 uppercase">Rate</p>
				<div class="flex justify-between">
					<span>Base Days in month</span>
					<span class="font-medium text-slate-800">{Number(data.daysInMonth)} days</span>
				</div>
				<div class="flex justify-between">
					<span>Monthly Hours</span>
					<span class="font-medium text-slate-800">{data.monthly_hours} hrs</span>
				</div>
				<div class="flex justify-between">
					<span>Hourly Rate</span>
					<span class="font-medium text-slate-800">{formatPHP(data.hourly_rate)}/hr</span>
				</div>
				<div class="flex justify-between">
					<span>Base Salary</span>
					<span class="font-medium text-slate-800">{formatPHP(Number(data.salary))}</span>
				</div>
				<div class="flex justify-between">
					<span>Base Working Hours</span>
					<span class="font-medium text-slate-800">{Number(data.total_worked_hours)} hours</span>
				</div>
			</div>

			<!-- Undertime -->
			<div class="rounded-md bg-orange-50 p-2">
				<p class="mb-1 text-[10px] font-medium tracking-wide text-orange-400 uppercase">
					Undertime
				</p>
				<div class="flex justify-between">
					<span>Raw Hours</span>
					<span class="font-medium text-slate-800">{data.hours} hrs {data.minutes} mins</span>
				</div>
				<div class="flex justify-between">
					<span>Travel Credit</span>
					<span class="font-medium text-green-600">- {data.travel_credit} hrs</span>
				</div>
				<div class="mt-1 flex justify-between border-t border-orange-100 pt-1">
					<span>Net Undertime</span>
					<span class="font-medium text-slate-800"
						>{data.net_hours} hrs {data.net_minutes} minutes</span
					>
				</div>
				<div class="flex justify-between">
					<span>Deduction</span>
					<span class="font-medium text-red-500">- {formatPHP(data.undertime_deduction)}</span>
				</div>
			</div>

			<!-- Gross -->
			<div class="flex justify-between rounded-md bg-blue-50 p-2">
				<span class="font-medium text-blue-700">Gross Pay</span>
				<span class="font-semibold text-blue-700">{formatPHP(data.gross)}</span>
			</div>

			<!-- Deductions -->
			<div class="rounded-md bg-red-50 p-2">
				<p class="mb-1 text-[10px] font-medium tracking-wide text-red-400 uppercase">Deductions</p>
				<div class="flex justify-between">
					<span>SSS</span>
					<span class="font-medium text-red-500">- {formatPHP(data.sss)}</span>
				</div>
				<div class="flex justify-between">
					<span>PAG-IBIG</span>
					<span class="font-medium text-red-500">- {formatPHP(data.pag_ibig)}</span>
				</div>
				<div class="flex justify-between">
					<span>MICRODEV</span>
					<span class="font-medium text-red-500">- {formatPHP(data.microdev)}</span>
				</div>
				<div class="mt-1 flex justify-between border-t border-red-100 pt-1">
					<span>Total Deductions</span>
					<span class="font-medium text-red-500">- {formatPHP(data.total_deductions)}</span>
				</div>
			</div>

			<!-- Net -->
			<div class="flex justify-between rounded-md bg-green-50 p-2">
				<span class="font-semibold text-green-700">Net Pay</span>
				<span class="font-bold text-green-700">{formatPHP(data.net)}</span>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
