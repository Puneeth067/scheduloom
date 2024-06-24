'use server'
import { db } from "@/lib/db";

export async function createSubject(data: any) {
    console.log(data)
    if (!data) {
        return { error: "Confirmation email sent!" };
    }
    const createdSubject = await db.$transaction(async (tx) => {
        // Step 1: Create the subject within the transaction
        const subject = await tx.subject.create({
            data: {
                name: data.name,
                code: data.code,
            },
        });

        // Step 2: Retrieve the id of the created subject
        const subjectId = subject.id;

        // Step 3: Create entries in UserSubject table to link users to the subject within the transaction
        const userSubjectPromises = data.userIds.map((userId:string) =>
            tx.userSubject.create({
                data: {
                    userId,
                    subjectId,
                },
            })
        );

        // Execute all userSubject creation promises concurrently within the transaction
        await Promise.all(userSubjectPromises);

        // Return the created subject (if needed)
        return subject;
    });
    console.log(data,'data')
    return { success: "Confirmation email sent!" };


}
