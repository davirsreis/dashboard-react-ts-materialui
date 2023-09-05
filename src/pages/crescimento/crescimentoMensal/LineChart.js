import { Line } from 'react-chartjs-2';

import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';

function LineChart({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.8)' || 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' && 'rgba(255, 255, 255, 0.2)' || 'rgba(0, 0, 0, 0.2)';

  const greenColor = 'rgba(82,221,95,1.00)';
  const redColor = 'rgba(255,99,99,1.00)';
  const zeroLineDash = [5, 5]; 

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const numMes = { 'Jan': 1, 'Fev': 2, 'Mar': 3, 'Abr': 4, 'Mai': 5, 'Jun': 6, 'Jul': 7, 'Ago': 8, 'Set': 9, 'Out': 10, 'Nov': 11, 'Dez': 12 };

  const dadosGrafico = {
    labels: [],
    datasets: [
      {
        label: 'Desempenho',
        data: [],
        fill: false,
        backgroundColor: [],
        borderColor: 'rgba(82,221,95,1.00)',
        tension: 0.1
      },
      {
        label: 'Zero',
        data: [],
        fill: false,
        borderColor: axisLabelColor,
        borderDash: zeroLineDash,
        pointRadius: 0,
        borderWidth: 1
      }
    ]
  };

  Object.keys(data).forEach(ano => {
    Object.keys(data[ano]).forEach(mes => {
      const crescimento = data[ano][mes].crescimento;
      const isPositive = crescimento >= 0;

      const label = meses[Number(mes) - 1];
      dadosGrafico.labels.push(`${label}/${ano}`);
      dadosGrafico.datasets[0].data.push(crescimento);
      dadosGrafico.datasets[0].backgroundColor.push(isPositive ? greenColor : redColor);
  
      dadosGrafico.datasets[1].data.push(0);
    });
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: axisLabelColor,
          filter: (legendItem) => legendItem.text !== 'Zero',
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
    onClick: async (event) => {
      if (event.chart.tooltip.title.length[0] != '') {
        const mes = event.chart.tooltip.title[0].split('/')[0];
        const mesSelecionado = numMes[mes];
        const anoSelecionado = event.chart.tooltip.title[0].split('/')[1];

        window.location.href = `http://localhost:3000/desempenho/mes?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`;
      }
    }

  };


  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Line data={dadosGrafico} options={options} />
    </div>
  );
}

export default LineChart;