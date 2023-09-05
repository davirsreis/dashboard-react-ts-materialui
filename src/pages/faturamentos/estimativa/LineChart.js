import { Line } from 'react-chartjs-2';
import { Environment } from '../../../shared/environment';
import { UseAppThemeContext } from '../../../shared/contexts/ThemeContext';

function LineChart({ data }) {
  const { themeName } = UseAppThemeContext();
  const axisLabelColor = themeName === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.9)';
  const gridLabelColor = themeName === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
  const cores = Environment.cores;

  const dadosGrafico = {
    labels: [],
    datasets: [
      {
        label: 'Dados reais',
        data: [],
        borderColor: cores[1],
        fill: false,
        tension: 0.1
      },
      {
        label: 'Dados previstos',
        data: [],
        borderColor: 'rgba(255,99,99,1.00)',
        fill: false,
        tension: 0.1
      }
    ]
  };

  // Dados reais e previstos
  for (let i = 0; i < data.labelsCompletos.length; i++) {
    const valorObservado = data.dadosCompletos[i] && data.dadosCompletos[i][0] ? data.dadosCompletos[i][0] : null;
    dadosGrafico.labels.push(Environment.dataCompletaFormatada[data.labelsCompletos[i]]);
    dadosGrafico.datasets[0].data.push(valorObservado);

    if (i >= 0) {
      const valorPrevisto = data.dadosPrevisao[i - 0][0];
      dadosGrafico.datasets[1].data.push(valorPrevisto);
    } else {
      dadosGrafico.datasets[1].data.push(null);
    }
  }

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
          color: axisLabelColor,
          offset: true
        }
      },
      y: {
        min: 157000,
        max: 161000,
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

  return (
    <div style={{ height: 'auto', width: '70%' }}>
      <Line data={dadosGrafico} options={options} />
    </div>
  );
}

export default LineChart;
