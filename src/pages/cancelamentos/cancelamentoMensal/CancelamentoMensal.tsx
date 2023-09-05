import { Box, Card, CardContent, Grid, Typography, TextField, Button, Checkbox, MenuItem, Select, FormControl, ListItemText, Input } from '@mui/material';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';

import { Chart, ArcElement, registerables } from 'chart.js';
Chart.register(...registerables, ArcElement);

import { fetchCancelamento, fetchCancelamentoRegiao, fetchCancelamentoGenero, fetchUpdateCancelamento, fetchUpdateCancelamentoRegiao, fetchUpdateCancelamentoGenero, fetchUpdateCancelamentoMotivo, fetchCancelamentoMotivo } from '../../../shared/services';
import { calcularFaturamento, calcularOcorrencia, obterMelhorEPiorMesOcorrencia } from '../../../shared/services/utils';
import { LayoutBaseDePagina } from '../../../shared/layouts';
import LineChart from './LineChart';
import PieChart from './PieChart';
import BarChart from './BarChart';
import BarChartMotivos from './BarChartMotivos';

export const CancelamentoMensal = () => {
  const [dataCancelamento, setDataCancelamento] = useState<{ [ano: string]: { [mes: string]: { total: number } } }>({});
  const [dataCancelamentoRegiao, setDataCancelamentoRegiao] = useState({});
  const [dataCancelamentoMotivo, setDataCancelamentoMotivo] = useState({});
  const [regioesSelecionadas, setRegioesSelecionadas] = useState<string[]>(['Aguas Claras', 'Taguatinga', 'Samambaia', 'Ceilandia', 'Sol Nascente', 'Arniqueiras']);
  const [motivosSelecionados, setMotivosSelecionados] = useState<string[]>(['Mudança de endereço', 'Inadimplência', 'Outros motivos', 'Contratou outro provedor', 'Insatisfacao']);
  const [generosSelecionados, setGenerosSelecionados] = useState<string[]>(['Masculino', 'Feminino']);
  const [melhorEPiorMes, setMelhorEPiorMes] = useState<(string | null)[]>([]);
  const [numMesesConsiderados, setNumMesesConsiderados] = useState<number>(0);
  const [dataCancelamentoGenero, setDataCancelamentoGenero] = useState([]);
  const [totalCancelamento, setTotalCancelamento] = useState<string>();
  const [mediaCancelamento, setMediaCancelamento] = useState<string>();

  const dataInicial = '2020-01-01';
  const dataFinal = '2022-12-31';

  const [startDate, setStartDate] = useState(dataInicial);
  const [endDate, setEndDate] = useState(dataFinal);

  const [periodoSelecionado, setPeriodoSelecionado] = useState<string[]>([moment(dataInicial, 'YYYY/MM/DD').format('DD/MM/YYYY'), moment(dataFinal, 'YYYY/MM/DD').format('DD/MM/YYYY')]);

  // Consultas faturamentos, regioes e generos
  useEffect(() => {
    async function fetchData() {
      const dataCancelamento = await fetchCancelamento(dataInicial, dataFinal);
      setDataCancelamento(dataCancelamento);

      const dataCancelamentoRegiao = await fetchCancelamentoRegiao(dataInicial, dataFinal);
      setDataCancelamentoRegiao(dataCancelamentoRegiao);

      const dataCancelamentoGenero = await fetchCancelamentoGenero(dataInicial, dataFinal);
      setDataCancelamentoGenero(dataCancelamentoGenero);

      const dataCancelamentoMotivo = await fetchCancelamentoMotivo(dataInicial, dataFinal);
      setDataCancelamentoMotivo(dataCancelamentoMotivo);
    }
    fetchData();
  }, []);

  // Calculo da media, total e número de meses considerados
  useEffect(() => {
    const { totalOcorrencia, mediaOcorrencia, numMesesConsiderados } = calcularOcorrencia(dataCancelamento);
    setNumMesesConsiderados(numMesesConsiderados);
    setTotalCancelamento(totalOcorrencia.toString());
    setMediaCancelamento(mediaOcorrencia.toString());

    const { melhorMes, melhorMesTotal, piorMes, piorMesTotal } = obterMelhorEPiorMesOcorrencia(dataCancelamento);
    setMelhorEPiorMes([melhorMes, melhorMesTotal, piorMes, piorMesTotal]);
  }, [dataCancelamento]);

  // Atualizando consultas de faturamentos, regioes e generos
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      regioes: regioesSelecionadas.join(','),
      generos: generosSelecionados.join(','),
      motivos: motivosSelecionados.join(','),
    });

    async function fetchCancelamentosUpdate() {
      const responseMotivo = await fetchUpdateCancelamentoMotivo(searchParams);
      const responseRegiao = await fetchUpdateCancelamentoRegiao(searchParams);
      const responseGenero = await fetchUpdateCancelamentoGenero(searchParams);
      const responseTotal = await fetchUpdateCancelamento(searchParams);

      setDataCancelamentoMotivo(responseMotivo);
      setDataCancelamentoGenero(responseGenero);
      setDataCancelamentoRegiao(responseRegiao);
      setDataCancelamento(responseTotal);

      setPeriodoSelecionado([startDate, endDate]);
    }

    fetchCancelamentosUpdate();
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
      titulo='Comparando cancelamentos de diferentes meses'
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

              <Grid item xs={12} sm={4}>
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

              <Grid item xs={12} sm={4}>
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

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <Select
                    labelId="motivos-label"
                    id="motivos-select"
                    multiple
                    value={motivosSelecionados}
                    onChange={e => {
                      const newValue = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
                      setMotivosSelecionados(newValue);
                    }}
                    input={<Input />}
                    renderValue={selected => 'Motivos selecionados'}
                    displayEmpty={true}
                  >

                    {['Mudança de endereço', 'Inadimplência', 'Outros motivos', 'Contratou outro provedor', 'Insatisfacao'].map(motivo => (
                      <MenuItem key={motivo} value={motivo}>
                        <Checkbox checked={motivosSelecionados.includes(motivo)} />
                        <ListItemText primary={motivo} />
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
                    <Typography variant="h6">Total de cancelamentos:</Typography>
                    <Typography variant="h5">{totalCancelamento || 'Carregando...'}</Typography>
                    <Typography variant="subtitle1">{periodoSelecionado[0] || '01-01-2020'} até {periodoSelecionado[1] || '31-12-2022'}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">
                    <Typography variant="h6">Média de Cancelamentos:</Typography>
                    <Typography variant="h5">{mediaCancelamento || 'Carregando...'}</Typography>
                    <Typography variant="subtitle1">{numMesesConsiderados} meses considerados</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">
                    <Typography variant="h6">Mais cancelamentos ({melhorEPiorMes?.[0] || 'N/A'}):</Typography>
                    <Typography variant="h5">{melhorEPiorMes?.[1] || 'Carregando...'}</Typography>
                    <Typography variant="h6">Menos cancelamentos ({melhorEPiorMes?.[2] || 'N/A'}):</Typography>
                    <Typography variant="h5">{melhorEPiorMes?.[3] || 'Carregando...'}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                    <Typography variant="subtitle2" fontSize={12}>Cancelamentos mensais (Gêneros)</Typography>
                    {dataCancelamentoGenero ? (
                      <PieChart data={dataCancelamentoGenero} />
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

                    <Typography variant="subtitle2" fontSize={12}>Cancelamentos mensais ({periodoSelecionado[0]} a {periodoSelecionado[1]})</Typography>
                    {dataCancelamento ? (
                      <LineChart data={dataCancelamento} />
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

                    <Typography variant="subtitle2" fontSize={12}>Cancelamentos mensais (Regiões)</Typography>
                    {dataCancelamentoRegiao ? (
                      <BarChart data={dataCancelamentoRegiao} />
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

                    <Typography variant="subtitle2" fontSize={12}>Cancelamentos mensais (Motivos)</Typography>
                    {dataCancelamentoMotivo ? (
                      <BarChartMotivos data={dataCancelamentoMotivo} />
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