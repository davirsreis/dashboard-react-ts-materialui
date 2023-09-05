import { Bar } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';
import { Environment } from '../../../shared/environment';

function BarChart2({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';
  
  const cores = Environment.cores;

  const dadosGrafico = {
    labels: [],
    datasets: [
      {
        label: 'Assinaturas (2022)',
        data: [],
        backgroundColor: cores[1],
        borderColor: '#fff',
        borderWidth: 0.5,
        hoverBorderColor: '#fff',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Assinaturas (2021)',
        data: [],
        backgroundColor: cores[2],
        borderColor: '#fff',
        borderWidth: 0.5,
        hoverBorderColor: '#fff',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Cancelamentos (2022)',
        data: [],
        backgroundColor: cores[3],
        borderColor: '#fff',
        borderWidth: 0.5,
        hoverBorderColor: '#fff',
        fill: false,
        tension: 0.1
      },
      {
        label: 'Cancelamentos (2021)',
        data: [],
        backgroundColor: cores[4],
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

    Object.entries(data).forEach(([regiaoCliente, { [Object.keys(obj)[0]]: { assinaturas: totalAssinaturasPeriodo1, cancelamentos: totalCancelamentosPeriodo1 }, [Object.keys(obj)[1]]: { assinaturas: totalAssinaturasPeriodo2, cancelamentos: totalCancelamentosPeriodo2 } }]) => {
      dadosGrafico.labels.push(regiaoCliente);
      dadosGrafico.datasets[0].data.push(totalAssinaturasPeriodo2);
      dadosGrafico.datasets[1].data.push(totalAssinaturasPeriodo1);
      dadosGrafico.datasets[2].data.push(totalCancelamentosPeriodo2);
      dadosGrafico.datasets[3].data.push(totalCancelamentosPeriodo1);

      dadosGrafico.datasets[0].label = `Novas assinaturas (${Object.keys(obj)[1]})`;
      dadosGrafico.datasets[1].label = `Novas assinaturas (${Object.keys(obj)[0]})`;
      dadosGrafico.datasets[2].label = `Cancelamentos (${Object.keys(obj)[1]})`;
      dadosGrafico.datasets[3].label = `Cancelamentos (${Object.keys(obj)[0]})`;

      dadosGrafico.datasets[2].hidden = true;
      dadosGrafico.datasets[3].hidden = true;
    });
  }

  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Bar data={dadosGrafico} options={options} />
    </div>
  );
}

export default BarChart2;