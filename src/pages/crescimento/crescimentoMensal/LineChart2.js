import { Line } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';

function LineChart2({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const numMes = { 'Jan': 1, 'Fev': 2, 'Mar': 3, 'Abr': 4, 'Mai': 5, 'Jun': 6, 'Jul': 7, 'Ago': 8, 'Set': 9, 'Out': 10, 'Nov': 11, 'Dez': 12 };

  const dadosGrafico = {
    labels: [],
    datasets: [
      {
        label: 'Novas Assinaturas',
        data: [],
        fill: false,
        borderColor: 'rgba(82,221,95,1.00)',
        backgroundColor: 'rgba(82,221,95,1.00)',
        tension: 0.1
      },
      {
        label: 'Cancelamentos',
        data: [],
        fill: false,
        borderColor: 'rgba(255,99,99,1.00)',
        backgroundColor: 'rgba(255,99,99,1.00)',
        tension: 0.1
      },
    ]
  };

  Object.keys(data).forEach(ano => {
    Object.keys(data[ano]).forEach(mes => {
      const assinaturas = data[ano][mes].assinaturas;
      const cancelamentos = data[ano][mes].cancelamentos;

      const label = meses[Number(mes) - 1];
      dadosGrafico.labels.push(`${label}/${ano}`);
      dadosGrafico.datasets[0].data.push(assinaturas);
      dadosGrafico.datasets[1].data.push(cancelamentos);
    });
  });

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


  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Line data={dadosGrafico} options={options} />
    </div>
  );
}

export default LineChart2;