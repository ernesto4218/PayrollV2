<script lang="ts" generics="TData, TValue">
	import {
		type ColumnDef,
		type SortingState,
		type ColumnFiltersState,
		getCoreRowModel,
		getSortedRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Info, Save, Search } from 'lucide-svelte';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		month: string;
		year: string;
		filterColumn?: string;
		searchPlaceholder?: string;
		onRefresh?: () => void;
	};

	let {
		data,
		columns,
		filterColumn = 'full_name',
		searchPlaceholder = 'Search record...',
		month,
		year,
		onRefresh
	}: DataTableProps<TData, TValue> = $props();

	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: (updater) => {
			sorting = typeof updater === 'function' ? updater(sorting) : updater;
		},
		onColumnFiltersChange: (updater) => {
			columnFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
		},
		state: {
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			}
		}
	});
</script>

<div class="w-full space-y-2">
	<div class="flex flex-row gap-2">
		<div class="relative w-full sm:w-64">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400"
			/>
			<Input
				placeholder={searchPlaceholder}
				value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''}
				onchange={(e) => table.getColumn(filterColumn)?.setFilterValue(e.currentTarget.value)}
				oninput={(e) => table.getColumn(filterColumn)?.setFilterValue(e.currentTarget.value)}
				class="h-8 rounded-lg border-slate-200 bg-white pl-8 text-xs placeholder:text-slate-400 focus:bg-white"
			/>
		</div>
	</div>

	<!-- Table -->
	<div class="w-full overflow-hidden rounded-md border border-slate-100 bg-white shadow-xs">
		<Table.Root class="w-full">
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row class="border-b border-slate-100 bg-slate-50 hover:bg-slate-50">
						{#each headerGroup.headers as header (header.id)}
							<Table.Head
								colspan={header.colSpan}
								style="width: {header.getSize()}px; min-width: {header.getSize()}px"
								class="h-8 px-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase"
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
						class="border-b border-slate-100 transition-colors duration-100 hover:bg-violet-50/50 data-[state=selected]:bg-violet-50"
					>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell
								style="width: {cell.column.getSize()}px; min-width: {cell.column.getSize()}px"
								class="h-10 px-3 text-sm font-medium text-wrap text-slate-700"
							>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{:else}
					<Table.Row class="hover:bg-transparent">
						<Table.Cell colspan={columns.length} class="h-24 text-center">
							<div class="flex flex-col items-center justify-center gap-1.5">
								<div class="rounded-full bg-slate-100 p-2">
									<Search class="size-4 text-slate-400" />
								</div>
								<span class="text-xs font-medium text-slate-400">
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

	<!-- Row count footer -->
	<p class="px-0.5 text-[11px] font-medium text-slate-400">
		Showing
		<span class="font-semibold text-slate-500">{table.getFilteredRowModel().rows.length}</span>
		of
		<span class="font-semibold text-slate-500">{data.length}</span>
		results
	</p>
</div>
