import { Line } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';
import { Environment } from '../../../shared/environment';

function LineChart2({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';

  const cores = Environment.cores;

  const dadosGrafico = {
    labels: [],
    datasets: [
      {
        label: `Assinaturas (${Object.keys(data)[1]})`,
        data: [],
        fill: false,
        borderColor: cores[1],
        backgroundColor: cores[1],
        tension: 0.1
      },
      {
        label: `Assinaturas (${Object.keys(data)[0]})`,
        data: [],
        fill: false,
        borderColor: cores[2],
        backgroundColor: cores[2],
        tension: 0.1
      },
      {
        label: `Cancelamentos (${Object.keys(data)[1]})`,
        data: [],
        fill: false,
        borderColor: cores[3],
        backgroundColor: cores[3],
        tension: 0.1
      },
      {
        label: `Cancelamentos (${Object.keys(data)[0]})`,
        data: [],
        fill: false,
        borderColor: cores[4],
        backgroundColor: cores[4],
        tension: 0.1
      }
    ]
  };

  
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        hidden: {
          index: 0
        },
        labels: {
          color: axisLabelColor,
        },
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

  Object.keys(data).forEach(ano => {
    Object.keys(data[ano]).forEach(mes => {
      const assinaturas = data[ano][mes].assinaturas;
      const cancelamentos = data[ano][mes].cancelamentos;

      dadosGrafico.datasets[2].hidden = true;
      dadosGrafico.datasets[3].hidden = true;

      if (ano === Object.keys(data)[1]) {
        const label = meses[Number(mes) - 1];
        dadosGrafico.labels.push(label);
        dadosGrafico.datasets[0].data.push(assinaturas);
        dadosGrafico.datasets[2].data.push(cancelamentos);
      } else if (ano === Object.keys(data)[0]) {
        dadosGrafico.datasets[1].data.push(assinaturas);
        dadosGrafico.datasets[3].data.push(cancelamentos);
      }
    });
  });

  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Line data={dadosGrafico} options={options} />
    </div>
  );
}

export default LineChart2;