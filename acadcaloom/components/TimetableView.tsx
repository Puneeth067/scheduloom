import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Timetable, Subject, Teacher, Class, DAYS, PERIODS_PER_DAY } from '../types';
import { Trash2, Pencil, FlaskRoundIcon as Flask } from 'lucide-react'; // Added Flask icon

interface TimetableViewProps {
  timetables: Timetable[];
  subjects: Subject[];
  teachers: Teacher[];
  classes: Class[];
  view: 'student' | 'teacher';
  onRemoveTimetable: (classId: string) => void;
  onRemoveSlot: (classId: string, day: string, period: number) => void; // Updated
  onEditSlot: (classId: string, day: string, period: number) => void; // Updated
}

export default function TimetableView({ timetables, subjects, teachers, classes, view, onRemoveTimetable, onRemoveSlot, onEditSlot }: TimetableViewProps) { // Updated
  const getSubjectName = (subjectId: string | null) => {
    if (!subjectId) return '';
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.name : '';
  };

  const getClassName = (classId: string) => {
    const classData = classes.find((c) => c.id === classId);
    return classData ? classData.name : '';
  };

  const getTeacherSchedule = (teacherId: string) => {
    const schedule: { [key: string]: { className: string; subjectName: string }[] } = {};
    DAYS.forEach(day => {
      schedule[day] = Array(PERIODS_PER_DAY).fill(null);
    });

    timetables.forEach(timetable => {
      timetable.slots.forEach(slot => {
        const subject = subjects.find(s => s.id === slot.subjectId);
        if (subject && subject.teacherId === teacherId) {
          schedule[slot.day][slot.period] = {
            className: getClassName(timetable.classId),
            subjectName: subject.name,
          };
        }
      });
    });

    return schedule;
  };

  const renderCell = (slot: any, timetable: Timetable, day: string, period: number) => {
    const subject = subjects.find(s => s.id === slot?.subjectId);
    const isInterval = (period === 2 || period === 4);

    if (isInterval) {
      return <TableCell key={period} className="bg-gray-200">Interval</TableCell>;
    }

    return (
      <TableCell
        key={period}
        style={{ backgroundColor: subject?.color }}
        className="relative group"
      >
        {slot ? (
          <>
            {getSubjectName(slot.subjectId)}
            {slot.isLab && <Flask size={16} className="inline-block ml-1" />}
            <div className="absolute top-0 right-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="p-1 text-blue-500 hover:text-blue-700"
                onClick={() => onEditSlot(timetable.classId, day, period)}
              >
                <Pencil size={12} />
              </button>
              <button
                className="p-1 text-gray-500 hover:text-red-500"
                onClick={() => onRemoveSlot(timetable.classId, day, period)}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </>
        ) : ''}
      </TableCell>
    );
  };

  if (view === 'teacher') {
    return (
      <div>
        {teachers.map(teacher => (
          <div key={teacher.id} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{teacher.name}'s Schedule</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day / Period</TableHead>
                  {Array.from({ length: PERIODS_PER_DAY }, (_, i) => (
                    <TableHead key={i}>{i + 1}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {DAYS.map((day) => (
                  <TableRow key={day}>
                    <TableCell>{day}</TableCell>
                    {Array.from({ length: PERIODS_PER_DAY }, (_, period) => {
                      const schedule = getTeacherSchedule(teacher.id);
                      const slot = schedule[day][period];
                      return (
                        <TableCell key={period}>
                          {slot ? `${slot.className} - ${slot.subjectName}` : ''}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {timetables.map(timetable => (
        <div key={timetable.classId} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{getClassName(timetable.classId)}</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day / Period</TableHead>
                {Array.from({ length: PERIODS_PER_DAY + 2 }, (_, i) => (
                  <TableHead key={i}>{i + 1}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {DAYS.map((day) => (
                <TableRow key={day}>
                  <TableCell>{day}</TableCell>
                  {Array.from({ length: PERIODS_PER_DAY + 2 }, (_, period) => {
                    const adjustedPeriod = period < 2 ? period : period < 4 ? period - 1 : period - 2;
                    const slot = timetable.slots.find((s) => s.day === day && s.period === adjustedPeriod);
                    return renderCell(slot, timetable, day, period);
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}

