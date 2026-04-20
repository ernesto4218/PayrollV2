<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Trash2, TriangleAlert } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		loadId: number;
		instructorName: string;
		subjectName: string;
		subjectCode: string;
		onDeleted?: () => void;
	}

	let { loadId, instructorName, subjectName, subjectCode, onDeleted }: Props = $props();

	let open = $state(false);
	let loading = $state(false);

	async function handleDelete() {
		loading = true;
		try {
			const res = await fetch(`/API/DELETE/faculty-load/${loadId}`, {
				method: 'DELETE'
			});

			console.log(res);

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message ?? `Server error ${res.status}`);
			}

			toast.success('Faculty load deleted successfully!');
			open = false;
			onDeleted?.();
		} catch (e: any) {
			toast.error(e.message || 'Failed to delete. Please try again.');
		} finally {
			loading = false;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<button
				{...props}
				class="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-[12px] font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700"
			>
				<Trash2 class="size-3" />
				Delete
			</button>
		{/snippet}
	</Dialog.Trigger>

	<Dialog.Content class="max-w-md overflow-hidden rounded-2xl border border-red-100 p-0">
		<!-- Header -->
		<Dialog.Header
			class="flex-row items-start gap-3.5 border-b border-red-100 bg-red-50 px-6 pt-6 pb-4"
		>
			<div class="flex h-10 w-10 min-w-10 items-center justify-center rounded-xl bg-red-500">
				<Trash2 class="size-5 text-white" />
			</div>
			<div>
				<Dialog.Title class="text-base font-semibold text-red-950">Delete faculty load</Dialog.Title
				>
				<Dialog.Description class="mt-0.5 text-[13px] text-gray-500">
					This action cannot be undone
				</Dialog.Description>
			</div>
		</Dialog.Header>

		<!-- Body -->
		<div class="px-6 py-5">
			<div class="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
				<TriangleAlert class="mt-0.5 size-4 shrink-0 text-amber-500" />
				<p class="text-[13px] text-amber-800">
					You are about to permanently delete the faculty load for
					<span class="font-semibold">{instructorName}</span>.
				</p>
			</div>

			<!-- Load details -->
			<div class="mt-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5">
				<div class="flex flex-col gap-1.5">
					<div class="flex items-center justify-between">
						<span class="text-[11px] font-semibold tracking-wide text-gray-400 uppercase"
							>Instructor</span
						>
						<span class="text-[13px] font-medium text-gray-700">{instructorName}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-[11px] font-semibold tracking-wide text-gray-400 uppercase"
							>Subject</span
						>
						<span class="text-[13px] font-medium text-gray-700">{subjectName}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">Code</span
						>
						<span class="text-[13px] font-medium text-gray-700">{subjectCode}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">ID</span>
						<span class="font-mono text-[13px] text-gray-500">#{loadId}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<div class="flex justify-end gap-2 bg-gray-50 px-6 py-4">
			<Dialog.Close>
				<Button
					variant="outline"
					class="rounded-lg border-gray-200 text-[13.5px] text-gray-600 hover:bg-gray-100"
					disabled={loading}
				>
					Cancel
				</Button>
			</Dialog.Close>
			<Button
				class="gap-2 rounded-lg bg-red-500 text-[13.5px] text-white shadow-sm shadow-red-200 hover:bg-red-600"
				onclick={handleDelete}
				disabled={loading}
			>
				{#if loading}
					<div
						class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
					></div>
					Deleting...
				{:else}
					<Trash2 class="size-3.5" />
					Delete load
				{/if}
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
