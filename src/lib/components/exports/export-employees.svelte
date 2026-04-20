<script lang="ts">
	import { Download } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Employee } from '../../../routes/accountant/employees/table/columns';
	import { env } from '$env/dynamic/public';

	let { employees }: { employees: Employee[] } = $props();

	function printEmployees() {
		const fullTime = employees.filter((e) => e.classification === 'full-time');
		const partTime = employees.filter((e) => e.classification === 'part-time');

		const formatSalary = (n: number) =>
			Number(n).toLocaleString('en-PH', {
				style: 'currency',
				currency: 'PHP',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			});

		const tableRows = (list: Employee[]) =>
			list
				.map(
					(e, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${e.employee_id}</td>
                <td>${e.first_name} ${e.middle_name ?? ''} ${e.last_name}</td>
                <td><span class="badge ${e.classification}">${e.classification}</span></td>
                <td>${formatSalary(e.salary)}</td>
                <td>${e.created_at}</td>
            </tr>
        `
				)
				.join('');

		const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <title>Employee List</title>
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

                .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; text-transform: capitalize; }
                .badge.full-time { background: #d1fae5; color: #065f46; }
                .badge.part-time { background: #e0f2fe; color: #0c4a6e; }

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
                    <div class="org-name">Employee Directory</div>
                    <div class="org-sub">Official Employee List — Confidential</div>
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
                    <div class="stat-label">Full-time</div>
                    <div class="stat-value">${fullTime.length}</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Part-time</div>
                    <div class="stat-value">${partTime.length}</div>
                </div>
            </div>

            <div class="section-title">Full-time Employees</div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Employee ID</th>
                        <th>Full Name</th>
                        <th>Classification</th>
                        <th>Monthly Salary</th>
                        <th>Date Employed</th>
                    </tr>
                </thead>
                <tbody>${tableRows(fullTime)}</tbody>
            </table>

            <div class="section-title">Part-time Employees</div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Employee ID</th>
                        <th>Full Name</th>
                        <th>Classification</th>
                        <th>Hourly Rate</th>
                        <th>Date Employed</th>
                    </tr>
                </thead>
                <tbody>${tableRows(partTime)}</tbody>
            </table>

            <div class="footer">
                <span>Generated by the ${env.PUBLIC_SYSTEM_NAME}</span>
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
	onclick={printEmployees}
>
	<Download class="size-4" />
	Export
</Button>
