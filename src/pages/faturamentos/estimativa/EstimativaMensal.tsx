import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';

import { Chart, ArcElement, registerables } from 'chart.js';
Chart.register(...registerables, ArcElement);

import { fetchFaturamentos, fetchFaturamentosRegiao, fetchFaturamentosGenero } from '../../../shared/services';
import { LayoutBaseDePagina } from '../../../shared/layouts';
import LineChart from './LineChart';

export const EstimativaMensal = () => {
  const [dataFaturamento, setDataFaturamento] = useState<{ [ano: string]: { [mes: string]: { total: number } } }>({});
  const [dataFaturamentoEstimativa, setDataFaturamentoEstimativa] = useState<{
    dadosObservados: any[],
    labelsObservados: any[],
    dadosPrevisao: any[],
    labelsPrevisao: any[],
    dadosCompletos: any[],
    labelsCompletos: any[]
  } | undefined>(undefined);
  
  const [dataFaturamentoRegiao, setDataFaturamentoRegiao] = useState({});
  const [dataFaturamentoGenero, setDataFaturamentoGenero] = useState([]);

  const dataInicial = '2020-01-01';
  const dataFinal = '2022-09-30';

  const [periodoSelecionado, setPeriodoSelecionado] = useState<string[]>([moment(dataInicial, 'YYYY/MM/DD').format('DD/MM/YYYY'), moment(dataFinal, 'YYYY/MM/DD').format('DD/MM/YYYY')]);

  // Consultas faturamentos, regioes e generos
  useEffect(() => {
    async function fetchData() {
      // const dataFaturamento = await fetchFaturamentos(dataInicial, dataFinal);
      // setDataFaturamento(dataFaturamento);

      const dataFaturamentoRegiao = await fetchFaturamentosRegiao(dataInicial, dataFinal);
      setDataFaturamentoRegiao(dataFaturamentoRegiao);

      const dataFaturamentoGenero = await fetchFaturamentosGenero(dataInicial, dataFinal);
      setDataFaturamentoGenero(dataFaturamentoGenero);

      const dataFaturamento = await fetchFaturamentos(dataInicial, dataFinal);
      setDataFaturamento(dataFaturamento);

      const response = await fetch(`http://127.0.0.1:5000/estimativa-faturamento?data_inicial=${dataInicial}&data_final=${dataFinal}`);
      const data = await response.json();
      
      const df1Data = JSON.parse(data.df1);
      const df2Data = JSON.parse(data.df2);
      const df3Data = JSON.parse(data.df3);

      setDataFaturamentoEstimativa({
        dadosObservados: df1Data.data,
        labelsObservados: df1Data.index,
        dadosPrevisao: df2Data.data,
        labelsPrevisao: df2Data.index,
        dadosCompletos: df3Data.data,
        labelsCompletos: df3Data.index,
      });
      
      
    }
    fetchData();
  }, []);

  type GeneroNomes = {
    [key: string]: string;
  }

  const generoNomes: GeneroNomes = {
    'Indefinido': 'Indefinido',
    'Masculino': 'Masculino',
    'Feminino': 'Feminino',
  };

  return (
    <LayoutBaseDePagina
      titulo='Estimativa dos faturamentos mensais da empresa'
    >

      <Box width="100%" display="flex">
        <Grid container margin={1}>
          <Grid item container spacing={2}>

            <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>

              <Card>
                <CardContent>
                  <Box padding={6} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                    <Typography variant="subtitle2" fontSize={12}>Estimativa dos faturamentos em três meses</Typography>
                    {dataFaturamentoEstimativa ? (
                      <LineChart data={dataFaturamentoEstimativa} />
                    ) : (
                      <Typography variant="h5">Carregando dados...</Typography>
                    )}

                  </Box>
                </CardContent>
              </Card>

            </Grid>

          </Grid>
        </Grid>

      </Box>
    </LayoutBaseDePagina>
  );
};