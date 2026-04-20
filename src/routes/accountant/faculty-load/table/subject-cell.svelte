<script lang="ts">
	let { subject_code, subject_name }: { subject_code: string; subject_name: string } = $props();
</script>

<div class="flex flex-col gap-0.5">
	<span class="text-[13px] font-semibold text-gray-800">{subject_name}</span>
	<span
		class="w-fit rounded-md bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-indigo-600 uppercase"
	>
		{subject_code}
	</span>
</div>
