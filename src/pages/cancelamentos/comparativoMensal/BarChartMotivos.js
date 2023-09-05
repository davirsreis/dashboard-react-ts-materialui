import { Bar } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';
import { Environment } from '../../../shared/environment';

function BarChartMotivos({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';

  const cores = Environment.cores;
  const mesesNome = Environment.mesesNome;

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
  
  Object.entries(data).forEach(([contratos, meses]) => {
    const mesesArray = Object.keys(meses);
    dadosGrafico.labels.push(contratos);
    mesesArray.forEach((mes, index) => {
      dadosGrafico.datasets[index].data.push(meses[mes].total_ocorrencias);
      dadosGrafico.datasets[index].label = `Cancelamentos (${mesesNome[mes]})`;
    });
  });

  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Bar data={dadosGrafico} options={options} />
    </div>
  );
}

export default BarChartMotivos;