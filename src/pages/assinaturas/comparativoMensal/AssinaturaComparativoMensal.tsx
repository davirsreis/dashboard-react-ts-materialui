import { Box, Card, CardContent, Grid, Typography, Button, Checkbox, MenuItem, Select, FormControl, ListItemText, Input } from '@mui/material';
import { useEffect, useState } from 'react';

import { Chart, ArcElement, registerables } from 'chart.js';
Chart.register(...registerables, ArcElement);

import { fetchAssinaturaDComparativo, fetchAssinaturaGeneroDComparativo, fetchAssinaturaRegiaoDComparativo, fetchUpdateAssinaturaDComparativo, fetchUpdateAssinaturaGeneroDComparativo, fetchUpdateAssinaturaRegiaoDComparativo, fetchAssinaturaContratoDComparativo, fetchUpdateAssinaturaContratoDComparativo } from '../../../shared/services';
import { calcularComparativoOcorrenciaMensal } from '../../../shared/services/utils';
import { LayoutBaseDePagina } from '../../../shared/layouts';
import LineChart from './LineChart';
import PieChart from './PieChart1';
import BarChart from './BarChart';
import BarChartContratos from './BarChartContratos';
import PieChart2 from './PieChart2';
import { Environment } from '../../../shared/environment';

export const AssinaturaComparativoMensal = () => {
  const [regioesSelecionadas, setRegioesSelecionadas] = useState<string[]>(['Aguas Claras', 'Taguatinga', 'Samambaia', 'Ceilandia', 'Sol Nascente', 'Arniqueiras']);
  const [contratosSelecionados, setContratosSelecionados] = useState<string[]>(['200_MEGA', '20_MEGA', '60_MEGA', '50_MEGA', '10_MEGA', '100_MEGA', '300_MEGA']);
  const [dataAssinaturaContrato, setDataAssinaturaContrato] = useState<{ [ano: string]: { [contrato: string]: { total_valor: number } } }>({});
  const [dataAssinaturaRegiao, setDataAssinaturaRegiao] = useState<{ [ano: string]: { [regiao: string]: { total_valor: number } } }>({});
  const [dataAssinatura, setDataAssinatura] = useState<{ [ano: string]: { [mes: string]: { total: number } } }>({});
  const [primeiroMesSelecionado, setPrimeiroMesSelecionado] = useState<string[]>(['11', '2022', 'Nov/2022']);
  const [segundoMesSelecionado, setSegundoMesSelecionado] = useState<string[]>(['12', '2022', 'Dez/2022']);
  const [generosSelecionados, setGenerosSelecionados] = useState<string[]>(['Masculino', 'Feminino']);
  const [dataAssinaturaGenero, setDataAssinaturaGenero] = useState([]);

  const [assinaturaPeriodo1, setAssinaturaPeriodo1] = useState<string>();
  const [assinaturaPeriodo2, setAssinaturaPeriodo2] = useState<string>();
  const [comparativoDiferenca, setComparativoDiferenca] = useState<string>();

  const [periodoSelecionado, setPeriodoSelecionado] = useState<string[]>([primeiroMesSelecionado[2], segundoMesSelecionado[2]]);
  const primeiroMes = ([primeiroMesSelecionado[0], primeiroMesSelecionado[1]]);
  const segundoMes = ([segundoMesSelecionado[0], segundoMesSelecionado[1]]);

  // Consultas faturamentos, regioes e generos
  useEffect(() => {
    async function fetchData() {

      const dataAssinatura = await fetchAssinaturaDComparativo(primeiroMes, segundoMes);

      const dataAssinaturaRegiao = await fetchAssinaturaRegiaoDComparativo(primeiroMes, segundoMes);

      const dataAssinaturaGenero = await fetchAssinaturaGeneroDComparativo(primeiroMes, segundoMes);

      const dataAssinaturaContrato = await fetchAssinaturaContratoDComparativo(primeiroMes, segundoMes);

      setDataAssinatura(dataAssinatura);
      setDataAssinaturaRegiao(dataAssinaturaRegiao);
      setDataAssinaturaGenero(dataAssinaturaGenero);
      setDataAssinaturaContrato(dataAssinaturaContrato);
    }
    fetchData();
  }, []);

  // Calculo da media, total e número de meses considerados
  useEffect(() => {
    const { comparativoAnual, totalOcorrenciaPeriodo1, totalOcorrenciaPeriodo2 } = calcularComparativoOcorrenciaMensal(dataAssinatura);
    setComparativoDiferenca(comparativoAnual);
    setAssinaturaPeriodo1(totalOcorrenciaPeriodo1);
    setAssinaturaPeriodo2(totalOcorrenciaPeriodo2);
  }, [dataAssinatura]);

  // Atualizando consultas de faturamentos, regioes e generos
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setPeriodoSelecionado([primeiroMesSelecionado[2], segundoMesSelecionado[2]]);

    const params = {
      primeiro_mes: primeiroMes.join(','),
      segundo_mes: segundoMes.join(','),
      regioes: regioesSelecionadas.join(','),
      generos: generosSelecionados.join(','),
      contratos: contratosSelecionados.join(','),
    };

    const encodedSearchParams = new URLSearchParams(params);

    async function fetchAssinaturaUpdate() {
      const responseContrato = await fetchUpdateAssinaturaContratoDComparativo(encodedSearchParams);
      const responseRegiao = await fetchUpdateAssinaturaRegiaoDComparativo(encodedSearchParams);
      const responseGenero = await fetchUpdateAssinaturaGeneroDComparativo(encodedSearchParams);
      const responseTotal = await fetchUpdateAssinaturaDComparativo(encodedSearchParams);

      setDataAssinaturaContrato(responseContrato);
      setDataAssinaturaGenero(responseGenero);
      setDataAssinaturaRegiao(responseRegiao);
      setDataAssinatura(responseTotal);
    }

    fetchAssinaturaUpdate();
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
      titulo='Comparando novas assinaturas em diferentes meses'
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
                    <Typography variant="h6">Diferença de assinaturas de {periodoSelecionado[1]}:</Typography>
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
                    <Typography variant="h6">Total de assinaturas</Typography>
                    <Typography variant="h5">{assinaturaPeriodo1 ? (`${primeiroMesSelecionado[2]}: ${assinaturaPeriodo1}`) : ('Carregando')}</Typography>
                    <Typography variant="h5">{assinaturaPeriodo2 ? (`${segundoMesSelecionado[2]}: ${assinaturaPeriodo2}`) : ('Carregando')}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                    <Typography variant="subtitle2" fontSize={12}>Distribuição de gêneros ({primeiroMesSelecionado[2]})</Typography>
                    {dataAssinaturaGenero ? (
                      <PieChart data={dataAssinaturaGenero} />
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
                    {dataAssinaturaGenero ? (
                      <PieChart2 data={dataAssinaturaGenero} />
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

                    <Typography variant="subtitle2" fontSize={12}>Comparativo de novas assinaturas em meses diferentes</Typography>
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

                    <Typography variant="subtitle2" fontSize={12}>Comparativo de novas assinaturas (Regiões)</Typography>
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

                    <Typography variant="subtitle2" fontSize={12}>Comparativo de novas assinaturas (Contratos)</Typography>
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