<script lang="ts">
	import { editing_deductions } from '$lib/stores/edit-deductions-mode';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { Employee } from './columns.ts';

	let { employee }: { employee: Employee } = $props();

	let initial = $derived({
		pagibig: employee.pagibig ?? 0
	});

	let pagibig = $state(initial.pagibig);

	$effect(() => {
		pagibig = initial.pagibig;
	});

	$effect(() => {
		employee.pagibig = pagibig;
	});
</script>

<div class="flex items-center gap-1.5">
	<Input
		disabled={!$editing_deductions}
		type="number"
		placeholder="Hours"
		bind:value={pagibig}
		class="max-w-xs placeholder:text-xs"
	/>
</div>
