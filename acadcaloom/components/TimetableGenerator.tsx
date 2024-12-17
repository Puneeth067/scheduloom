'use client'
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Subject, Teacher, Class, Timetable, DAYS, PERIODS_PER_DAY, Interval } from '../types';
import { generateRandomColor } from '../utils/colorGenerator';
import { generateTimetables } from '../utils/geneticAlgorithm';
import { parseExcelFile } from '../utils/excelParser';
import SubjectForm from './SubjectForm';
import TeacherForm from './TeacherForm';
import ClassForm from './ClassForm';
import TimetableView from './TimetableView';
import TimetableEditForm from './TimetableEditForm';

export default function TimetableGenerator() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [selectedView, setSelectedView] = useState<'teacher' | 'student'>('student');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [bulkUploadData, setBulkUploadData] = useState('');
  const [editingTimetable, setEditingTimetable] = useState<Timetable | null>(null);
  const [editingSlot, setEditingSlot] = useState<{ classId: string; day: string; period: number } | null>(null);
  const [intervals, setIntervals] = useState<Interval[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addSubject = (subject: Omit<Subject, 'id' | 'color'>) => {
    const newSubject: Subject = {
      ...subject,
      id: `subject_${subjects.length + 1}`,
      color: generateRandomColor(),
    };
    setSubjects([...subjects, newSubject]);
  };

  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacher,
      id: `teacher_${teachers.length + 1}`,
    };
    setTeachers([...teachers, newTeacher]);
  };

  const addClass = (classData: Omit<Class, 'id'>) => {
    const newClass: Class = {
      ...classData,
      id: `class_${classes.length + 1}`,
    };
    setClasses([...classes, newClass]);
  };

  const generateTimetablesHandler = () => {
    const generatedTimetables = generateTimetables(classes, teachers, subjects);
    setTimetables(generatedTimetables);
  };

  const handleBulkUpload = () => {
    try {
      const data = JSON.parse(bulkUploadData);
      if (data.subjects) setSubjects(data.subjects);
      if (data.teachers) setTeachers(data.teachers);
      if (data.classes) setClasses(data.classes);
      if (data.timetables) setTimetables(data.timetables);
      if (data.intervals) setIntervals(data.intervals);
      setBulkUploadData('');
    } catch (error) {
      console.error('Error parsing bulk upload data:', error);
      alert('Invalid JSON format. Please check your input and try again.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { subjects, teachers, classes, timetables, intervals } = await parseExcelFile(file);
        setSubjects(subjects);
        setTeachers(teachers);
        setClasses(classes);
        setTimetables(timetables);
        setIntervals(intervals);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Error parsing Excel file. Please check the file format and try again.');
      }
    }
  };

  const getSampleData = () => {
    const sampleData = {
      subjects: [
        { id: 'subject_1', name: 'Mathematics', color: '#FF5733', teacherId: 'teacher_1', constraints: { 'Monday': { start: 1, end: 4 } } },
        { id: 'subject_2', name: 'Physics', color: '#33FF57', teacherId: 'teacher_2', constraints: { 'Tuesday': { start: 5, end: 8 } } },
      ],
      teachers: [
        { id: 'teacher_1', name: 'John Doe', constraints: { 'Monday': { start: 1, end: 6 } } },
        { id: 'teacher_2', name: 'Jane Smith', constraints: { 'Tuesday': { start: 3, end: 8 } } },
      ],
      classes: [
        { id: 'class_1', name: 'Class 10A', subjects: ['subject_1', 'subject_2'], labs: [{ subjectId: 'subject_2', duration: 2 }] },
      ],
      timetables: [
        {
          classId: 'class_1',
          slots: DAYS.flatMap(day =>
            Array.from({ length: PERIODS_PER_DAY }, (_, period) => ({
              day,
              period,
              subjectId: Math.random() > 0.5 ? 'subject_1' : 'subject_2',
              isLab: false,
            }))
          ),
        },
      ],
      intervals: [
        { day: 'Monday', period: 4 },
        { day: 'Tuesday', period: 4 },
        { day: 'Wednesday', period: 4 },
        { day: 'Thursday', period: 4 },
        { day: 'Friday', period: 4 },
      ],
    };
    setBulkUploadData(JSON.stringify(sampleData, null, 2));
  };

  const startEditingTimetable = (timetable: Timetable) => {
    setEditingTimetable(timetable);
  };

  const saveEditedTimetable = (editedTimetable: Timetable) => {
    setTimetables(timetables.map(t => t.classId === editedTimetable.classId ? editedTimetable : t));
    setEditingTimetable(null);
  };

  const removeSlot = (classId: string, day: string, period: number) => {
    setTimetables(timetables.map(timetable => {
      if (timetable.classId === classId) {
        return {
          ...timetable,
          slots: timetable.slots.map(slot => {
            if (slot.day === day && slot.period === period) {
              return { ...slot, subjectId: null, isLab: false };
            }
            // If this is the second period of a lab, also clear it
            if (slot.day === day && slot.period === period + 1 && slot.isLab) {
              return { ...slot, subjectId: null, isLab: false };
            }
            return slot;
          })
        };
      }
      return timetable;
    }));
  };

  const editSlot = (classId: string, day: string, period: number) => {
    setEditingSlot({ classId, day, period });
  };

  const saveEditedSlot = (subjectId: string, isLab: boolean) => {
    if (editingSlot) {
      setTimetables(timetables.map(timetable => {
        if (timetable.classId === editingSlot.classId) {
          return {
            ...timetable,
            slots: timetable.slots.map(slot => {
              if (slot.day === editingSlot.day && slot.period === editingSlot.period) {
                return { ...slot, subjectId, isLab };
              }
              // If it's a lab, update the next slot as well
              if (isLab && slot.day === editingSlot.day && slot.period === editingSlot.period + 1) {
                return { ...slot, subjectId, isLab };
              }
              return slot;
            })
          };
        }
        return timetable;
      }));
      setEditingSlot(null);
    }
  };

  const addInterval = (day: string, period: number) => {
    setIntervals([...intervals, { day, period }]);
  };

  const removeInterval = (day: string, period: number) => {
    setIntervals(intervals.filter(interval => !(interval.day === day && interval.period === period)));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">College Timetable Generator</h1>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <SubjectForm onSubmit={addSubject} teachers={teachers} />
        <TeacherForm onSubmit={addTeacher} />
        <ClassForm onSubmit={addClass} subjects={subjects} />
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Bulk Upload</h2>
        <Textarea
          value={bulkUploadData}
          onChange={(e) => setBulkUploadData(e.target.value)}
          placeholder="Paste JSON data here"
          className="mb-2"
        />
        <Button onClick={handleBulkUpload} className="mr-2">Upload JSON</Button>
        <Button onClick={getSampleData} variant="outline" className="mr-2">Get Sample Data</Button>
        <Button onClick={() => fileInputRef.current?.click()} variant="outline">
          Upload Excel
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".xlsx, .xls"
          style={{ display: 'none' }}
        />
      </div>
      <Button onClick={generateTimetablesHandler} className="mb-4">Generate Timetables</Button>
      <div className="mb-4">
        <Label htmlFor="viewSelect">View</Label>
        <Select onValueChange={(value: 'teacher' | 'student') => setSelectedView(value)}>
          <SelectTrigger id="viewSelect">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student View</SelectItem>
            <SelectItem value="teacher">Teacher View</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {selectedView === 'student' && (
        <div className="mb-4">
          <Label htmlFor="classSelect">Class</Label>
          <Select onValueChange={(value: string) => setSelectedClass(value)}>
            <SelectTrigger id="classSelect">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {timetables.length > 0 && (
        <div className="mb-4">
          <TimetableView
            timetables={selectedView === 'student' && selectedClass ? [timetables.find((t) => t.classId === selectedClass)!] : timetables}
            subjects={subjects}
            teachers={teachers}
            classes={classes}
            view={selectedView}
            intervals={intervals}
            onRemoveSlot={removeSlot}
            onEditSlot={editSlot}
          />
          {selectedView === 'student' && selectedClass && (
            <div className="mt-4">
              <Button onClick={() => startEditingTimetable(timetables.find((t) => t.classId === selectedClass)!)} className="mr-2">
                Edit Timetable
              </Button>
            </div>
          )}
        </div>
      )}
      {editingTimetable && (
        <TimetableEditForm
          timetable={editingTimetable}
          subjects={subjects}
          onSave={saveEditedTimetable}
          onCancel={() => setEditingTimetable(null)}
        />
      )}
      {editingSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Edit Slot</h3>
            <Select onValueChange={(value) => saveEditedSlot(value, false)}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => saveEditedSlot(editingSlot.subjectId, true)} className="mt-2 mr-2">
              Set as Lab
            </Button>
            <Button onClick={() => setEditingSlot(null)} className="mt-2">Cancel</Button>
          </div>
        </div>
      )}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Manage Intervals</h2>
        <div className="flex space-x-2 mb-2">
          <Select onValueChange={(value) => setEditingSlot({ ...editingSlot!, day: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((day) => (
                <SelectItem key={day} value={day}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setEditingSlot({ ...editingSlot!, period: parseInt(value) })}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: PERIODS_PER_DAY }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>{i + 1}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => addInterval(editingSlot!.day, editingSlot!.period)}>Add Interval</Button>
        </div>
        <div>
          {intervals.map((interval, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <span>{interval.day} - Period {interval.period + 1}</span>
              <Button variant="outline" size="sm" onClick={() => removeInterval(interval.day, interval.period)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

