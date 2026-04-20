<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { ArrowDown } from 'lucide-svelte';

	let { rawHours, credit, net } = $props();
</script>

<div class="flex flex-col items-start gap-1">
	<div class="flex items-center gap-2">
		<span class="">
			{net} hrs
		</span>

		{#if credit > 0}
			<Badge
				variant="secondary"
				class="h-5 border-green-200 bg-green-50 px-1.5 text-[10px] text-green-700"
			>
				<ArrowDown class="mr-1 size-2.5" />
				{credit + 'hrs '} C.E/TO
			</Badge>
		{/if}
	</div>

	{#if credit > 0}
		<span class="text-xs font-medium text-black line-through">
			was {rawHours} hrs
		</span>
	{/if}
</div>
