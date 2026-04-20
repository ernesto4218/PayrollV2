<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import { BookOpen, Check } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	type Props = {
		onRefresh: () => void;
	};

	let { onRefresh }: Props = $props();
	let loading = $state(false);
	let open = $state(false);

	let form = $state({
		code: '',
		name: ''
	});

	let errors: Record<string, string> = $state({});

	function validate() {
		errors = {};
		if (!form.code.trim()) errors.code = 'Subject code is required.';
		if (!form.name.trim()) errors.name = 'Subject name is required.';
		return Object.keys(errors).length === 0;
	}

	function resetForm() {
		form = { code: '', name: '' };
		errors = {};
	}

	async function handleSubmit() {
		if (!validate()) return;
		loading = true;

		const payload = {
			code: form.code.trim(),
			name: form.name.trim()
		};

		try {
			const res = await fetch('/API/POST/add-subject', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message ?? `Server error ${res.status}`);
			}

			toast.success('Subject added successfully!');
			resetForm();
			open = false;
			onRefresh();
		} catch (e: any) {
			toast.error(e.message || 'Failed to save. Please try again.');
		} finally {
			loading = false;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 hover:bg-emerald-600"
	>
		<BookOpen class="size-4" />
		Add Subject
	</Dialog.Trigger>

	<Dialog.Content class="max-w-lg overflow-hidden rounded-2xl border border-emerald-100 p-0">
		<!-- Header -->
		<Dialog.Header
			class="flex-row items-start gap-3.5 border-b border-emerald-100 bg-emerald-50 px-6 pt-6 pb-4"
		>
			<div class="flex h-10 w-10 min-w-10 items-center justify-center rounded-xl bg-emerald-500">
				<BookOpen class="size-5 text-white" />
			</div>
			<div>
				<Dialog.Title class="text-base font-semibold text-emerald-950">Add subject</Dialog.Title>
				<Dialog.Description class="mt-0.5 text-[13px] text-gray-500">
					Create a new subject record
				</Dialog.Description>
			</div>
		</Dialog.Header>

		<!-- Body -->
		<div class="flex flex-col gap-4 px-6 py-5">
			<!-- Subject Code -->
			<div class="flex flex-col gap-1.5">
				<div class="flex items-center gap-1.5">
					<BookOpen class="size-3 text-emerald-500" />
					<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
						Subject Code
					</Label>
				</div>
				<Input
					type="text"
					placeholder="e.g. MATH101, ENG201..."
					bind:value={form.code}
					class="border-gray-200 text-[13.5px] focus:border-emerald-400 focus:ring-emerald-100"
				/>
				{#if errors.code}
					<span class="text-[12px] text-red-500">{errors.code}</span>
				{/if}
			</div>

			<!-- Subject Name -->
			<div class="flex flex-col gap-1.5">
				<div class="flex items-center gap-1.5">
					<BookOpen class="size-3 text-emerald-500" />
					<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
						Subject Name
					</Label>
				</div>
				<Input
					type="text"
					placeholder="e.g. Basic Mathematics, English Communication..."
					bind:value={form.name}
					class="border-gray-200 text-[13.5px] focus:border-emerald-400 focus:ring-emerald-100"
				/>
				{#if errors.name}
					<span class="text-[12px] text-red-500">{errors.name}</span>
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
					Add subject
				{/if}
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
