import React, { useState } from "react";
import ClassInput from "./components/ClassInput";
import SubjectInput from "./components/SubjectInput";
import TeacherInput from "./components/TeacherInput";
import TimetableGenerator from "./components/TimetableGenerator";
import TimetableDisplay from "./components/TimetableDisplay";
import TeacherTimetableDisplay from "./components/TeacherTimetableDisplay";

function App() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);
  const [activeTab, setActiveTab] = useState("student");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <h1>Dynamic Teacher and Student Timetable</h1>
      {generatedTimetable}
      {/* Input forms for adding data */}
      <ClassInput setClasses={setClasses} classes={classes} />
      <SubjectInput setSubjects={setSubjects} subjects={subjects} />
      <TeacherInput
        teachers={teachers}
        setTeachers={setTeachers}
        classes={classes}
        subjects={subjects}
      />

      {/* Generate Timetable Button */}
      <TimetableGenerator
        classes={classes}
        subjects={subjects}
        teachers={teachers}
        setGeneratedTimetable={setGeneratedTimetable}
      />
      

      {/* Tab navigation */}
      {generatedTimetable && (
        <div>
          <button
            onClick={() => handleTabChange("student")}
            className={activeTab === "student" ? "active-tab" : ""}
          >
            Student POV
          </button>
          <button
            onClick={() => handleTabChange("teacher")}
            className={activeTab === "teacher" ? "active-tab" : ""}
          >
            Teacher POV
          </button>

          {/* Conditional rendering based on the selected tab */}
          {activeTab === "student" && (
            <TimetableDisplay generatedTimetable={generatedTimetable} />
          )}
          {activeTab === "teacher" && (
            <TeacherTimetableDisplay
              generatedTimetable={generatedTimetable}
              teachers={teachers}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
