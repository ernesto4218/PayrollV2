<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Timer, Save } from 'lucide-svelte';
	import type { Employee } from '../../../../routes/accountant/employees/table/columns';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	// ── Types ────────────────────────────────────────────────────────────────────

	type EmployeeWithDtr = Employee & {
		hours?: number | null;
		minutes?: number | null;
		semester?: string | null;
	};

	type TimeEntry = {
		amIn: string;
		amOut: string;
		pmIn: string;
		pmOut: string;
	};

	type DtrEntry = {
		hours: number;
		minutes: number;
	};

	type Schedule = {
		day: string; // "Monday", "Tuesday", etc.
		time_start: string; // "08:00:00"
		time_end: string; // "10:00:00"
	};

	type FacultyLoad = {
		load_id: number;
		subject_code: string;
		subject_name: string;
		schedules: Schedule[];
	};

	// ── Props ────────────────────────────────────────────────────────────────────

	let {
		employee,
		month,
		year,
		semester,
		onSaved
	}: {
		employee: EmployeeWithDtr;
		month: number;
		year: string;
		semester: string;
		onSaved?: () => void;
	} = $props();

	// ── State ────────────────────────────────────────────────────────────────────

	let records = $state<Record<number, TimeEntry>>({});
	let saving = $state(false);
	let saveError = $state<string | null>(null);
	let saveSuccess = $state(false);
	let dialogOpen = $state(false);
	let loading = $state(false);
	let facultyLoads = $state<FacultyLoad[]>([]);

	// ── Derived ──────────────────────────────────────────────────────────────────

	let startYear = $derived(parseInt(year.split('-')[0]));
	let days = $derived(daysInMonth(month, startYear));
	let dayNumbers = $derived(Array.from({ length: days }, (_, i) => i + 1));

	let totalMinutes = $derived(dayNumbers.reduce((acc, day) => acc + calcWorkedMinutes(day), 0));
	let totalHours = $derived(Math.floor(totalMinutes / 60));
	let totalMins = $derived(totalMinutes % 60);

	// ── Constants ────────────────────────────────────────────────────────────────

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const JS_DAY_NAMES = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday'
	];

	// ── Schedule helpers ─────────────────────────────────────────────────────────

	/**
	 * Returns all scheduled blocks for a given calendar day, matched by weekday name
	 * across ALL faculty loads.
	 */
	function getSchedulesForDay(day: number): Array<Schedule & { load: FacultyLoad }> {
		const weekday = JS_DAY_NAMES[new Date(startYear, month - 1, day).getDay()];
		const result: Array<Schedule & { load: FacultyLoad }> = [];
		for (const load of facultyLoads) {
			for (const sched of load.schedules) {
				if (sched.day === weekday) result.push({ ...sched, load });
			}
		}
		return result;
	}

	function isScheduledDay(day: number): boolean {
		return getSchedulesForDay(day).length > 0;
	}

	/** Short label shown under a scheduled row, e.g. "Database 08:00–10:00" */
	function formatTime(time: string): string {
		const [h, m] = time.split(':').map(Number);
		const period = h < 12 ? 'AM' : 'PM';
		const hour = h % 12 === 0 ? 12 : h % 12;
		return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
	}

	function getScheduleLabel(day: number): string {
		return getSchedulesForDay(day)
			.map((s) => `${s.load.subject_code} ${formatTime(s.time_start)}–${formatTime(s.time_end)}`)
			.join(' · ');
	}

	// ── Time helpers ─────────────────────────────────────────────────────────────

	/** Parse "HH:MM" or "HH:MM:SS" → minutes since midnight, or null if invalid. */
	function parseTime(t: string): number | null {
		if (!t) return null;
		const match = t.match(/^(\d{1,2}):(\d{2})/);
		if (!match) return null;
		const h = parseInt(match[1]);
		const m = parseInt(match[2]);
		if (h > 23 || m > 59) return null;
		return h * 60 + m;
	}

	/**
	 * Credits minutes for one logged window [actualIn, actualOut] against one
	 * scheduled window [schedStart, schedEnd]:
	 * - 0 if no overlap (completely outside → blocked)
	 * - Overlap portion only (handles late in + early out)
	 */
	function creditedMinutes(
		actualIn: number,
		actualOut: number,
		schedStart: number,
		schedEnd: number
	): number {
		if (actualOut <= schedStart || actualIn >= schedEnd) return 0; // outside → no credit
		return Math.max(0, Math.min(actualOut, schedEnd) - Math.max(actualIn, schedStart));
	}

	/**
	 * Total credited minutes for a day.
	 * - Non-scheduled days → 0
	 * - AM and PM windows each validated against all scheduled blocks for that day
	 */
	function calcWorkedMinutes(day: number): number {
		const schedules = getSchedulesForDay(day);
		if (schedules.length === 0) return 0;

		const entry = getEntry(day);
		let total = 0;

		const windows: Array<[string, string]> = [
			[entry.amIn, entry.amOut],
			[entry.pmIn, entry.pmOut]
		];

		for (const [inVal, outVal] of windows) {
			const actualIn = parseTime(inVal);
			const actualOut = parseTime(outVal);
			if (actualIn === null || actualOut === null || actualOut <= actualIn) continue;

			for (const sched of schedules) {
				const schedStart = parseTime(sched.time_start);
				const schedEnd = parseTime(sched.time_end);
				if (schedStart === null || schedEnd === null) continue;
				total += creditedMinutes(actualIn, actualOut, schedStart, schedEnd);
			}
		}

		return total;
	}

	// ── Entry helpers ────────────────────────────────────────────────────────────

	function daysInMonth(m: number, y: number) {
		return new Date(y, m, 0).getDate();
	}

	function getEntry(day: number): TimeEntry {
		return records[day] ?? { amIn: '', amOut: '', pmIn: '', pmOut: '' };
	}

	function setField(day: number, field: keyof TimeEntry, val: string) {
		records[day] = { ...getEntry(day), [field]: val };
	}

	function getDayWorked(day: number): DtrEntry {
		const mins = calcWorkedMinutes(day);
		return { hours: Math.floor(mins / 60), minutes: mins % 60 };
	}

	function getDayLabel(day: number) {
		return new Date(startYear, month - 1, day).toLocaleDateString('en-US', { weekday: 'short' });
	}

	function isWeekend(day: number) {
		const dow = new Date(startYear, month - 1, day).getDay();
		return dow === 0 || dow === 6;
	}

	// ── Save ─────────────────────────────────────────────────────────────────────

	// async function save() {
	// 	saving = true;
	// 	saveError = null;
	// 	saveSuccess = false;

	// 	try {
	// 		const payload = dayNumbers
	// 			.filter((day) => {
	// 				const e = getEntry(day);
	// 				return e.amIn || e.amOut || e.pmIn || e.pmOut;
	// 			})
	// 			.map((day) => {
	// 				const e = getEntry(day);
	// 				const worked = getDayWorked(day);
	// 				return {
	// 					employee_id: employee.employee_id,
	// 					month,
	// 					year,
	// 					day,
	// 					am_in: e.amIn,
	// 					am_out: e.amOut,
	// 					pm_in: e.pmIn,
	// 					pm_out: e.pmOut,
	// 					hours: worked.hours,
	// 					minutes: worked.minutes
	// 				};
	// 			});

	// 		const res = await fetch('/API/POST/add-dtr-part-time', {
	// 			method: 'POST',
	// 			headers: { 'Content-Type': 'application/json' },
	// 			body: JSON.stringify(payload)
	// 		});

	// 		if (!res.ok) throw new Error(await res.text());
	// 		saveSuccess = true;
	// 		onSaved?.();
	// 		toast.success('Saved successfully');
	// 		setTimeout(() => (saveSuccess = false), 2500);
	// 	} catch (e: any) {
	// 		saveError = e.message ?? 'Failed to save.';
	// 	} finally {
	// 		saving = false;
	// 	}
	// }

	async function save() {
		saving = true;
		saveError = null;
		saveSuccess = false;

		try {
			const payload = dayNumbers
				.filter((day) => {
					// Option A: Keep the day if it exists in our 'records' object at all.
					// This ensures if a user types something then erases it, we still send the empty strings.
					return records[day] !== undefined;
				})
				.map((day) => {
					const e = getEntry(day);
					const worked = getDayWorked(day);
					return {
						employee_id: employee.employee_id,
						month,
						year,
						day,
						// These will now correctly send "" (empty strings) to the server
						am_in: e.amIn,
						am_out: e.amOut,
						pm_in: e.pmIn,
						pm_out: e.pmOut,
						hours: worked.hours,
						minutes: worked.minutes
					};
				});

			const res = await fetch('/API/POST/add-dtr-part-time', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!res.ok) throw new Error(await res.text());

			saveSuccess = true;
			onSaved?.();
			toast.success('Saved successfully');
			setTimeout(() => (saveSuccess = false), 2500);
		} catch (e: any) {
			saveError = e.message ?? 'Failed to save.';

			//@ts-ignore
			toast.error(saveError);
		} finally {
			saving = false;
		}
	}

	// ── Fetch ─────────────────────────────────────────────────────────────────────

	async function fetchDtr() {
		loading = true;
		try {
			const res = await fetch(
				`/API/GET/dtr-part-time?employee_id=${employee.employee_id}&month=${month}&year=${year}&semester=${semester}`
			);
			if (!res.ok) throw new Error(await res.text());

			const json: {
				data: Array<{
					day: number;
					am_in: string;
					am_out: string;
					pm_in: string;
					pm_out: string;
				}>;
				loads: FacultyLoad[];
			} = await res.json();

			// Populate records
			const fetched: Record<number, TimeEntry> = {};
			for (const entry of json.data) {
				fetched[entry.day] = {
					amIn: entry.am_in ?? '',
					amOut: entry.am_out ?? '',
					pmIn: entry.pm_in ?? '',
					pmOut: entry.pm_out ?? ''
				};
			}
			records = fetched;

			// Populate faculty loads
			facultyLoads = json.loads ?? [];
		} catch (e: any) {
			saveError = e.message ?? 'Failed to load DTR.';
		} finally {
			loading = false;
		}
	}

	function handleOpenChange(open: boolean) {
		dialogOpen = open;
		if (open) fetchDtr();
	}

	onMount(() => {
		console.log('DTR component mounted');
	});
</script>

<Dialog.Root open={dialogOpen} onOpenChange={handleOpenChange}>
	<Dialog.Trigger>
		<Button
			variant="ghost"
			size="sm"
			class="h-8 gap-1.5 px-2.5 text-xs font-medium text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600"
		>
			<Timer class="size-3.5" />
			DTR
		</Button>
	</Dialog.Trigger>

	<Dialog.Content class="flex max-h-[90vh] min-w-6xl flex-col overflow-hidden">
		<Dialog.Header class="shrink-0">
			<Dialog.Title class="text-base">
				Daily Time Record —
				<span class="text-emerald-600">{employee.first_name} {employee.last_name}</span>
			</Dialog.Title>
			<Dialog.Description class="text-xs text-muted-foreground">
				{monthNames[month - 1]}
				{year} · Hours are credited only on scheduled days and within scheduled windows.
			</Dialog.Description>
		</Dialog.Header>

		<!-- Column headers -->
		<div class="mt-2 shrink-0 px-1">
			<div class="mb-0.5 grid grid-cols-[2.5rem_3rem_1fr_1fr_1fr_1fr_4rem_3.5rem] gap-x-2">
				<span></span><span></span>
				<span
					class="col-span-2 border-b border-blue-200 pb-0.5 text-center text-[10px] font-semibold tracking-wide text-blue-500 uppercase"
					>Morning</span
				>
				<span
					class="col-span-2 border-b border-orange-200 pb-0.5 text-center text-[10px] font-semibold tracking-wide text-orange-500 uppercase"
					>Afternoon</span
				>
				<span></span><span></span>
			</div>
			<div class="grid grid-cols-[2.5rem_3rem_1fr_1fr_1fr_1fr_4rem_3.5rem] gap-x-2">
				<span class="text-[10px] font-medium text-muted-foreground uppercase">Day</span>
				<span></span>
				<span class="text-center text-[10px] font-medium text-muted-foreground uppercase"
					>Time In</span
				>
				<span class="text-center text-[10px] font-medium text-muted-foreground uppercase"
					>Time Out</span
				>
				<span class="text-center text-[10px] font-medium text-muted-foreground uppercase"
					>Time In</span
				>
				<span class="text-center text-[10px] font-medium text-muted-foreground uppercase"
					>Time Out</span
				>
				<span class="text-center text-[10px] font-medium text-muted-foreground uppercase"
					>Hours</span
				>
				<span class="text-center text-[10px] font-medium text-muted-foreground uppercase">Mins</span
				>
			</div>
		</div>

		<!-- Day rows -->
		<div class="mt-1 flex-1 space-y-0.5 overflow-y-auto pr-1">
			{#each dayNumbers as day}
				{@const entry = getEntry(day)}
				{@const weekend = isWeekend(day)}
				{@const scheduled = isScheduledDay(day)}
				{@const worked = getDayWorked(day)}
				{@const schedLabel = getScheduleLabel(day)}

				<div
					class="rounded-md px-1 py-0.5
					{weekend ? 'bg-red-50/50' : ''}
					{scheduled && !weekend ? 'bg-emerald-50/40' : ''}"
				>
					<div
						class="grid grid-cols-[2.5rem_3rem_1fr_1fr_1fr_1fr_4rem_3.5rem] items-center gap-x-2"
					>
						<!-- Day number -->
						<span
							class="text-right font-mono text-xs font-medium
							{weekend ? 'text-red-500' : ''}
							{scheduled && !weekend ? 'text-emerald-700' : ''}"
						>
							{day}
						</span>

						<!-- Day label -->
						<span
							class="text-[10px]
							{weekend ? 'font-semibold text-red-500' : ''}
							{scheduled && !weekend ? 'font-semibold text-emerald-600' : 'text-muted-foreground'}"
						>
							{getDayLabel(day)}
						</span>

						<!-- AM In -->
						<Input
							type="time"
							value={entry.amIn}
							oninput={(e) => setField(day, 'amIn', (e.target as HTMLInputElement).value)}
							class="h-7 px-1 text-center text-xs"
						/>

						<!-- AM Out -->
						<Input
							type="time"
							value={entry.amOut}
							oninput={(e) => setField(day, 'amOut', (e.target as HTMLInputElement).value)}
							class="h-7 px-1 text-center text-xs"
						/>

						<!-- PM In -->
						<Input
							type="time"
							value={entry.pmIn}
							oninput={(e) => setField(day, 'pmIn', (e.target as HTMLInputElement).value)}
							class="h-7 px-1 text-center text-xs"
						/>

						<!-- PM Out -->
						<Input
							type="time"
							value={entry.pmOut}
							oninput={(e) => setField(day, 'pmOut', (e.target as HTMLInputElement).value)}
							class="h-7 px-1 text-center text-xs"
						/>

						<!-- Credited Hours (read-only) -->
						<div
							class="flex h-7 items-center justify-center rounded-md font-mono text-xs font-medium
							{scheduled ? 'bg-emerald-100 text-emerald-800' : 'bg-muted/50 text-muted-foreground'}"
						>
							{worked.hours}h
						</div>

						<!-- Credited Minutes (read-only) -->
						<div
							class="flex h-7 items-center justify-center rounded-md font-mono text-xs font-medium
							{scheduled ? 'bg-emerald-100 text-emerald-800' : 'bg-muted/50 text-muted-foreground'}"
						>
							{worked.minutes}m
						</div>
					</div>

					<!-- Schedule hint under scheduled rows -->
					{#if scheduled}
						<p class="mt-0.5 pl-22 text-[9px] text-emerald-600/80">
							📅 {schedLabel}
						</p>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Footer -->
		<div class="mt-1 flex shrink-0 items-center justify-between border-t pt-3">
			<div class="text-xs text-muted-foreground">
				Total credited hours:
				<span class="font-semibold text-foreground">{totalHours}h {totalMins}m</span>
			</div>
			<div class="flex items-center gap-2">
				{#if loading}
					<span class="text-xs text-muted-foreground">Loading…</span>
				{/if}
				{#if saveSuccess}
					<span class="text-xs text-emerald-500">Saved!</span>
				{/if}
				{#if saveError}
					<span class="text-xs text-red-500">{saveError}</span>
				{/if}
				<Button
					size="sm"
					class="h-8 gap-1.5 bg-emerald-600"
					onclick={save}
					disabled={saving || loading}
				>
					<Save class="size-3.5" />
					{saving ? 'Saving…' : 'Save'}
				</Button>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
