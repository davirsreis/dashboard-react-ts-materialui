import { Line } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';

function LineChart({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';

  const greenColor = 'rgba(82,221,95,1.00)';
  const redColor = 'rgba(255,99,99,1.00)';
  const zeroLineDash = [5, 5]; 

  const dadosGrafico = {
    labels: [],
    datasets: [
      {
        label: 'Desempenho',
        data: [],
        fill: false,
        tension: 0.1,
        backgroundColor: [],
        borderColor: 'rgba(82,221,95,1.00)',
      },
      {
        label: 'Zero',
        data: [],
        fill: false,
        borderColor: axisLabelColor,
        borderDash: zeroLineDash,
        pointRadius: 0,
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: axisLabelColor,
          filter: (legendItem) => legendItem.text !== 'Zero',
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
    const crescimento = data[dia].crescimento;
    const isPositive = crescimento >= 0;

    dadosGrafico.labels.push('Dia ' +dia);
    dadosGrafico.datasets[0].data.push(crescimento);
    dadosGrafico.datasets[0].backgroundColor.push(isPositive ? greenColor : redColor);

    dadosGrafico.datasets[1].data.push(0);
  });

  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Line data={dadosGrafico} options={options} />
    </div>
  );
}

export default LineChart;