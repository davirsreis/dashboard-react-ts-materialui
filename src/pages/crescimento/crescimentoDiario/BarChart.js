import { Bar } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';

function BarChart({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';

  const dadosGrafico = {
    labels: [],
    datasets: [
      {
        label: 'Desempenho',
        data: [],
        backgroundColor: [],
        borderColor: '#fff',
        borderWidth: 0.5,
        hoverBorderColor: '#fff',
        fill: false,
        tension: 0.1
      },
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
        },
      },
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          fontColor: axisLabelColor
        },
        gridLines: {
          color: gridLabelColor
        },
        afterBuildTicks: function (scale) {
          scale.ticks = scale.ticks.map(tick => Math.abs(tick));
        }
      }],
      xAxes: [{
        ticks: {
          fontColor: axisLabelColor,
        },
        gridLines: {
          color: gridLabelColor
        }
      }],
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
          color: axisLabelColor,
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
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return `${data.labels[tooltipItem.index]}: ${value > 0 ? '+' : ''}${value}%`;
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

  const corPositiva = 'rgba(82,221,95,1.00)';
  const corNegativa = 'rgba(255,99,99,1.00)';

  const dadosFormatados = Object.entries(data).map(([regiaoCliente, { crescimento }]) => ({
    regiaoCliente,
    crescimento
  }));

  dadosFormatados.forEach(({ regiaoCliente, crescimento }) => {
    dadosGrafico.labels.push(regiaoCliente);
    dadosGrafico.datasets[0].data.push(crescimento);
    dadosGrafico.datasets[0].backgroundColor.push(crescimento >= 0 ? corPositiva : corNegativa);
  });

  const valores = dadosGrafico.datasets[0].data;
  const valorMaximo = Math.max(...valores);
  const valorMinimo = Math.min(...valores);

  options.scales.y.min = valorMinimo >= 0 ? 0 : valorMinimo;
  options.scales.y.max = Math.max(Math.abs(valorMinimo), valorMaximo);

  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Bar data={dadosGrafico} options={options} />
    </div>
  );
}

export default BarChart;