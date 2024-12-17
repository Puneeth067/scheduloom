import React from 'react';
import { TimeSlot, Teacher, Subject, Class } from '../types';

interface TeacherTimetableProps {
  timeSlots: TimeSlot[];
  teachers: Teacher[];
  subjects: Subject[];
  classes: Class[];
}

export default function TeacherTimetable({
  timeSlots,
  teachers,
  subjects,
  classes,
}: TeacherTimetableProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  const getSlotContent = (day: string, period: number, teacherId: string) => {
    const slot = timeSlots.find(
      (s) => s.day === day && s.period === period && s.teacherId === teacherId
    );

    if (!slot) return null;

    const subject = subjects.find((s) => s.id === slot.subjectId);
    const cls = classes.find((c) => c.id === slot.classId);

    return (
      <div className="p-2 bg-green-50 rounded">
        <div className="font-medium text-green-800">{cls?.name}</div>
        <div className="text-sm text-green-600">{subject?.name}</div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {teachers.map((teacher) => (
        <div key={teacher.id}>
          <h3 className="text-xl font-semibold mb-4">Teacher: {teacher.name}</h3>
          <div className="overflow-x-auto">
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
                        {getSlotContent(day, period, teacher.id)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}