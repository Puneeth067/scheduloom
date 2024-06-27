import { db } from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export  async function GET(req: Request) {
    if (req.method === 'GET') {
        const timetable = await db.timetable.findMany({
            include: {
                subject: true,
                // faculty: true
            }
        });
        // res.status(200).json(timetable);
    } else {
    }
}
