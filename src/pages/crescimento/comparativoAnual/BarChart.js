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
        label: 'Desempenho (2022)',
        data: [],
        backgroundColor: [],
        borderColor: '#fff',
        borderWidth: 0.5,
        hoverBorderColor: '#fff',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Desempenho (2021)',
        data: [],
        backgroundColor: [],
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

  let obj = [];

  if (Object.values(data)[0]) {
    obj = Object.values(data)[0];


    Object.entries(data).forEach(([regiaoCliente, { [Object.keys(obj)[0]]: { crescimento: totalCrescimentoPeriodo1 }, [Object.keys(obj)[1]]: { crescimento: totalCrescimentoPeriodo2 } }]) => {
      dadosGrafico.labels.push(regiaoCliente);
      dadosGrafico.datasets[0].data.push(totalCrescimentoPeriodo2);
      dadosGrafico.datasets[1].data.push(totalCrescimentoPeriodo1);

      dadosGrafico.datasets[0].backgroundColor.push(totalCrescimentoPeriodo2 >= 0 ? cores[1] : cores[6]);
      dadosGrafico.datasets[1].backgroundColor.push(totalCrescimentoPeriodo1 >= 0 ? cores[2] : cores[6]);

      dadosGrafico.datasets[0].label = `Crescimento (${Object.keys(obj)[1]})`;
      dadosGrafico.datasets[1].label = `Crescimento (${Object.keys(obj)[0]})`;
    });
  }

  const valoresDataset1 = dadosGrafico.datasets[0].data;
  const valorMaximoDataset1 = Math.max(...valoresDataset1);
  const valorMinimoDataset1 = Math.min(...valoresDataset1);

  const valoresDataset2 = dadosGrafico.datasets[1].data;
  const valorMaximoDataset2 = Math.max(...valoresDataset2);
  const valorMinimoDataset2 = Math.min(...valoresDataset2);

  const maiorValorPositivo = Math.max(valorMaximoDataset1, valorMaximoDataset2);
  const maiorValorNegativo = Math.min(valorMinimoDataset1, valorMinimoDataset2);

  const maiorValorAbsoluto = Math.max(Math.abs(maiorValorPositivo), Math.abs(maiorValorNegativo));

  options.scales.y.min = -maiorValorAbsoluto;
  options.scales.y.max = maiorValorAbsoluto;

  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Bar data={dadosGrafico} options={options} />
    </div>
  );
}

export default BarChart;