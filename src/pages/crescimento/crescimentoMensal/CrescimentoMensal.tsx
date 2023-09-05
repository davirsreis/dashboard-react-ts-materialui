import { Box, Card, CardContent, Grid, Typography, TextField, Button, Checkbox, MenuItem, Select, FormControl, ListItemText, Input } from '@mui/material';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';

import { Chart, ArcElement, registerables } from 'chart.js';
Chart.register(...registerables, ArcElement);

import { fetchCrescimento, fetchCrescimentoRegiao, fetchCrescimentoGenero, fetchUpdateCrescimento, fetchUpdateCrescimentoRegiao, fetchUpdateCrescimentoGenero } from '../../../shared/services';
import { calcularCrescimento, calcularFaturamento, calcularOcorrencia } from '../../../shared/services/utils';
import { LayoutBaseDePagina } from '../../../shared/layouts';
import LineChart from './LineChart';
import PieChart from './PieChart';
import BarChart from './BarChart';
import BarChart2 from './BarChart2';
import LineChart2 from './LineChart2';

export const CrescimentoMensal = () => {
  const [dataCrescimento, setDataCrescimento] = useState<{ [ano: string]: { [mes: string]: { total: number } } }>({});
  const [dataCrescimentoRegiao, setDataCrescimentoRegiao] = useState({});
  const [regioesSelecionadas, setRegioesSelecionadas] = useState<string[]>(['Aguas Claras', 'Taguatinga', 'Samambaia', 'Ceilandia', 'Sol Nascente', 'Arniqueiras']);
  const [generosSelecionados, setGenerosSelecionados] = useState<string[]>(['Masculino', 'Feminino']);
  const [numMesesConsiderados, setNumMesesConsiderados] = useState<number>(0);
  const [dataCrescimentoGenero, setDataCrescimentoGenero] = useState([]);
  const [totalCrescimento, setTotalCrescimento] = useState<string>();
  const [mediaCrescimento, setMediaCrescimento] = useState<string>();
  const [totalAssinaturas, setTotalAssinaturas] = useState<string>();
  const [totalCancelamentos, setTotalCancelamentos] = useState<string>();

  const dataInicial = '2020-01-01';
  const dataFinal = '2022-12-31';

  const [startDate, setStartDate] = useState(dataInicial);
  const [endDate, setEndDate] = useState(dataFinal);

  const [periodoSelecionado, setPeriodoSelecionado] = useState<string[]>([moment(dataInicial, 'YYYY/MM/DD').format('DD/MM/YYYY'), moment(dataFinal, 'YYYY/MM/DD').format('DD/MM/YYYY')]);

  // Consultas faturamentos, regioes e generos
  useEffect(() => {
    async function fetchData() {
      const dataCrescimento = await fetchCrescimento(dataInicial, dataFinal);
      setDataCrescimento(dataCrescimento);

      const dataCrescimentoRegiao = await fetchCrescimentoRegiao(dataInicial, dataFinal);
      setDataCrescimentoRegiao(dataCrescimentoRegiao);

      const dataCrescimentoGenero = await fetchCrescimentoGenero(dataInicial, dataFinal);
      setDataCrescimentoGenero(dataCrescimentoGenero);
    }
    fetchData();
  }, []);

  // Calculo da porcentagem de desempenho, média e total de assinaturas e cancelamentos
  useEffect(() => {
    const { porcentagemCrescimento, mediaCrescimento, totalAssinaturas, totalCancelamentos, totalMesesConsiderados } = calcularCrescimento(dataCrescimento);
    setTotalCrescimento(porcentagemCrescimento);
    setMediaCrescimento(mediaCrescimento.toString());
    setTotalAssinaturas(totalAssinaturas.toString());
    setTotalCancelamentos(totalCancelamentos.toString());
    setNumMesesConsiderados(totalMesesConsiderados);
  }, [dataCrescimento]);

  // Atualizando consultas de faturamentos, regioes e generos
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      regioes: regioesSelecionadas.join(','),
      generos: generosSelecionados.join(','),
    });

    async function fetchCrescimentoUpdate() {
      const responseRegiao = await fetchUpdateCrescimentoRegiao(searchParams);
      const responseGenero = await fetchUpdateCrescimentoGenero(searchParams);
      const responseTotal = await fetchUpdateCrescimento(searchParams);

      setDataCrescimentoGenero(responseGenero);
      setDataCrescimentoRegiao(responseRegiao);
      setDataCrescimento(responseTotal);

      setPeriodoSelecionado([startDate, endDate]);
    }

    fetchCrescimentoUpdate();
  };


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
      titulo='índice de desempenho mensal da empresa'
    >
      <Box width="100%" display="flex">
        <form onSubmit={handleSubmit}>
          <Grid container margin={1}>
            <Grid item container spacing={2}>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Data inicial"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  fullWidth
                  inputProps={{
                    min: '2020-01-01',
                    max: '2022-12-31'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Data final"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                  inputProps={{
                    min: '2020-01-01',
                    max: '2022-12-31'
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Select
                    labelId="regioes-label"
                    id="regioes-select"
                    multiple
                    value={regioesSelecionadas}
                    onChange={e => {
                      const newValue = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
                      setRegioesSelecionadas(newValue);
                    }}
                    input={<Input />}
                    renderValue={selected => 'Regiões selecionadas'}
                    displayEmpty={true}
                  >
                    {['Aguas Claras', 'Taguatinga', 'Samambaia', 'Ceilandia', 'Sol Nascente', 'Arniqueiras', 'Outros'].map(regiao => (
                      <MenuItem key={regiao} value={regiao}>
                        <Checkbox checked={regioesSelecionadas.includes(regiao)} />
                        <ListItemText primary={regiao} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Select
                    labelId="generos-label"
                    id="generos-select"
                    multiple
                    value={generosSelecionados}
                    onChange={e => {
                      const newValue = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
                      setGenerosSelecionados(newValue);
                    }}
                    input={<Input />}
                    renderValue={selected => 'Gêneros selecionados'}
                    displayEmpty={true}
                  >

                    {['Masculino', 'Feminino', 'Indefinido'].map(genero => (
                      <MenuItem key={genero} value={genero}>
                        <Checkbox checked={generosSelecionados.includes(genero)} />
                        <ListItemText primary={generoNomes[genero]} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Buscar dados
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>


      <Box width="100%" display="flex">
        <Grid container margin={1}>
          <Grid item container spacing={2}>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">
                    <Typography variant="h6">Desempenho total:</Typography>
                    <Typography
                      variant="h4"
                      style={{ color: Number(totalCrescimento) >= 0 ? 'rgba(82,221,95,1.00)' : 'rgba(255,99,99,1.00)' }}
                    >
                      {Number(totalCrescimento) >= 0 ? '+' : ''}{Number(totalCrescimento) + '%' || 'Carregando...'}
                    </Typography>
                    <Typography variant="subtitle1">{periodoSelecionado[0] || '01-01-2020'} até {periodoSelecionado[1] || '31-12-2022'}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">
                    <Typography variant="h6">Média de desempenho:</Typography>
                    <Typography
                      variant="h4"
                      style={{ color: Number(mediaCrescimento) >= 0 ? 'rgba(82,221,95,1.00)' : 'rgba(255,99,99,1.00)' }}
                    >
                      {Number(mediaCrescimento) >= 0 ? '+' : ''}{Number(mediaCrescimento) + '%' || 'Carregando...'}
                    </Typography>
                    <Typography variant="subtitle1">{numMesesConsiderados} meses considerados</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">
                    <Typography variant="h6">Resumo geral</Typography>
                    <Typography variant="h5">{totalAssinaturas ? (`Assinaturas: ${totalAssinaturas}`) : ('Carregando')}</Typography>
                    <Typography variant="h5">{totalCancelamentos ? (`Cancelamentos: ${totalCancelamentos}`) : ('Carregando')}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                    <Typography variant="subtitle2" fontSize={12}>Índice de desempenho por gêneros</Typography>
                    {dataCrescimentoGenero ? (
                      <PieChart data={dataCrescimentoGenero} />
                    ) : (
                      <Typography variant="h5">Carregando dados...</Typography>
                    )}

                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>

              <Card>
                <CardContent>
                  <Box padding={6} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                    <Typography variant="subtitle2" fontSize={12}>Índice de desempenho mensal ({periodoSelecionado[0]} a {periodoSelecionado[1]})</Typography>
                    {dataCrescimento ? (
                      <LineChart data={dataCrescimento} />
                    ) : (
                      <Typography variant="h5">Carregando dados...</Typography>
                    )}

                  </Box>
                </CardContent>
              </Card>

            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>

              <Card>
                <CardContent>
                  <Box padding={6} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                    <Typography variant="subtitle2" fontSize={12}>Índice de novas assinaturas/cancelamentos</Typography>
                    {dataCrescimento ? (
                      <LineChart2 data={dataCrescimento} />
                    ) : (
                      <Typography variant="h5">Carregando dados...</Typography>
                    )}

                  </Box>
                </CardContent>
              </Card>

            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>

              <Card>
                <CardContent>
                  <Box padding={6} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                    <Typography variant="subtitle2" fontSize={12}>Índice de desempenho por região</Typography>
                    {dataCrescimentoRegiao ? (
                      <BarChart data={dataCrescimentoRegiao} />
                    ) : (
                      <Typography variant="h5">Carregando dados...</Typography>
                    )}

                  </Box>
                </CardContent>
              </Card>

            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>

              <Card>
                <CardContent>
                  <Box padding={6} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                    <Typography variant="subtitle2" fontSize={12}>Índice de novas assinaturas e cancelamentos por região</Typography>
                    {dataCrescimentoRegiao ? (
                      <BarChart2 data={dataCrescimentoRegiao} />
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