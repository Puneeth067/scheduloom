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
        <div className="pl-4 cursor-pointer" > {/* Main container with left padding */}
            <h3 className="text-lg font-bold mb-2">Add Teacher</h3>
            <div className="flex items-center mb-2"> {/* Flex container for input */}
                <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    placeholder="Teacher Name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-2"
                    required
                />
                <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white mr-2"
                >
                    <option value="" disabled>Select Class</option>
                    {classes.map((cls, index) => (
                        <option key={index} value={cls}>{cls}</option>
                    ))}
                </select>
                <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white mr-2"
                >
                    <option value="" disabled>Select Subject</option>
                    {subjects.map((sub, index) => (
                        <option key={index} value={sub.name}>{sub.name}</option>
                    ))}
                </select>
            </div>

            {/* Adding Unavailability Constraints */}
            <div className="mb-4">
                <h4 className="text-lg font-bold mb-2">Add Unavailability Constraints</h4>
                <div className="flex items-center mb-2">
                    <select
                        value={unavailableDay}
                        onChange={(e) => setUnavailableDay(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white mr-2"
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
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white mr-2"
                        required
                    />
                    <input
                        type="number"
                        value={endPeriod}
                        onChange={(e) => setEndPeriod(e.target.value)}
                        placeholder="End Period"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white mr-2"
                        required
                    />
                    <button
                        onClick={addConstraint}
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            Add Unavailability
                        </span>
                    </button>
                </div>
                <h5 className="text-md font-bold">Current Unavailability Constraints:</h5>
                <div>
                    {constraints.map((constraint, index) => (
                        <div key={index} className="text-sm font-bold">
                            {`Day: ${constraint.day}, Start Period: ${constraint.start}, End Period: ${constraint.end}`}
                        </div>
                    ))}
                </div>
            </div>

            {/* Max Teaching Hours per Day */}
            <div className="max-w-xs mx-0 mt-6 pl-4"> {/* Set margin to 0 and added left padding */}
                <label
                    htmlFor="max-hours-input"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Max Teaching Hours per Day
                </label>
                <div className="relative flex items-center max-w-[8rem]">
                    <button
                        type="button"
                        onClick={() => setMaxHoursPerDay(maxHoursPerDay - 1)}
                        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-l-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                    >
                        <svg
                            className="w-3 h-3 text-gray-900 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 2"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h16"
                            />
                        </svg>
                    </button>
                    <input
                        type="number"
                        id="max-hours-input"
                        value={maxHoursPerDay}
                        onChange={(e) => setMaxHoursPerDay(e.target.value)}
                        className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Max Hours per Day"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setMaxHoursPerDay(maxHoursPerDay + 1)}
                        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-r-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                    >
                        <svg
                            className="w-3 h-3 text-gray-900 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 18"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 1v16M1 9h16"
                            />
                        </svg>
                    </button>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Please select the maximum teaching hours per day.
                </p>
            </div>

            {/* Add some margin above the button */}
            <button
                onClick={addTeacher}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 mt-4 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
            >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    Add Teacher
                </span>
            </button>

        </div>
    );
}

export default TeacherInput;
