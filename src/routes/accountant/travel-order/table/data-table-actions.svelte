<script lang="ts">
	import type { Employee } from './columns.ts';
	import DeleteTravelOrder from '$lib/components/dialogs/travel-order/delete-travel-order.svelte';

	let { employee, onRefresh }: { employee: Employee; onRefresh?: () => void } = $props();
</script>

<div class="flex items-center gap-1.5">
	<DeleteTravelOrder
		travelOrderId={employee.travel_order_id}
		employeeName={`${employee.first_name} ${employee.middle_name ?? ''} ${employee.last_name}`.trim()}
		purpose={employee.purpose}
		message={employee.message}
		onDeleted={onRefresh}
	/>
</div>
