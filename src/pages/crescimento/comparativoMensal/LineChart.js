import { Line } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';
import { Environment } from '../../../shared/environment';

function LineChart({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';

  const dias = Array.from({ length: 31 }, (_, i) => `Dia ${i + 1}`);
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const cores = Environment.cores;
  const textMes = Environment.mesesNome2;

  const zeroLineDash = [5, 5];

  const dadosGrafico = {
    labels: dias,
    datasets: [
      {
        data: Array(31).fill(0),
        fill: false,
        backgroundColor: [],
        borderColor: cores[1],
        tension: 0.1,
        label: `${textMes[Object.keys(data)[0]]}`
      },
      {
        data: Array(31).fill(0),
        fill: false,
        backgroundColor: [],
        borderColor: cores[2],
        tension: 0.1,
        label: `${textMes[Object.keys(data)[1]]}`
      },
      {
        label: 'Zero',
        data: Array(31).fill(0),
        fill: false,
        borderColor: axisLabelColor,
        borderDash: zeroLineDash,
        pointRadius: 0,
        borderWidth: 1,
      }

    ],
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
    },
  };

  Object.keys(data).forEach((mes, index) => {
    Object.keys(data[mes]).forEach(dia => {
      const crescimento = data[mes][dia].crescimento;
      const isPositive = crescimento >= 0;

      const diaIndex = Number(dia) - 1;
      dadosGrafico.datasets[index].data[diaIndex] = crescimento;
  
      if (index === 0) {
        dadosGrafico.datasets[index].backgroundColor[diaIndex] = isPositive ? cores[1] : cores[6];
      } else if (index === 1) {
        dadosGrafico.datasets[index].backgroundColor[diaIndex] = isPositive ? cores[2] : cores[6];
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