import { Box, Card, CardContent, Grid, Typography, Button, Checkbox, MenuItem, Select, FormControl, ListItemText, Input } from '@mui/material';
import { useEffect, useState } from 'react';

import { Chart, ArcElement, registerables } from 'chart.js';
Chart.register(...registerables, ArcElement);

import { fetchCrescimentoRegiaoComparativo, fetchUpdateCrescimentoRegiaoComparativo, fetchCrescimentoComparativo, fetchCrescimentoGeneroComparativo, fetchUpdateCrescimentoComparativo, fetchUpdateCrescimentoGeneroComparativo } from '../../../shared/services';
import { calcularComparativoCrescimento, calcularComparativoOcorrencia, calcularOcorrencia } from '../../../shared/services/utils';
import { LayoutBaseDePagina } from '../../../shared/layouts';
import LineChart from './LineChart';
import PieChart from './PieChart1';
import BarChart from './BarChart';
import PieChart2 from './PieChart2';
import LineChart2 from './LineChart2';
import BarChart2 from './BarChart2';
import { Environment } from '../../../shared/environment';

export const CrescimentoComparativoAnual = () => {
  const [regioesSelecionadas, setRegioesSelecionadas] = useState<string[]>(['Aguas Claras', 'Taguatinga', 'Samambaia', 'Ceilandia', 'Sol Nascente', 'Arniqueiras']);
  const [dataCrescimentoRegiao, setDataCrescimentoRegiao] = useState<{ [ano: string]: { [regiao: string]: { total_valor: number } } }>({});
  const [dataCrescimento, setDataCrescimento] = useState<{ [ano: string]: { [mes: string]: { total: number } } }>({});
  const [generosSelecionados, setGenerosSelecionados] = useState<string[]>(['Masculino', 'Feminino']);
  const [anosSelecionados, setAnosSelecionados] = useState<string[]>(['2021', '2022']);
  const [dataCrescimentoGenero, setDataCrescimentoGenero] = useState([]);
  const [periodoInicial, setPeriodoInicial] = useState('1');
  const [periodoFinal, setPeriodoFinal] = useState('12');
  const [primeiroAno, setPrimeiroAno] = useState('2021');
  const [segundoAno, setSegundoAno] = useState('2022');

  const [crescimento2021, setCrescimento2021] = useState<string>();
  const [crescimento2022, setCrescimento2022] = useState<string>();
  const [comparativoDiferenca, setComparativoDiferenca] = useState<string>();

  const [periodoSelecionado, setPeriodoSelecionado] = useState<string[]>(['Janeiro', 'Dezembro']);

  // Consultas faturamentos, regioes e generos
  useEffect(() => {
    async function fetchData() {
      const dataCrescimento = await fetchCrescimentoComparativo(periodoInicial, periodoFinal);
      setDataCrescimento(dataCrescimento);

      const dataCrescimentoRegiao = await fetchCrescimentoRegiaoComparativo(periodoInicial, periodoFinal);
      setDataCrescimentoRegiao(dataCrescimentoRegiao);

      const dataCrescimentoGenero = await fetchCrescimentoGeneroComparativo(periodoInicial, periodoFinal);
      setDataCrescimentoGenero(dataCrescimentoGenero);
    }
    fetchData();
  }, []);

  // Calculo da media, total e número de meses considerados
  useEffect(() => {
    const { comparativoAnual, totalCrescimentoPeriodo1, totalCrescimentoPeriodo2 } = calcularComparativoCrescimento(dataCrescimento);
    setComparativoDiferenca(comparativoAnual);
    setCrescimento2021(totalCrescimentoPeriodo1);
    setCrescimento2022(totalCrescimentoPeriodo2);

  }, [dataCrescimento]);

  // Atualizando consultas de faturamentos, regioes e generos
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      periodo_inicial: periodoInicial,
      periodo_final: periodoFinal,
      regioes: regioesSelecionadas.join(','),
      generos: generosSelecionados.join(','),
      primeiro_ano: anosSelecionados[0],
      segundo_ano: anosSelecionados[1],
    });

    async function fetchCrescimentoUpdate() {
      const responseRegiao = await fetchUpdateCrescimentoRegiaoComparativo(searchParams);
      const responseGenero = await fetchUpdateCrescimentoGeneroComparativo(searchParams);
      const responseTotal = await fetchUpdateCrescimentoComparativo(searchParams);

      setDataCrescimentoGenero(responseGenero);
      setDataCrescimentoRegiao(responseRegiao);
      setDataCrescimento(responseTotal);

      setPeriodoSelecionado([Environment.meses[Number(periodoInicial) - 1].nome, Environment.meses[Number(periodoFinal) - 1].nome]);
    }

    fetchCrescimentoUpdate();
    if (anosSelecionados[0] > anosSelecionados[1]) {
      setPrimeiroAno(anosSelecionados[1]);
      setSegundoAno(anosSelecionados[0]);
    } else {
      setPrimeiroAno(anosSelecionados[0]);
      setSegundoAno(anosSelecionados[1]);
    }
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
      titulo='Comparando desempenho de diferentes anos'
    >
      <Box width="100%" display="flex">
        <form onSubmit={handleSubmit}>
          <Grid container margin={1}>
            <Grid item container spacing={2}>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Select
                    labelId="periodo-label"
                    id="periodo-select"
                    value={periodoInicial}
                    onChange={e => setPeriodoInicial(e.target.value)}
                    input={<Input />}
                    renderValue={selected => {
                      const selectedMonth = Environment.meses.find(periodo => periodo.numero === Number(selected));
                      return selectedMonth ? selectedMonth.nome : 'Periodo Inicial';
                    }}
                    displayEmpty={true}
                    multiple={false}
                  >
                    {Environment.meses.map(periodo => (
                      <MenuItem key={periodo.nome} value={String(periodo.numero)}>
                        <Checkbox checked={periodoInicial.includes(String(periodo.numero))} />
                        <ListItemText primary={periodo.nome} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Select
                    labelId="periodo-label"
                    id="periodo-select"
                    value={periodoFinal}
                    onChange={e => setPeriodoFinal(e.target.value)}
                    input={<Input />}
                    renderValue={selected => {
                      const selectedMonth = Environment.meses.find(periodo => periodo.numero === Number(selected));
                      return selectedMonth ? selectedMonth.nome : 'Periodo Final';
                    }}
                    displayEmpty={true}
                    multiple={false}
                  >
                    {Environment.meses.map(periodo => (
                      <MenuItem key={periodo.nome} value={String(periodo.numero)}>
                        <Checkbox checked={Number(periodoFinal) === periodo.numero} />
                        <ListItemText primary={periodo.nome} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Select
                    labelId="anos-label"
                    id="anos-select"
                    multiple
                    value={anosSelecionados}
                    onChange={e => {
                      const selectedOptions = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
                      if (selectedOptions.length > 2) {
                        return;
                      }
                      setAnosSelecionados(selectedOptions);
                    }}
                    input={<Input />}
                    renderValue={selected => 'Anos selecionados'}
                    displayEmpty={true}
                  >

                    {['2020', '2021', '2022'].map(ano => (
                      <MenuItem key={ano} value={ano}>
                        <Checkbox checked={anosSelecionados.includes(ano)} />
                        <ListItemText primary={ano} />
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
                    <Typography variant="h6">Diferença de desempenho em {segundoAno}:</Typography>
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
                    <Typography variant="h6">Total de desempenho</Typography>
                    <Typography variant="h5">
                      {primeiroAno}: <span style={{ color: Number(crescimento2021) >= 0 ? 'rgba(82,221,95,1.00)' : 'rgba(255,99,99,1.00)' }}>{Number(crescimento2021) >= 0 ? '+' : ''}{Number(crescimento2021) + '%' || 'Carregando...'}</span>
                    </Typography>
                    <Typography variant="h5">
                      {segundoAno}: <span style={{ color: Number(crescimento2022) >= 0 ? 'rgba(82,221,95,1.00)' : 'rgba(255,99,99,1.00)' }}>{Number(crescimento2022) >= 0 ? '+' : ''}{Number(crescimento2022) + '%' || 'Carregando...'}</span>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                    <Typography variant="subtitle2" fontSize={12}>Distribuição de gêneros ({primeiroAno})</Typography>
                    {dataCrescimentoGenero ? (
                      <PieChart data={dataCrescimentoGenero} />
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

                    <Typography variant="subtitle2" fontSize={12}>Distribuição de gêneros ({segundoAno})</Typography>
                    {dataCrescimentoGenero ? (
                      <PieChart2 data={dataCrescimentoGenero} />
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

                    <Typography variant="subtitle2" fontSize={12}>Comparativo de desempenho ({primeiroAno} e {segundoAno})</Typography>
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

                    <Typography variant="subtitle2" fontSize={12}>Comparativo de desempenho ({primeiroAno} e {segundoAno})</Typography>
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

                    <Typography variant="subtitle2" fontSize={12}>Comparativo de desempenho (Regiões, {primeiroAno} e {segundoAno})</Typography>
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

                    <Typography variant="subtitle2" fontSize={12}>Comparativo de assinatura/cancelamento (Regiões, {primeiroAno} e {segundoAno} )</Typography>
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