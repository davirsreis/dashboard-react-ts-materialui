import { Line } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';

function LineChart2({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';

  const dias = Array.from({ length: 31 }, (_, i) => `Dia ${i + 1}`);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
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
    },
  };

  const dadosGrafico = {
    labels: dias,
    datasets: [
      {
        label: 'Novas assinaturas',
        data: Array(31).fill(0),
        fill: false,
        borderColor: 'rgba(82,221,95,1.00)',
        backgroundColor: 'rgba(82,221,95,1.00)',
        tension: 0.1,
      },
      {
        label: 'Cancelamentos',
        data: Array(31).fill(0),
        fill: false,
        borderColor: 'rgba(255,99,99,1.00)',
        backgroundColor: 'rgba(255,99,99,1.00)',
        tension: 0.1,
      }
    ],
  };

  Object.keys(data).forEach(dia => {
    const assinaturas = data[dia].assinaturas;
    const cancelamentos = data[dia].cancelamentos;
    const diaIndex = Number(dia) - 1;
    dadosGrafico.datasets[0].data[diaIndex] = assinaturas;
    dadosGrafico.datasets[1].data[diaIndex] = cancelamentos;
  });

  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Line data={dadosGrafico} options={options} />
    </div>
  );
}

export default LineChart2;