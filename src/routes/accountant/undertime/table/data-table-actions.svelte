<script lang="ts">
	import { editing_dtr } from '$lib/stores/edit-undertime-mode';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { Employee } from './columns.ts';

	let { employee }: { employee: Employee } = $props();

	let initial = $derived({ hours: employee.hours ?? 0, minutes: employee.minutes ?? 0 });

	let hours = $state(initial.hours);
	let minutes = $state(initial.minutes);

	$effect(() => {
		hours = initial.hours;
		minutes = initial.minutes;
	});

	$effect(() => {
		employee.hours = hours;
		employee.minutes = minutes;
	});
</script>

<div class="flex items-center gap-1.5">
	<Input
		disabled={!$editing_dtr}
		type="number"
		placeholder="Hours"
		bind:value={hours}
		class="max-w-xs placeholder:text-xs"
	/>
	:
	<Input
		disabled={!$editing_dtr}
		type="number"
		placeholder="Minutes"
		bind:value={minutes}
		class="max-w-xs placeholder:text-xs"
	/>
</div>
