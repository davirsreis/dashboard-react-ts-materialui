import { Box, Card, CardContent, Grid, Typography, Button, Checkbox, MenuItem, Select, FormControl, ListItemText, Input } from '@mui/material';
import { useEffect, useState } from 'react';

import { Chart, ArcElement, registerables } from 'chart.js';
Chart.register(...registerables, ArcElement);

import { fetchCancelamentoDComparativo, fetchCancelamentoGeneroDComparativo, fetchCancelamentoRegiaoDComparativo, fetchUpdateCancelamentoDComparativo, fetchUpdateCancelamentoGeneroDComparativo, fetchUpdateCancelamentoRegiaoDComparativo, fetchCancelamentoMotivoDComparativo, fetchUpdateCancelamentoMotivoDComparativo } from '../../../shared/services';
import { calcularComparativoOcorrenciaMensal } from '../../../shared/services/utils';
import { LayoutBaseDePagina } from '../../../shared/layouts';
import LineChart from './LineChart';
import PieChart from './PieChart1';
import BarChart from './BarChart';
import BarChartMotivos from './BarChartMotivos';
import PieChart2 from './PieChart2';
import { Environment } from '../../../shared/environment';

export const CancelamentoComparativoMensal = () => {
  const [regioesSelecionadas, setRegioesSelecionadas] = useState<string[]>(['Aguas Claras', 'Taguatinga', 'Samambaia', 'Ceilandia', 'Sol Nascente', 'Arniqueiras']);
  const [motivosSelecionados, setMotivosSelecionados] = useState<string[]>(['Mudança de endereço', 'Inadimplência', 'Outros motivos', 'Contratou outro provedor', 'Insatisfacao']);
  const [dataCancelamentoMotivo, setDataCancelamentoMotivo] = useState<{ [ano: string]: { [motivo: string]: { total_valor: number } } }>({});
  const [dataCancelamentoRegiao, setDataCancelamentoRegiao] = useState<{ [ano: string]: { [regiao: string]: { total_valor: number } } }>({});
  const [dataCancelamento, setDataCancelamento] = useState<{ [ano: string]: { [mes: string]: { total: number } } }>({});
  const [primeiroMesSelecionado, setPrimeiroMesSelecionado] = useState<string[]>(['11', '2022', 'Nov/2022']);
  const [segundoMesSelecionado, setSegundoMesSelecionado] = useState<string[]>(['12', '2022', 'Dez/2022']);
  const [generosSelecionados, setGenerosSelecionados] = useState<string[]>(['Masculino', 'Feminino']);
  const [numMesesConsiderados, setNumMesesConsiderados] = useState<number>(0);
  const [dataCancelamentoGenero, setDataCancelamentoGenero] = useState([]);
  const [totalCancelamento, setTotalCancelamento] = useState<string>();
  const [mediaCancelamento, setMediaCancelamento] = useState<string>();

  const [cancelamentoPeriodo1, setCancelamentoPeriodo1] = useState<string>();
  const [cancelamentoPeriodo2, setCancelamentoPeriodo2] = useState<string>();
  const [comparativoDiferenca, setComparativoDiferenca] = useState<string>();

  const [periodoSelecionado, setPeriodoSelecionado] = useState<string[]>([primeiroMesSelecionado[2], segundoMesSelecionado[2]]);
  const primeiroMes = ([primeiroMesSelecionado[0], primeiroMesSelecionado[1]]);
  const segundoMes = ([segundoMesSelecionado[0], segundoMesSelecionado[1]]);

  // Consultas faturamentos, regioes e generos
  useEffect(() => {
    async function fetchData() {

      const dataCancelamento = await fetchCancelamentoDComparativo(primeiroMes, segundoMes);

      const dataCancelamentoRegiao = await fetchCancelamentoRegiaoDComparativo(primeiroMes, segundoMes);

      const dataCancelamentoGenero = await fetchCancelamentoGeneroDComparativo(primeiroMes, segundoMes);

      const dataCancelamentoMotivo = await fetchCancelamentoMotivoDComparativo(primeiroMes, segundoMes);

      setDataCancelamento(dataCancelamento);
      setDataCancelamentoRegiao(dataCancelamentoRegiao);
      setDataCancelamentoGenero(dataCancelamentoGenero);
      setDataCancelamentoMotivo(dataCancelamentoMotivo);
    }
    fetchData();
  }, []);

  // Calculo da media, total e número de meses considerados
  useEffect(() => {
    const { comparativoAnual, totalOcorrenciaPeriodo1, totalOcorrenciaPeriodo2 } = calcularComparativoOcorrenciaMensal(dataCancelamento);
    setComparativoDiferenca(comparativoAnual);
    setCancelamentoPeriodo1(totalOcorrenciaPeriodo1);
    setCancelamentoPeriodo2(totalOcorrenciaPeriodo2);
  }, [dataCancelamento]);

  // Atualizando consultas de faturamentos, regioes e generos
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setPeriodoSelecionado([primeiroMesSelecionado[2], segundoMesSelecionado[2]]);

    const params = {
      primeiro_mes: primeiroMes.join(','),
      segundo_mes: segundoMes.join(','),
      regioes: regioesSelecionadas.join(','),
      generos: generosSelecionados.join(','),
      motivos: motivosSelecionados.join(','),
    };

    const encodedSearchParams = new URLSearchParams(params);

    async function fetchCancelamentoUpdate() {
      const responseMotivo = await fetchUpdateCancelamentoMotivoDComparativo(encodedSearchParams);
      const responseRegiao = await fetchUpdateCancelamentoRegiaoDComparativo(encodedSearchParams);
      const responseGenero = await fetchUpdateCancelamentoGeneroDComparativo(encodedSearchParams);
      const responseTotal = await fetchUpdateCancelamentoDComparativo(encodedSearchParams);

      setDataCancelamentoMotivo(responseMotivo);
      setDataCancelamentoGenero(responseGenero);
      setDataCancelamentoRegiao(responseRegiao);
      setDataCancelamento(responseTotal);
    }

    fetchCancelamentoUpdate();
  };


  type GeneroNomes = {
    [key: string]: string;
  }

  const generoNomes: GeneroNomes = {
    'Indefinido': 'Indefinido',
    'Masculino': 'Masculino',
    'Feminino': 'Feminino',
  };

  const meses = Environment.anoMes;

  return (
    <LayoutBaseDePagina
      titulo='Comparando cancelamentos em diferentes meses'
    >
      <Box width="100%" display="flex">
        <form onSubmit={handleSubmit}>
          <Grid container margin={1}>
            <Grid item container spacing={2}>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Select
                    labelId="mes-label"
                    id="mes-select"
                    value={primeiroMesSelecionado.join(',')}
                    onChange={(e) => {
                      const valor = e.target.value.split(',')[0];
                      const valor2 = e.target.value.split(',')[1];
                      const nome = e.target.value.split(',')[2];
                      setPrimeiroMesSelecionado([valor, valor2, nome]);
                    }}
                    input={<Input />}
                    renderValue={(selected) => primeiroMesSelecionado[2]}
                    displayEmpty={true}
                    multiple={false}
                    MenuProps={{ style: { maxHeight: '500px' } }}
                  >
                    {meses.map((mes) => (
                      <MenuItem key={mes.nome} value={`${mes.valor},${mes.nome}`}>
                        <Checkbox checked={primeiroMesSelecionado[2] === mes.nome.toString()} />
                        <ListItemText primary={mes.nome} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Select
                    labelId="mes-label"
                    id="mes-select"
                    value={segundoMesSelecionado.join(',')}
                    onChange={(e) => {
                      const valor = e.target.value.split(',')[0];
                      const valor2 = e.target.value.split(',')[1];
                      const nome = e.target.value.split(',')[2];
                      setSegundoMesSelecionado([valor, valor2, nome]);
                    }}
                    input={<Input />}
                    renderValue={(selected) => segundoMesSelecionado[2]}
                    displayEmpty={true}
                    multiple={false}
                    MenuProps={{ style: { maxHeight: '500px' } }}
                  >
                    {meses.map((mes) => (
                      <MenuItem key={mes.nome} value={`${mes.valor},${mes.nome}`}>
                        <Checkbox checked={segundoMesSelecionado[2] === mes.nome.toString()} />
                        <ListItemText primary={mes.nome} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                    <Typography variant="h6">Diferença de cancelamentos {periodoSelecionado[1]}:</Typography>
                    <Typography
                      variant="h4"
                      style={{ color: Number(comparativoDiferenca) >= 0 ? 'rgba(82,221,95,1.00)' : 'rgba(255,99,99,1.00)' }}
                    >
                      {Number(comparativoDiferenca) >= 0 ? '+' : ''}{Number(comparativoDiferenca) + '%' || 'Carregando...'}
                    </Typography>
                    <Typography variant="subtitle1">
                      {periodoSelecionado[0] || 'Janeiro'} a {periodoSelecionado[1] || 'Novembro'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">
                    <Typography variant="h6">Total de cancelamentos</Typography>
                    <Typography variant="h5">{cancelamentoPeriodo1 ? (`${primeiroMesSelecionado[2]}: ${cancelamentoPeriodo1}`) : ('Carregando')}</Typography>
                    <Typography variant="h5">{cancelamentoPeriodo2 ? (`${segundoMesSelecionado[2]}: ${cancelamentoPeriodo2}`) : ('Carregando')}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                    <Typography variant="subtitle2" fontSize={12}>Distribuição de gêneros ({primeiroMesSelecionado[2]})</Typography>
                    {dataCancelamentoGenero ? (
                      <PieChart data={dataCancelamentoGenero} />
                    ) : (
                      <Typography variant="h5">Carregando dados...</Typography>
                    )}

                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                    <Typography variant="subtitle2" fontSize={12}>Distribuição de gêneros ({segundoMesSelecionado[2]})</Typography>
                    {dataCancelamentoGenero ? (
                      <PieChart2 data={dataCancelamentoGenero} />
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

                    <Typography variant="subtitle2" fontSize={12}>Comparativo de cancelamentos em meses diferentes</Typography>
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

                    <Typography variant="subtitle2" fontSize={12}>Comparativo de cancelamentos (Regiões, {primeiroMesSelecionado[2]} e {segundoMesSelecionado[2]})</Typography>
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

                    <Typography variant="subtitle2" fontSize={12}>Comparativo de cancelamentos (Motivos, {primeiroMesSelecionado[2]} e {segundoMesSelecionado[2]})</Typography>
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