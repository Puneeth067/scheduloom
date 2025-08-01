import React from "react";
import { saveTimetableToDatabase } from '@/utils/timetableService';

class TimetableGA {
    constructor(classes, subjects, teachers, populationSize, maxGenerations) {
        this.classes = classes;
        this.subjects = subjects;
        this.teachers = teachers;
        this.populationSize = populationSize;
        this.maxGenerations = maxGenerations;
        this.population = [];
        this.bestSchedule = null;
    }

    initializePopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            const schedule = this.generateRandomSchedule();
            this.population.push(schedule);
        }
    }

    generateRandomSchedule() {
        const period = { d: 6, p: 7 }; // 6 days, 7 periods (adjust as needed)
        let schedule = Array.from({ length: this.classes.length }, () =>
            Array.from({ length: period.d }, () => Array(period.p).fill(null))
        );

        for (let cIndex = 0; cIndex < this.classes.length; cIndex++) {
            let remainingLectures = this.getRemainingLecturesForClass(cIndex);
            for (let day = 0; day < period.d; day++) {
                for (let per = 0; per < period.p; per++) {
                    if (schedule[cIndex][day][per] === null && remainingLectures > 0) {
                        let teacher = this.getRandomTeacher(cIndex, day, per, schedule);
                        if (teacher && this.isSchedulePossible(cIndex, day, per, teacher.name, schedule)) {
                            schedule[cIndex][day][per] = teacher.name;
                            remainingLectures--;
                        }
                    }
                }
            }
        }
        return schedule;
    }

    getRandomTeacher(cIndex, day, per, schedule) {
        const eligibleTeachers = this.teachers.filter(teacher => {
            const teacherPeriodCount = this.getTeacherPeriodsPerDay(teacher.name, day, schedule);

            // By default, teachers are available for all periods unless constraints are added
            return teacher.assigned.some(e => e.class === this.classes[cIndex]) &&
                !teacher.constraints.some(constraint =>
                    constraint.day === day && constraint.start <= per && constraint.end >= per
                ) &&
                teacherPeriodCount < teacher.maxHoursPerDay; // Respect max hours per day if set
        });

        return eligibleTeachers.length > 0 ? eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)] : null;
    }

    getTeacherPeriodsPerDay(teacherName, day, schedule) {
        let count = 0;
        for (let classSchedule of schedule) {
            for (let periodIndex = 0; periodIndex < classSchedule[day].length; periodIndex++) {
                if (classSchedule[day][periodIndex] === teacherName) {
                    count++;
                }
            }
        }
        return count;
    }

    isSchedulePossible(classIndex, day, periodIndex, teacherName, schedule) {
        // Ensure no other class is taught by the same teacher in the same period
        for (let otherClassIndex = 0; otherClassIndex < this.classes.length; otherClassIndex++) {
            if (otherClassIndex !== classIndex && schedule[otherClassIndex][day][periodIndex] === teacherName) {
                return false;
            }
        }
        return !schedule[classIndex][day].includes(teacherName);
    }

    getRemainingLecturesForClass(cIndex) {
        let totalLectures = 0;
        this.teachers.forEach(teacher => {
            let valid = teacher.assigned.find(e => e.class === this.classes[cIndex]);
            if (valid) totalLectures += valid.subject.creditHr;
        });
        return totalLectures;
    }

    run() {
        this.initializePopulation();
        // Run GA logic for a certain number of generations (simplified for brevity)
        this.bestSchedule = this.population[0]; // Select the first schedule for now
        return this.bestSchedule;
    }
}
function TimetableGenerator({ classes, subjects, teachers, setGeneratedTimetable, userData }) {
    const generateTimetable = async () => {
        if (classes.length === 0 || subjects.length === 0 || teachers.length === 0) {
            alert("Please add classes, subjects, and teachers.");
            return;
        }

        try {
            const ga = new TimetableGA(classes, subjects, teachers, 10, 100);
            const bestSchedule = ga.run();
            
            // Save the generated timetable to Supabase
            const timetableData = {
                schedule: bestSchedule,
                classes,
                subjects,
                teachers,
                generatedAt: new Date().toISOString()
            };

            const { success, error } = await saveTimetableToDatabase(timetableData, userData.id);
            
            if (!success) {
                throw error;
            }

            setGeneratedTimetable(bestSchedule);
        } catch (error) {
            console.error('Error generating and saving timetable:', error);
            alert('There was an error saving the timetable. Please try again.');
        }
    };

    return (
        <div className="pl-4">
            <button 
                onClick={generateTimetable}
                className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
            >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 cursor-pointer">
                    Generate Timetable
                </span>
            </button>
        </div>
    );
}

export default TimetableGenerator;