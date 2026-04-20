<script lang="ts">
	import { page } from '$app/stores';
	import Fulltime from '$lib/components/overview/fulltime.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	const segments = $derived($page.url.pathname.split('/').filter(Boolean));
	const pageTitle = $derived(
		$page.data.folder?.name ??
			[...segments]
				.pop()
				?.replace(/-/g, ' ')
				.replace(/\b\w/g, (c) => c.toUpperCase()) ??
			'Dashboard'
	);
</script>

<div class="min-h-screen space-y-8 bg-slate-50 p-6 md:p-10">
	<!-- Header -->
	<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
		<div class="space-y-1.5">
			<h1 class="text-4xl font-extrabold tracking-tight text-slate-900">{pageTitle}</h1>
			<p class="text-sm font-medium text-slate-500">
				Overview of the payroll, check everything before running the payroll
			</p>
		</div>

		<div class="flex shrink-0 items-center gap-2.5">
			<!-- <ExportUndertime {employees} month={month_value} year={year_value} /> -->
		</div>
	</div>

	<Tabs.Root value="fulltime">
		<Tabs.List class="bg-slate-200">
			<Tabs.Trigger
				value="fulltime"
				class="data-[state=active]:bg-white data-[state=active]:text-black">Full-time</Tabs.Trigger
			>
			<Tabs.Trigger
				value="parttime"
				class="data-[state=active]:bg-white data-[state=active]:text-black">Part-time</Tabs.Trigger
			>
		</Tabs.List>
		<Tabs.Content value="fulltime"><Fulltime /></Tabs.Content>
		<Tabs.Content value="parttime">Change your password here.</Tabs.Content>
	</Tabs.Root>
</div>
