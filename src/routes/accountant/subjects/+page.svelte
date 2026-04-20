<script lang="ts">
	import { createColumns } from './table/columns.ts';
	import DataTable from './table/data-table.svelte';
	import ExportTravelOrder from '$lib/components/exports/export-travel-order.svelte';
	import AddTravelOrder from '$lib/components/dialogs/travel-order/add-travel-order.svelte';
	import AddSubject from '$lib/components/dialogs/subject/add-subject.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	type Subject = {
		id: number;
		code: string;
		name: string;
	};

	let subjects: Subject[] = $state([]);

	export async function fetchSubjects() {
		const res = await fetch(`/API/GET/all-subjects`);
		if (!res.ok) throw new Error('Failed to fetch');
		return res.json() as Promise<Subject[]>;
	}

	export async function refresh() {
		subjects = await fetchSubjects();
		console.log('Fetched subjects: ', subjects);
	}

	onMount(() => {
		refresh().catch((e) => {
			toast.error(e?.message || 'Failed to get subjects');
		});
	});
</script>

<div class="min-h-screen space-y-8 bg-slate-50 p-6 md:p-10">
	<!-- Header -->
	<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
		<div class="space-y-1.5">
			<h1 class="text-4xl font-extrabold tracking-tight text-slate-900">Subjects</h1>
			<p class="text-sm font-medium text-slate-500">Add subjects for a part time instructors</p>
		</div>

		<div class="flex shrink-0 items-center gap-2.5">
			<AddSubject onRefresh={refresh} />
		</div>
	</div>

	<DataTable
		onRefresh={refresh}
		columns={createColumns(refresh)}
		data={subjects}
		filterColumn="name"
		searchPlaceholder="Search subjects..."
	/>
</div>
