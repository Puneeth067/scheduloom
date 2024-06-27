"use client"
import { useEffect, useState } from 'react';
import { PrismaClient, Timetable } from '@prisma/client';

const Home: React.FC = () => {
    const [schedule, setSchedule] = useState<Timetable[]>([]);

    useEffect(() => {
        const fetchSchedule = async () => {
            const response = await fetch('/api/timetable');
            const data: Timetable[] = await response.json();
            setSchedule(data);
        };

        fetchSchedule();
    }, []);

    const generateTimetable = async () => {
        await fetch('/api/generate', { method: 'POST' });
        const response = await fetch('/api/timetable');
        const data: Timetable[] = await response.json();
        setSchedule(data);
    };

    return (
        <div>
            <h1>Generated Timetable</h1>
            <button onClick={generateTimetable}>Generate Timetable</button>
            <table>
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Hour</th>
                        <th>Subject</th>
                        <th>Faculty</th>
                        <th>Classroom</th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((cls, index) => (
                        <tr key={index}>
                            <td>{["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][cls.day]}</td>
                            <td>{["8:30-9:30", "9:30-10:30", "10:30-11:30", "11:30-12:30", "12:30-1:30", "1:30-2:30", "2:30-3:30"][cls.hour]}</td>
                            <td>{cls.subject.name}</td>
                            <td>{cls.faculty.name}</td>
                            <td>{cls.classroom}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Home;
