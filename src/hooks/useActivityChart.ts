import { useState } from "react";

export type ChartView = "weekly" | "monthly";

export const useActivityChart = () => {
  const [chartView, setChartView] = useState<ChartView>("weekly");

  const isWeekly = chartView === "weekly";
  
  const title = "Active Students";
  const description = isWeekly 
    ? "Daily mobile app activity this week" 
    : "Monthly app usage trends";

  return {
    chartView,
    setChartView,
    isWeekly,
    title,
    description
  };
};