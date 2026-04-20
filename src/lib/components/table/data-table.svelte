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
</script>

<div class="w-full space-y-4">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div class="relative w-full sm:w-72">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
			/>
			<Input
				placeholder={searchPlaceholder}
				value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''}
				oninput={(e) => table.getColumn(filterColumn)?.setFilterValue(e.currentTarget.value)}
				class="h-9 rounded-lg border-slate-200 bg-white pl-9 text-sm focus:ring-violet-500"
			/>
		</div>
	</div>

	<div class="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
		<div class="w-full overflow-x-auto">
			<Table.Root class="w-full">
				<Table.Header>
					{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
						<Table.Row class="border-b border-slate-100 bg-slate-50/50">
							{#each headerGroup.headers as header (header.id)}
								<Table.Head
									colspan={header.colSpan}
									class="h-11 px-5 text-[10px] font-bold tracking-widest text-slate-500 uppercase 
                  {header.colSpan > 1
										? 'border-x border-slate-100 bg-slate-100/30 text-center'
										: 'text-left'}"
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
							class="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/50"
						>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell class="h-12 border-slate-50 px-5 text-sm text-slate-600">
									<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={table.getVisibleFlatColumns().length} class="h-48 text-center">
								<div class="flex flex-col items-center justify-center gap-3">
									<div class="rounded-full bg-slate-50 p-4">
										<Search class="size-6 text-slate-300" />
									</div>
									<p class="text-sm font-medium text-slate-400">No matching employees found.</p>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</div>

	<div class="flex items-center justify-between px-2">
		<p class="text-[11px] font-medium tracking-wider text-slate-400 uppercase">
			Total Records: <span class="text-slate-700">{data.length}</span>
		</p>
		<div class="flex items-center gap-4">
			<span class="text-xs font-medium text-slate-500">
				Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
			</span>
			<div class="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon"
					class="size-8 rounded-md"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<ChevronLeft class="size-4" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					class="size-8 rounded-md"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<ChevronRight class="size-4" />
				</Button>
			</div>
		</div>
	</div>
</div>
