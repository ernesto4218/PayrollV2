<script lang="ts">
	import { Download } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { PUBLIC_SYSTEM_NAME } from '$env/static/public';

	type FacultyLoad = {
		load_id: number;
		employee_id: number;
		fullname: string;
		subject_code: string;
		subject_name: string;
		semester: string;
		school_year: string;
		schedules: { day: string; time_start: string; time_end: string }[];
		created_at: string;
	};

	let {
		loads,
		semester,
		school_year
	}: { loads: FacultyLoad[]; semester: string; school_year: string } = $props();

	function formatTime(time: string): string {
		if (!time) return '';
		const [hourStr, minute] = time.split(':');
		let hour = parseInt(hourStr);
		const ampm = hour >= 12 ? 'PM' : 'AM';
		if (hour === 0) hour = 12;
		else if (hour > 12) hour -= 12;
		return `${hour}:${minute} ${ampm}`;
	}

	function formatSchedules(
		schedules: { day: string; time_start: string; time_end: string }[]
	): string {
		if (!schedules?.length) return '—';
		return schedules
			.map((s) => `${s.day} ${formatTime(s.time_start)} – ${formatTime(s.time_end)}`)
			.join('<br/>');
	}

	function printLoads() {
		const tableRows = loads
			.map(
				(l, i) => `
				<tr>
					<td>${i + 1}</td>
					<td>${l.employee_id}</td>
					<td>${l.fullname}</td>
					<td><span class="badge">${l.subject_code}</span></td>
					<td>${l.subject_name}</td>
					<td><span class="sem-badge sem-${l.semester.toLowerCase().replace(' ', '')}">${l.semester} Sem</span></td>
					<td>${l.school_year}</td>
					<td class="schedule-cell">${formatSchedules(l.schedules)}</td>
					<td>${l.created_at ?? '—'}</td>
				</tr>
			`
			)
			.join('');

		// Group by instructor for summary
		const byInstructor = loads.reduce(
			(acc, l) => {
				acc[l.fullname] = (acc[l.fullname] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const uniqueInstructors = Object.keys(byInstructor).length;
		const uniqueSubjects = new Set(loads.map((l) => l.subject_code)).size;
		const totalScheduleSlots = loads.reduce((sum, l) => sum + (l.schedules?.length ?? 0), 0);

		const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="UTF-8" />
			<title>Faculty Loads — ${semester} Semester ${school_year}</title>
			<style>
				* { margin: 0; padding: 0; box-sizing: border-box; }
				body { font-family: 'Segoe UI', sans-serif; color: #1e293b; background: #fff; padding: 36px; }

				.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 18px; border-bottom: 2px solid #10b981; }
				.org-name { font-size: 20px; font-weight: 700; color: #064e3b; }
				.org-sub { font-size: 11px; color: #6b7280; margin-top: 3px; }
				.print-date { font-size: 10px; color: #9ca3af; text-align: right; }
				.print-date strong { display: block; font-size: 12px; color: #374151; }

				.summary { display: flex; gap: 20px; margin-bottom: 18px; flex-wrap: wrap; }
				.stat { font-size: 11px; color: #6b7280; }
				.stat strong { color: #065f46; font-weight: 700; }

				.section-title { font-size: 10px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; margin-top: 20px; }

				table { width: 100%; border-collapse: collapse; font-size: 10px; }
				thead tr { background: #f0fdf4; }
				thead th { padding: 8px 10px; text-align: left; font-size: 7.5px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #bbf7d0; }
				tbody tr { border-bottom: 1px solid #f1f5f9; }
				tbody tr:last-child { border-bottom: none; }
				tbody td { padding: 7px 10px; color: #334155; vertical-align: middle; font-size: 10px; }
				tbody tr:nth-child(even) { background: #f9fafb; }

				.badge { display: inline-block; background: #dcfce7; color: #166534; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 4px; letter-spacing: 0.5px; }

				.sem-badge { display: inline-block; font-size: 9px; font-weight: 600; padding: 1px 6px; border-radius: 4px; }
				.sem-badge.sem-1st { background: #dbeafe; color: #1d4ed8; }
				.sem-badge.sem-2nd { background: #ede9fe; color: #6d28d9; }
				.sem-badge.sem-summer { background: #fef3c7; color: #b45309; }

				.schedule-cell { font-size: 9.5px; color: #475569; line-height: 1.7; }

				tfoot tr { background: #f0fdf4; border-top: 2px solid #bbf7d0; }
				tfoot td { padding: 8px 10px; font-weight: 700; font-size: 10px; color: #065f46; }

				.footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 9px; color: #9ca3af; }

				@media print {
					body { padding: 20px; }
					@page { margin: 1cm; size: 13in 8.5in landscape; }
				}
			</style>
		</head>
		<body>
			<div class="header">
				<div>
					<div class="org-name">Faculty Load Report</div>
					<div class="org-sub">${semester} Semester — ${school_year} &nbsp;·&nbsp; Confidential</div>
				</div>
				<div class="print-date">
					<strong>Printed on</strong>
					${new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
				</div>
			</div>

			<div class="summary">
				<div class="stat">Total Loads: <strong>${loads.length}</strong></div>
				<div class="stat">Instructors: <strong>${uniqueInstructors}</strong></div>
				<div class="stat">Subjects: <strong>${uniqueSubjects}</strong></div>
				<div class="stat">Total Schedule Slots: <strong>${totalScheduleSlots}</strong></div>
				<div class="stat">Semester: <strong>${semester}</strong></div>
				<div class="stat">School Year: <strong>${school_year}</strong></div>
			</div>

			<div class="section-title">Faculty Loads — ${semester} Semester ${school_year}</div>
			<table>
				<thead>
					<tr>
						<th>#</th>
						<th>Employee ID</th>
						<th>Instructor</th>
						<th>Code</th>
						<th>Subject</th>
						<th>Semester</th>
						<th>School Year</th>
						<th>Schedule</th>
						<th>Date Assigned</th>
					</tr>
				</thead>
				<tbody>${tableRows}</tbody>
				<tfoot>
					<tr>
						<td colspan="9">${loads.length} faculty load(s) — ${uniqueInstructors} instructor(s) — ${uniqueSubjects} subject(s)</td>
					</tr>
				</tfoot>
			</table>

			<div class="footer">
				<span>Generated by ${PUBLIC_SYSTEM_NAME}</span>
				<span>Total: ${loads.length} load(s)</span>
			</div>
		</body>
		</html>`;

		const win = window.open('', '_blank');
		if (!win) return;
		win.document.write(html);
		win.document.close();
		win.focus();
		win.print();
	}
</script>

<Button
	variant="outline"
	size="lg"
	class="gap-2 border-slate-100 font-medium text-slate-600 hover:bg-gray-100"
	onclick={printLoads}
>
	<Download class="size-4" />
	Export
</Button>
