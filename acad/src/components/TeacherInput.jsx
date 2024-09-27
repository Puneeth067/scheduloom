import React, { useState } from "react";

function TeacherInput({ teachers, setTeachers, classes, subjects }) {
    const [teacherName, setTeacherName] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [constraints, setConstraints] = useState([]); // For storing unavailable periods
    const [unavailableDay, setUnavailableDay] = useState("");
    const [startPeriod, setStartPeriod] = useState("");
    const [endPeriod, setEndPeriod] = useState("");
    const [maxHoursPerDay, setMaxHoursPerDay] = useState(0); // Max hours per day

    const addTeacher = () => {
        if (teacherName && selectedClass && selectedSubject) {
            const subject = subjects.find((sub) => sub.name === selectedSubject);
            setTeachers([
                ...teachers,
                {
                    name: teacherName,
                    assigned: [{ class: selectedClass, subject }],
                    constraints: constraints, // Only unavailable periods are added here
                    maxHoursPerDay: parseInt(maxHoursPerDay), // Optional max hours per day constraint
                },
            ]);
            setTeacherName("");
            setSelectedClass("");
            setSelectedSubject("");
            setConstraints([]);
            setMaxHoursPerDay(0);
        }
    };

    const addConstraint = () => {
        if (unavailableDay && startPeriod && endPeriod) {
            setConstraints([
                ...constraints,
                { day: parseInt(unavailableDay), start: parseInt(startPeriod), end: parseInt(endPeriod) },
            ]);
            setUnavailableDay("");
            setStartPeriod("");
            setEndPeriod("");
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

            {/* Adding Unavailability Constraints */}
            <div>
                <h4>Add Unavailability Constraints</h4>
                <select
                    value={unavailableDay}
                    onChange={(e) => setUnavailableDay(e.target.value)}
                >
                    <option value="" disabled>
                        Select Day
                    </option>
                    <option value="0">Monday</option>
                    <option value="1">Tuesday</option>
                    <option value="2">Wednesday</option>
                    <option value="3">Thursday</option>
                    <option value="4">Friday</option>
                    <option value="5">Saturday</option>
                </select>
                <input
                    type="number"
                    value={startPeriod}
                    onChange={(e) => setStartPeriod(e.target.value)}
                    placeholder="Start Period"
                />
                <input
                    type="number"
                    value={endPeriod}
                    onChange={(e) => setEndPeriod(e.target.value)}
                    placeholder="End Period"
                />
                <button onClick={addConstraint}>Add Unavailability</button>
                <div>
                    <h5>Current Unavailability Constraints:</h5>
                    {constraints.map((constraint, index) => (
                        <div key={index}>
                            {`Day: ${constraint.day}, Start Period: ${constraint.start}, End Period: ${constraint.end}`}
                        </div>
                    ))}
                </div>
            </div>

            {/* Max Teaching Hours per Day */}
            <div>
                <h4>Max Teaching Hours per Day</h4>
                <input
                    type="number"
                    value={maxHoursPerDay}
                    onChange={(e) => setMaxHoursPerDay(e.target.value)}
                    placeholder="Max Hours per Day"
                />
            </div>

            <button onClick={addTeacher}>Add Teacher</button>
        </div>
    );
}

export default TeacherInput;
