'use client'
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Subject, Teacher, Class, Timetable, DAYS, PERIODS_PER_DAY } from '../types';
import { generateRandomColor } from '../utils/colorGenerator';
import { generateTimetables } from '../utils/geneticAlgorithm';
import { parseExcelFile } from '../utils/excelParser';
import SubjectForm from './SubjectForm';
import TeacherForm from './TeacherForm';
import ClassForm from './ClassForm';
import TimetableView from './TimetableView';
import TimetableEditForm from './TimetableEditForm';
import { Calendar, User, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';


export default function TimetableGenerator({ session, userData, setUserData }: TimetableGeneratorProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [selectedView, setSelectedView] = useState<'teacher' | 'student'>('student');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [bulkUploadData, setBulkUploadData] = useState('');
  const [editingTimetable, setEditingTimetable] = useState<Timetable | null>(null);
  const [editingSlot, setEditingSlot] = useState<{ classId: string; day: string; period: number } | null>(null);
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
    // Adjust the generated timetables to include interval slots
    const adjustedTimetables = generatedTimetables.map(timetable => ({
      ...timetable,
      slots: DAYS.flatMap(day =>
        Array.from({ length: PERIODS_PER_DAY + 2 }, (_, period) => {
          if (period === 2 || period === 4) {
            return { day, period, subjectId: null, isLab: false, isInterval: true };
          }
          const adjustedPeriod = period < 2 ? period : period < 4 ? period - 1 : period - 2;
          const slot = timetable.slots.find(s => s.day === day && s.period === adjustedPeriod);
          return slot ? { ...slot, period } : { day, period, subjectId: null, isLab: false, isInterval: false };
        })
      ),
    }));
    setTimetables(adjustedTimetables);
  };

  const handleBulkUpload = () => {
    try {
      const data = JSON.parse(bulkUploadData);
      if (data.subjects) setSubjects(data.subjects);
      if (data.teachers) setTeachers(data.teachers);
      if (data.classes) setClasses(data.classes);
      if (data.timetables) setTimetables(data.timetables);
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
        const { subjects, teachers, classes, timetables } = await parseExcelFile(file);
        setSubjects(subjects);
        setTeachers(teachers);
        setClasses(classes);
        setTimetables(timetables);
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
        { id: 'class_1', name: 'Class 10A', subjects: ['subject_1', 'subject_2'], labs: [] },
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

  const saveEditedSlot = (subjectId: string) => {
    if (editingSlot) {
      setTimetables(timetables.map(timetable => {
        if (timetable.classId === editingSlot.classId) {
          return {
            ...timetable,
            slots: timetable.slots.map(slot => {
              if (slot.day === editingSlot.day && slot.period === editingSlot.period) {
                return { ...slot, subjectId, isLab: false };
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
          College Timetable Generator
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <SubjectForm onSubmit={addSubject} teachers={teachers} />
          <TeacherForm onSubmit={addTeacher} />
          <ClassForm onSubmit={addClass} subjects={subjects} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Bulk Upload</h2>
          <Textarea
            value={bulkUploadData}
            onChange={(e) => setBulkUploadData(e.target.value)}
            placeholder="Paste JSON data here"
            className="mb-4 min-h-[200px] border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleBulkUpload} className="bg-purple-600 hover:bg-purple-700">
              Upload JSON
            </Button>
            <Button onClick={getSampleData} variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
              Get Sample Data
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Upload Excel
            </Button>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".xlsx, .xls"
          style={{ display: 'none' }}
        />
      </div>
      <Card className="w-full max-w-6xl mx-auto bg-white shadow-lg mb-6">
      <CardContent className="pt-6 pb-6">
        <div className="space-y-6">
          {/* Generate Button */}
          <Button 
            onClick={generateTimetablesHandler}
            className="w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-medium flex items-center justify-center gap-2"
            size="lg"
          >
            <Calendar className="w-5 h-5" />
            Generate Timetables
          </Button>

          {/* View Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              View Type
            </Label>
            <Select onValueChange={(value: 'teacher' | 'student') => setSelectedView(value)}>
              <SelectTrigger 
                id="viewSelect"
                className="w-full border-gray-200 focus:border-indigo-500"
              >
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Student View
                  </div>
                </SelectItem>
                <SelectItem value="teacher">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Teacher View
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Class Selection - Only shown for student view */}
          {selectedView === 'student' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Select Class
              </Label>
              <Select onValueChange={(value: string) => setSelectedClass(value)}>
                <SelectTrigger 
                  id="classSelect"
                  className="w-full border-gray-200 focus:border-indigo-500"
                >
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {cls.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
      {timetables.length > 0 && (
        <div className="mb-4">
          <TimetableView
            timetables={selectedView === 'student' && selectedClass ? [timetables.find((t) => t.classId === selectedClass)!] : timetables}
            subjects={subjects}
            teachers={teachers}
            classes={classes}
            view={selectedView}
            onRemoveSlot={removeSlot}
            onEditSlot={editSlot}
            onRemoveTimetable={(classId) => setTimetables(timetables.filter(t => t.classId !== classId))}
          />
          {selectedView === 'student' && selectedClass && (
            <div className="left-4 mt-4">
              <Button onClick={() => startEditingTimetable(timetables.find((t) => t.classId === selectedClass)!)} className="mr-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
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
            <Select onValueChange={saveEditedSlot}>
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
            <Button onClick={() => setEditingSlot(null)} className="mt-2">Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface TimetableGeneratorProps {
  session?: any;
  userData?: any;
  setUserData?: (data: any) => void;
}
