"use client";

import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useEffect, useState } from "react";
Chart.register(...registerables);

type Dataset = {
  label: string;
  data: number[];
};

type ChartData = {
  labels: string[];
  datasets: Dataset[];
};

function BarChart() {
  const [data, setData] = useState<ChartData | null>(null);

  useEffect(() => {
    const getSurveyData = async () => {
      const response = await fetch("/api/admission/survey");
      const data: ChartData = await response.json();

      setData(data);
    };

    getSurveyData();
  }, []);

  return (
    data && (
      <Bar
        className="bg-base-100 p-5 shadow-lg max-w-6xl max-h-full col-span-3 rounded-xl"
        data={data}
      />
    )
  );
}
export default BarChart;
