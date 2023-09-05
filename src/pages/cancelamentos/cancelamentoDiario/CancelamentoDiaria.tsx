import { Box, Card, CardContent, Grid, Typography, Button, Checkbox, MenuItem, Select, FormControl, ListItemText, Input } from '@mui/material';
import { useEffect, useState } from 'react';

import { Chart, ArcElement, registerables } from 'chart.js';
Chart.register(...registerables, ArcElement);

import { fetchCancelamentoMotivoMensal, fetchCancelamentoGeneroMensal, fetchCancelamentoMensal, fetchCancelamentoRegiaoMensal, fetchUpdateCancelamentoMotivoMensal, fetchUpdateCancelamentoGeneroMensal, fetchUpdateCancelamentoMensal, fetchUpdateCancelamentoRegiaoMensal } from '../../../shared/services';
import { calcularOcorrenciaMensal, obterMelhorEPiorDiaOcorrencia } from '../../../shared/services/utils';
import { LayoutBaseDePagina } from '../../../shared/layouts';
import LineChart from './LineChart';
import PieChart from './PieChart';
import BarChart from './BarChart';
import BarChartMotivos from './BarChartMotivos';
import { Environment } from '../../../shared/environment';

export const CancelamentoDiaria = () => {
  const [dataCancelamento, setDataCancelamento] = useState<{ [ano: string]: { [mes: string]: { total: number } } }>({});
  const [dataCancelamentoRegiao, setDataCancelamentoRegiao] = useState<{ [ano: string]: { [regiao: string]: { total_valor: number } } }>({});
  const [dataCancelamentoMotivo, setDataCancelamentoMotivo] = useState({});
  const [regioesSelecionadas, setRegioesSelecionadas] = useState<string[]>(['Aguas Claras', 'Taguatinga', 'Samambaia', 'Ceilandia', 'Sol Nascente', 'Arniqueiras']);
  const [motivosSelecionados, setMotivosSelecionados] = useState<string[]>(['Mudança de endereço', 'Inadimplência', 'Outros motivos', 'Contratou outro provedor', 'Insatisfacao']);
  const [generosSelecionados, setGenerosSelecionados] = useState<string[]>(['Masculino', 'Feminino']);
  const [melhorEPiorDia, setMelhorEPiorDia] = useState<(string | null)[]>([]);
  const [numDiasConsiderados, setNumDiasConsiderados] = useState<number>(0);
  const [dataCancelamentoGenero, setDataCancelamentoGenero] = useState([]);
  const [totalCancelamento, setTotalCancelamento] = useState<string>();
  const [mediaCancelamento, setMediaCancelamento] = useState<string>();

  const [mesSelecionado, setMesSelecionado] = useState<string[]>(['1', 'Janeiro']);
  const [anoSelecionado, setAnoSelecionado] = useState('2022');

  // Consultas faturamentos, regioes e generos
  useEffect(() => {
    async function fetchData() {
      const params = new URLSearchParams(window.location.search);
      const mes = params.get('mes_selecionado');
      const ano = params.get('ano_selecionado');

      if (mes && ano) {
        const searchParams = new URLSearchParams({
          mes_selecionado: mes,
          ano_selecionado: ano,
        });
        const mesObj = meses[Number(mes) - 1];
        setMesSelecionado([mes, mesObj.nome]);
        setAnoSelecionado(ano);

        const responseMotivo = await fetchUpdateCancelamentoMotivoMensal(searchParams);
        const responseRegiao = await fetchUpdateCancelamentoRegiaoMensal(searchParams);
        const responseGenero = await fetchUpdateCancelamentoGeneroMensal(searchParams);
        const responseTotal = await fetchUpdateCancelamentoMensal(searchParams);

        setDataCancelamentoMotivo(responseMotivo);
        setDataCancelamentoGenero(responseGenero);
        setDataCancelamentoRegiao(responseRegiao);
        setDataCancelamento(responseTotal);
      } else {
        const dataCancelamento = await fetchCancelamentoMensal(mesSelecionado[0], anoSelecionado);
        setDataCancelamento(dataCancelamento);

        const dataCancelamentoRegiao = await fetchCancelamentoRegiaoMensal(mesSelecionado[0], anoSelecionado);
        setDataCancelamentoRegiao(dataCancelamentoRegiao);

        const dataCancelamentoGenero = await fetchCancelamentoGeneroMensal(mesSelecionado[0], anoSelecionado);
        setDataCancelamentoGenero(dataCancelamentoGenero);

        const dataCancelamentoMotivo = await fetchCancelamentoMotivoMensal(mesSelecionado[0], anoSelecionado);
        setDataCancelamentoMotivo(dataCancelamentoMotivo);
      }
    }
    fetchData();
  }, []);

  // Calculo da media, total e número de meses considerados
  useEffect(() => {
    const { totalOcorrencia, mediaOcorrencia, numDiasConsiderados } = calcularOcorrenciaMensal(dataCancelamento);
    setNumDiasConsiderados(numDiasConsiderados);
    setTotalCancelamento(totalOcorrencia.toString());
    setMediaCancelamento(mediaOcorrencia.toString());

    const { melhorDia, melhorDiaTotal, piorDia, piorDiaTotal } = obterMelhorEPiorDiaOcorrencia(dataCancelamento);
    setMelhorEPiorDia([melhorDia, melhorDiaTotal, piorDia, piorDiaTotal]);
  }, [dataCancelamento]);

  // Atualizando consultas de faturamentos, regioes e generos
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      mes_selecionado: mesSelecionado[0],
      ano_selecionado: anoSelecionado,
      regioes: regioesSelecionadas.join(','),
      generos: generosSelecionados.join(','),
      motivos: motivosSelecionados.join(','),
    });

    async function fetchCancelamentosUpdate() {
      const responseMotivo = await fetchUpdateCancelamentoMotivoMensal(searchParams);
      const responseRegiao = await fetchUpdateCancelamentoRegiaoMensal(searchParams);
      const responseGenero = await fetchUpdateCancelamentoGeneroMensal(searchParams);
      const responseTotal = await fetchUpdateCancelamentoMensal(searchParams);

      setDataCancelamentoMotivo(responseMotivo);
      setDataCancelamentoGenero(responseGenero);
      setDataCancelamentoRegiao(responseRegiao);
      setDataCancelamento(responseTotal);
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

  const meses = Environment.meses;

  return (
    <LayoutBaseDePagina
      titulo='Cancelamento diária'
    >
      <Box width="100%" display="flex">
        <form onSubmit={handleSubmit}>
          <Grid container margin={1}>
            <Grid item container spacing={2}>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Select
                    labelId="ano-label"
                    id="ano-select"
                    multiple={false}
                    value={anoSelecionado}
                    onChange={e => setAnoSelecionado(e.target.value)}
                    input={<Input />}
                    renderValue={selected => anoSelecionado}
                    displayEmpty={true}
                  >
                    {['2020', '2021', '2022'].map(ano => (
                      <MenuItem key={ano} value={ano}>
                        <Checkbox checked={anoSelecionado.includes(ano)} />
                        <ListItemText primary={ano} />
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
                    value={mesSelecionado.join(',')}
                    onChange={(e) => {
                      const numero = parseInt(e.target.value.split(',')[0]);
                      const nome = e.target.value.split(',')[1];
                      setMesSelecionado([numero.toString(), nome]);
                    }}
                    input={<Input />}
                    renderValue={(selected) => {
                      const selectedMonth = meses.find(
                        (mes) => mes.numero === parseInt(selected.split(',')[0])
                      );
                      return selectedMonth ? selectedMonth.nome : 'Mês';
                    }}
                    displayEmpty={true}
                    multiple={false}
                  >
                    {meses.map((mes) => (
                      <MenuItem key={mes.nome} value={`${mes.numero},${mes.nome}`}>
                        <Checkbox checked={mesSelecionado[0] === mes.numero.toString()} />
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
                    <Typography variant="h6">Total de cancelamentos:</Typography>
                    <Typography variant="h5">{totalCancelamento || 'Carregando...'}</Typography>
                    <Typography variant="subtitle1">{mesSelecionado[1] || 'Janeiro'} de {anoSelecionado || '2022'}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">
                    <Typography variant="h6">Média de cancelamentos:</Typography>
                    <Typography variant="h5">{mediaCancelamento || 'Carregando...'}</Typography>
                    <Typography variant="subtitle1">{numDiasConsiderados} dias considerados</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">
                    <Typography variant="h6">Mais cancelamentos (dia {melhorEPiorDia?.[0] || 'N/A'}):</Typography>
                    <Typography variant="h5">{melhorEPiorDia?.[1] || 'Carregando...'}</Typography>
                    <Typography variant="h6">Menos cancelamentos (dia {melhorEPiorDia?.[2] || 'N/A'}):</Typography>
                    <Typography variant="h5">{melhorEPiorDia?.[3] || 'Carregando...'}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={150} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                    <Typography variant="subtitle2" fontSize={12}>Cancelamentos diários (Gêneros)</Typography>
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

                    <Typography variant="subtitle2" fontSize={12}>Cancelamentos diários ({mesSelecionado[1]} a {anoSelecionado})</Typography>
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

                    <Typography variant="subtitle2" fontSize={12}>Cancelamentos diários (Regiões)</Typography>
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

                    <Typography variant="subtitle2" fontSize={12}>Cancelamentos diários (Motivos)</Typography>
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