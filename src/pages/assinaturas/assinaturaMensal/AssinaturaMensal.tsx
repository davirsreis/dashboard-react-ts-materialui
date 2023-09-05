import { Box, Card, CardContent, Grid, Typography, TextField, Button, Checkbox, MenuItem, Select, FormControl, ListItemText, Input } from '@mui/material';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';

import { Chart, ArcElement, registerables } from 'chart.js';
Chart.register(...registerables, ArcElement);

import { fetchAssinatura, fetchAssinaturaRegiao, fetchAssinaturaGenero, fetchUpdateAssinatura, fetchUpdateAssinaturaRegiao, fetchUpdateAssinaturaGenero, fetchUpdateAssinaturaContrato, fetchAssinaturaContrato } from '../../../shared/services';
import { calcularFaturamento, calcularOcorrencia, obterMelhorEPiorMesOcorrencia } from '../../../shared/services/utils';
import { LayoutBaseDePagina } from '../../../shared/layouts';
import LineChart from './LineChart';
import PieChart from './PieChart';
import BarChart from './BarChart';
import BarChartContratos from './BarChartContratos';

export const AssinaturaMensal = () => {
  const [dataAssinatura, setDataAssinatura] = useState<{ [ano: string]: { [mes: string]: { total: number } } }>({});
  const [dataAssinaturaRegiao, setDataAssinaturaRegiao] = useState({});
  const [dataAssinaturaContrato, setDataAssinaturaContrato] = useState({});
  const [regioesSelecionadas, setRegioesSelecionadas] = useState<string[]>(['Aguas Claras', 'Taguatinga', 'Samambaia', 'Ceilandia', 'Sol Nascente', 'Arniqueiras']);
  const [contratosSelecionados, setContratosSelecionados] = useState<string[]>(['200_MEGA', '20_MEGA', '60_MEGA', '50_MEGA', '10_MEGA', '100_MEGA', '300_MEGA']);
  const [generosSelecionados, setGenerosSelecionados] = useState<string[]>(['Masculino', 'Feminino']);
  const [numMesesConsiderados, setNumMesesConsiderados] = useState<number>(0);
  const [melhorEPiorMes, setMelhorEPiorMes] = useState<(string | null)[]>([]);
  const [dataAssinaturaGenero, setDataAssinaturaGenero] = useState([]);
  const [totalAssinatura, setTotalAssinatura] = useState<string>();
  const [mediaAssinatura, setMediaAssinatura] = useState<string>();
  const [totalOcorrencia, setTotalOcorrencia] = useState<string>();
  const [mediaOcorrencia, setMediaOcorrencia] = useState<string>();

  const dataInicial = '2020-01-01';
  const dataFinal = '2022-12-31';

  const [startDate, setStartDate] = useState(dataInicial);
  const [endDate, setEndDate] = useState(dataFinal);

  const [periodoSelecionado, setPeriodoSelecionado] = useState<string[]>([moment(dataInicial, 'YYYY/MM/DD').format('DD/MM/YYYY'), moment(dataFinal, 'YYYY/MM/DD').format('DD/MM/YYYY')]);

  // Consultas faturamentos, regioes e generos
  useEffect(() => {
    async function fetchData() {
      const dataAssinatura = await fetchAssinatura(dataInicial, dataFinal);
      setDataAssinatura(dataAssinatura);

      const dataAssinaturaRegiao = await fetchAssinaturaRegiao(dataInicial, dataFinal);
      setDataAssinaturaRegiao(dataAssinaturaRegiao);

      const dataAssinaturaGenero = await fetchAssinaturaGenero(dataInicial, dataFinal);
      setDataAssinaturaGenero(dataAssinaturaGenero);

      const dataAssinaturaContrato = await fetchAssinaturaContrato(dataInicial, dataFinal);
      setDataAssinaturaContrato(dataAssinaturaContrato);
    }
    fetchData();
  }, []);

  // Calculo da media, total e número de meses considerados
  useEffect(() => {
    const { totalFaturamento, mediaFaturamento, numMesesConsiderados } = calcularFaturamento(dataAssinatura);
    const { totalOcorrencia, mediaOcorrencia } = calcularOcorrencia(dataAssinatura);

    setNumMesesConsiderados(numMesesConsiderados);
    setTotalAssinatura(totalFaturamento);
    setMediaAssinatura(mediaFaturamento);

    setTotalOcorrencia(totalOcorrencia.toString());
    setMediaOcorrencia(mediaOcorrencia.toString());

    const { melhorMes, melhorMesTotal, piorMes, piorMesTotal } = obterMelhorEPiorMesOcorrencia(dataAssinatura);
    setMelhorEPiorMes([melhorMes, melhorMesTotal, piorMes, piorMesTotal]);
  }, [dataAssinatura]);

  // Atualizando consultas de faturamentos, regioes e generos
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      regioes: regioesSelecionadas.join(','),
      generos: generosSelecionados.join(','),
      contratos: contratosSelecionados.join(','),
    });

    async function fetchAssinaturasUpdate() {
      const responseContrato = await fetchUpdateAssinaturaContrato(searchParams);
      const responseRegiao = await fetchUpdateAssinaturaRegiao(searchParams);
      const responseGenero = await fetchUpdateAssinaturaGenero(searchParams);
      const responseTotal = await fetchUpdateAssinatura(searchParams);

      setDataAssinaturaContrato(responseContrato);
      setDataAssinaturaGenero(responseGenero);
      setDataAssinaturaRegiao(responseRegiao);
      setDataAssinatura(responseTotal);

      setPeriodoSelecionado([startDate, endDate]);
    }

    fetchAssinaturasUpdate();
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
      titulo='Assinatura mensal da empresa'
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
                    labelId="contratos-label"
                    id="contratos-select"
                    multiple
                    value={contratosSelecionados}
                    onChange={e => {
                      const newValue = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
                      setContratosSelecionados(newValue);
                    }}
                    input={<Input />}
                    renderValue={selected => 'Contratos selecionados'}
                    displayEmpty={true}
                  >

                    {['200_MEGA', '20_MEGA', '60_MEGA', '50_MEGA', '10_MEGA', '100_MEGA', '300_MEGA', 'OUTROS', '500_MEGA'].map(contrato => (
                      <MenuItem key={contrato} value={contrato}>
                        <Checkbox checked={contratosSelecionados.includes(contrato)} />
                        <ListItemText primary={contrato} />
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
                    <Typography variant="h6">Total de novos assinantes:</Typography>
                    <Typography variant="h5">{totalOcorrencia || 'Carregando...'}</Typography>
                    <Typography variant="subtitle1">{periodoSelecionado[0] || '01-01-2020'} até {periodoSelecionado[1] || '31-12-2022'}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">
                    <Typography variant="h6">Média mensal de novas assinaturas:</Typography>
                    <Typography variant="h5">{mediaOcorrencia || 'Carregando...'}</Typography>
                    <Typography variant="subtitle1">{numMesesConsiderados} meses considerados</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">
                    <Typography variant="h6">Mais assinaturas ({melhorEPiorMes?.[0] || 'N/A'}):</Typography>
                    <Typography variant="h5">{melhorEPiorMes?.[1] || 'Carregando...'}</Typography>
                    <Typography variant="h6">Menos assinaturas ({melhorEPiorMes?.[2] || 'N/A'}):</Typography>
                    <Typography variant="h5">{melhorEPiorMes?.[3] || 'Carregando...'}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                    <Typography variant="subtitle2" fontSize={12}>Distruibuição de assinaturas por gêneros</Typography>
                    {dataAssinaturaGenero ? (
                      <PieChart data={dataAssinaturaGenero} />
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

                    <Typography variant="subtitle2" fontSize={12}>Novas assinaturas mensais</Typography>
                    {dataAssinatura ? (
                      <LineChart data={dataAssinatura} />
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

                    <Typography variant="subtitle2" fontSize={12}>Novas assinaturas (Regiões)</Typography>
                    {dataAssinaturaRegiao ? (
                      <BarChart data={dataAssinaturaRegiao} />
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

                    <Typography variant="subtitle2" fontSize={12}>Novas assinaturas (Contratos)</Typography>
                    {dataAssinaturaContrato ? (
                      <BarChartContratos data={dataAssinaturaContrato} />
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