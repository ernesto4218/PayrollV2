<script lang="ts">
	import type { Subject } from './columns.ts';
	import DeleteSubject from '$lib/components/dialogs/subject/delete-subject.svelte';

	let { subject, onDeleted }: { subject: Subject; onDeleted?: () => void } = $props();
</script>

<div class="flex items-center gap-1.5">
	<DeleteSubject
		subjectId={subject.id}
		subjectCode={subject.code}
		subjectName={subject.name}
		{onDeleted}
	/>
</div>
