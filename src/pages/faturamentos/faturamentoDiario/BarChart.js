import { Bar } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';
import { Environment } from '../../../shared/environment';

function BarChart({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';

  const cores = Environment.cores;

  const dadosGrafico = {
    labels: [],
    datasets: [
      {
        label: 'Faturamento total',
        data: [],
        backgroundColor: cores,
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
        display: false,
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
    },
    onClick: async (event) => {
      if (event.chart.tooltip.title.length[0] != '') {
        const regiaoSelecionada = event.chart.tooltip.title[0].split('/')[0];
        window.location.href = `http://localhost:3000/regioes?regiao_selecionada=${regiaoSelecionada}`;
      }
    }
  };

  const dadosFormatados = Object.entries(data).map(([regiaoCliente, { total_valor }]) => ({
    regiaoCliente,
    total_valor,
  }));

  dadosFormatados.forEach(({ regiaoCliente, total_valor }) => {
    dadosGrafico.labels.push(regiaoCliente);
    dadosGrafico.datasets[0].data.push(total_valor);
  });

  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Bar data={dadosGrafico} options={options} />
    </div>
  );
}

export default BarChart;