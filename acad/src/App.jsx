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
    <div className="min-h-screen w-full flex flex-col justify-between bg-cyan-950 cursor-pointer">
      <div className="flex flex-col items-start my-8 p-4 w-full shadow-md	">
        {/* Scheduloom Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white pr-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            Scheduloom
          </span>
        </h1>

        {/* Subtitle Text */}
        <div className="subtitle-container w-full">
          <p className="text-md md:text-md font-medium text-blue-800 dark:text-blue-300 opacity-5">
            {`Create scalable, optimized schedules for both teachers and students with ease.`.split(' ').map((word, index) => (
              <span key={index}>
                {word}
                {index < `Create scalable, optimized schedules for both teachers and students with ease.`.split(' ').length - 1 && <span className="mr-2"></span>}
              </span>
            ))}
          </p>
        </div>
      </div>

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
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pl-4 pt-4">
          <ul
            className="flex flex-wrap -mb-px text-sm font-medium text-center"
            role="tablist"
          >
            {/* Student POV Tab */}
            <li className="me-2" role="presentation">
              <button
                onClick={() => handleTabChange("student")}
                className={`relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 ${
                  activeTab === "student"
                    ? "border-b-2 border-purple-600"
                    : ""
                }`}
                type="button"
                role="tab"
                aria-selected={activeTab === "student"}
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 cursor-pointer">
                  Student POV
                </span>
              </button>
            </li>

            {/* Teacher POV Tab */}
            <li className="me-2" role="presentation">
              <button
                onClick={() => handleTabChange("teacher")}
                className={`relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 ${
                  activeTab === "teacher"
                    ? "border-b-2 border-purple-600"
                    : ""
                }`}
                type="button"
                role="tab"
                aria-selected={activeTab === "teacher"}
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 cursor-pointer">
                  Teacher POV
                </span>
              </button>
            </li>
          </ul>

          {/* Conditional rendering based on the selected tab */}
          <div className="mt-4">
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
        </div>
      )}




    </div>
  );
  }
  

export default App;
