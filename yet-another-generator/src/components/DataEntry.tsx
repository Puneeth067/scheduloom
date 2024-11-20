import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Teacher, Subject, Class } from '../types';

interface DataEntryProps {
  teachers: Teacher[];
  subjects: Subject[];
  classes: Class[];
  setTeachers: (teachers: Teacher[]) => void;
  setSubjects: (subjects: Subject[]) => void;
  setClasses: (classes: Class[]) => void;
}

export default function DataEntry({
  teachers,
  subjects,
  classes,
  setTeachers,
  setSubjects,
  setClasses,
}: DataEntryProps) {
  const addTeacher = () => {
    const name = prompt('Enter teacher name:');
    if (name) {
      setTeachers([...teachers, { id: crypto.randomUUID(), name }]);
    }
  };

  const addSubject = () => {
    const name = prompt('Enter subject name:');
    if (!name) return;
    setSubjects([...subjects, { id: crypto.randomUUID(), name, teacherIds: [] }]);
  };

  const addClass = () => {
    const name = prompt('Enter class name:');
    if (name) {
      setClasses([...classes, { id: crypto.randomUUID(), name }]);
    }
  };

  const toggleTeacherForSubject = (subjectId: string, teacherId: string) => {
    setSubjects(subjects.map(subject => {
      if (subject.id === subjectId) {
        const hasTeacher = subject.teacherIds.includes(teacherId);
        return {
          ...subject,
          teacherIds: hasTeacher
            ? subject.teacherIds.filter(id => id !== teacherId)
            : [...subject.teacherIds, teacherId]
        };
      }
      return subject;
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Teachers</h2>
          <button
            onClick={addTeacher}
            className="text-blue-600 hover:text-blue-800"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>
        <ul className="space-y-2">
          {teachers.map((teacher) => (
            <li
              key={teacher.id}
              className="flex justify-between items-center bg-gray-50 p-2 rounded"
            >
              <span>{teacher.name}</span>
              <button
                onClick={() =>
                  setTeachers(teachers.filter((t) => t.id !== teacher.id))
                }
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Subjects</h2>
          <button
            onClick={addSubject}
            className="text-blue-600 hover:text-blue-800"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>
        <ul className="space-y-4">
          {subjects.map((subject) => (
            <li key={subject.id} className="bg-gray-50 p-3 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{subject.name}</span>
                <button
                  onClick={() =>
                    setSubjects(subjects.filter((s) => s.id !== subject.id))
                  }
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm">
                <p className="text-gray-600 mb-1">Assign Teachers:</p>
                <div className="flex flex-wrap gap-2">
                  {teachers.map((teacher) => (
                    <button
                      key={teacher.id}
                      onClick={() => toggleTeacherForSubject(subject.id, teacher.id)}
                      className={`px-2 py-1 rounded text-sm ${
                        subject.teacherIds.includes(teacher.id)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {teacher.name}
                    </button>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Classes</h2>
          <button
            onClick={addClass}
            className="text-blue-600 hover:text-blue-800"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>
        <ul className="space-y-2">
          {classes.map((cls) => (
            <li
              key={cls.id}
              className="flex justify-between items-center bg-gray-50 p-2 rounded"
            >
              <span>{cls.name}</span>
              <button
                onClick={() =>
                  setClasses(classes.filter((c) => c.id !== cls.id))
                }
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}