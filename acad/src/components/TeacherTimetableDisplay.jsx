import React from "react";

function TeacherTimetableDisplay({ generatedTimetable, teachers }) {
    return (
        <div className="p-6 shadow-md rounded-lg cursor-pointer">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
                Teacher's POV
            </h2>
            <table className="min-w-full table-auto border border-gray-300">
                <thead className="bg-gradient-to-r from-green-400 to-blue-600 text-white">
                    <tr>
                        <th className="p-3 text-left border border-gray-300">Teacher</th>
                        <th className="p-3 text-left border border-gray-300">Day</th>
                        <th className="p-3 text-left border border-gray-300">Periods</th>
                    </tr>
                </thead>
                <tbody className="bg-cyan-200">
                    {teachers.map((teacher, teacherIndex) => (
                        <React.Fragment key={teacherIndex}>
                            {generatedTimetable.map((_, dayIndex) => (
                                <tr key={dayIndex}>
                                    {/* Render the teacher name only on the first row for each teacher */}
                                    {dayIndex === 0 && (
                                        <td
                                            rowSpan={generatedTimetable.length} // Spans the number of days
                                            className="p-3 border border-gray-300 font-semibold text-gray-700 align-top"
                                        >
                                            {teacher.name}
                                        </td>
                                    )}
                                    {/* Day column */}
                                    <td className="p-3 border border-gray-300 font-bold text-blue-600">
                                        {`Day ${dayIndex + 1}`}
                                    </td>
                                    {/* Periods column */}
                                    <td className="p-3 border border-gray-300">
                                        {generatedTimetable[dayIndex].map((daySchedule, classIndex) => (
                                            <div key={classIndex} className="mt-1">
                                                {daySchedule.map((period, periodIndex) => {
                                                    if (period === teacher.name) {
                                                        return (
                                                            <p
                                                                key={periodIndex}
                                                                className="text-gray-700"
                                                            >{`Class ${classIndex + 1} - Period ${periodIndex + 1}`}</p>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TeacherTimetableDisplay;
