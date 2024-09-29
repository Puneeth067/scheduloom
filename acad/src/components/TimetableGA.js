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
        const period = {
            d: 6,
            p: 8
        }; // 6 days, 8 periods per day
        let schedule = Array.from({
                length: this.classes.length
            }, () =>
            Array.from({
                length: period.d
            }, () => Array(period.p).fill(null))
        );

        // Assign teachers to all periods for each class
        for (let cIndex = 0; cIndex < this.classes.length; cIndex++) {
            let remainingLectures = this.getRemainingLecturesForClass(cIndex);

            // Assign subjects and teachers for each class's timetable
            for (let day = 0; day < period.d; day++) {
                for (let per = 0; per < period.p; per++) {
                    if (remainingLectures > 0 && schedule[cIndex][day][per] === null) {
                        let teacher = this.getRandomTeacher(cIndex, day, per, schedule);
                        if (teacher && this.isSchedulePossible(cIndex, day, per, teacher.name, schedule)) {
                            schedule[cIndex][day][per] = teacher.name;
                            remainingLectures--;
                        }
                    }
                }
            }

            // Ensure no empty periods for the class by assigning remaining teachers
            for (let day = 0; day < period.d; day++) {
                for (let per = 0; per < period.p; per++) {
                    if (schedule[cIndex][day][per] === null) {
                        let teacher = this.getRandomTeacher(cIndex, day, per, schedule);
                        if (teacher) {
                            schedule[cIndex][day][per] = teacher.name;
                        }
                    }
                }
            }
        }

        return schedule;
    }

    getRandomTeacher(cIndex, day, per, schedule) {
        // Find eligible teachers who are not already assigned in the same period
        const eligibleTeachers = this.teachers.filter(teacher => {
            const teacherPeriodCount = this.getTeacherPeriodsPerDay(teacher.name, day, schedule);

            return (
                teacher.assigned.some(e => e.class === this.classes[cIndex]) &&
                teacherPeriodCount < teacher.maxHoursPerDay &&
                this.isTeacherAvailable(teacher.name, day, per, schedule)
            );
        });

        return eligibleTeachers.length > 0 ? eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)] : null;
    }

    isTeacherAvailable(teacherName, day, period, schedule) {
        // Ensure teacher is not already assigned to another class in the same period
        for (let classSchedule of schedule) {
            if (classSchedule[day][period] === teacherName) {
                return false;
            }
        }
        return true;
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

    getRemainingLecturesForClass(cIndex) {
        let totalLectures = 0;
        this.teachers.forEach(teacher => {
            let valid = teacher.assigned.find(e => e.class === this.classes[cIndex]);
            if (valid) totalLectures += valid.subject.creditHr;
        });
        return totalLectures;
    }

    // Fitness function to evaluate the quality of the schedule
    calculateFitness(schedule) {
        let fitness = 0;

        // Check for teacher conflicts and penalize them
        for (let day = 0; day < schedule[0].length; day++) {
            for (let period = 0; period < schedule[0][day].length; period++) {
                const teachersInPeriod = new Set();

                for (let classIndex = 0; classIndex < schedule.length; classIndex++) {
                    const teacher = schedule[classIndex][day][period];
                    if (teacher !== null) {
                        if (teachersInPeriod.has(teacher)) {
                            fitness -= 10; // Penalty for conflict
                        } else {
                            teachersInPeriod.add(teacher);
                        }
                    }
                }
            }
        }

        return fitness;
    }

    run() {
        this.initializePopulation();

        let bestFitness = -Infinity;
        let bestSchedule = null;

        // Evaluate all schedules and find the best one based on fitness
        for (let generation = 0; generation < this.maxGenerations; generation++) {
            for (let schedule of this.population) {
                const fitness = this.calculateFitness(schedule);
                if (fitness > bestFitness) {
                    bestFitness = fitness;
                    bestSchedule = schedule;
                }
            }
        }

        this.bestSchedule = bestSchedule;
        return this.bestSchedule;
    }
}

export default TimetableGA;
