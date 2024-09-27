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
        <div>
            <h3>Add Subject</h3>
            <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Subject Name"
            />
            <input
                type="number"
                value={creditHours}
                onChange={(e) => setCreditHours(e.target.value)}
                placeholder="Credit Hours"
            />
            <button onClick={addSubject}>Add Subject</button>
            <div>Subjects: {subjects.map((sub) => sub.name).join(", ")}</div>
        </div>
    );
}

export default SubjectInput;
