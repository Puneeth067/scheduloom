import { db } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';


export  async function POST(req: Request) {
    // Input faculties and classrooms
    const faculties = [
        { name: "Dr. Smith", subjects: ["Math", "Physics"] },
        { name: "Ms. Johnson", subjects: ["Chemistry", "Biology"] },
    ];
    const classrooms = ["Room 101", "Room 102", "Room 103"];
    const hoursPerDay = 7;

    // Clear existing timetable
    await db.timetable.deleteMany({});

    const schedule: any[] = [];

    for (const faculty of faculties) {
        for (const subject of faculty.subjects) {
            for (let day = 0; day < 5; ++day) {
                for (let hour = 0; hour < hoursPerDay; ++hour) {
                    if ((hour + 1) % 3 === 0) continue; // Skip interval hours

                    for (const classroom of classrooms) {
                        const isAvailable = await db.timetable.findFirst({
                            where: {
                                day,
                                hour,
                                classroom
                            }
                        });

                        if (!isAvailable) {
                            const newEntry = await db.timetable.create({
                                data: {
                                    subject: { connect: { id: '84de14ca-6eec-45a6-91a7-c6826ae14d89' } },
                                    faculty: {
                                        connect: {
                                            id:'015f527d-252c-4638-a91d-cd460abe7523'
                                        }
                                    },
                                    classroom,
                                    day,
                                    hour
                                }
                            });
                            schedule.push(newEntry);
                            break;
                        }
                    }
                }
            }
        }
    }
}
