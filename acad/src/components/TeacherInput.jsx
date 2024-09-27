import React, { useState } from "react";

function TeacherInput({ teachers, setTeachers, classes, subjects }) {
    const [teacherName, setTeacherName] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");

    const addTeacher = () => {
        if (teacherName && selectedClass && selectedSubject) {
            const subject = subjects.find((sub) => sub.name === selectedSubject);
            setTeachers([
                ...teachers,
                { name: teacherName, assigned: [{ class: selectedClass, subject }] },
            ]);
            setTeacherName("");
            setSelectedClass("");
            setSelectedSubject("");
        }
    };

    return (
        <div>
            <h3>Add Teacher</h3>
            <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Teacher Name"
            />
            <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
            >
                <option value="" disabled>
                    Select Class
                </option>
                {classes.map((cls, index) => (
                    <option key={index} value={cls}>
                        {cls}
                    </option>
                ))}
            </select>
            <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
            >
                <option value="" disabled>
                    Select Subject
                </option>
                {subjects.map((sub, index) => (
                    <option key={index} value={sub.name}>
                        {sub.name}
                    </option>
                ))}
            </select>
            <button onClick={addTeacher}>Add Teacher</button>
            <div>Teachers: {teachers.map((teacher) => teacher.name).join(", ")}</div>
        </div>
    );
}

export default TeacherInput;
