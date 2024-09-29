import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const FitnessChart = ({ fitnessData, maxGenerations }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Destroy previous chart instance
    }

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: Array.from({ length: maxGenerations }, (_, i) => i + 1),
        datasets: [
          {
            label: "Fitness",
            data: fitnessData,
            borderColor: "blue",
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => chartInstanceRef.current?.destroy(); // Cleanup on unmount
  }, [fitnessData, maxGenerations]);

  return <canvas ref={chartRef} style={{ width: "100%", height: "400px" }}></canvas>;
};

export default FitnessChart;
