<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import {
		GraduationCap,
		BookOpen,
		Clock,
		Check,
		Search,
		X,
		Plus,
		Trash2,
		Pencil
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { FacultyLoad } from '../../../../routes/accountant/faculty-load/table/columns';

	type Props = {
		load: FacultyLoad;
		onRefresh: () => void;
	};

	let { load, onRefresh }: Props = $props();

	let open = $state(false);
	let loading = $state(false);

	// Teacher search state
	let teacherQuery = $state(load.fullname);
	let selectedTeacher: { employee_id: number | string; fullname: string } | null = $state({
		employee_id: load.employee_id,
		fullname: load.fullname
	});
	let showTeacherDropdown = $state(false);
	let teacherResults: { employee_id: number | string; fullname: string }[] = $state([]);
	let teacherLoading = $state(false);

	// Subject search state
	let subjectQuery = $state(`${load.subject_code} — ${load.subject_name}`);
	let selectedSubject: { id: number | string; code: string; name: string } | null = $state({
		id: load.subject_id,
		code: load.subject_code,
		name: load.subject_name
	});
	let showSubjectDropdown = $state(false);
	let subjectResults: { id: number | string; code: string; name: string }[] = $state([]);
	let subjectLoading = $state(false);

	type ScheduleSlot = {
		id: string;
		day: string;
		time_start: string;
		time_end: string;
	};

	const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const SEMESTERS = ['1st', '2nd', 'Summer'];

	const currentYear = new Date().getFullYear();
	const SCHOOL_YEARS = Array.from({ length: currentYear - 2014 + 1 }, (_, i) => {
		const y = 2014 + i;
		return `${y}-${y + 1}`;
	}).reverse();

	// Pre-populate schedules from existing load
	let schedules: ScheduleSlot[] = $state(
		load.schedules.length
			? load.schedules.map((s: { day: any; time_start: any; time_end: any }) => ({
					id: crypto.randomUUID(),
					day: s.day,
					time_start: s.time_start,
					time_end: s.time_end
				}))
			: [{ id: crypto.randomUUID(), day: '', time_start: '', time_end: '' }]
	);

	let form = $state({
		semester: load.semester,
		school_year: load.school_year
	});

	let errors: Record<string, string> = $state({});

	// Reset to original values when dialog opens
	$effect(() => {
		if (open) {
			teacherQuery = load.fullname;
			selectedTeacher = { employee_id: load.employee_id, fullname: load.fullname };
			subjectQuery = `${load.subject_code} — ${load.subject_name}`;
			selectedSubject = { id: load.subject_id, code: load.subject_code, name: load.subject_name };
			schedules = load.schedules.map((s) => ({
				id: crypto.randomUUID(),
				day: s.day,
				time_start: s.time_start.slice(0, 5), // "08:00:00" → "08:00"
				time_end: s.time_end.slice(0, 5)
			}));
			form = { semester: load.semester, school_year: load.school_year };
			errors = {};

			console.log('Load data:', load);
			console.log('Schedules:', load.schedules);
		}
	});

	// Teacher search
	let teacherTimeout: ReturnType<typeof setTimeout>;
	async function searchTeachers(query: string) {
		clearTimeout(teacherTimeout);
		if (!query.trim()) {
			teacherResults = [];
			showTeacherDropdown = false;
			return;
		}
		teacherTimeout = setTimeout(async () => {
			teacherLoading = true;
			try {
				const res = await fetch(`/API/GET/search-employees?q=${encodeURIComponent(query)}`);
				if (res.ok) {
					teacherResults = await res.json();
					showTeacherDropdown = true;
				}
			} catch {
				teacherResults = [];
			} finally {
				teacherLoading = false;
			}
		}, 300);
	}

	function selectTeacher(t: { employee_id: number | string; fullname: string }) {
		selectedTeacher = t;
		teacherQuery = t.fullname;
		showTeacherDropdown = false;
		teacherResults = [];
		if (errors.teacher) delete errors.teacher;
	}

	function clearTeacher() {
		selectedTeacher = null;
		teacherQuery = '';
		teacherResults = [];
		showTeacherDropdown = false;
	}

	// Subject search
	let subjectTimeout: ReturnType<typeof setTimeout>;
	async function searchSubjects(query: string) {
		clearTimeout(subjectTimeout);
		if (!query.trim()) {
			subjectResults = [];
			showSubjectDropdown = false;
			return;
		}
		subjectTimeout = setTimeout(async () => {
			subjectLoading = true;
			try {
				const res = await fetch(`/API/GET/search-subjects?q=${encodeURIComponent(query)}`);
				if (res.ok) {
					subjectResults = await res.json();
					showSubjectDropdown = true;
				}
			} catch {
				subjectResults = [];
			} finally {
				subjectLoading = false;
			}
		}, 300);
	}

	function selectSubject(s: { id: number | string; code: string; name: string }) {
		selectedSubject = s;
		subjectQuery = `${s.code} — ${s.name}`;
		showSubjectDropdown = false;
		subjectResults = [];
		if (errors.subject) delete errors.subject;
	}

	function clearSubject() {
		selectedSubject = null;
		subjectQuery = '';
		subjectResults = [];
		showSubjectDropdown = false;
	}

	function addSchedule() {
		schedules = [...schedules, { id: crypto.randomUUID(), day: '', time_start: '', time_end: '' }];
	}

	function removeSchedule(id: string) {
		if (schedules.length === 1) return;
		schedules = schedules.filter((s) => s.id !== id);
	}

	function validate() {
		errors = {};
		if (!selectedTeacher) errors.teacher = 'Please select a teacher.';
		if (!selectedSubject) errors.subject = 'Please select a subject.';
		if (!form.semester) errors.semester = 'Semester is required.';
		if (!form.school_year) errors.school_year = 'School year is required.';
		schedules.forEach((s, i) => {
			if (!s.day) errors[`day_${i}`] = 'Day is required.';
			if (!s.time_start) errors[`time_start_${i}`] = 'Start time is required.';
			if (!s.time_end) errors[`time_end_${i}`] = 'End time is required.';
		});
		return Object.keys(errors).length === 0;
	}

	async function handleSubmit() {
		if (!validate()) return;
		loading = true;

		const payload = {
			employee_id: selectedTeacher!.employee_id,
			subject_id: selectedSubject!.id,
			semester: form.semester,
			school_year: form.school_year,
			schedules: schedules.map(({ day, time_start, time_end }) => ({ day, time_start, time_end }))
		};

		try {
			const res = await fetch(`/API/PUT/edit-faculty-load/${load.load_id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message ?? `Server error ${res.status}`);
			}

			toast.success('Faculty load updated successfully!');
			open = false;
			onRefresh();
		} catch (e: any) {
			toast.error(e.message || 'Failed to update. Please try again.');
		} finally {
			loading = false;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<button
				{...props}
				class="inline-flex items-center gap-1.5 rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-[12px] font-medium text-indigo-600 transition hover:bg-indigo-100 hover:text-indigo-700"
			>
				<Pencil class="size-3" />
				Edit
			</button>
		{/snippet}
	</Dialog.Trigger>

	<Dialog.Content class="max-w-lg overflow-hidden rounded-2xl border border-indigo-100 p-0">
		<!-- Header -->
		<Dialog.Header
			class="flex-row items-start gap-3.5 border-b border-indigo-100 bg-indigo-50 px-6 pt-6 pb-4"
		>
			<div class="flex h-10 w-10 min-w-10 items-center justify-center rounded-xl bg-indigo-500">
				<Pencil class="size-5 text-white" />
			</div>
			<div>
				<Dialog.Title class="text-base font-semibold text-indigo-950">
					Edit faculty load
				</Dialog.Title>
				<Dialog.Description class="mt-0.5 text-[13px] text-gray-500">
					Update subject, schedule, or semester for this load
				</Dialog.Description>
			</div>
		</Dialog.Header>

		<!-- Body -->
		<div class="flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-6 py-5">
			<!-- Teacher Search -->
			<div class="flex flex-col gap-1.5">
				<div class="flex items-center gap-1.5">
					<GraduationCap class="size-3 text-indigo-500" />
					<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase"
						>Teacher</Label
					>
				</div>
				{#if selectedTeacher}
					<div
						class="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2"
					>
						<div
							class="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white"
						>
							{selectedTeacher.fullname.charAt(0).toUpperCase()}
						</div>
						<span class="text-[13px] font-medium text-indigo-800">{selectedTeacher.fullname}</span>
						<span class="text-[11px] text-indigo-500">· ID {selectedTeacher.employee_id}</span>
					</div>
				{/if}
				{#if errors.teacher}
					<span class="text-[12px] text-red-500">{errors.teacher}</span>
				{/if}
			</div>

			<!-- Subject Search -->
			<div class="flex flex-col gap-1.5">
				<div class="flex items-center gap-1.5">
					<BookOpen class="size-3 text-indigo-500" />
					<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase"
						>Subject</Label
					>
				</div>
				<div class="relative">
					{#if showSubjectDropdown}
						<div
							class="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
						>
							{#if subjectLoading}
								<div class="flex items-center gap-2 px-3.5 py-2.5 text-[13px] text-gray-400">
									<div
										class="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-500"
									></div>
									Searching...
								</div>
							{:else if subjectResults.length === 0}
								<div class="px-3.5 py-2.5 text-[13px] text-gray-400">No subjects found.</div>
							{:else}
								{#each subjectResults as s}
									<button
										type="button"
										class="flex w-full items-center gap-3 px-3.5 py-2.5 text-left hover:bg-indigo-50"
										onclick={() => selectSubject(s)}
									>
										<div
											class="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-600"
										>
											<BookOpen class="size-3.5" />
										</div>
										<div>
											<div class="text-[13px] font-medium text-gray-800">{s.name}</div>
											<div class="text-[11px] text-gray-400">{s.code}</div>
										</div>
									</button>
								{/each}
							{/if}
						</div>
					{/if}
				</div>
				{#if selectedSubject}
					<div
						class="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2"
					>
						<div
							class="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white"
						>
							<BookOpen class="size-3" />
						</div>
						<span class="text-[13px] font-medium text-indigo-800">{selectedSubject.name}</span>
						<span class="text-[11px] text-indigo-500">· {selectedSubject.code}</span>
					</div>
				{/if}
				{#if errors.subject}
					<span class="text-[12px] text-red-500">{errors.subject}</span>
				{/if}
			</div>

			<!-- Semester & School Year -->
			<div class="flex gap-3">
				<div class="flex flex-1 flex-col gap-1.5">
					<div class="flex items-center gap-1.5">
						<GraduationCap class="size-3 text-indigo-500" />
						<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase"
							>Semester</Label
						>
					</div>
					<select
						disabled
						bind:value={form.semester}
						class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[13.5px] text-gray-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
					>
						<option value="" disabled>Select semester</option>
						{#each SEMESTERS as s}
							<option value={s}>{s} Semester</option>
						{/each}
					</select>
					{#if errors.semester}
						<span class="text-[12px] text-red-500">{errors.semester}</span>
					{/if}
				</div>

				<div class="flex flex-1 flex-col gap-1.5">
					<div class="flex items-center gap-1.5">
						<GraduationCap class="size-3 text-indigo-500" />
						<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase"
							>School Year</Label
						>
					</div>
					<select
						disabled
						bind:value={form.school_year}
						class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[13.5px] text-gray-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
					>
						<option value="" disabled>Select school year</option>
						{#each SCHOOL_YEARS as y}
							<option value={y}>{y}</option>
						{/each}
					</select>
					{#if errors.school_year}
						<span class="text-[12px] text-red-500">{errors.school_year}</span>
					{/if}
				</div>
			</div>

			<!-- Schedule Slots -->
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-1.5">
						<Clock class="size-3 text-indigo-500" />
						<Label class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase"
							>Schedule</Label
						>
					</div>
					<button
						type="button"
						onclick={addSchedule}
						class="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-600 hover:bg-indigo-100"
					>
						<Plus class="size-3" /> Add slot
					</button>
				</div>

				{#each schedules as slot, i (slot.id)}
					<div class="rounded-xl border border-gray-200 bg-gray-50 p-3">
						<div class="mb-2 flex items-center justify-between">
							<span class="text-[11px] font-semibold text-gray-400 uppercase">Slot {i + 1}</span>
							{#if schedules.length > 1}
								<button
									type="button"
									onclick={() => removeSchedule(slot.id)}
									class="text-gray-400 hover:text-red-500"
								>
									<Trash2 class="size-3.5" />
								</button>
							{/if}
						</div>

						<div class="flex flex-col gap-2">
							<div class="flex flex-col gap-1">
								<span class="text-[11px] text-gray-400">Day</span>
								<select
									bind:value={slot.day}
									class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[13.5px] text-gray-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
								>
									<option value="" disabled>Select a day</option>
									{#each DAYS as day}
										<option value={day}>{day}</option>
									{/each}
								</select>
								{#if errors[`day_${i}`]}
									<span class="text-[12px] text-red-500">{errors[`day_${i}`]}</span>
								{/if}
							</div>

							<div class="flex items-center gap-2">
								<div class="flex flex-1 flex-col gap-1">
									<span class="text-[11px] text-gray-400">Start time</span>
									<input
										type="time"
										bind:value={slot.time_start}
										class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[13.5px] text-gray-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
									/>
									{#if errors[`time_start_${i}`]}
										<span class="text-[12px] text-red-500">{errors[`time_start_${i}`]}</span>
									{/if}
								</div>
								<div class="mt-4 text-gray-400">→</div>
								<div class="flex flex-1 flex-col gap-1">
									<span class="text-[11px] text-gray-400">End time</span>
									<input
										type="time"
										bind:value={slot.time_end}
										class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-[13.5px] text-gray-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none"
									/>
									{#if errors[`time_end_${i}`]}
										<span class="text-[12px] text-red-500">{errors[`time_end_${i}`]}</span>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Footer -->
		<div class="flex justify-end gap-2 bg-gray-50 px-6 py-4">
			<Dialog.Close>
				<Button
					variant="outline"
					class="rounded-lg border-gray-200 text-[13.5px] text-gray-600 hover:bg-gray-100"
					disabled={loading}
				>
					Cancel
				</Button>
			</Dialog.Close>
			<Button
				class="gap-2 rounded-lg bg-indigo-500 text-[13.5px] text-white shadow-sm shadow-indigo-200 hover:bg-indigo-600"
				onclick={handleSubmit}
				disabled={loading}
			>
				{#if loading}
					<div
						class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
					></div>
					Saving...
				{:else}
					<Check class="size-3.5" />
					Save changes
				{/if}
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
