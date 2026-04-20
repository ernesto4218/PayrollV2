<script lang="ts">
	import type { Employee } from './columns.ts';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ListCheck } from 'lucide-svelte';
	import Dtr from '$lib/components/dialogs/employee/dtr-part-time.svelte';

	const monthMap: Record<string, number> = {
		january: 1,
		february: 2,
		march: 3,
		april: 4,
		may: 5,
		june: 6,
		july: 7,
		august: 8,
		september: 9,
		october: 10,
		november: 11,
		december: 12
	};

	let {
		employee,
		month,
		year,
		semester,
		onSaved
	}: { employee: Employee; month: string; year: string; semester: string; onSaved?: () => void } =
		$props();

	let monthNumber = $derived(monthMap[month.toLowerCase()] ?? 1);
</script>

<div class="flex items-center gap-1.5">
	<Dtr {employee} month={monthNumber} {year} {semester} {onSaved} />
	<Button
		variant="ghost"
		size="sm"
		class="h-8 gap-1.5 px-2.5 text-xs font-medium text-blue-500 hover:bg-blue-500/10 hover:text-blue-600"
	>
		<ListCheck class="size-3.5" />
		Breakdown
	</Button>
</div>
