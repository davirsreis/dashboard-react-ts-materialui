import { Line } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';
import { Environment } from '../../../shared/environment';

function LineChart({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';

  const cores = Environment.cores;

  const zeroLineDash = [5, 5];

  const dadosGrafico = {
    labels: [],
    datasets: [
      {
        label: `Ano de ${Object.keys(data)[1]}`,
        data: [],
        fill: false,
        backgroundColor: [],
        borderColor: cores[1],
        tension: 0.1
      },
      {
        label: `Ano de ${Object.keys(data)[0]}`,
        data: [],
        fill: false,
        backgroundColor: [],
        borderColor: cores[2],
        tension: 0.1
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

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  Object.keys(data).forEach(ano => {
    Object.keys(data[ano]).forEach(mes => {
      const crescimento = data[ano][mes].crescimento;
      const isPositive = crescimento >= 0;

      if (ano === Object.keys(data)[1]) {
        const label = meses[Number(mes) - 1];
        dadosGrafico.labels.push(label);
        dadosGrafico.datasets[0].data.push(crescimento);
        dadosGrafico.datasets[0].backgroundColor.push(isPositive ? cores[1] : cores[6]);
      } else if (ano === Object.keys(data)[0]) {
        dadosGrafico.datasets[1].data.push(crescimento);
        dadosGrafico.datasets[1].backgroundColor.push(isPositive ? cores[2] : cores[6]);
      }

      dadosGrafico.datasets[2].data.push(0);
    });
  });

  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Line data={dadosGrafico} options={options} />
    </div>
  );
}

export default LineChart;