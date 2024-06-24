'use server'
import { db } from "@/lib/db";

export async function createTeacher(data: any) {
    console.log(data)
    if (!data) {
        return { error: "Confirmation email sent!" };
    }
    await db.user.create({
        data: {
            ...data,
            role: "TEACHER"
        }
    })
    console.log(data, 'data')
    return { success: "Confirmation email sent!" };


}
