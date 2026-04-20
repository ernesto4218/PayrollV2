<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { User, FileText, CalendarRange, Check, Search, X, Van } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { DateFormatter, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';

	const df = new DateFormatter('en-PH', { dateStyle: 'medium' });

	let loading = $state(false);
	type Props = {
		onRefresh: () => void;
	};

	let { onRefresh }: Props = $props();

	// Employee search state
	let employeeQuery = $state('');
	let selectedEmployee: { employee_id: number | string; fullname: string } | null = $state(null);
	let showDropdown = $state(false);
	let searchResults: { employee_id: number | string; fullname: string }[] = $state([]);
	let searchLoading = $state(false);
	let classification = $state('more-day');

	// Date state
	let date_from: DateValue | undefined = $state(undefined);
	let date_to: DateValue | undefined = $state(undefined);

	let form = $state({
		purpose: '',
		message: ''
	});

	let errors: Record<string, string> = $state({});

	// Debounced employee search
	let searchTimeout: ReturnType<typeof setTimeout>;
	async function searchEmployees(query: string) {
		clearTimeout(searchTimeout);
		if (!query.trim()) {
			searchResults = [];
			showDropdown = false;
			return;
		}
		searchTimeout = setTimeout(async () => {
			searchLoading = true;
			try {
				const res = await fetch(`/API/GET/search-employees?q=${encodeURIComponent(query)}`);
				if (res.ok) {
					const data = await res.json();
					searchResults = data;
					showDropdown = true;
				}
			} catch {
				searchResults = [];
			} finally {
				searchLoading = false;
			}
		}, 300);
	}

	function selectEmployee(emp: { employee_id: number | string; fullname: string }) {
		selectedEmployee = emp;
		employeeQuery = emp.fullname;
		showDropdown = false;
		searchResults = [];
		if (errors.employee) delete errors.employee;
	}

	function clearEmployee() {
		selectedEmployee = null;
		employeeQuery = '';
		searchResults = [];
		showDropdown = false;
	}

	function validate() {
		errors = {};
		if (!selectedEmployee) errors.employee = 'Please select an employee.';
		if (!form.purpose.trim()) errors.purpose = 'Travel purpose is required.';
		if (!date_from) errors.date_from = 'Start date is required.';

		// Only require 'date_to' if it's NOT a half-day
		if (classification === 'more-day' && !date_to) {
			errors.date_to = 'End date is required.';
		}

		return Object.keys(errors).length === 0;
	}

	function resetForm() {
		form = { purpose: '', message: '' };
		errors = {};
		date_from = undefined;
		date_to = undefined;
		clearEmployee();
	}

	async function handleSubmit() {
		if (!validate()) return;
		loading = true;

		// Logic: If half-day, 'to' is the same as 'from', otherwise use 'date_to'
		const fromDate = date_from?.toDate(getLocalTimeZone()).toISOString().split('T')[0];
		const toDate =
			classification === 'half-day'
				? fromDate
				: date_to?.toDate(getLocalTimeZone()).toISOString().split('T')[0];

		const payload = {
			employee_id: selectedEmployee!.employee_id,
			employee_name: selectedEmployee!.fullname,
			travel_purpose: form.purpose.trim(),
			message: form.message.trim(),
			from: fromDate,
			to: toDate,
			classification: classification
		};

		try {
			const res = await fetch('/API/POST/add-travel-order', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message ?? `Server error ${res.status}`);
			}

			toast.success('C.A/Travel Order added successfully!');
			resetForm();
			onRefresh();
		} catch (e: any) {
			toast.error(e.message || 'Failed to save. Please try again.');
		} finally {
			loading = false;
		}
	}
</script>

<Dialog.Root>
	<Dialog.Trigger
		class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-600"
	>
		<Van class="size-4" />
		Add C.A/Travel Order
	</Dialog.Trigger>

	<Dialog.Content class="max-w-lg overflow-hidden rounded-2xl border border-emerald-100 p-0">
		<!-- Header -->
		<Dialog.Header
			class="flex-row items-start gap-3.5 border-b border-emerald-100 bg-emerald-50 px-6 pt-6 pb-4"
		>
			<div class="flex h-10 w-10 min-w-10 items-center justify-center rounded-xl bg-emerald-500">
				<Van class="size-5 text-white" />
			</div>
			<div>
				<Dialog.Title class="text-base font-semibold text-emerald-950"
					>Add C.A/Travel Order</Dialog.Title
				>
				<Dialog.Description class="mt-0.5 text-[13px] text-gray-500">
					Create a new C.A/Travel Order for an employee
				</Dialog.Description>
			</div>
		</Dialog.Header>

		<!-- Body -->
		<div class="flex flex-col gap-4 px-6 py-5">
			<!-- Employee Search -->
			<div class="flex flex-col gap-1.5">
				<div class="flex items-center gap-1.5">
					<User class="size-3 text-emerald-500" />
					<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
						Employee
					</Label>
				</div>
				<div class="relative">
					<div class="relative">
						<Search
							class="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-gray-400"
						/>
						<Input
							type="text"
							placeholder="Search by name or ID..."
							bind:value={employeeQuery}
							oninput={() => {
								selectedEmployee = null;
								searchEmployees(employeeQuery);
							}}
							onfocus={() => {
								if (searchResults.length) showDropdown = true;
							}}
							onblur={() => setTimeout(() => (showDropdown = false), 150)}
							class="border-gray-200 pr-8 pl-8 text-[13.5px] focus:border-emerald-400 focus:ring-emerald-100
							       {selectedEmployee ? 'border-emerald-300 bg-emerald-50/60' : ''}"
						/>
						{#if employeeQuery}
							<button
								type="button"
								class="absolute top-1/2 right-2.5 -translate-y-1/2 text-gray-400 hover:text-gray-600"
								onclick={clearEmployee}
							>
								<X class="size-3.5" />
							</button>
						{/if}
					</div>

					<!-- Dropdown -->
					{#if showDropdown}
						<div
							class="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
						>
							{#if searchLoading}
								<div class="flex items-center gap-2 px-3.5 py-2.5 text-[13px] text-gray-400">
									<div
										class="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-emerald-500"
									></div>
									Searching...
								</div>
							{:else if searchResults.length === 0}
								<div class="px-3.5 py-2.5 text-[13px] text-gray-400">No employees found.</div>
							{:else}
								{#each searchResults as emp}
									<button
										type="button"
										class="flex w-full items-center gap-3 px-3.5 py-2.5 text-left hover:bg-emerald-50"
										onclick={() => selectEmployee(emp)}
									>
										<div
											class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-600"
										>
											{emp.fullname.charAt(0).toUpperCase()}
										</div>
										<div>
											<div class="text-[13px] font-medium text-gray-800">{emp.fullname}</div>
											<div class="text-[11px] text-gray-400">ID: {emp.employee_id}</div>
										</div>
									</button>
								{/each}
							{/if}
						</div>
					{/if}
				</div>
				{#if selectedEmployee}
					<div
						class="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2"
					>
						<div
							class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white"
						>
							{selectedEmployee.fullname.charAt(0).toUpperCase()}
						</div>
						<span class="text-[13px] font-medium text-emerald-800">{selectedEmployee.fullname}</span
						>
						<span class="text-[11px] text-emerald-500">· ID {selectedEmployee.employee_id}</span>
					</div>
				{/if}
				{#if errors.employee}
					<span class="text-[12px] text-red-500">{errors.employee}</span>
				{/if}
			</div>

			<!-- Travel Purpose -->
			<div class="flex flex-col gap-1.5">
				<div class="flex items-center gap-1.5">
					<FileText class="size-3 text-emerald-500" />
					<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
						Travel Purpose
					</Label>
				</div>
				<Input
					type="text"
					placeholder="e.g. Client meeting, Site inspection..."
					bind:value={form.purpose}
					class="border-gray-200 text-[13.5px] focus:border-emerald-400 focus:ring-emerald-100"
				/>
				{#if errors.purpose}
					<span class="text-[12px] text-red-500">{errors.purpose}</span>
				{/if}
			</div>

			<!-- Message / Notes -->
			<div class="flex flex-col gap-1.5">
				<div class="flex items-center gap-1.5">
					<FileText class="size-3 text-emerald-500" />
					<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
						Message <span class="text-gray-400 normal-case">(optional)</span>
					</Label>
				</div>
				<textarea
					placeholder="Additional notes or instructions..."
					bind:value={form.message}
					rows={3}
					class="w-full resize-none rounded-md border border-gray-200 px-3 py-2 text-[13.5px] text-gray-800 transition
					       outline-none placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
				></textarea>
			</div>

			<RadioGroup.Root bind:value={classification} class="flex gap-2">
				{#each [['more-day', '1 or more days'], ['half-day', 'Half Day']] as [val, label]}
					<label
						for="r-{val}"
						class="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2.5 text-[13px] font-medium
              {classification === val
							? 'border-emerald-400 bg-emerald-50 text-emerald-800'
							: 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}"
					>
						<RadioGroup.Item value={val} id="r-{val}" class="hidden" />
						<div
							class="flex h-3.5 w-3.5 items-center justify-center rounded-full border-[1.5px]
                {classification === val ? 'border-emerald-500' : 'border-gray-300'}"
						>
							{#if classification === val}
								<div class="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
							{/if}
						</div>
						{label}
					</label>
				{/each}
			</RadioGroup.Root>

			<!-- Date Range -->
			<div class="flex flex-col gap-1.5">
				<div class="flex items-center gap-1.5">
					<CalendarRange class="size-3 text-emerald-500" />
					<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
						Travel Duration
					</Label>
				</div>
				<div class="flex items-center gap-2">
					<div class="flex flex-1 flex-col gap-1">
						<span class="text-[11px] text-gray-400">
							{classification === 'half-day' ? 'Date' : 'From'}
						</span>
						<Popover.Root>
							<Popover.Trigger>
								{#snippet child({ props })}
									<button
										{...props}
										class="flex h-9 w-full items-center gap-2 rounded-md border px-3 text-[13.5px] transition
                           {date_from
											? 'border-emerald-300 bg-emerald-50/60 text-gray-800'
											: 'border-gray-200 text-gray-400'}
                           hover:border-emerald-300 hover:bg-emerald-50/40"
									>
										<CalendarRange class="size-3.5 shrink-0 text-gray-400" />
										{date_from ? df.format(date_from.toDate(getLocalTimeZone())) : 'Pick a date'}
									</button>
								{/snippet}
							</Popover.Trigger>
							<Popover.Content class="w-auto p-0" align="start">
								<Calendar type="single" bind:value={date_from} />
							</Popover.Content>
						</Popover.Root>
						{#if errors.date_from}
							<span class="text-[12px] text-red-500">{errors.date_from}</span>
						{/if}
					</div>

					{#if classification === 'more-day'}
						<div class="mt-4 text-gray-400">→</div>

						<div class="flex flex-1 flex-col gap-1">
							<span class="text-[11px] text-gray-400">To</span>
							<Popover.Root>
								<Popover.Trigger>
									{#snippet child({ props })}
										<button
											{...props}
											class="flex h-9 w-full items-center gap-2 rounded-md border px-3 text-[13.5px] transition
                             {date_to
												? 'border-emerald-300 bg-emerald-50/60 text-gray-800'
												: 'border-gray-200 text-gray-400'}
                             hover:border-emerald-300 hover:bg-emerald-50/40"
										>
											<CalendarRange class="size-3.5 shrink-0 text-gray-400" />
											{date_to ? df.format(date_to.toDate(getLocalTimeZone())) : 'Pick a date'}
										</button>
									{/snippet}
								</Popover.Trigger>
								<Popover.Content class="w-auto p-0" align="start">
									<Calendar type="single" bind:value={date_to} minValue={date_from} />
								</Popover.Content>
							</Popover.Root>
							{#if errors.date_to}
								<span class="text-[12px] text-red-500">{errors.date_to}</span>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="flex justify-end gap-2 bg-gray-50 px-6 py-4">
			<Dialog.Close>
				<Button
					variant="outline"
					class="rounded-lg border-gray-200 text-[13.5px] text-gray-600 hover:bg-gray-100"
					onclick={resetForm}
					disabled={loading}
				>
					Cancel
				</Button>
			</Dialog.Close>
			<Button
				class="gap-2 rounded-lg bg-emerald-500 text-[13.5px] text-white shadow-sm shadow-emerald-200 hover:bg-emerald-600"
				onclick={handleSubmit}
				disabled={loading}
			>
				{#if loading}
					<div
						class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
					></div>
					Saving...
				{:else}
					<Check class="size-3.5" />
					Add C.A/Travel Order
				{/if}
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
