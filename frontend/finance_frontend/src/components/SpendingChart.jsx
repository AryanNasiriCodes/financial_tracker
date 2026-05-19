import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../contexts/ThemeContext/UseTheme';

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingChart = ({ transactions }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Filter current month transactions
  const currentMonthTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
  });

  // Calculate totals
  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryTotals = {};

  currentMonthTransactions.forEach(t => {
    const amount = parseFloat(t.amount);
    if (t.type === 'income') {
      totalIncome += amount;
    } else if (t.type === 'expense') {
      totalExpenses += amount;
      const catName = t.category_name || 'Uncategorized';
      categoryTotals[catName] = (categoryTotals[catName] || 0) + amount;
    }
  });

  if (totalIncome === 0) {
    return <div style={{ color: 'var(--text-color)' }}>No income recorded for this month. Add income to see spending breakdown.</div>;
  }

  // Prepare chart data
  const labels = Object.keys(categoryTotals);
  const dataValues = Object.values(categoryTotals);
  const remaining = totalIncome - totalExpenses;

  if (remaining > 0) {
    labels.push('Savings');
    dataValues.push(remaining);
  } else if (remaining < 0) {
    labels.push('Overspent');
    dataValues.push(-remaining);
  }

  // Assign colors with better contrast for dark mode
  const backgroundColors = labels.map(label => {
    if (label === 'Savings') return '#4CAF50';
    if (label === 'Overspent') return '#F44336';
    // Use slightly brighter colors for dark mode
    const palette = isDark 
      ? ['#FF8888', '#88AAFF', '#FFDD88', '#88DDCC', '#CC88FF', '#FFAA66']
      : ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    let hash = 0;
    for (let i = 0; i < label.length; i++) {
      hash = ((hash << 5) - hash) + label.charCodeAt(i);
    }
    return palette[Math.abs(hash) % palette.length];
  });

  const chartData = {
    labels: labels,
    datasets: [{
      data: dataValues,
      backgroundColor: backgroundColors,
      hoverBackgroundColor: backgroundColors,
      borderColor: isDark ? '#1e1e2f' : '#ffffff', // حاشیه برای تفکیک بیشتر
      borderWidth: 2,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / totalIncome) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}% of income)`;
          }
        },
        bodyColor: isDark ? '#e8e8e8' : '#1a1a1a',
        titleColor: isDark ? '#e8e8e8' : '#1a1a1a',
        backgroundColor: isDark ? '#2a2a3a' : '#ffffff',
        borderColor: isDark ? '#4a4a5a' : '#cccccc',
        borderWidth: 1
      },
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#e8e8e8' : '#1a1a1a',
          font: { size: 12, weight: 'normal' },
          boxWidth: 12,
          padding: 10
        }
      }
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '500px', 
      margin: '2rem auto 0 auto',
      marginTop:'2rem',
      background: 'var(--card-bg)',
      padding: '1rem',
      borderRadius: '12px',
      color: 'var(--text-color)'
    }}>
      <h3 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>Spending as % of Income (This Month)</h3>
      <p style={{ color: 'var(--text-color)', marginBottom: '1rem' }}>Total Income: ${totalIncome.toFixed(2)}</p>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default SpendingChart;