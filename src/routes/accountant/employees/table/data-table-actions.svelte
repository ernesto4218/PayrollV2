<script lang="ts">
	// @ts-nocheck
	import { Eye, Timer, FolderOpen } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Employee } from './columns.ts';
	import ViewEmployee from '$lib/components/dialogs/employee/view-employee.svelte';
	import EditEmployee from '$lib/components/dialogs/employee/edit-employee.svelte';

	let { employee }: { employee: Employee } = $props();
</script>

<div class="flex items-center gap-1.5">
	<ViewEmployee {employee} />
	<EditEmployee {employee} />
	<Button
		variant="ghost"
		size="sm"
		class="h-8 gap-1.5 px-2.5 text-xs font-medium text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600"
	>
		<Timer class="size-3.5" />
		DTR
	</Button>
	<Button
		variant="ghost"
		size="sm"
		class="h-8 gap-1.5 px-2.5 text-xs font-medium text-violet-500 hover:bg-violet-500/10 hover:text-violet-600"
	>
		<FolderOpen class="size-3.5" />
		Records
	</Button>
</div>
