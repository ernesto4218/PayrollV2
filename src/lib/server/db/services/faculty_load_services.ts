import { getFacultyLoads, getFacultyLoadSchedules, insertFacultyLoad, insertFacultyLoadSchedules, replaceSchedules, updateFacultyLoadRecord,  } from "../repositories/faculty-load.repo";

export async function addFacultyLoad(
    employee_id: number,
    subject_id: number,
    semester: string,
    school_year: string,
    schedules: { day: string; time_start: string; time_end: string }[]
) {
    const load_id = await insertFacultyLoad(employee_id, subject_id, semester, school_year);

    if (!load_id) {
        return { state: false, message: 'Failed to assign faculty load.' };
    }

    const scheduled = await insertFacultyLoadSchedules(load_id, schedules);

    if (!scheduled) {
        return { state: false, message: 'Failed to insert schedules.' };
    }

    return { state: true, message: 'Faculty load assigned successfully.' };
}

export async function getAllFacultyLoads(semester: string, school_year: string) {
    const loads = await getFacultyLoads(semester, school_year);

    const result = await Promise.all(
        loads.map(async (load) => ({
            ...load,
            schedules: await getFacultyLoadSchedules(load.load_id)
        }))
    );

    return result;
}

export async function updateFacultyLoad(
    load_id: number,
    employee_id: number,
    subject_id: number,
    semester: string,
    school_year: string,
    schedules: { day: string; time_start: string; time_end: string }[]
) {
    const updated = await updateFacultyLoadRecord(load_id, employee_id, subject_id, semester, school_year);

    if (!updated) {
        return { state: false, message: 'Failed to update faculty load.' };
    }

    const scheduled = await replaceSchedules(load_id, schedules);

    if (!scheduled) {
        return { state: false, message: 'Failed to update schedules.' };
    }

    return { state: true, message: 'Faculty load updated successfully.' };
}