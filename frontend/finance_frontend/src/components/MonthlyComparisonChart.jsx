import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../contexts/ThemeContext/UseTheme";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const MonthlyComparisonChart = ({ transactions }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Get last 12 months (you had 12)
  const months = [];
  const labels = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    labels.push(d.toLocaleString("default", { month: "short" }));
    months.push(d);
  }

  const incomeData = months.map((month) => {
    const total = transactions
      .filter((t) => {
        const tDate = new Date(t.date);
        return (
          t.type === "income" &&
          tDate.getMonth() === month.getMonth() &&
          tDate.getFullYear() === month.getFullYear()
        );
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return total;
  });

  const expenseData = months.map((month) => {
    const total = transactions
      .filter((t) => {
        const tDate = new Date(t.date);
        return (
          t.type === "expense" &&
          tDate.getMonth() === month.getMonth() &&
          tDate.getFullYear() === month.getFullYear()
        );
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return total;
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        backgroundColor: isDark
          ? "rgba(74, 158, 255, 0.7)"
          : "rgba(54, 162, 235, 0.5)",
        borderColor: isDark ? "#4a9eff" : "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: expenseData,
        backgroundColor: isDark
          ? "rgba(255, 107, 107, 0.7)"
          : "rgba(255, 99, 132, 0.5)",
        borderColor: isDark ? "#ff6b6b" : "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDark ? "#e8e8e8" : "#1a1a1a",
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: "Monthly Income vs Expenses (Last 12 Months)",
        color: isDark ? "#e8e8e8" : "#1a1a1a",
        font: { size: 14 },
      },
      tooltip: {
        bodyColor: isDark ? "#e8e8e8" : "#1a1a1a",
        titleColor: isDark ? "#e8e8e8" : "#1a1a1a",
        backgroundColor: isDark ? "#2a2a3a" : "#ffffff",
        borderColor: isDark ? "#4a4a5a" : "#cccccc",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Amount ($)",
          color: isDark ? "#e8e8e8" : "#1a1a1a",
        },
        ticks: {
          color: isDark ? "#e8e8e8" : "#1a1a1a",
        },
        grid: {
          color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
      },
      x: {
        ticks: {
          color: isDark ? "#e8e8e8" : "#1a1a1a",
        },
        grid: {
          color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        },
      },
    },
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1rem",
        background: "var(--card-bg)",
        borderRadius: "12px",
      }}
    >
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MonthlyComparisonChart;
