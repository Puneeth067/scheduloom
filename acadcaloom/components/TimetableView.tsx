import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timetable, Subject, Teacher, Class, DAYS, PERIODS_PER_DAY } from '../types';
import { BeakerIcon, GraduationCap } from 'lucide-react';

interface TimetableViewProps {
  timetables: Timetable[];
  subjects: Subject[];
  teachers: Teacher[];
  classes: Class[];
  view: 'student' | 'teacher';
}

export default function TimetableView({
  timetables,
  subjects,
  teachers,
  classes,
  view,
}: TimetableViewProps) {
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

  const isInterval = (period: number) => {
    return period === 2 || period === 4;
  };

  const renderCell = (slot: any, timetable: Timetable) => {
    const subject = subjects.find(s => s.id === slot?.subjectId);

    return (
      <div className="p-2">
        {slot && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">{getSubjectName(slot.subjectId)}</span>
            {slot.isLab && <BeakerIcon size={16} className="text-purple-600" />}
          </div>
        )}
      </div>
    );
  };

  if (view === 'teacher') {
    return (
      <div className="space-y-8">
        {teachers.map(teacher => (
          <Card key={teacher.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <GraduationCap className="h-6 w-6" />
                {teacher.name}'s Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">Day / Period</TableHead>
                      {Array.from({ length: PERIODS_PER_DAY }, (_, i) => (
                        <TableHead key={i} className="font-semibold text-gray-700 text-center">
                          {i + 1}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DAYS.map((day) => (
                      <TableRow key={day} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-700">{day}</TableCell>
                        {Array.from({ length: PERIODS_PER_DAY }, (_, period) => {
                          const schedule = getTeacherSchedule(teacher.id);
                          const slot = schedule[day][period];
                          if (isInterval(period)) {
                            return (
                              <TableCell key={period} className="bg-gray-100 text-center text-sm text-gray-500">
                                Break Time
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell key={period} className="text-center">
                              {slot && (
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                  <div className="font-medium text-indigo-700">{slot.className}</div>
                                  <div className="text-sm text-indigo-600">{slot.subjectName}</div>
                                </div>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {timetables.map(timetable => (
        <Card key={timetable.classId} className="bg-white shadow-lg rounded-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <GraduationCap className="h-6 w-6" />
              {getClassName(timetable.classId)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">Day / Period</TableHead>
                    {Array.from({ length: PERIODS_PER_DAY }, (_, i) => (
                      <TableHead key={i} className="font-semibold text-gray-700 text-center">
                        {i + 1}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DAYS.map((day) => (
                    <TableRow key={day} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-gray-700">{day}</TableCell>
                      {Array.from({ length: PERIODS_PER_DAY }, (_, period) => {
                        if (isInterval(period)) {
                          return (
                            <TableCell key={period} className="bg-gray-100 text-center text-sm text-gray-500">
                              Break Time
                            </TableCell>
                          );
                        }
                        const slot = timetable.slots.find((s) => s.day === day && s.period === period);
                        return (
                          <TableCell
                            key={period}
                            className="transition-all duration-200"
                            style={{ backgroundColor: slot ? `${subjects.find(s => s.id === slot.subjectId)?.color}20` : '' }}
                          >
                            {renderCell(slot, timetable)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}