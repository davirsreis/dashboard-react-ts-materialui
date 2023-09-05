import { Bar } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';
import { Environment } from '../../../shared/environment';

function BarChart2({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';

  const cores = Environment.cores;
  const mesesNome = Environment.mesesNome2;

  let meses = [];

  if (data && Object.keys(data).length > 0) {
    const regioes = Object.keys(data);
    meses = Object.keys(data[regioes[0]]);
  }



  const dadosGrafico = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: cores[1],
        borderWidth: 0.5,
        hoverBorderColor: '#fff',
        fill: false,
        tension: 0.1,
        label: `Assinaturas (${mesesNome[meses[0]]})`
      },
      {
        data: [],
        backgroundColor: [],
        borderColor: cores[2],
        borderWidth: 0.5,
        hoverBorderColor: '#fff',
        fill: false,
        tension: 0.1,
        label: `Assinaturas (${mesesNome[meses[1]]})`
      },
      {
        data: [],
        backgroundColor: [],
        borderColor: cores[1],
        borderWidth: 0.5,
        hoverBorderColor: '#fff',
        fill: false,
        tension: 0.1,
        label: `Cancelamentos (${mesesNome[meses[0]]})`
      },
      {
        data: [],
        backgroundColor: [],
        borderColor: cores[2],
        borderWidth: 0.5,
        hoverBorderColor: '#fff',
        fill: false,
        tension: 0.1,
        label: `Cancelamentos (${mesesNome[meses[1]]})`
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
    },
    onClick: async (event) => {
      if (event.chart.tooltip.title.length[0] != '') {
        const regiaoSelecionada = event.chart.tooltip.title[0].split('/')[0];
        window.location.href = `http://localhost:3000/regioes?regiao_selecionada=${regiaoSelecionada}`;
      }
    }
  };


  Object.keys(data).forEach(regiaoCliente => {
    const meses = Object.keys(data[regiaoCliente]);
    const assinatura1 = data[regiaoCliente][meses[0]].assinaturas;
    const assinatura2 = data[regiaoCliente][meses[1]].assinaturas;
    const cancelamento1 = data[regiaoCliente][meses[0]].cancelamentos;
    const cancelamento2 = data[regiaoCliente][meses[1]].cancelamentos;

    dadosGrafico.labels.push(regiaoCliente);
    dadosGrafico.datasets[0].data.push(assinatura1);
    dadosGrafico.datasets[1].data.push(assinatura2);
    dadosGrafico.datasets[2].data.push(cancelamento1);
    dadosGrafico.datasets[3].data.push(cancelamento2);
    dadosGrafico.datasets[0].backgroundColor.push(assinatura1 < 0 ? '#dc143c' : cores[1]);
    dadosGrafico.datasets[1].backgroundColor.push(assinatura2 < 0 ? '#dc143c' : cores[2]);
    dadosGrafico.datasets[2].backgroundColor.push(cancelamento1 < 0 ? '#dc143c' : cores[3]);
    dadosGrafico.datasets[3].backgroundColor.push(cancelamento2 < 0 ? '#dc143c' : cores[4]);

    dadosGrafico.datasets[2].hidden = true;
    dadosGrafico.datasets[3].hidden = true;

  });

  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Bar data={dadosGrafico} options={options} />
    </div>
  );
}

export default BarChart2;