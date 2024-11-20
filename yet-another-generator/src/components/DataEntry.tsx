import React, { useState } from 'react';
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
  const [editingAvailability, setEditingAvailability] = useState<string | null>(null);
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const addTeacher = () => {
    const name = prompt('Enter teacher name:');
    if (name) {
      setTeachers([...teachers, { id: crypto.randomUUID(), name, availability: {} }]);
    }
  };

  const addSubject = () => {
    const name = prompt('Enter subject name:');
    if (name) {
      setSubjects([...subjects, { id: crypto.randomUUID(), name, teacherIds: [] }]);
    }
  };

  const addClass = () => {
    const name = prompt('Enter class name:');
    if (name) {
      setClasses([...classes, { id: crypto.randomUUID(), name }]);
    }
  };

  const toggleTeacherForSubject = (subjectId: string, teacherId: string) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === subjectId
          ? {
            ...subject,
            teacherIds: subject.teacherIds.includes(teacherId)
              ? subject.teacherIds.filter((id) => id !== teacherId)
              : [...subject.teacherIds, teacherId],
          }
          : subject
      )
    );
  };

  const updateAvailability = (teacherId: string, day: string, hours: string[]) => {
    setTeachers(
      teachers.map((teacher) =>
        teacher.id === teacherId
          ? {
            ...teacher,
            availability: {
              ...teacher.availability,
              [day]: hours,
            },
          }
          : teacher
      )
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Teachers Section */}
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
              className="bg-gray-50 p-3 rounded flex flex-col space-y-2"
            >
              <div className="flex justify-between items-center">
                <span>{teacher.name}</span>
                <button
                  onClick={() =>
                    setTeachers(teachers.filter((t) => t.id !== teacher.id))
                  }
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() =>
                  setEditingAvailability(
                    editingAvailability === teacher.id ? null : teacher.id
                  )
                }
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {editingAvailability === teacher.id
                  ? 'Close Availability Editor'
                  : 'Edit Availability'}
              </button>

              {editingAvailability === teacher.id && (
                <div className="mt-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="mb-2">
                      <span className="block text-sm font-medium text-gray-700">
                        {day}
                      </span>
                      <input
                        type="text"
                        placeholder="Enter hours (e.g., 9-10, 11-12)"
                        value={
                          teacher.availability[day]
                            ? teacher.availability[day].join(', ')
                            : ''
                        }
                        onChange={(e) =>
                          updateAvailability(
                            teacher.id,
                            day,
                            e.target.value.split(',').map((hour) => hour.trim())
                          )
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Subjects Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Subjects</h2>
          <button title='hello'
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
                <button title='hello'
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
                      onClick={() =>
                        toggleTeacherForSubject(subject.id, teacher.id)
                      }
                      className={`px-2 py-1 rounded text-sm ${subject.teacherIds.includes(teacher.id)
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

      {/* Classes Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Classes</h2>
          <button title='hello'
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
                title='hello'
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
