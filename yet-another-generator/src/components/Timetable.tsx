import React from 'react';
import { TimeSlot, Teacher, Subject, Class } from '../types';

interface TimetableProps {
  timeSlots: TimeSlot[];
  teachers: Teacher[];
  subjects: Subject[];
  classes: Class[];
}

export default function Timetable({
  timeSlots,
  teachers,
  subjects,
  classes,
}: TimetableProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  const getSlotContent = (day: string, period: number, classId: string) => {
    const slot = timeSlots.find(
      (s) => s.day === day && s.period === period && s.classId === classId
    );

    if (!slot) return null;

    const subject = subjects.find((s) => s.id === slot.subjectId);
    const teacher = teachers.find((t) => t.id === slot.teacherId);

    return (
      <div className="p-2 bg-blue-50 rounded">
        <div className="font-medium text-blue-800">{subject?.name}</div>
        <div className="text-sm text-blue-600">{teacher?.name}</div>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto">
      {classes.map((cls) => (
        <div key={cls.id} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Class: {cls.name}</h3>
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-50">Day / Period</th>
                {periods.map((period) => (
                  <th key={period} className="border p-2 bg-gray-50">
                    {period}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <td className="border p-2 font-medium bg-gray-50">{day}</td>
                  {periods.map((period) => (
                    <td key={period} className="border p-2">
                      {getSlotContent(day, period, cls.id)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}