<script lang="ts">
	import { editing_deductions } from '$lib/stores/edit-deductions-mode';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { Employee } from './columns.ts';

	let { employee }: { employee: Employee } = $props();

	let initial = $derived({
		microdev: employee.microdev ?? 0
	});

	let microdev = $state(initial.microdev);

	$effect(() => {
		microdev = initial.microdev;
	});

	$effect(() => {
		employee.microdev = microdev;
	});
</script>

<div class="flex items-center gap-1.5">
	<Input
		disabled={!$editing_deductions}
		type="number"
		placeholder="Hours"
		bind:value={microdev}
		class="max-w-xs placeholder:text-xs"
	/>
</div>
