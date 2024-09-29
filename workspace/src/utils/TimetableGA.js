export class OptimizedTimetableGA {
    constructor(classes, subjects, teachers, populationSize, maxGenerations, patience = 10) {
        this.classes = classes;
        this.subjects = subjects;
        this.teachers = teachers;
        this.populationSize = populationSize;
        this.maxGenerations = maxGenerations;
        this.patience = patience; // Early stopping patience
        this.population = [];
        this.bestSchedule = null;
        this.fitnessCache = new Map();
    }

    initializePopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            const schedule = this.generateRandomSchedule();
            this.population.push(schedule);
        }
    }

    generateRandomSchedule() {
        let schedule = Array.from({
                length: this.classes.length
            }, () =>
            Array.from({
                length: 5
            }, () => Array(7).fill(0))
        );

        for (let cIndex = 0; cIndex < this.classes.length; cIndex++) {
            let remainingLectures = this.getRemainingLecturesForClass(cIndex);
            for (let day = 0; day < 5; day++) {
                for (let per = 0; per < 7; per++) {
                    if (schedule[cIndex][day][per] === 0 && remainingLectures > 0) {
                        let teacher = this.getRandomTeacher(cIndex, day, per);
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

    getRandomTeacher(cIndex, day, per) {
        const eligibleTeachers = this.teachers
            .filter((teacher) => teacher.assigned.some((e) => e.class === this.classes[cIndex]))
            .filter(
                (teacher) =>
                !teacher.constraints.some((constraint) => constraint.day === day && constraint.start <= per && constraint.end >= per)
            );
        return eligibleTeachers.length > 0 ?
            eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)] :
            null;
    }

    isSchedulePossible(classIndex, day, periodIndex, teacherName, schedule) {
        for (let otherClassIndex = 0; otherClassIndex < this.classes.length; otherClassIndex++) {
            if (otherClassIndex !== classIndex && schedule[otherClassIndex][day][periodIndex] === teacherName) {
                return false;
            }
        }
        return !schedule[classIndex][day].includes(teacherName);
    }

    getRemainingLecturesForClass(cIndex) {
        return this.teachers
            .filter((teacher) => teacher.assigned.some((e) => e.class === this.classes[cIndex]))
            .reduce((totalLectures, teacher) => {
                let valid = teacher.assigned.find((e) => e.class === this.classes[cIndex]);
                return valid ? totalLectures + valid.subject.creditHr : totalLectures;
            }, 0);
    }

    calculateFitness(schedule) {
        const scheduleKey = JSON.stringify(schedule);
        if (this.fitnessCache.has(scheduleKey)) {
            return this.fitnessCache.get(scheduleKey);
        }

        let fitness = 0;
        for (let day = 0; day < 5; day++) {
            for (let per = 0; per < 7; per++) {
                let teacherSet = new Set();
                for (let cIndex = 0; cIndex < this.classes.length; cIndex++) {
                    const teacher = schedule[cIndex][day][per];
                    if (teacher !== 0) {
                        if (teacherSet.has(teacher)) {
                            fitness -= 10; // Conflict penalty
                        } else {
                            teacherSet.add(teacher);
                        }
                    }
                }
            }
        }

        for (let cIndex = 0; cIndex < this.classes.length; cIndex++) {
            let remainingLectures = this.getRemainingLecturesForClass(cIndex);
            fitness += remainingLectures === 0 ? 50 : -20 * remainingLectures;
        }

        this.fitnessCache.set(scheduleKey, fitness); // Cache the fitness value
        return fitness;
    }

    selectParents() {
        const sortedPopulation = this.population.sort(
            (a, b) => this.calculateFitness(b) - this.calculateFitness(a)
        );
        return sortedPopulation.slice(0, Math.floor(this.populationSize / 2));
    }

    crossover(parent1, parent2) {
        const crossoverPoint = Math.floor(Math.random() * this.classes.length);
        return Array.from({
                length: this.classes.length
            }, (_, cIndex) =>
            cIndex < crossoverPoint ? parent1[cIndex] : parent2[cIndex]
        );
    }

    mutate(schedule) {
        const classIndex = Math.floor(Math.random() * this.classes.length);
        const dayIndex = Math.floor(Math.random() * 5);
        const periodIndex = Math.floor(Math.random() * 7);
        const teacher = this.getRandomTeacher(classIndex, dayIndex, periodIndex);

        if (teacher && this.isSchedulePossible(classIndex, dayIndex, periodIndex, teacher.name, schedule)) {
            schedule[classIndex][dayIndex][periodIndex] = teacher.name;
        }
        return schedule;
    }

    run() {
        this.initializePopulation();
        let lastBestFitness = -Infinity;
        let noImprovementCount = 0;

        for (let generation = 0; generation < this.maxGenerations; generation++) {
            if (noImprovementCount >= this.patience) {
                console.log(`Early stopping at generation ${generation}`);
                break;
            }

            const parents = this.selectParents();
            let newPopulation = [];

            for (let i = 0; i < parents.length; i++) {
                for (let j = i + 1; j < parents.length; j++) {
                    let offspring = this.crossover(parents[i], parents[j]);
                    if (Math.random() < 0.1) {
                        offspring = this.mutate(offspring); // Apply mutation
                    }
                    newPopulation.push(offspring);
                }
            }

            this.population = newPopulation;
            this.bestSchedule = this.population.reduce((best, schedule) =>
                this.calculateFitness(schedule) > this.calculateFitness(best) ? schedule : best
            );

            const bestFitness = this.calculateFitness(this.bestSchedule);
            if (bestFitness > lastBestFitness) {
                lastBestFitness = bestFitness;
                noImprovementCount = 0;
            } else {
                noImprovementCount++;
            }

            console.log(`Generation ${generation + 1}: Best Fitness = ${bestFitness}`);
        }

        return this.bestSchedule;
    }
}
