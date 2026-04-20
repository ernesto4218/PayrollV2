<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Hash, User, Bookmark, Banknote, Calendar, Eye, Briefcase } from 'lucide-svelte';
	import type { Employee } from '../../../../routes/accountant/employees/table/columns';

	let { employee }: { employee: Employee } = $props();

	// svelte-ignore state_referenced_locally
	const fullName =
		`${employee.first_name} ${employee.middle_name ?? ''} ${employee.last_name}`.trim();

	// svelte-ignore state_referenced_locally
	const initials = `${employee.first_name[0]}${employee.last_name[0]}`.toUpperCase();

	// svelte-ignore state_referenced_locally
	const formattedSalary = Number(employee.salary).toLocaleString('en-PH', {
		style: 'currency',
		currency: 'PHP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	});
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button
			variant="ghost"
			size="sm"
			class="h-8 gap-1.5 px-2.5 text-xs font-medium text-blue-500 hover:bg-blue-500/10 hover:text-blue-600"
		>
			<Eye class="size-3.5" />
			View
		</Button>
	</Dialog.Trigger>

	<Dialog.Content class="max-w-md overflow-hidden rounded-2xl border border-emerald-100 p-0">
		<!-- Header -->
		<Dialog.Header
			class="flex-row items-start gap-3.5 border-b border-emerald-100 bg-emerald-50 px-6 pt-6 pb-4"
		>
			<div class="flex h-10 w-10 min-w-10 items-center justify-center rounded-xl bg-emerald-500">
				<Eye class="size-5 text-white" />
			</div>
			<div>
				<Dialog.Title class="text-base font-semibold text-emerald-950"
					>Employee Details</Dialog.Title
				>
				<Dialog.Description class="mt-0.5 text-[13px] text-gray-500">
					Viewing record for employee #{employee.employee_id}
				</Dialog.Description>
			</div>
		</Dialog.Header>

		<!-- Avatar + Name -->
		<div class="flex flex-col items-center gap-2 border-b border-gray-100 px-6 py-6">
			<div
				class="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-bold text-white shadow-sm shadow-emerald-200"
			>
				{initials}
			</div>
			<p class="text-base font-semibold text-gray-900">{fullName}</p>
			<p class="text-[13px] text-gray-500">{employee.designation ?? '—'}</p>
			<span
				class="rounded-full px-3 py-0.5 text-[11px] font-semibold tracking-wide uppercase
				{employee.classification === 'full-time'
					? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
					: 'border border-blue-200 bg-blue-50 text-blue-700'}"
			>
				{employee.classification}
			</span>
		</div>

		<!-- Details -->
		<div class="flex flex-col gap-0 px-6 py-4">
			{#each [{ icon: Hash, label: 'Employee ID', value: String(employee.employee_id) }, { icon: User, label: 'First name', value: employee.first_name }, { icon: User, label: 'Middle name', value: employee.middle_name ?? '—' }, { icon: User, label: 'Last name', value: employee.last_name }, { icon: Briefcase, label: 'Designation', value: employee.designation ?? '—' }, { icon: Bookmark, label: 'Classification', value: employee.classification }, { icon: Banknote, label: employee.classification === 'full-time' ? 'Monthly salary' : 'Hourly rate', value: formattedSalary }, { icon: Calendar, label: 'Date employed', value: employee.created_at }] as row}
				<div class="flex items-center justify-between border-b border-gray-100 py-3 last:border-0">
					<div class="flex items-center gap-2">
						<row.icon class="size-3.5 text-emerald-500" />
						<span class="text-[12px] font-medium tracking-wide text-gray-400 uppercase"
							>{row.label}</span
						>
					</div>
					<span class="text-[13.5px] font-medium text-gray-800">{row.value}</span>
				</div>
			{/each}
		</div>

		<!-- Footer -->
		<div class="flex justify-end bg-gray-50 px-6 py-4">
			<Dialog.Close>
				<Button
					variant="outline"
					class="rounded-lg border-gray-200 text-[13.5px] text-gray-600 hover:bg-gray-100"
				>
					Close
				</Button>
			</Dialog.Close>
		</div>
	</Dialog.Content>
</Dialog.Root>
