<script lang="ts">
	import type { FacultyLoad } from './columns.ts';
	import DeleteFacultyLoad from '$lib/components/dialogs/faculty-load/delete-faculty-load.svelte';
	import EditFacultyLoad from '$lib/components/dialogs/faculty-load/edit-faculty-load.svelte';

	let { load, onDeleted }: { load: FacultyLoad; onDeleted?: () => void } = $props();
</script>

<div class="flex items-center gap-1.5">
	<EditFacultyLoad {load} onRefresh={() => onDeleted?.()} />
	<DeleteFacultyLoad
		loadId={load.load_id}
		instructorName={load.fullname}
		subjectName={load.subject_name}
		subjectCode={load.subject_code}
		onDeleted={() => onDeleted?.()}
	/>
</div>
