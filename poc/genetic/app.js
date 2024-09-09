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
        let schedule = ThreeDarray(this.classes.length, period.d, period.p);

        // Randomly assign subjects to periods for each class
        for (let cIndex = 0; cIndex < this.classes.length; cIndex++) {
            let remainingLectures = this.getRemainingLecturesForClass(cIndex);
            for (let day = 0; day < period.d; day++) {
                for (let per = 0; per < period.p; per++) {
                    if (schedule[cIndex][day][per] === 0 && remainingLectures > 0) {
                        let teacher = this.getRandomTeacher(cIndex);
                        let valid = teacher.assigned.find(e => e.class === this.classes[cIndex]);
                        if (valid) {
                            if (this.isSchedulePossible(cIndex, day, per, teacher.name, schedule)) {
                                schedule[cIndex][day][per] = teacher.name;
                                remainingLectures--;
                            }
                        }
                    }
                }
            }
        }
        return schedule;
    }

    isSchedulePossible(classIndex, day, periodIndex, teacherName, schedule) {
        // Check if the teacher is already scheduled for another class in the same period
        for (let otherClassIndex = 0; otherClassIndex < this.classes.length; otherClassIndex++) {
            if (otherClassIndex !== classIndex && schedule[otherClassIndex][day][periodIndex] === teacherName) {
                return false;
            }
        }
        return true;
    }

    getRemainingLecturesForClass(cIndex) {
        let totalLectures = 0;
        this.teachers.forEach(teacher => {
            let valid = teacher.assigned.find(e => e.class === this.classes[cIndex]);
            if (valid) totalLectures += valid.subject.creditHr;
        });
        return totalLectures;
    }

    getRandomTeacher(cIndex) {
        const eligibleTeachers = this.teachers.filter(teacher =>
            teacher.assigned.some(e => e.class === this.classes[cIndex])
        );
        return eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)];
    }

    calculateFitness(schedule) {
        let fitness = 0;

        // Add fitness for no conflicts (teachers/classes with no overlaps)
        for (let day = 0; day < period.d; day++) {
            for (let per = 0; per < period.p; per++) {
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

        // Check if the number of lectures assigned matches the requirements
        for (let cIndex = 0; cIndex < this.classes.length; cIndex++) {
            let remainingLectures = this.getRemainingLecturesForClass(cIndex);
            fitness += remainingLectures === 0 ? 50 : -20 * remainingLectures;
        }

        return fitness;
    }

    selectParents() {
        const sortedPopulation = this.population.sort(
            (a, b) => this.calculateFitness(b) - this.calculateFitness(a)
        );
        return sortedPopulation.slice(0, this.populationSize / 2); // Top 50% parents
    }

    crossover(parent1, parent2) {
        const crossoverPoint = Math.floor(Math.random() * this.classes.length);
        const offspring = ThreeDarray(this.classes.length, period.d, period.p);

        // Combine the schedules of parent1 and parent2
        for (let cIndex = 0; cIndex < this.classes.length; cIndex++) {
            if (cIndex < crossoverPoint) {
                offspring[cIndex] = parent1[cIndex];
            } else {
                offspring[cIndex] = parent2[cIndex];
            }
        }

        return offspring;
    }

    mutate(schedule) {
        const classIndex = Math.floor(Math.random() * this.classes.length);
        const dayIndex = Math.floor(Math.random() * period.d);
        const periodIndex = Math.floor(Math.random() * period.p);

        // Randomly assign a new teacher to a period
        const teacher = this.getRandomTeacher(classIndex);
        if (this.isSchedulePossible(classIndex, dayIndex, periodIndex, teacher.name, schedule)) {
            schedule[classIndex][dayIndex][periodIndex] = teacher.name;
        }

        return schedule;
    }

    run() {
        this.initializePopulation();

        for (let generation = 0; generation < this.maxGenerations; generation++) {
            let parents = this.selectParents();
            let newPopulation = [];

            // Create offspring through crossover
            for (let i = 0; i < parents.length; i++) {
                for (let j = i + 1; j < parents.length; j++) {
                    let offspring = this.crossover(parents[i], parents[j]);
                    if (Math.random() < 0.1) {
                        offspring = this.mutate(offspring); // Apply mutation with 10% probability
                    }
                    newPopulation.push(offspring);
                }
            }

            this.population = newPopulation;

            // Track the best schedule
            this.bestSchedule = this.population.reduce((best, schedule) =>
                this.calculateFitness(schedule) > this.calculateFitness(best) ?
                schedule :
                best
            );

            // Log the progress
            console.log(`Generation ${generation + 1}: Best Fitness = ${this.calculateFitness(this.bestSchedule)}`);
        }

        return this.bestSchedule;
    }
}

// Sample data
const c = ["c1", "c2", "c3"];
const s = [{
        name: "s1",
        creditHr: 3
    },
    {
        name: "s2",
        creditHr: 3
    },
    {
        name: "s3",
        creditHr: 3
    },
    {
        name: "s4",
        creditHr: 3
    },
    {
        name: "s5",
        creditHr: 3
    },
    {
        name: "s6",
        creditHr: 2
    },
];
const t = [{
        name: "t0",
        assigned: [{
                class: c[0],
                subject: s[0],
                lecture: [1, 1, 1]
            },
            {
                class: c[1],
                subject: s[0],
                lecture: [1, 1, 1]
            },
            {
                class: c[2],
                subject: s[0],
                lecture: [1, 1, 1]
            },
        ],
    },
    {
        name: "t1",
        assigned: [{
                class: c[0],
                subject: s[1],
                lecture: [1, 1, 1]
            },
            {
                class: c[1],
                subject: s[1],
                lecture: [1, 1, 1]
            },
            {
                class: c[2],
                subject: s[1],
                lecture: [1, 1, 1]
            },
        ],
    },
    {
        name: "t2",
        assigned: [{
                class: c[0],
                subject: s[2],
                lecture: [2, 1]
            },
            {
                class: c[1],
                subject: s[2],
                lecture: [2, 1]
            },
            {
                class: c[2],
                subject: s[2],
                lecture: [2, 1]
            },
        ],
    },
    {
        name: "t3",
        assigned: [{
                class: c[0],
                subject: s[3],
                lecture: [1, 1, 1]
            },
            {
                class: c[1],
                subject: s[3],
                lecture: [1, 1, 1]
            },
            {
                class: c[2],
                subject: s[3],
                lecture: [1, 1, 1]
            },
        ],
    },
    {
        name: "t4",
        assigned: [{
                class: c[0],
                subject: s[4],
                lecture: [1, 1, 1]
            },
            {
                class: c[1],
                subject: s[4],
                lecture: [1, 1, 1]
            },
            {
                class: c[2],
                subject: s[4],
                lecture: [1, 1, 1]
            },
        ],
    },
    {
        name: "t5",
        assigned: [{
                class: c[0],
                subject: s[5],
                lecture: [1, 1, 1]
            },
            {
                class: c[1],
                subject: s[5],
                lecture: [1, 1, 1]
            },
            {
                class: c[2],
                subject: s[5],
                lecture: [1, 1, 1]
            },
        ],
    },
];

// Set the period and initialize the GA
const period = {
    d: 5,
    p: 7
};

const ga = new TimetableGA(c, s, t, 10, 100);
const bestSchedule = ga.run();

// Generate and display the timetable in HTML
function generateTable(schedule) {
    let html = '<table><thead><tr><th>Class</th>';
    for (let day = 1; day <= period.d; day++) {
        html += `<th>Day ${day}</th>`;
    }
    html += '</tr></thead><tbody>';

    schedule.forEach((classSchedule, classIndex) => {
        html += `<tr><td>Class ${classIndex + 1}</td>`;
        classSchedule.forEach(daySchedule => {
            html += `<td><table>`;
            daySchedule.forEach((teacher, periodIndex) => {
                html += `<tr><td>Period ${periodIndex + 1}: ${teacher}</td></tr>`;
            });
            html += `</table></td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
}

document.getElementById('timetable').innerHTML = generateTable(bestSchedule);
