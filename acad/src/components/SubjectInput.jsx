import React, { useState } from "react";

function SubjectInput({ setSubjects, subjects }) {
    const [subjectName, setSubjectName] = useState("");
    const [creditHours, setCreditHours] = useState("");

    const addSubject = () => {
        if (subjectName && creditHours) {
            setSubjects([...subjects, { name: subjectName, creditHr: parseInt(creditHours) }]);
            setSubjectName("");
            setCreditHours("");
        }
    };

    return (
        <div className="pl-4 cursor-pointer"> {/* Main container with left padding */}
            <h3 className="text-lg font-bold mb-2">Add Subject</h3>
            <div className="flex items-center mb-2"> {/* Flex container for input and button */}
                <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="Subject Name"
                    id="subject_name" // Optional: Add an ID if needed
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-2" // Updated styling
                    required // Optional: Mark as required if needed
                />
                <input
                    type="number"
                    value={creditHours}
                    onChange={(e) => setCreditHours(e.target.value)}
                    placeholder="Credit Hours"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-2" // Updated styling for credit hours
                    required // Optional: Mark as required if needed
                />
                <button
                    onClick={addSubject}
                    className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Add Subject
                    </span>
                </button>
            </div>
            <div className="text-md font-bold mb-2">Subjects: {subjects.map((sub) => sub.name).join(", ")}</div> {/* Subjects content below */}
        </div>
    );
}

export default SubjectInput;
