<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Hash, User, Bookmark, Banknote, Briefcase, Pencil, Check } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { Employee } from '../../../../routes/accountant/employees/table/columns';

	let { employee }: { employee: Employee } = $props();

	let loading = $state(false);

	let form = $state({
		first_name: employee.first_name,
		middle_name: employee.middle_name ?? '',
		last_name: employee.last_name,
		designation: employee.designation ?? '',
		classification: employee.classification,
		salary: employee.salary as number | string
	});

	let errors: Record<string, string> = $state({});

	function validate() {
		errors = {};
		if (!form.first_name.trim()) errors.first_name = 'First name is required.';
		if (!form.last_name.trim()) errors.last_name = 'Last name is required.';
		if (!form.designation.trim()) errors.designation = 'Designation is required.';
		if (!form.salary || parseFloat(String(form.salary)) <= 0)
			errors.salary = 'Please enter a valid salary.';
		return Object.keys(errors).length === 0;
	}

	function resetForm() {
		form = {
			first_name: employee.first_name,
			middle_name: employee.middle_name ?? '',
			last_name: employee.last_name,
			designation: employee.designation ?? '',
			classification: employee.classification,
			salary: employee.salary
		};
		errors = {};
	}

	async function handleSubmit() {
		if (!validate()) return;
		loading = true;

		const payload = {
			first_name: form.first_name.trim(),
			middle_name: form.middle_name.trim() || null,
			last_name: form.last_name.trim(),
			designation: form.designation.trim(),
			classification: form.classification,
			salary: form.salary
		};

		try {
			const res = await fetch(`/API/PUT/edit-employee/${employee.employee_id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message ?? `Server error ${res.status}`);
			}

			toast.success('Employee updated successfully!');
		} catch (e: any) {
			toast.error(e.message || 'Failed to save. Please try again.');
		} finally {
			loading = false;
		}
	}
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button
			variant="ghost"
			size="sm"
			class="h-8 gap-1.5 px-2.5 text-xs font-medium text-amber-500 hover:bg-amber-500/10 hover:text-amber-600"
		>
			<Pencil class="size-3.5" />
			Edit
		</Button>
	</Dialog.Trigger>

	<Dialog.Content class="max-w-lg overflow-hidden rounded-2xl border border-amber-100 p-0">
		<!-- Header -->
		<Dialog.Header
			class="flex-row items-start gap-3.5 border-b border-amber-100 bg-amber-50 px-6 pt-6 pb-4"
		>
			<div class="flex h-10 w-10 min-w-10 items-center justify-center rounded-xl bg-amber-500">
				<Pencil class="size-5 text-white" />
			</div>
			<div>
				<Dialog.Title class="text-base font-semibold text-amber-950">Edit employee</Dialog.Title>
				<Dialog.Description class="mt-0.5 text-[13px] text-gray-500">
					Editing record for employee #{employee.employee_id}
				</Dialog.Description>
			</div>
		</Dialog.Header>

		<!-- Body -->
		<div class="flex flex-col gap-4 px-6 py-5">
			<!-- Employee ID (read-only) -->
			<div class="flex flex-col gap-1.5">
				<div class="flex items-center gap-1.5">
					<Hash class="size-3 text-amber-500" />
					<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
						Employee ID
					</Label>
				</div>
				<Input
					type="number"
					value={employee.employee_id}
					disabled
					class="max-w-40 border-gray-200 bg-gray-50 text-[13.5px] text-gray-400"
				/>
			</div>

			<!-- Name -->
			<div class="flex flex-col gap-1.5">
				<div class="flex items-center gap-1.5">
					<User class="size-3 text-amber-500" />
					<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
						Full name
					</Label>
				</div>
				<div class="flex gap-2">
					<Input
						type="text"
						placeholder="First name"
						bind:value={form.first_name}
						class="border-gray-200 text-[13.5px] focus:border-amber-400 focus:ring-amber-100"
					/>
					<Input
						type="text"
						placeholder="Middle name"
						bind:value={form.middle_name}
						class="border-gray-200 text-[13.5px] focus:border-amber-400 focus:ring-amber-100"
					/>
					<Input
						type="text"
						placeholder="Last name"
						bind:value={form.last_name}
						class="border-gray-200 text-[13.5px] focus:border-amber-400 focus:ring-amber-100"
					/>
				</div>
				{#if errors.first_name || errors.last_name}
					<span class="text-[12px] text-red-500">{errors.first_name || errors.last_name}</span>
				{/if}
			</div>

			<!-- Designation -->
			<div class="flex flex-col gap-1.5">
				<div class="flex items-center gap-1.5">
					<Briefcase class="size-3 text-amber-500" />
					<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
						Designation
					</Label>
				</div>
				<Input
					type="text"
					placeholder="e.g. Software Engineer"
					bind:value={form.designation}
					class="border-gray-200 text-[13.5px] focus:border-amber-400 focus:ring-amber-100"
				/>
				{#if errors.designation}
					<span class="text-[12px] text-red-500">{errors.designation}</span>
				{/if}
			</div>

			<!-- Classification -->
			<div class="flex flex-col gap-1.5">
				<div class="flex items-center gap-1.5">
					<Bookmark class="size-3 text-amber-500" />
					<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
						Classification
					</Label>
				</div>
				<RadioGroup.Root bind:value={form.classification} class="flex gap-2">
					{#each [['full-time', 'Full-time'], ['part-time', 'Part-time']] as [val, label]}
						<label
							for="r-{val}"
							class="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2.5 text-[13px] font-medium
							{form.classification === val
								? 'border-amber-400 bg-amber-50 text-amber-800'
								: 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}"
						>
							<RadioGroup.Item value={val} id="r-{val}" class="hidden" />
							<div
								class="flex h-3.5 w-3.5 items-center justify-center rounded-full border-[1.5px]
								{form.classification === val ? 'border-amber-500' : 'border-gray-300'}"
							>
								{#if form.classification === val}
									<div class="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
								{/if}
							</div>
							{label}
						</label>
					{/each}
				</RadioGroup.Root>
			</div>

			<!-- Salary -->
			<div class="flex flex-col gap-1.5">
				<div class="flex items-center gap-1.5">
					<Banknote class="size-3 text-amber-500" />
					<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
						{form.classification === 'full-time' ? 'Monthly salary' : 'Hourly rate'}
					</Label>
				</div>
				<div class="relative max-w-50">
					<span
						class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[13px] text-gray-400"
						>₱</span
					>
					<Input
						type="number"
						placeholder="0.00"
						bind:value={form.salary}
						class="border-gray-200 pl-6 text-[13.5px] focus:border-amber-400 focus:ring-amber-100"
					/>
				</div>
				{#if errors.salary}
					<span class="text-[12px] text-red-500">{errors.salary}</span>
				{/if}
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
				class="gap-2 rounded-lg bg-amber-500 text-[13.5px] text-white shadow-sm shadow-amber-200 hover:bg-amber-600"
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
					Save changes
				{/if}
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
