import { Line } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';
import { Environment } from '../../../shared/environment';

function LineChart2({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';

  const dias = Array.from({ length: 31 }, (_, i) => `Dia ${i + 1}`);
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const cores = Environment.cores;
  const textMes = Environment.mesesNome2;

  const dadosGrafico = {
    labels: dias,
    datasets: [
      {
        data: Array(31).fill(0),
        fill: false,
        backgroundColor: cores[1],
        borderColor: cores[1],
        tension: 0.1,
        label: `Assinaturas (${textMes[Object.keys(data)[0]]})`
      },
      {
        data: Array(31).fill(0),
        fill: false,
        backgroundColor: cores[2],
        borderColor: cores[2],
        tension: 0.1,
        label: `Assinaturas (${textMes[Object.keys(data)[1]]})`
      },
      {
        data: Array(31).fill(0),
        fill: false,
        backgroundColor: cores[3],
        borderColor: cores[3],
        tension: 0.1,
        label: `Cancelamentos (${textMes[Object.keys(data)[0]]})`
      },
      {
        data: Array(31).fill(0),
        fill: false,
        backgroundColor: cores[4],
        borderColor: cores[4],
        tension: 0.1,
        label: `Cancelamentos (${textMes[Object.keys(data)[1]]})`
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: axisLabelColor,
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
      const assinaturas1 = data[Object.keys(data)[0]][dia].assinaturas;
      const assinaturas2 = data[Object.keys(data)[1]][dia].assinaturas;
      const cancelamentos1 = data[Object.keys(data)[0]][dia].cancelamentos;
      const cancelamentos2 = data[Object.keys(data)[1]][dia].cancelamentos;
  
      const diaIndex = Number(dia) - 1;
      dadosGrafico.datasets[0].data[diaIndex] = assinaturas1;
      dadosGrafico.datasets[1].data[diaIndex] = assinaturas2;
      dadosGrafico.datasets[2].data[diaIndex] = cancelamentos1;
      dadosGrafico.datasets[3].data[diaIndex] = cancelamentos2;

      dadosGrafico.datasets[2].hidden = true;
      dadosGrafico.datasets[3].hidden = true;
    });
  });
  
  



  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Line data={dadosGrafico} options={options} />
    </div>
  );
}

export default LineChart2;