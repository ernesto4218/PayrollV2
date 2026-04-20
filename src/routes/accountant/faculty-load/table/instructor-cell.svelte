<script lang="ts">
	let { fullname, employee_id }: { fullname: string; employee_id: number } = $props();

	const initials = fullname
		.split(' ')
		.map((n) => n[0])
		.slice(0, 2)
		.join('')
		.toUpperCase();
</script>

<div class="flex items-center gap-2.5">
	<div
		class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700"
	>
		{initials}
	</div>
	<div class="flex flex-col">
		<span class="text-[13px] font-semibold text-gray-800">{fullname}</span>
		<span class="text-[11px] text-gray-400">ID: {employee_id}</span>
	</div>
</div>
