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

      // Assign subjects and teachers for every period, ensuring no free periods
      for (let cIndex = 0; cIndex < this.classes.length; cIndex++) {
          let subjectIndex = 0;

          for (let day = 0; day < period.d; day++) {
              for (let per = 0; per < period.p; per++) {
                  let subject = this.subjects[subjectIndex % this.subjects.length]; // Cycle through subjects
                  let teacher = this.getRandomTeacher(cIndex, day, per, schedule, subject);

                  if (teacher && this.isSchedulePossible(cIndex, day, per, teacher.name, schedule)) {
                      schedule[cIndex][day][per] = `${teacher.name} (${subject.name})`; // Assign teacher and subject
                  } else {
                      let fallbackTeacher = this.getFallbackTeacher(cIndex, day, per, schedule, subject);
                      if (fallbackTeacher) {
                          schedule[cIndex][day][per] = `${fallbackTeacher.name} (${subject.name})`; // Assign fallback teacher
                      } else {
                          schedule[cIndex][day][per] = "No Teacher Available";
                      }
                  }

                  subjectIndex++; // Move to the next subject
              }
          }
      }

      return schedule;
  }



    getRandomTeacher(cIndex, day, per, schedule, subject) {
        const eligibleTeachers = this.teachers.filter(teacher => {
            const teacherPeriodCount = this.getTeacherPeriodsPerDay(teacher.name, day, schedule);

            // Ensure teacher is eligible for the class and subject, and is within their daily limit
            return (
                teacher.assigned.some(e => e.class === this.classes[cIndex] && e.subject.name === subject.name) &&
                teacherPeriodCount < teacher.maxHoursPerDay &&
                this.isTeacherAvailable(teacher.name, day, per, schedule) // Check if teacher is available
            );
        });

        return eligibleTeachers.length > 0 ? eligibleTeachers[Math.floor(Math.random() * eligibleTeachers.length)] : null;
    }


    getFallbackTeacher(cIndex, day, per, schedule, subject) {
        const availableTeachers = this.teachers.filter(teacher => {
            return this.isTeacherAvailable(teacher.name, day, per, schedule);
        });

        return availableTeachers.length > 0 ? availableTeachers[Math.floor(Math.random() * availableTeachers.length)] : null;
    }


    isTeacherAvailable(teacherName, day, period, schedule) {
        // Check if the teacher is already teaching another class during the same period
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
                            fitness -= 10; // Penalize conflicts
                        } else {
                            teachersInPeriod.add(teacher);
                        }
                    }
                }
            }
        }

        return fitness;
    }
}

export default TimetableGA;
