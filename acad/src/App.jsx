import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from './utils/supabaseClient';

import ClassInput from "./components/ClassInput";
import SubjectInput from "./components/SubjectInput";
import TeacherInput from "./components/TeacherInput";
import ExcelUpload from "./components/ExcelUpload";
import TimetableGenerator from "./components/TimetableGenerator";
import TimetableDisplay from "./components/TimetableDisplay";
import TeacherTimetableDisplay from "./components/TeacherTimetableDisplay";

function App() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [activeTab, setActiveTab] = useState("student");
  const [classIndex, setClassIndex] = useState(0);

  const handleExcelData = (data) => {
    // Example parsing: assuming that the first row contains the headers,
    // and subsequent rows contain class, subject, and teacher data.
    const parsedClasses = [];
    const parsedSubjects = [];
    const parsedTeachers = [];

    data.forEach((row, index) => {
      if (index === 0) return; // Skip the header row

      const className = row[0];
      const subjectName = row[1];
      const teacherName = row[2];
      const creditHours = row[3]; // assuming credit hours are in the 4th column

      // Add to classes if not already added
      if (!parsedClasses.includes(className)) {
        parsedClasses.push(className);
      }

      // Add to subjects if not already added
      if (!parsedSubjects.some((subject) => subject.name === subjectName)) {
        parsedSubjects.push({ name: subjectName, creditHr: creditHours });
      }

      // Add to teachers
      if (!parsedTeachers.some((teacher) => teacher.name === teacherName)) {
        parsedTeachers.push({
          name: teacherName,
          assigned: [{ class: className, subject: { name: subjectName, creditHr: creditHours } }],
          constraints: [], // Initially no constraints
        });
      }
    });

    setClasses(parsedClasses);
    setSubjects(parsedSubjects);
    setTeachers(parsedTeachers);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setGeneratedTimetable(null);
      setActiveTab("student");
      window.location.href = "/"; // Redirect to the Auth component
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
        <h1 className="text-4xl font-bold text-indigo-600">
          Timetable Management System
        </h1>
        <div />
      </div>

      <Card className="mb-12">
        <CardContent >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ClassInput setClasses={setClasses} classes={classes} />
            <SubjectInput setSubjects={setSubjects} subjects={subjects} />
            <TeacherInput
              teachers={teachers}
              setTeachers={setTeachers}
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