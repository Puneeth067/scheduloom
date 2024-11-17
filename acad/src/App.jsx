import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/utils/supabaseClient';
import { fetchUserTimetable, saveTimetableToDatabase } from '@/utils/timetableService';
import ClassInput from "./components/ClassInput";
import SubjectInput from "./components/SubjectInput";
import TeacherInput from "./components/TeacherInput";
import ExcelUpload from "./components/ExcelUpload";
import TimetableGenerator from "./components/TimetableGenerator";
import TimetableDisplay from "./components/TimetableDisplay";
import TeacherTimetableDisplay from "./components/TeacherTimetableDisplay";

function App({ session: initialSession, userData: initialUserData, setUserData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [activeTab, setActiveTab] = useState("student");
  const [classIndex, setClassIndex] = useState(0);
  const [localUserData, setLocalUserData] = useState(initialUserData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add handler functions for real-time updates
  const handleClassUpdate = async (newClasses) => {
    setClasses(newClasses);
    await saveTimetableData(newClasses, subjects, teachers, generatedTimetable);
    
    // Trigger timetable regeneration if we have all necessary data
    if (newClasses.length > 0 && subjects.length > 0 && teachers.length > 0) {
      const timetableData = {
        classes: newClasses,
        subjects: subjects,
        teachers: teachers,
        schedule: generatedTimetable
      };
      await saveTimetableToDatabase(timetableData, initialUserData.id);
    }
  };

  const handleSubjectUpdate = async (newSubjects) => {
    setSubjects(newSubjects);
    await saveTimetableData(classes, newSubjects, teachers, generatedTimetable);
    
    if (classes.length > 0 && newSubjects.length > 0 && teachers.length > 0) {
      const timetableData = {
        classes: classes,
        subjects: newSubjects,
        teachers: teachers,
        schedule: generatedTimetable
      };
      await saveTimetableToDatabase(timetableData, initialUserData.id);
    }
  };

  const handleTeacherUpdate = async (newTeachers) => {
    setTeachers(newTeachers);
    await saveTimetableData(classes, subjects, newTeachers, generatedTimetable);
    
    if (classes.length > 0 && subjects.length > 0 && newTeachers.length > 0) {
      const timetableData = {
        classes: classes,
        subjects: subjects,
        teachers: newTeachers,
        schedule: generatedTimetable
      };
      await saveTimetableToDatabase(timetableData, initialUserData.id);
    }
  };

  useEffect(() => {
    const loadTimetableData = async () => {
      if (!initialSession || !initialUserData) {
        console.log('No session or user data, redirecting to login');
        navigate('/');
        return;
      }

      setLocalUserData(initialUserData);

      try {
        const { success, data } = await fetchUserTimetable(initialUserData.id);
        
        if (success && data) {
          setClasses(data.classes);
          setSubjects(data.subjects);
          setTeachers(data.teachers);
          setGeneratedTimetable(data.schedule);
        } else if (initialUserData.savedTimetable) {
          const savedData = JSON.parse(initialUserData.savedTimetable);
          if (savedData.classes) setClasses(savedData.classes);
          if (savedData.subjects) setSubjects(savedData.subjects);
          if (savedData.teachers) setTeachers(savedData.teachers);
          if (savedData.generatedTimetable) setGeneratedTimetable(savedData.generatedTimetable);
          
          const migrationData = {
            schedule: savedData.generatedTimetable,
            classes: savedData.classes,
            subjects: savedData.subjects,
            teachers: savedData.teachers,
            generatedAt: new Date().toISOString()
          };
          
          await saveTimetableToDatabase(migrationData, initialUserData.id);
        }
      } catch (err) {
        console.error('Error loading timetable data:', err);
        setError('Failed to load timetable data. Please try refreshing the page.');
      }
    };

    loadTimetableData();
  }, [initialSession, initialUserData, navigate]);

  const handleExcelData = (data) => {
    const parsedClasses = [];
    const parsedSubjects = [];
    const parsedTeachers = [];

    data.forEach((row, index) => {
      if (index === 0) return;

      const className = row[0];
      const subjectName = row[1];
      const teacherName = row[2];
      const creditHours = row[3];

      if (!parsedClasses.includes(className)) {
        parsedClasses.push(className);
      }

      if (!parsedSubjects.some((subject) => subject.name === subjectName)) {
        parsedSubjects.push({ name: subjectName, creditHr: creditHours });
      }

      if (!parsedTeachers.some((teacher) => teacher.name === teacherName)) {
        parsedTeachers.push({
          name: teacherName,
          assigned: [{ class: className, subject: { name: subjectName, creditHr: creditHours } }],
          constraints: [],
        });
      }
    });

    setClasses(parsedClasses);
    setSubjects(parsedSubjects);
    setTeachers(parsedTeachers);
    saveTimetableData(parsedClasses, parsedSubjects, parsedTeachers);
  };

  const saveTimetableData = async (
    currentClasses = classes,
    currentSubjects = subjects,
    currentTeachers = teachers,
    currentTimetable = generatedTimetable
  ) => {
    try {
      const dataToSave = {
        classes: currentClasses,
        subjects: currentSubjects,
        teachers: currentTeachers,
        generatedTimetable: currentTimetable
      };

      const { error: updateError } = await supabase
        .from('users')
        .update({
          savedTimetable: JSON.stringify(dataToSave)
        })
        .eq('id', initialUserData.id);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error saving timetable data:', err);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      // Clear all local state first
      setClasses([]);
      setSubjects([]);
      setTeachers([]);
      setGeneratedTimetable(null);
      setLocalUserData(null);
      setActiveTab("student");
      setClassIndex(0);
      
      // Sign out from Supabase
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      
      // Clear any stored data in localStorage if you have any
      localStorage.removeItem('timetableData'); // Add if you have local storage items
      
      // Navigate after successful logout
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
      setError("Failed to log out properly. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/')}
          >
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
          
        </div>
        <h1 className="text-4xl font-bold text-indigo-600">
          Timetable Management System
        </h1>
        <div />
      </div>

      <Card className="mb-12">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ClassInput setClasses={handleClassUpdate} classes={classes} />
            <SubjectInput setSubjects={handleSubjectUpdate} subjects={subjects} />
            <TeacherInput
              teachers={teachers}
              setTeachers={handleTeacherUpdate}
              classes={classes}
              subjects={subjects}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <ExcelUpload onFileUpload={handleExcelData} />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <TimetableGenerator
              classes={classes}
              subjects={subjects}
              teachers={teachers}
              setGeneratedTimetable={setGeneratedTimetable}
              userData={localUserData}
            />
          </div>
        </CardContent>
      </Card>

      {generatedTimetable && (
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Timetable</CardTitle>
            <div className="flex space-x-4">
              <Button
                onClick={() => handleTabChange("student")}
                variant={activeTab === "student" ? "default" : "ghost"}
              >
                Student POV
              </Button>
              <Button
                onClick={() => handleTabChange("teacher")}
                variant={activeTab === "teacher" ? "default" : "ghost"}
              >
                Teacher POV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === "student" && (
              <TimetableDisplay generatedTimetable={generatedTimetable} />
            )}
            {activeTab === "teacher" && (
              <TeacherTimetableDisplay
                generatedTimetable={generatedTimetable}
                teachers={teachers}
                classIndex={classIndex}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default App;