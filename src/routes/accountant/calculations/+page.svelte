<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Loader2, CheckCircle2, AlertCircle } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { toast } from 'svelte-sonner';

	let totalWorkedHours = $state('');
	let isSaving = $state(false);
	let isFetching = $state(true);
	let saveSuccess = $state(false);
	let saveError = $state('');

	async function fetchSettings() {
		isFetching = true;
		try {
			const response = await fetch('/API/GET/calculation-settings');
			if (!response.ok) throw new Error('Failed to fetch settings');
			const data = await response.json();
			const setting = data.find((s: any) => s.name === 'total_worked_hours');
			totalWorkedHours = setting?.value ?? '';
		} catch (err) {
			console.error('Error fetching settings:', err);
		} finally {
			isFetching = false;
		}
	}

	async function saveSettings() {
		isSaving = true;
		saveSuccess = false;
		saveError = '';
		try {
			const response = await fetch('/API/POST/calculation-settings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: 'total_worked_hours', value: Number(totalWorkedHours) })
			});
			if (!response.ok) throw new Error('Failed to save settings');
			saveSuccess = true;
			toast.success('Settings saved');
			setTimeout(() => (saveSuccess = false), 3000);
		} catch (err) {
			saveError = 'Failed to save. Please try again.';
		} finally {
			isSaving = false;
		}
	}

	// @ts-ignore
	function handleInput(e) {
		const val = e.target.value.replace(/[^0-9.]/g, '');
		totalWorkedHours = val;
	}

	onMount(() => {
		fetchSettings();
	});
</script>

<div class="min-h-screen space-y-8 bg-slate-50 p-6 md:p-10">
	<!-- Header -->
	<div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
		<div class="space-y-1.5">
			<h1 class="text-4xl font-extrabold tracking-tight text-slate-900">Calculations</h1>
			<p class="text-sm font-medium text-slate-500">Modify calculations of the entire payroll.</p>
		</div>
	</div>

	<div>
		<Card.Root class="max-w-sm">
			<Card.Header>
				<Card.Title
					>Work Hours Configuration <Badge class="bg-emerald-500">Full-time</Badge></Card.Title
				>
				<Card.Description>
					Set the standard total worked hours used across payroll calculations.
				</Card.Description>
			</Card.Header>

			<Card.Content>
				{#if isFetching}
					<div class="flex items-center gap-2 text-sm text-slate-500">
						<Loader2 class="h-4 w-4 animate-spin" />
						Loading settings...
					</div>
				{:else}
					<div class="max-w-sm space-y-2">
						<Label for="worked-hours">Total Worked Hours</Label>
						<div class="relative">
							<Input
								id="worked-hours"
								type="number"
								min="1"
								max="24"
								step="0.5"
								placeholder="e.g. 8"
								value={totalWorkedHours}
								oninput={handleInput}
								class="pr-14"
							/>
						</div>
						<p class="text-xs text-slate-500">
							Enter the number of hours per day (e.g. 8, 10, 12).
						</p>
					</div>
				{/if}
			</Card.Content>

			<Card.Footer class="flex items-center gap-4">
				<Button onclick={saveSettings} disabled={isSaving || isFetching || !totalWorkedHours}>
					{#if isSaving}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Saving...
					{:else}
						Save Settings
					{/if}
				</Button>

				{#if saveSuccess}
					<span class="flex items-center gap-1.5 text-sm font-medium text-green-600">
						<CheckCircle2 class="h-4 w-4" />
						Settings saved!
					</span>
				{/if}

				{#if saveError}
					<span class="flex items-center gap-1.5 text-sm font-medium text-red-500">
						<AlertCircle class="h-4 w-4" />
						{saveError}
					</span>
				{/if}
			</Card.Footer>
		</Card.Root>
	</div>
</div>
