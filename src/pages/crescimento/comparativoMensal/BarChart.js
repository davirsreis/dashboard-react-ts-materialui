import { Bar } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';
import { Environment } from '../../../shared/environment';

function BarChart({ data }) {
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
        label: `Desempenho (${mesesNome[meses[0]]})`
      },
      {
        data: [],
        backgroundColor: [],
        borderColor: cores[2],
        borderWidth: 0.5,
        hoverBorderColor: '#fff',
        fill: false,
        tension: 0.1,
        label: `Desempenho (${mesesNome[meses[1]]})`
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
    const crescimento1 = data[regiaoCliente][meses[0]].crescimento;
    const crescimento2 = data[regiaoCliente][meses[1]].crescimento;

    dadosGrafico.labels.push(regiaoCliente);
    dadosGrafico.datasets[0].data.push(crescimento1);
    dadosGrafico.datasets[1].data.push(crescimento2);
    dadosGrafico.datasets[0].backgroundColor.push(crescimento1 < 0 ? '#dc143c' : cores[1]);
    dadosGrafico.datasets[1].backgroundColor.push(crescimento2 < 0 ? '#dc143c' : cores[2]);
  });

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