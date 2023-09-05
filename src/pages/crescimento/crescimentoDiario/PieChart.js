import React from 'react';
import { Pie } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';
import { Environment } from '../../../shared/environment';

function PieChart({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';

  const labels = Object.keys(data);
  const values = Object.values(data).map(genero => genero['crescimento']);
  const cores = Environment.generosCores;

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Desempenho',
        data: values,
        backgroundColor: labels.map(genero => cores[genero]),
        borderWidth: 0.5,
        hoverBorderColor: '#fff',
        fill: false,
        tension: 0.1
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: axisLabelColor
        }
      }
    },
  };

  return <Pie data={chartData} options={options} />;
}

export default PieChart;