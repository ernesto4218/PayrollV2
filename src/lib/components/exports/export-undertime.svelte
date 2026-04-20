<script lang="ts">
	import { Download } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { PUBLIC_SYSTEM_NAME } from '$env/static/public';

	type EmployeeUndertime = {
		employee_id: number;
		first_name: string;
		middle_name: string | null;
		last_name: string;
		undertime_id: number | null;
		hours: number | null;
		minutes: number | null;
		month: string | null;
		year: number | null;
		date_updated: string | null;
	};

	let { employees, month, year }: { employees: EmployeeUndertime[]; month: string; year: string } =
		$props();

	function printUndertime() {
		const formatName = (e: EmployeeUndertime) =>
			`${e.first_name} ${e.middle_name ? e.middle_name + ' ' : ''}${e.last_name}`;

		const formatUndertime = (h: number | null, m: number | null) => {
			const hrs = h ?? 0;
			const mins = m ?? 0;
			if (hrs === 0 && mins === 0) return '<span class="no-undertime">—</span>';
			return `${hrs}h ${mins}m`;
		};

		const totalHours = employees.reduce((sum, e) => sum + (e.hours ?? 0), 0);
		const totalMinutes = employees.reduce((sum, e) => sum + (e.minutes ?? 0), 0);
		const normalizedHours = totalHours + Math.floor(totalMinutes / 60);
		const normalizedMinutes = totalMinutes % 60;

		const withUndertime = employees.filter((e) => (e.hours ?? 0) > 0 || (e.minutes ?? 0) > 0);

		const tableRows = employees
			.map(
				(e, i) => `
			<tr>
				<td>${i + 1}</td>
				<td>${e.employee_id}</td>
				<td>${formatName(e)}</td>
				<td class="undertime-cell">${formatUndertime(e.hours, e.minutes)}</td>
				<td>${e.date_updated ? new Date(e.date_updated).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}</td>
			</tr>
		`
			)
			.join('');

		const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="UTF-8" />
			<title>Undertime Report — ${month} ${year}</title>
			<style>
				* { margin: 0; padding: 0; box-sizing: border-box; }
				body { font-family: 'Segoe UI', sans-serif; color: #1e293b; background: #fff; padding: 40px; }

				.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #10b981; }
				.org-name { font-size: 22px; font-weight: 700; color: #064e3b; }
				.org-sub { font-size: 12px; color: #6b7280; margin-top: 3px; }
				.print-date { font-size: 11px; color: #9ca3af; text-align: right; }
				.print-date strong { display: block; font-size: 13px; color: #374151; }

				.summary { display: flex; gap: 16px; margin-bottom: 28px; }
				.stat { flex: 1; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 18px; }
				.stat-label { font-size: 10px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
				.stat-value { font-size: 22px; font-weight: 700; color: #065f46; margin-top: 4px; }

				.section-title { font-size: 11px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; margin-top: 24px; }

				table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
				thead tr { background: #f0fdf4; }
				thead th { padding: 10px 12px; text-align: left; font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #d1fae5; }
				tbody tr { border-bottom: 1px solid #f1f5f9; }
				tbody tr:last-child { border-bottom: none; }
				tbody td { padding: 10px 12px; color: #334155; vertical-align: middle; }
				tbody tr:nth-child(even) { background: #fafafa; }

				.undertime-cell { font-weight: 600; color: #b45309; }
				.no-undertime { color: #cbd5e1; }

				.footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 10px; color: #9ca3af; }

				@media print {
					body { padding: 24px; }
					@page { margin: 1cm; size: A4; }
				}
			</style>
		</head>
		<body>
			<div class="header">
				<div>
					<div class="org-name">Undertime Report</div>
					<div class="org-sub">${month.charAt(0).toUpperCase() + month.slice(1)} ${year} — Confidential</div>
				</div>
				<div class="print-date">
					<strong>Printed on</strong>
					${new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
				</div>
			</div>

			<div class="summary">
				<div class="stat">
					<div class="stat-label">Total Employees</div>
					<div class="stat-value">${employees.length}</div>
				</div>
				<div class="stat">
					<div class="stat-label">With Undertime</div>
					<div class="stat-value">${withUndertime.length}</div>
				</div>
				<div class="stat">
					<div class="stat-label">Total Undertime</div>
					<div class="stat-value">${normalizedHours}h ${normalizedMinutes}m</div>
				</div>
			</div>

			<div class="section-title">Employee Undertime — ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}</div>
			<table>
				<thead>
					<tr>
						<th>#</th>
						<th>Employee ID</th>
						<th>Full Name</th>
						<th>Undertime</th>
						<th>Last Updated</th>
					</tr>
				</thead>
				<tbody>${tableRows}</tbody>
			</table>

			<div class="footer">
				<span>Generated by ${PUBLIC_SYSTEM_NAME}</span>
				<span>Total: ${employees.length} employee(s)</span>
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
	onclick={printUndertime}
>
	<Download class="size-4" />
	Export
</Button>
