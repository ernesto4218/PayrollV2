<script lang="ts">
	import { SidebarProvider } from '$lib/components/ui/sidebar';
	import AccountantSidebar from '$lib/components/sidebars/accountant-sidebar.svelte';
	import AccountantTopbar from '$lib/components/topbars/accountant-topbar.svelte';

	const { data, children } = $props();
</script>

<SidebarProvider>
	<AccountantSidebar {data} />

	<div class="flex min-h-screen flex-1 flex-col overflow-x-hidden">
		<AccountantTopbar {data} />

		<!-- svelte-ignore slot_element_deprecated -->
		<main class="w-full flex-1 overflow-x-hidden">
			<slot />
		</main>

		<!-- <AdminFooter /> -->
	</div>
</SidebarProvider>
