<script lang="ts">
	let { semester, school_year }: { semester: string; school_year: string } = $props();

	const colorMap: Record<string, string> = {
		'1st': 'bg-blue-50 text-blue-600 border-blue-200',
		'2nd': 'bg-violet-50 text-violet-600 border-violet-200',
		Summer: 'bg-amber-50 text-amber-600 border-amber-200'
	};

	const color = colorMap[semester] ?? 'bg-gray-50 text-gray-600 border-gray-200';
</script>

<div class="flex flex-col gap-1">
	<span class="w-fit rounded-md border px-2 py-0.5 text-[11px] font-semibold {color}">
		{semester} Sem
	</span>
	<span class="text-[11px] text-gray-400">{school_year}</span>
</div>
