import React from 'react';
import { Pie } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';
import { Environment } from '../../../shared/environment';

function PieChart2({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';

  const cores = Environment.generosCores;

  const labels = Object.keys(data).map(genero => genero);
  const values = Object.values(data).map(genero => genero[Object.keys(Object.values(data)[1])[1]]['total_valor']);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Faturou',
        data: values,
        backgroundColor: labels.map(genero => cores[genero]),
        borderWidth: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: axisLabelColor,
        },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}

export default PieChart2;