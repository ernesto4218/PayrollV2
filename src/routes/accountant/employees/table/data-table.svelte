<script lang="ts" generics="TData, TValue">
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type ColumnFiltersState,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Search, ChevronLeft, ChevronRight } from 'lucide-svelte';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		filterColumn?: string;
		searchPlaceholder?: string;
	};

	let {
		data,
		columns,
		filterColumn = 'full_name',
		searchPlaceholder = 'Search employees...'
	}: DataTableProps<TData, TValue> = $props();

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			pagination = typeof updater === 'function' ? updater(pagination) : updater;
		},
		onSortingChange: (updater) => {
			sorting = typeof updater === 'function' ? updater(sorting) : updater;
		},
		onColumnFiltersChange: (updater) => {
			columnFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			}
		}
	});

	function setClassificationFilter(value: string) {
		table.getColumn('classification')?.setFilterValue(value === 'all' ? undefined : value);
	}

	const activeClassification = $derived(
		(table.getColumn('classification')?.getFilterValue() as string) ?? 'all'
	);
</script>

<div class="w-full space-y-3 p-5">
	<!-- Search + Filter -->
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div class="relative w-full sm:w-72">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
			/>
			<Input
				placeholder={searchPlaceholder}
				value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''}
				onchange={(e) => table.getColumn(filterColumn)?.setFilterValue(e.currentTarget.value)}
				oninput={(e) => table.getColumn(filterColumn)?.setFilterValue(e.currentTarget.value)}
				class="h-9 rounded-xl border-slate-200 bg-slate-50 pl-9 text-sm placeholder:text-slate-400 focus:bg-white"
			/>
		</div>

		<!-- Classification filter pills -->
		<div class="flex items-center gap-2">
			{#each [['all', 'All'], ['full-time', 'Full-time'], ['part-time', 'Part-time']] as [val, label]}
				<button
					type="button"
					onclick={() => setClassificationFilter(val)}
					class="rounded-lg border px-3.5 py-1.5 text-[12px] font-medium transition-colors
						{activeClassification === val
						? 'border-emerald-400 bg-emerald-50 text-emerald-700'
						: 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}"
				>
					{label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Table -->
	<div class="w-full overflow-hidden">
		<Table.Root class="w-full">
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row class="border-b border-slate-100 bg-slate-50/70 hover:bg-slate-50/70">
						{#each headerGroup.headers as header (header.id)}
							<Table.Head
								colspan={header.colSpan}
								class="h-11 px-5 text-[11px] font-bold tracking-widest text-slate-400 uppercase"
							>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each table.getRowModel().rows as row (row.id)}
					<Table.Row
						data-state={row.getIsSelected() && 'selected'}
						class="border-b border-slate-100 transition-colors duration-150 hover:bg-violet-50/50 data-[state=selected]:bg-violet-50"
					>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell class="h-14 px-5 text-sm font-medium text-slate-700">
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row class="hover:bg-transparent">
						<Table.Cell colspan={columns.length} class="h-36 text-center">
							<div class="flex flex-col items-center justify-center gap-2">
								<div class="rounded-full bg-slate-100 p-3">
									<Search class="size-5 text-slate-400" />
								</div>
								<span class="text-sm font-medium text-slate-400">
									{#if table.getColumn(filterColumn)?.getFilterValue() as string}
										No results for "<strong class="text-slate-600"
											>{table.getColumn(filterColumn)?.getFilterValue()}</strong
										>"
									{:else}
										No results found.
									{/if}
								</span>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<!-- Footer -->
	<div class="flex items-center justify-between px-1 pt-1">
		<p class="text-xs font-medium text-slate-400">
			Showing
			<span class="font-semibold text-slate-600">{table.getFilteredRowModel().rows.length}</span>
			of
			<span class="font-semibold text-slate-600">{data.length}</span>
			results
		</p>
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				size="sm"
				class="h-8 w-8 rounded-lg border-slate-200 p-0"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<ChevronLeft class="size-4 text-slate-500" />
			</Button>
			<span class="text-xs font-semibold text-slate-600">
				{table.getState().pagination.pageIndex + 1}
				<span class="font-normal text-slate-400">of</span>
				{table.getPageCount()}
			</span>
			<Button
				variant="outline"
				size="sm"
				class="h-8 w-8 rounded-lg border-slate-200 p-0"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				<ChevronRight class="size-4 text-slate-500" />
			</Button>
		</div>
	</div>
</div>
