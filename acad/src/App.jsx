import React, { useState } from "react";
import ClassInput from "./components/ClassInput";
import SubjectInput from "./components/SubjectInput";
import TeacherInput from "./components/TeacherInput";
import TimetableGenerator from "./components/TimetableGenerator";
import TimetableDisplay from "./components/TimetableDisplay";

function App() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [generatedTimetable, setGeneratedTimetable] = useState(null);

  return (
    <div>
      <h1>Dynamic Teacher Timetable</h1>

      <ClassInput setClasses={setClasses} classes={classes} />
      <SubjectInput setSubjects={setSubjects} subjects={subjects} />
      <TeacherInput
        teachers={teachers}
        setTeachers={setTeachers}
        classes={classes}
        subjects={subjects}
      />

      <TimetableGenerator
        classes={classes}
        subjects={subjects}
        teachers={teachers}
        setGeneratedTimetable={setGeneratedTimetable}
      />

      {generatedTimetable && (
        <TimetableDisplay generatedTimetable={generatedTimetable} />
      )}
    </div>
  );
}

export default App;
