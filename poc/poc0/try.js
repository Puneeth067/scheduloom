// Array of Subjects
const subjects = ["Math", "Science", "English", "History", "Geography", "Computer Science"];

// Array of Classes, with sections and periods
const classes = [{
        className: "Class 1",
        sections: ["A", "B", "C"],
        schedule: {
            Monday: 4,
            Tuesday: 8,
            Wednesday: 6,
            Thursday: 7,
            Friday: 5,
            Saturday: 4
        }
    },
    {
        className: "Class 2",
        sections: ["A", "B", "C"],
        schedule: {
            Monday: 6,
            Tuesday: 7,
            Wednesday: 8,
            Thursday: 6,
            Friday: 5,
            Saturday: 3
        }
    }
];

// Array of Teachers, each teaching multiple subjects to different classes
const teachers = [{
        name: "Mr. Smith",
        subjects: [{
                subject: "Math",
                classes: ["Class 1", "Class 2"]
            },
            {
                subject: "Science",
                classes: ["Class 1"]
            }
        ]
    },
    {
        name: "Ms. Johnson",
        subjects: [{
                subject: "English",
                classes: ["Class 1", "Class 2"]
            },
            {
                subject: "History",
                classes: ["Class 2"]
            }
        ]
    },
    {
        name: "Dr. Brown",
        subjects: [{
                subject: "Geography",
                classes: ["Class 1"]
            },
            {
                subject: "Computer Science",
                classes: ["Class 2"]
            }
        ]
    }
];

// Initialize timetable for each class
const timetable = {
    "Class 1": {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: []
    },
    "Class 2": {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: []
    }
};

// Helper function to check teacher availability
function isTeacherAvailable(teacherName, day, period, timetable) {
    for (let cls in timetable) {
        if (timetable[cls][day][period] && timetable[cls][day][period].teacher === teacherName) {
            return false;
        }
    }
    return true;
}

// Generate timetable
function generateTimetable() {
    for (let cls of classes) {
        const className = cls.className;
        const schedule = cls.schedule;

        for (let day in schedule) {
            const periods = schedule[day];

            for (let i = 0; i < periods; i++) {
                for (let teacher of teachers) {
                    for (let subjectInfo of teacher.subjects) {
                        if (subjectInfo.classes.includes(className) && isTeacherAvailable(teacher.name, day, i, timetable)) {
                            // Assign the teacher to the class in this period
                            timetable[className][day][i] = {
                                teacher: teacher.name,
                                subject: subjectInfo.subject
                            };
                            break;
                        }
                    }
                }
            }
        }
    }
}

// Initialize timetable slots based on the number of periods
for (let cls of classes) {
    const className = cls.className;
    const schedule = cls.schedule;
    for (let day in schedule) {
        for (let i = 0; i < schedule[day]; i++) {
            timetable[className][day].push(null); // Fill periods with empty slots
        }
    }
}

// Generate the timetable
generateTimetable();

console.table(timetable);
