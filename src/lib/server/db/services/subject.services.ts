import { getSubjectByCode, insertSubject } from '$lib/server/db/repositories/subjects.repo';

export async function addSubject(
    code: string,
    name: string,
) {
    const existing = await getSubjectByCode(code);

    if (existing) {
        return { state: false, message: "Subject code already exists." };
    }

    const result = await insertSubject(code, name);

    if (result) {
        return { state: true, message: "Subject added successfully." };
    } else {
        return { state: false, message: "Failed to add subject." };
    }
}