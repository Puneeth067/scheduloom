import React from "react";

function TimetableDisplay({ generatedTimetable }) {
    return (
        <div className="p-6 shadow-md rounded-lg cursor-pointer">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">
                Student's POV
            </h2>
            <table className="min-w-full table-auto border border-gray-300">
                <thead className="bg-gradient-to-r from-green-400 to-blue-600 text-white">
                    <tr>
                        <th className="p-3 text-left border border-gray-300">Class</th>
                        <th className="p-3 text-left border border-gray-300">Day</th>
                        <th className="p-3 text-left border border-gray-300">Periods</th>
                    </tr>
                </thead>
                <tbody className="bg-cyan-200">
                    {generatedTimetable.map((classSchedule, classIndex) => (
                        <React.Fragment key={classIndex}>
                            {classSchedule.map((daySchedule, dayIndex) => (
                                <tr key={`${classIndex}-${dayIndex}`}>
                                    {/* Render class name only once by checking if it's the first row for the class */}
                                    {dayIndex === 0 && (
                                        <td
                                            rowSpan={classSchedule.length}
                                            className="p-3 border border-gray-300 font-semibold text-gray-700"
                                        >
                                            {`Class ${classIndex + 1}`}
                                        </td>
                                    )}
                                    <td className="p-3 border border-gray-300 font-bold text-blue-600">
                                        {`Day ${dayIndex + 1}`}
                                    </td>
                                    <td className="p-3 border border-gray-300">
                                        {daySchedule.map((period, periodIndex) =>
                                            period ? (
                                                <span key={periodIndex} className="mr-2 text-gray-500">
                                                    {`P${periodIndex + 1}: ${period}`}
                                                </span>
                                            ) : (
                                                <span key={periodIndex} className="mr-2 text-gray-500">
                                                    Free
                                                </span>
                                            )
                                        )}
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

export default TimetableDisplay;
