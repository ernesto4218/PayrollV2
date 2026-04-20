import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    try {
        const res = await fetch('/API/GET/all-employees');

        if (!res.ok) {
            return { employees: [] };
        }

        const data = await res.json();
        console.log(data);
        return { employees: data };

    } catch (e) {
        console.error(e);
        return { employees: [] };
    }
};