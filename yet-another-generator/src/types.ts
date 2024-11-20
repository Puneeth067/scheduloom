export interface Teacher {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  teacherIds: string[]; // Changed to support multiple teachers
}

export interface Class {
  id: string;
  name: string;
}

export interface TimeSlot {
  day: string;
  period: number;
  classId: string;
  subjectId: string;
  teacherId: string;
}

export type ViewMode = 'student' | 'teacher';