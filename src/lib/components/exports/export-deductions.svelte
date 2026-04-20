<script lang="ts">
	import { Download } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { PUBLIC_SYSTEM_NAME } from '$env/static/public';

	type EmployeeDeduction = {
		employee_id: number;
		first_name: string;
		middle_name: string | null;
		last_name: string;
		deduction_id: number | null;
		sss: number | null;
		pagibig: number | null;
		microdev: number | null;
		month: string | null;
		year: number | null;
		date_updated: string | null;
	};

	let { employees, month, year }: { employees: EmployeeDeduction[]; month: string; year: string } =
		$props();

	function printDeductions() {
		const formatName = (e: EmployeeDeduction) =>
			`${e.first_name} ${e.middle_name ? e.middle_name + ' ' : ''}${e.last_name}`;

		const formatAmount = (val: number | null) =>
			val ? `₱${val.toFixed(2)}` : '<span class="no-value">—</span>';

		const toNum = (val: number | null) => val ?? 0;

		const totalSSS = employees.reduce((sum, e) => sum + toNum(e.sss), 0);
		const totalPagibig = employees.reduce((sum, e) => sum + toNum(e.pagibig), 0);
		const totalMicrodev = employees.reduce((sum, e) => sum + toNum(e.microdev), 0);
		const grandTotal = totalSSS + totalPagibig + totalMicrodev;

		const withDeductions = employees.filter(
			(e) => toNum(e.sss) > 0 || toNum(e.pagibig) > 0 || toNum(e.microdev) > 0
		);

		const tableRows = employees
			.map(
				(e, i) => `
			<tr>
				<td>${i + 1}</td>
				<td>${e.employee_id}</td>
				<td>${formatName(e)}</td>
				<td class="amount-cell">${formatAmount(e.sss)}</td>
				<td class="amount-cell">${formatAmount(e.pagibig)}</td>
				<td class="amount-cell">${formatAmount(e.microdev)}</td>
				<td class="amount-cell total-cell">₱${(toNum(e.sss) + toNum(e.pagibig) + toNum(e.microdev)).toFixed(2)}</td>
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
			<title>Deductions Report — ${month} ${year}</title>
			<style>
				* { margin: 0; padding: 0; box-sizing: border-box; }
				body { font-family: 'Segoe UI', sans-serif; color: #1e293b; background: #fff; padding: 40px; }

				.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 20px; border-bottom: 2px solid #10b981; }
				.org-name { font-size: 22px; font-weight: 700; color: #064e3b; }
				.org-sub { font-size: 12px; color: #6b7280; margin-top: 3px; }
				.print-date { font-size: 11px; color: #9ca3af; text-align: right; }
				.print-date strong { display: block; font-size: 13px; color: #374151; }

				.summary { display: flex; gap: 24px; margin-bottom: 20px; flex-wrap: wrap; }
				.stat { font-size: 12px; color: #6b7280; }
				.stat strong { color: #065f46; font-weight: 700; }

				.section-title { font-size: 11px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; margin-top: 24px; }

				table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
				thead tr { background: #f0fdf4; }
				thead th { padding: 10px 12px; text-align: left; font-size: 8px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #d1fae5; }
				tbody tr { border-bottom: 1px solid #f1f5f9; }
				tbody tr:last-child { border-bottom: none; }
				tbody td { padding: 10px 12px; color: #334155; vertical-align: middle; }
				tbody tr:nth-child(even) { background: #fafafa; }

				.amount-cell { font-weight: 600; color: #b45309; text-align: right; }
				.total-cell { color: #065f46; border-left: 1px solid #d1fae5; }
				.no-value { color: #cbd5e1; font-weight: 400; }

				tfoot tr { background: #f0fdf4; border-top: 2px solid #d1fae5; }
				tfoot td { padding: 10px 12px; font-weight: 700; font-size: 12px; color: #065f46; text-align: right; }
				tfoot td:first-child { text-align: left; color: #374151; }

				.footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 10px; color: #9ca3af; }

				@media print {
					body { padding: 24px; }
					@page { margin: 1cm; size: 8.5in 13in; }
				}
			</style>
		</head>
		<body>
			<div class="header">
				<div>
					<div class="org-name">Deductions Report</div>
					<div class="org-sub">${month.charAt(0).toUpperCase() + month.slice(1)} ${year} — Confidential</div>
				</div>
				<div class="print-date">
					<strong>Printed on</strong>
					${new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
				</div>
			</div>

			<div class="summary">
					<div class="stat">Total Employees: <strong>${employees.length}</strong></div>
					<div class="stat">With Deductions: <strong>${withDeductions.length}</strong></div>
					<div class="stat">SSS: <strong>₱${totalSSS.toFixed(2)}</strong></div>
					<div class="stat">Pag-IBIG: <strong>₱${totalPagibig.toFixed(2)}</strong></div>
					<div class="stat">Microdev: <strong>₱${totalMicrodev.toFixed(2)}</strong></div>
					<div class="stat">Grand Total: <strong>₱${grandTotal.toFixed(2)}</strong></div>
			</div>

			<div class="section-title">Employee Deductions — ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}</div>
			<table>
				<thead>
					<tr>
						<th>#</th>
						<th>Employee ID</th>
						<th>Full Name</th>
						<th style="text-align:right">SSS</th>
						<th style="text-align:right">Pag-IBIG</th>
						<th style="text-align:right">Microdev</th>
						<th style="text-align:right">Total</th>
						<th>Last Updated</th>
					</tr>
				</thead>
				<tbody>${tableRows}</tbody>
				<tfoot>
					<tr>
						<td colspan="3">Totals</td>
						<td>₱${totalSSS.toFixed(2)}</td>
						<td>₱${totalPagibig.toFixed(2)}</td>
						<td>₱${totalMicrodev.toFixed(2)}</td>
						<td>₱${grandTotal.toFixed(2)}</td>
						<td></td>
					</tr>
				</tfoot>
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
	onclick={printDeductions}
>
	<Download class="size-4" />
	Export
</Button>
