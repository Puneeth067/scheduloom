import React from "react";

function TimetableDisplay({ generatedTimetable }) {
    return (
        <div>
            <h2>Student's POV</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Class</th>
                        <th>Day</th>
                        <th>Periods</th>
                    </tr>
                </thead>
                <tbody>
                    {generatedTimetable.map((classSchedule, classIndex) =>
                        classSchedule.map((daySchedule, dayIndex) => (
                            <tr key={`${classIndex}-${dayIndex}`}>
                                <td>{`Class ${classIndex + 1}`}</td>
                                <td>{`Day ${dayIndex + 1}`}</td>
                                <td>
                                    {daySchedule.map((period, periodIndex) =>
                                        period ? `P${periodIndex + 1}: ${period} ` : "Free "
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TimetableDisplay;
