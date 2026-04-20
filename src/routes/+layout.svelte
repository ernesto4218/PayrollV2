<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
	import { Toaster } from '$lib/components/ui/sonner/index.js';
</script>

<Toaster richColors theme="light" position="top-right" />

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
