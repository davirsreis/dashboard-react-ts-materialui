import { Bar } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';
import { Environment } from '../../../shared/environment';

function BarChartContratos({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';

  const cores = Environment.cores;

  const dadosGrafico = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: cores[0],
        borderColor: '#fff',
        borderWidth: 0.5,
        hoverBorderColor: '#fff',
        fill: false,
        tension: 0.1
      },
      {
        data: [],
        backgroundColor: cores[1],
        borderColor: '#fff',
        borderWidth: 0.5,
        hoverBorderColor: '#fff',
        fill: false,
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14
          },
          color: axisLabelColor
        }
      },
    },
    scales: {
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
        },
        beginAtZero: true,
      },
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
      }
    }
  };


  Object.entries(data).forEach(([contratoCliente, Anos]) => {
    const AnosArray = Object.keys(Anos);
    dadosGrafico.labels.push(contratoCliente);
    AnosArray.forEach((ano, index) => {
      dadosGrafico.datasets[index].data.push(Anos[ano].total_ocorrencias);
      dadosGrafico.datasets[index].label = `Novas assinaturas (${ano})`;
    });
  });

  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Bar data={dadosGrafico} options={options} />
    </div>
  );
}

export default BarChartContratos;