import type { Employee } from "../../../routes/accountant/travel-order/table/columns";

export async function fetchTravelOrders(month: string, year: string) {
    const res = await fetch(`/API/GET/filter-travel-order?month=${month}&year=${year}`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json() as Promise<Employee[]>;
}