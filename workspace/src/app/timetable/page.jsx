'use client'
import { useState, useEffect } from "react";
import { OptimizedTimetableGA } from "@/utils/TimetableGA";
import FitnessChart from "@/components/TimetableTable/FitnessChart";

const TimetablePage = () => {
  const [bestSchedule, setBestSchedule] = useState(null);
  const [fitnessData, setFitnessData] = useState([]);

  useEffect(() => {
    const classes = ["c1", "c2", "c3"];
    const subjects = [
      { name: "s1", creditHr: 3 },
      { name: "s2", creditHr: 3 },
      { name: "s3", creditHr: 3 },
      { name: "s4", creditHr: 3 },
      { name: "s5", creditHr: 3 },
      { name: "s6", creditHr: 2 },
    ];
    const teachers = [
      {
        name: "t0",
        assigned: [
          { class: "c1", subject: "s1" },
          { class: "c2", subject: "s1" },
          { class: "c3", subject: "s1" },
        ],
        constraints: [{ day: 1, start: 0, end: 3 }],
      },
      // Add more teacher objects as needed
    ];

    const period = { d: 5, p: 7 };
    const ga = new OptimizedTimetableGA(classes, subjects, teachers, 10, 100, 15); // Patience set to 15

    const bestSchedule = ga.run();
    setBestSchedule(bestSchedule);

    // Collect fitness data for the chart
    const fitnessData = ga.population.map((schedule) => ga.calculateFitness(schedule));
    setFitnessData(fitnessData);
  }, []);

  return (
    <div>
      <h1>Optimized Teacher Timetable</h1>
      <div id="schedule">{bestSchedule && <pre>{JSON.stringify(bestSchedule, null, 2)}</pre>}</div>
      <FitnessChart fitnessData={fitnessData} maxGenerations={100} />
    </div>
  );
};

export default TimetablePage;
