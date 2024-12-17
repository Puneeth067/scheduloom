import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Calendar, RefreshCw } from 'lucide-react';
import DataEntry from './components/DataEntry';
import Timetable from './components/Timetable';
import TeacherTimetable from './components/TeacherTimetable';
import ViewToggle from './components/ViewToggle';
import { generateTimetable } from './utils/timetableGenerator';
import { Teacher, Subject, Class, TimeSlot, ViewMode } from './types';

function App() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('student');

  const handleGenerateTimetable = () => {
    if (teachers.length === 0 || subjects.length === 0 || classes.length === 0) {
      toast.error('Please add teachers, subjects, and classes first!');
      return;
    }

    const subjectsWithTeachers = subjects.filter(s => s.teacherIds.length > 0);
    if (subjectsWithTeachers.length === 0) {
      toast.error('Please assign at least one teacher to each subject!');
      return;
    }

    const newTimeSlots = generateTimetable(teachers, subjects, classes);
    setTimeSlots(newTimeSlots);
    toast.success('Timetable generated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              School Timetable Generator
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            <button
              onClick={handleGenerateTimetable}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Generate Timetable
            </button>
          </div>
        </div>

        <DataEntry
          teachers={teachers}
          subjects={subjects}
          classes={classes}
          setTeachers={setTeachers}
          setSubjects={setSubjects}
          setClasses={setClasses}
        />

        {timeSlots.length > 0 && (
          viewMode === 'student' ? (
            <Timetable
              timeSlots={timeSlots}
              teachers={teachers}
              subjects={subjects}
              classes={classes}
            />
          ) : (
            <TeacherTimetable
              timeSlots={timeSlots}
              teachers={teachers}
              subjects={subjects}
              classes={classes}
            />
          )
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;