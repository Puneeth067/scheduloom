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
        <div className="bg-white shadow-lg p-6 rounded-lg w-72 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Add Subject</h3>
            <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Subject Name"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            />
            <input
                type="number"
                value={creditHours}
                onChange={(e) => setCreditHours(e.target.value)}
                placeholder="Credit Hours"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            />
            <button
                onClick={addSubject}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg w-full hover:bg-indigo-600 transition-colors"
            >
                Add Subject
            </button>
            <div className="text-gray-600 mt-4">Subjects: {subjects.map((sub) => sub.name).join(", ")}</div>
        </div>
    );
}

export default SubjectInput;
