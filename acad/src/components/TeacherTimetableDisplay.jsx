import React from "react";

function TeacherTimetableDisplay({ generatedTimetable, teachers, classIndex }) {
    return (
        <div className="p-6 bg-white shadow-lg rounded-lg max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Teacher's Timetable</h2>
            <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                    <tr>
                        <th className="p-3 text-left border border-gray-300">Teacher</th>
                        <th className="p-3 text-left border border-gray-300">Day</th>
                        {[...Array(8)].map((_, periodIndex) => (
                            <th key={periodIndex} className="p-3 text-left border border-gray-300">
                                {`Period ${periodIndex + 1}`}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-gray-50">
                    {teachers.map((teacher, teacherIndex) => (
                        <React.Fragment key={teacherIndex}>
                            {generatedTimetable.map((daySchedule, dayIndex) => (
                                <tr key={dayIndex} className="hover:bg-gray-100 transition duration-200 ease-in-out">
                                    {dayIndex === 0 && (
                                        <td
                                            rowSpan={generatedTimetable.length}
                                            className="p-3 border border-gray-300 font-semibold text-gray-800 align-top"
                                        >
                                            {teacher.name}
                                        </td>
                                    )}
                                    <td className="p-3 border border-gray-300 font-bold text-blue-600">
                                        {`Day ${dayIndex + 1}`}
                                    </td>
                                    {daySchedule.map((classSchedule, periodIndex) => (
                                        <td key={periodIndex} className="p-3 border border-gray-300 text-center">
                                        {classSchedule[periodIndex] === teacher.name ? (
                                          <span className="text-gray-700 font-medium">
                                            {`Teaching Class ${classIndex + 1}`}
                                          </span>
                                        ) : (
                                          <span className="text-gray-400 italic">Free</span>
                                        )}
                                      </td>
                                    ))}
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
