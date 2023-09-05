import { Line } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';

function LineChart({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';

  const dadosGrafico = {
    labels: [],
    datasets: [
      {
        label: 'Faturamento total',
        data: [],
        fill: false,
        borderColor: 'rgba(82,221,95,1.00)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: axisLabelColor
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: gridLabelColor,
          borderWidth: 1,
          borderDash: [5, 5]
        },
        ticks: {
          font: {
            size: 14
          },
          color: axisLabelColor
        }
      },
      y: {
        grid: {
          color: gridLabelColor,
          borderWidth: 1,
          borderDash: [5, 5]
        },
        ticks: {
          font: {
            size: 14
          },
          color: axisLabelColor
        }
      }
    }
  };

  Object.keys(data).forEach(dia => {
    const valorTotal = data[dia].total;
    dadosGrafico.labels.push('Dia ' +dia);
    dadosGrafico.datasets[0].data.push(valorTotal);
  });

  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Line data={dadosGrafico} options={options} />
    </div>
  );
}

export default LineChart;