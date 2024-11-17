import React, { useState } from "react";
import {supabase} from "../utils/supabaseClient";

function TeacherInput({ teachers, setTeachers, classes, subjects }) {
    const [teacherName, setTeacherName] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [constraints, setConstraints] = useState([]);
    const [unavailableDay, setUnavailableDay] = useState("");
    const [startPeriod, setStartPeriod] = useState("");
    const [endPeriod, setEndPeriod] = useState("");
    const [maxHoursPerDay, setMaxHoursPerDay] = useState(8); // Set default to 8
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const addTeacherToSupabase = async (teacherData) => {
        setLoading(true);
        setErrorMessage("");

        const { data, error } = await supabase
            .from('teachers') // Use the existing teachers table
            .insert([teacherData]);

        setLoading(false);

        if (error) {
            console.error("Error adding teacher:", error.message);
            setErrorMessage("Failed to add teacher. Try again.");
        } else {
            console.log("Teacher added:", data);
        }
    };

    const addTeacher = async () => {
        if (teacherName && selectedClass && selectedSubject) {
            const subject = subjects.find((sub) => sub.name === selectedSubject);
            const newTeacher = {
                name: teacherName,
                assigned: [{ class: selectedClass, subject }],
                constraints: constraints,
                maxHoursPerDay: parseInt(maxHoursPerDay),
            };

            // Update the local state
            setTeachers([...teachers, newTeacher]);

            // Save the teacher in Supabase
            await addTeacherToSupabase(newTeacher);

            // Reset the input fields
            setTeacherName("");
            setSelectedClass("");
            setSelectedSubject("");
            setConstraints([]);
            setMaxHoursPerDay(8); // Reset to default 8
        }
    };

    const addConstraint = () => {
        if (unavailableDay && startPeriod && endPeriod) {
            setConstraints([
                ...constraints,
                { day: unavailableDay, start: parseInt(startPeriod), end: parseInt(endPeriod) },
            ]);
            setUnavailableDay("");
            setStartPeriod("");
            setEndPeriod("");
        }
    };

    return (
        <div className="bg-white shadow-lg p-6 rounded-lg w-72 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">Add Teacher</h3>
            <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Teacher Name"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            />
            <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            >
                <option value="" disabled>Select Class</option>
                {classes.map((cls, index) => (
                    <option key={index} value={cls}>
                        {cls}
                    </option>
                ))}
            </select>
            <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
            >
                <option value="" disabled>Select Subject</option>
                {subjects.map((sub, index) => (
                    <option key={index} value={sub.name}>
                        {sub.name}
                    </option>
                ))}
            </select>

            <div>
                <h4 className="text-lg font-semibold mb-2 text-gray-700">Add Availability Constraints</h4>
                <select
                    value={unavailableDay}
                    onChange={(e) => setUnavailableDay(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
                >
                    <option value="" disabled>Select Day</option>
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
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
                />
                <input
                    type="number"
                    value={endPeriod}
                    onChange={(e) => setEndPeriod(e.target.value)}
                    placeholder="End Period"
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
                />
                <button
                    onClick={addConstraint}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg w-full hover:bg-pink-600 transition-colors"
                >
                    Add Constraint
                </button>
                <div className="mt-4">
                    <h5 className="text-lg font-semibold text-gray-700">Current Constraints:</h5>
                    {constraints.map((constraint, index) => (
                        <div key={index} className="text-gray-600">
                            {`Day: ${constraint.day}, Start Period: ${constraint.start}, End Period: ${constraint.end}`}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2 text-gray-700">Max Teaching Hours per Day</h4>
                <input
                    type="number"
                    value={maxHoursPerDay}
                    onChange={(e) => setMaxHoursPerDay(e.target.value)}
                    placeholder="Max Hours per Day"
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                />
            </div>

            <button
                onClick={addTeacher}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg w-full mt-6 hover:bg-indigo-600 transition-colors"
                disabled={loading} // Disable button when loading
            >
                {loading ? "Adding..." : "Add Teacher"}
            </button>
            {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
        </div>
    );
}

export default TeacherInput;
