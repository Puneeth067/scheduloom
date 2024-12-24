'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
import { dataService } from '@/services/dataService';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';


export default function TimetableGenerator({ session, userData, setUserData }: TimetableGeneratorProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedView, setSelectedView] = useState<'teacher' | 'student'>('student');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [bulkUploadData, setBulkUploadData] = useState('');
  const [editingTimetable, setEditingTimetable] = useState<Timetable | null>(null);
  const [editingSlot, setEditingSlot] = useState<{ class_id: string; day: string; period: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadInitialData();
  }, [session?.user?.id]);

  const loadInitialData = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const [loadedSubjects, loadedTeachers, loadedClasses, loadedTimetables] = await Promise.all([
        dataService.getSubjects(),
        dataService.getTeachers(),
        dataService.getClasses(),
        dataService.getTimetables()
      ]);
      
      setSubjects(loadedSubjects);
      setTeachers(loadedTeachers);
      setClasses(loadedClasses);
      setTimetables(loadedTimetables);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const addSubject = async (subject: Omit<Subject, 'id' | 'color'>) => {
    try {
      const newSubject = {
        ...subject,
        teacher_id: subject.teacher_id, // Use snake_case to match database
        color: generateRandomColor(),
        user_id: session?.user?.id
      };
      
      const createdSubject = await dataService.createSubject(newSubject);
      setSubjects(prev => [...prev, createdSubject]);
      
      toast({
        title: "Success",
        description: "Subject added successfully",
      });
    } catch (error) {
      console.error('Error adding subject:', error);
      toast({
        title: "Error",
        description: "Failed to add subject",
        variant: "destructive"
      });
    }
  };

  const addTeacher = async (teacher: Omit<Teacher, 'id'>) => {
    try {
      const newTeacher = {
        ...teacher,
        user_id: session?.user?.id
      };
      
      const createdTeacher = await dataService.createTeacher(newTeacher);
      setTeachers(prev => [...prev, createdTeacher]);
      
      toast({
        title: "Success",
        description: "Teacher added successfully",
      });
    } catch (error) {
      console.error('Error adding teacher:', error);
      toast({
        title: "Error",
        description: "Failed to add teacher",
        variant: "destructive"
      });
    }
  };

  const addClass = async (classData: Omit<Class, 'id'>) => {
    try {
      const newClass = {
        ...classData,
        user_id: session?.user?.id
      };
      
      const createdClass = await dataService.createClass(newClass);
      setClasses(prev => [...prev, createdClass]);
      
      toast({
        title: "Success",
        description: "Class added successfully",
      });
    } catch (error) {
      console.error('Error adding class:', error);
      toast({
        title: "Error",
        description: "Failed to add class",
        variant: "destructive"
      });
    }
  };

  const generateTimetablesHandler = async () => {
    try {
      setLoading(true);
      const generatedTimetables = generateTimetables(classes, teachers, subjects);
      
      // Adjust the generated timetables to match database schema
      const adjustedTimetables = generatedTimetables.map(timetable => ({
        class_id: timetable.class_id, // Convert to snake_case
        user_id: session?.user?.id,
        slots: DAYS.flatMap(day =>
          Array.from({ length: PERIODS_PER_DAY + 2 }, (_, period) => {
            if (period === 2 || period === 4) {
              return {
                day,
                period,
                subject_id: null, // Convert to snake_case
                is_lab: false, // Convert to snake_case
                is_interval: true // Convert to snake_case
              };
            }
            const adjustedPeriod = period < 2 ? period : period < 4 ? period - 1 : period - 2;
            const slot = timetable.slots.find(s => s.day === day && s.period === adjustedPeriod);
            return slot
              ? {
                  day,
                  period,
                  subject_id: slot.subject_id, // Convert to snake_case
                  is_lab: slot.is_lab, // Convert to snake_case
                  is_interval: false // Convert to snake_case
                }
              : {
                  day,
                  period,
                  subject_id: null,
                  is_lab: false,
                  is_interval: false
                };
          })
        ),
      }));
  
      // Save the generated timetables to the database
      const savedTimetables = await Promise.all(
        adjustedTimetables.map(timetable => dataService.createTimetable(timetable))
      );
  
      // Convert back to camelCase for frontend use
      interface AdjustedTimetable {
        class_id: string;
        user_id: string;
        slots: {
          day: string;
          period: number;
          subject_id: string | null;
          is_lab: boolean;
          is_interval: boolean;
        }[];
      }

      interface FormattedTimetable extends Timetable {
        class_id: string;
        slots: {
          day: string;
          period: number;
          subject_id: string | null;
          is_lab: boolean;
          is_interval: boolean;
        }[];
      }

      const formattedTimetables: FormattedTimetable[] = savedTimetables.map((timetable: AdjustedTimetable) => ({
        ...timetable,
        class_id: timetable.class_id,
        slots: timetable.slots.map(slot => ({
          ...slot,
          subject_id: slot.subject_id,
          isLab: slot.is_lab,
          isInterval: slot.is_interval
        }))
      }));
  
      setTimetables(formattedTimetables);
      toast({
        title: "Success",
        description: "Timetables generated and saved successfully",
      });
    } catch (error) {
      console.error('Error generating timetables:', error);
      toast({
        title: "Error",
        description: "Failed to generate timetables",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
          class_id: 'class_1',
          slots: DAYS.flatMap(day =>
            Array.from({ length: PERIODS_PER_DAY }, (_, period) => ({
              day,
              period,
              subject_id: Math.random() > 0.5 ? 'subject_1' : 'subject_2',
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
    setTimetables(timetables.map(t => t.class_id === editedTimetable.class_id ? editedTimetable : t));
    setEditingTimetable(null);
  };

  const removeSlot = (class_id: string, day: string, period: number) => {
    setTimetables(timetables.map(timetable => {
      if (timetable.class_id === class_id) {
        return {
          ...timetable,
          slots: timetable.slots.map(slot => {
            if (slot.day === day && slot.period === period) {
              return { ...slot, subject_id: null, isLab: false };
            }
            return slot;
          })
        };
      }
      return timetable;
    }));
  };

  const editSlot = (class_id: string, day: string, period: number) => {
    setEditingSlot({ class_id, day, period });
  };

  const saveEditedSlot = (subject_id: string) => {
    if (editingSlot) {
      setTimetables(timetables.map(timetable => {
        if (timetable.class_id === editingSlot.class_id) {
          return {
            ...timetable,
            slots: timetable.slots.map(slot => {
              if (slot.day === editingSlot.day && slot.period === editingSlot.period) {
                return { ...slot, subject_id, isLab: false };
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
            timetables={selectedView === 'student' && selectedClass ? [timetables.find((t) => t.class_id === selectedClass)!] : timetables}
            subjects={subjects}
            teachers={teachers}
            classes={classes}
            view={selectedView}
            onRemoveSlot={removeSlot}
            onEditSlot={editSlot}
            onRemoveTimetable={(class_id) => setTimetables(timetables.filter(t => t.class_id !== class_id))}
          />
          {selectedView === 'student' && selectedClass && (
            <div className="left-4 mt-4">
              <Button onClick={() => startEditingTimetable(timetables.find((t) => t.class_id === selectedClass)!)} className="mr-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
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
          teachers={teachers}
          classes={classes}
          onSave={saveEditedTimetable}
          onCancel={() => setEditingTimetable(null)}
          onDelete={(timetableId) => {
            setTimetables(timetables.filter(t => t.id !== timetableId));
            setEditingTimetable(null);
          }}
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
      <Toaster />
    </div>
  );
}

interface TimetableGeneratorProps {
  session?: any;
  userData?: any;
  setUserData?: (data: any) => void;
}
