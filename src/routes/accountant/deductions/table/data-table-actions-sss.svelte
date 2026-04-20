<script lang="ts">
	import { editing_deductions } from '$lib/stores/edit-deductions-mode';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { Employee } from './columns.ts';

	let { employee }: { employee: Employee } = $props();

	let initial = $derived({
		sss: employee.sss ?? 0,
		pagibig: employee.pagibig ?? 0,
		microdev: employee.microdev ?? 0
	});

	let sss = $state(initial.sss);

	$effect(() => {
		sss = initial.sss;
	});

	$effect(() => {
		employee.sss = sss;
	});
</script>

<div class="flex items-center gap-1.5">
	<Input
		disabled={!$editing_deductions}
		type="number"
		placeholder="Hours"
		bind:value={sss}
		class="max-w-xs placeholder:text-xs"
	/>
</div>
