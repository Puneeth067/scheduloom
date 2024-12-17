import { Teacher, Subject, Class, TimeSlot } from '../types';

export function generateTimetable(
  teachers: Teacher[],
  subjects: Subject[],
  classes: Class[]
): TimeSlot[] {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];
  const timeSlots: TimeSlot[] = [];

  const isTeacherAvailable = (teacherId: string, day: string, period: number): boolean => {
    return !timeSlots.some(
      (slot) => slot.day === day && slot.period === period && slot.teacherId === teacherId
    );
  };

  classes.forEach((cls) => {
    days.forEach((day) => {
      periods.forEach((period) => {
        // Get all subjects with their available teachers for this slot
        const availableSubjects = subjects.flatMap(subject => 
          subject.teacherIds
            .filter(teacherId => isTeacherAvailable(teacherId, day, period))
            .map(teacherId => ({
              subject,
              teacherId
            }))
        );

        if (availableSubjects.length > 0) {
          const randomChoice = availableSubjects[
            Math.floor(Math.random() * availableSubjects.length)
          ];
          
          timeSlots.push({
            day,
            period,
            classId: cls.id,
            subjectId: randomChoice.subject.id,
            teacherId: randomChoice.teacherId,
          });
        }
      });
    });
  });

  return timeSlots;
}