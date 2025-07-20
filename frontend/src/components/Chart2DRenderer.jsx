import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const Chart2DRenderer = ({ chartType, data, xAxis, yAxis, color, size }) => {
  if (!xAxis || !yAxis || !data.length) return null;

  const chartData = {
    labels: data.map((row) => row[xAxis]),
    datasets: [
      {
        label: `${yAxis} vs ${xAxis}`,
        data: data.map((row) => row[yAxis]),
        backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'],
        borderColor: color,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  const style = {
    width: `${size}px`,
    height: `${size * 0.6}px`,
  };

  switch (chartType) {
    case "Bar Chart (2D)":
      return <Bar data={chartData} options={chartOptions} style={style} />;
    case "Line Chart":
      return <Line data={chartData} options={chartOptions} style={style} />;
    case "Pie Chart":
      return <Pie data={chartData} options={chartOptions} style={style} />;
    default:
      return <p>Unsupported chart type</p>;
  }
};

export default Chart2DRenderer;