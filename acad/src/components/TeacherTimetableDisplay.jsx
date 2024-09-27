import React from "react";

function TeacherTimetableDisplay({ generatedTimetable, teachers }) {
    // We will iterate over the teachers and show their schedules
    return (
        <div>
            <h2>Teacher's POV</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Teacher</th>
                        <th>Day</th>
                        <th>Periods</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.map((teacher, teacherIndex) => (
                        <tr key={teacherIndex}>
                            <td>{teacher.name}</td>
                            <td colSpan="2">
                                {generatedTimetable.map((classSchedule, dayIndex) => (
                                    <div key={dayIndex}>
                                        <h4>{`Day ${dayIndex + 1}`}</h4>
                                        {classSchedule.map((daySchedule, classIndex) => (
                                            <div key={classIndex}>
                                                {daySchedule.map((period, periodIndex) => {
                                                    if (period === teacher.name) {
                                                        return (
                                                            <p key={periodIndex}>
                                                                {`Class ${classIndex + 1} - Period ${periodIndex + 1
                                                                    }`}
                                                            </p>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TeacherTimetableDisplay;
