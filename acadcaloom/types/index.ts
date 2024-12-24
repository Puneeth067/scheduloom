export interface Subject {
  id: string;
  name: string;
  teacher_id: string; // Changed from teacherId to match database column
  color?: string;
  user_id: string;
  constraints?: {
    [day: string]: { start: number; end: number } | null;
  };
}

export interface Teacher {
  id: string;
  name: string;
  constraints: {
    [day: string]: { start: number; end: number } | null;
  };
}

export interface Class {
  id: string;
  name: string;
  subjects: string[];
  labs: { subject_id: string; duration: number }[];
}

export interface TimeSlot {
  day: string;
  period: number;
  subject_id: string | null; // Changed from subjectId to match database
  is_lab: boolean; // Changed from isLab to match database
  is_interval?: boolean; // Changed from isInterval to match database
}

export interface Timetable {
  id?: string;
  class_id: string; // Changed from classId to match database
  user_id: string;
  slots: TimeSlot[];
  created_at?: string;
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const PERIODS_PER_DAY = 8;

export interface Interval {
  day: string;
  period: number;
}
