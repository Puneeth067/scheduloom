import { Subject, Teacher, Class, Timetable, TimeSlot, DAYS, PERIODS_PER_DAY } from '../types';

function generateInitialPopulation(classes: Class[], populationSize: number): Timetable[] {
  const population: Timetable[] = [];

  for (let i = 0; i < populationSize; i++) {
    const timetables = classes.map((cls) => ({
      class_id: cls.id,
      user_id: '', // Will be set in TimetableGenerator
      slots: DAYS.flatMap((day) =>
        Array.from({ length: PERIODS_PER_DAY }, (_, period) => ({
          day,
          period,
          subject_id: cls.subjects[Math.floor(Math.random() * cls.subjects.length)],
          is_lab: false,
          is_interval: false
        }))
      ),
    }));

    population.push(...timetables);
  }

  return population;
}

function calculateFitness(timetable: Timetable, classes: Class[], teachers: Teacher[], subjects: Subject[]): number {
  let fitness = 0;

  // Check for teacher conflicts
  const teacherSlots: { [teacher_id: string]: Set<string> } = {};
  timetable.slots.forEach((slot) => {
    if (slot.subject_id) {
      const subject = subjects.find(s => s.id === slot.subject_id);
      if (subject) {
        const teacher_id = subject.teacher_id; // Fixed: using snake_case
        if (!teacherSlots[teacher_id]) {
          teacherSlots[teacher_id] = new Set();
        }
        const slotKey = `${slot.day}-${slot.period}`;
        if (teacherSlots[teacher_id].has(slotKey)) {
          fitness -= 10; // Penalize teacher conflicts
        } else {
          teacherSlots[teacher_id].add(slotKey);
        }
      }
    }
  });

  // Check for continuous subjects
  let continuousSubjects = 0;
  for (let i = 1; i < timetable.slots.length; i++) {
    if (timetable.slots[i].subject_id === timetable.slots[i - 1].subject_id) {
      continuousSubjects++;
      if (continuousSubjects > 2) {
        fitness -= 5; // Penalize more than 2 continuous subjects
      }
    } else {
      continuousSubjects = 0;
    }
  }

  // Check for teacher constraints
  timetable.slots.forEach((slot) => {
    if (slot.subject_id) {
      const subject = subjects.find(s => s.id === slot.subject_id);
      if (subject) {
        const teacher = teachers.find((t) => t.id === subject.teacher_id); // Fixed: using snake_case
        if (teacher && teacher.constraints && teacher.constraints[slot.day]) {
          const constraint = teacher.constraints[slot.day];
          if (constraint) {
            const { start, end } = constraint;
            if (slot.period < start || slot.period > end) {
              fitness -= 10; // Penalize violating teacher constraints
            }
          }
        }
      }
    }
  });

  // Check for subject constraints
  timetable.slots.forEach((slot) => {
    if (slot.subject_id) {
      const subject = subjects.find(s => s.id === slot.subject_id);
      if (subject && subject.constraints && subject.constraints[slot.day]) {
        const constraint = subject.constraints[slot.day];
        if (constraint) {
          const { start, end } = constraint;
          if (slot.period < start || slot.period > end) {
            fitness -= 10; // Penalize violating subject constraints
          }
        }
      }
    }
  });

  // Check for lab sessions
  const classData = classes.find((c) => c.id === timetable.class_id);
  if (classData && classData.labs) {
    classData.labs.forEach((lab) => {
      let labFound = false;
      for (let i = 0; i < timetable.slots.length - 1; i++) {
        if (
          timetable.slots[i].subject_id === lab.subject_id &&
          timetable.slots[i + 1].subject_id === lab.subject_id &&
          timetable.slots[i].day === timetable.slots[i + 1].day &&
          timetable.slots[i].period === timetable.slots[i + 1].period - 1
        ) {
          labFound = true;
          break;
        }
      }
      if (!labFound) {
        fitness -= 10; // Penalize missing lab sessions
      }
    });
  }

  return fitness;
}

function crossover(parent1: Timetable, parent2: Timetable): Timetable {
  const child: Timetable = {
    class_id: parent1.class_id,
    user_id: parent1.user_id,
    slots: [],
  };

  const crossoverPoint = Math.floor(Math.random() * parent1.slots.length);

  child.slots = [
    ...parent1.slots.slice(0, crossoverPoint),
    ...parent2.slots.slice(crossoverPoint),
  ];

  return child;
}

function mutate(timetable: Timetable, classes: Class[], mutationRate: number): Timetable {
  const mutatedTimetable: Timetable = {
    class_id: timetable.class_id,
    user_id: timetable.user_id,
    slots: timetable.slots.map((slot) => ({ ...slot })),
  };

  mutatedTimetable.slots.forEach((slot, index) => {
    if (Math.random() < mutationRate) {
      const classData = classes.find((c) => c.id === timetable.class_id);
      if (classData) {
        slot.subject_id = classData.subjects[Math.floor(Math.random() * classData.subjects.length)];
      }
    }
  });

  return mutatedTimetable;
}

export function generateTimetables(
  classes: Class[],
  teachers: Teacher[],
  subjects: Subject[],
  populationSize: number = 100,
  generations: number = 100,
  mutationRate: number = 0.01
): Timetable[] {
  // Input validation
  if (!classes?.length || !teachers?.length || !subjects?.length) {
    throw new Error('Missing required input data');
  }

  let population = generateInitialPopulation(classes, populationSize);

  for (let gen = 0; gen < generations; gen++) {
    const fitnessScores = population.map((timetable) => ({
      timetable,
      fitness: calculateFitness(timetable, classes, teachers, subjects),
    }));

    fitnessScores.sort((a, b) => b.fitness - a.fitness);

    const newPopulation: Timetable[] = [];

    // Elitism: Keep the best 10% of the population
    const eliteCount = Math.floor(populationSize * 0.1);
    newPopulation.push(...fitnessScores.slice(0, eliteCount).map((item) => item.timetable));

    // Generate the rest of the population through crossover and mutation
    while (newPopulation.length < populationSize) {
      const parent1 = fitnessScores[Math.floor(Math.random() * fitnessScores.length)].timetable;
      const parent2 = fitnessScores[Math.floor(Math.random() * fitnessScores.length)].timetable;

      let child = crossover(parent1, parent2);
      child = mutate(child, classes, mutationRate);

      newPopulation.push(child);
    }

    population = newPopulation;
  }

  // Return the best timetable for each class
  const bestTimetables: { [class_id: string]: Timetable } = {};
  population.forEach((timetable) => {
    if (!bestTimetables[timetable.class_id] || 
        calculateFitness(timetable, classes, teachers, subjects) > 
        calculateFitness(bestTimetables[timetable.class_id], classes, teachers, subjects)) {
      bestTimetables[timetable.class_id] = timetable;
    }
  });

  return Object.values(bestTimetables);
}