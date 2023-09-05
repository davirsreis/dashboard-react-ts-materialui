import { Line } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';
import { Environment } from '../../../shared/environment';

function LineChart({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';

  const dias = Array.from({ length: 31 }, (_, i) => `Dia ${i + 1}`);
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  const textMes = Environment.mesesNome;

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
        data: Array(31).fill(0),
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
        label: `${textMes[Object.keys(data)[0]]}`
      },
      {
        data: Array(31).fill(0),
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
        label: `${textMes[Object.keys(data)[1]]}`
      }
    ],
  };

  Object.keys(data).forEach((mes, index) => {
    Object.keys(data[mes]).forEach(dia => {
      const valorTotal = data[mes][dia].total_ocorrencias;
      const diaIndex = Number(dia) - 1;
      dadosGrafico.datasets[index].data[diaIndex] = valorTotal;
    });
  });



  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Line data={dadosGrafico} options={options} />
    </div>
  );
}

export default LineChart;