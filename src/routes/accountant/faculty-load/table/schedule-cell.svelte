<script lang="ts">
	let { schedules }: { schedules: { day: string; time_start: string; time_end: string }[] } =
		$props();

	const dayColor: Record<string, string> = {
		Monday: 'bg-blue-50 text-blue-700',
		Tuesday: 'bg-emerald-50 text-emerald-700',
		Wednesday: 'bg-violet-50 text-violet-700',
		Thursday: 'bg-yellow-100 text-yellow-700',
		Friday: 'bg-red-50 text-red-700',
		Saturday: 'bg-amber-50 text-amber-700'
	};

	function formatTime(time: string): string {
		if (!time) return '';
		const [hourStr, minute] = time.split(':');
		let hour = parseInt(hourStr);
		const ampm = hour >= 12 ? 'PM' : 'AM';
		if (hour === 0) hour = 12;
		else if (hour > 12) hour -= 12;
		return `${hour}:${minute} ${ampm}`;
	}
</script>

<div class="flex flex-wrap gap-1">
	{#if !schedules?.length}
		<span class="text-[12px] text-gray-400">—</span>
	{:else}
		{#each schedules as s}
			<div
				class="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium {dayColor[
					s.day
				] ?? 'bg-gray-50 text-gray-600'}"
			>
				<span class="font-bold">{s.day.slice(0, 3)}</span>
				<span class="text-[10px] opacity-75"
					>{formatTime(s.time_start)}–{formatTime(s.time_end)}</span
				>
			</div>
		{/each}
	{/if}
</div>
