import { Box, Card, CardContent, Grid, Typography, TextField, Button, Checkbox, MenuItem, Select, FormControl, ListItemText, Input } from '@mui/material';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/pt-br';

import { Chart, ArcElement, registerables } from 'chart.js';
Chart.register(...registerables, ArcElement);

import { UseAppThemeContext } from '../../shared/contexts/ThemeContext';
import { LayoutBaseDePagina } from '../../shared/layouts';
import { calcularCrescimento, calcularFaturamento, calcularOcorrencia, consultarMelhorContrato, consultarPrincipalMotivo, fetchCrescimentoGenero, fetchUpdateAssinatura, fetchUpdateAssinaturaContrato, fetchUpdateCancelamento, fetchUpdateCancelamentoMotivo, fetchUpdateCrescimento, fetchUpdateFaturamentos, fetchUpdateFaturamentosGenero, fetchUpdateFaturamentosRegiao } from '../../shared/services';
import PieChart from '../faturamentos/faturamentoMensal/PieChart';
import PieChartGenero from '../crescimento/crescimentoMensal/PieChart';
import BarChartMotivos from '../cancelamentos/cancelamentoMensal/BarChartMotivos';
import LineChart from '../crescimento/crescimentoMensal/LineChart';
import LineChart2 from '../crescimento/crescimentoMensal/LineChart2';
import LineChartFaturamento from '../faturamentos/faturamentoMensal/LineChart';

export const RegioesPage = () => {
  const { themeName } = UseAppThemeContext();

  const fundoColor = themeName === 'light' && '#ffffff' || '#303134';
  const linhaColor = themeName === 'light' && '#F8F8F8' || '#525356';

  const [motivosSelecionados, setMotivosSelecionados] = useState<string[]>(['Mudança de endereço', 'Inadimplência', 'Outros motivos', 'Contratou outro provedor', 'Insatisfação']);
  const [dataFaturamento, setDataFaturamento] = useState<{ [ano: string]: { [mes: string]: { total: number } } }>({});
  const [dataCrescimento, setDataCrescimento] = useState<{ [ano: string]: { [mes: string]: { total: number } } }>({});
  const [generosSelecionados, setGenerosSelecionados] = useState<string[]>(['Masculino', 'Feminino']);
  const [regiaoSelecionada, setRegiaoSelecionada] = useState<string[]>(['Aguas Claras']);
  const [nomeRegiao, setNomeRegiao] = useState<string>(regiaoSelecionada[0]);
  const [principalMotivoValor, setPrincipalMotivoValor] = useState<string>();
  const [dataAssinaturaContrato, setDataAssinaturaContrato] = useState({});
  const [dataCancelamentoMotivo, setDataCancelamentoMotivo] = useState({});
  const [melhorContratoValor, setMelhorContratoValor] = useState<string>();
  const [dataCrescimentoGenero, setDataCrescimentoGenero] = useState([]);
  const [dataFaturamentoGenero, setDataFaturamentoGenero] = useState([]);
  const [totalCancelamento, setTotalCancelamento] = useState<string>();
  const [totalFaturamento, setTotalFaturamento] = useState<string>();
  const [totalCrescimento, setTotalCrescimento] = useState<string>();
  const [totalAssiantura, setTotalAssinatura] = useState<string>();
  const [principalMotivo, setPrincipalMotivo] = useState<string>();
  const [melhorContrato, setMelhorContrato] = useState<string>();
  const [dataCancelamento, setDataCancelamento] = useState({});
  const [dataAssinatura, setDataAssinatura] = useState({});
  const [periodo, setPeriodo] = useState<string>();



  const dataInicial = '2020-01-01';
  const dataFinal = '2022-12-31';

  const [startDate, setStartDate] = useState(dataInicial);
  const [endDate, setEndDate] = useState(dataFinal);

  const [periodoSelecionado, setPeriodoSelecionado] = useState<string[]>([moment(dataInicial, 'YYYY/MM/DD').format('DD/MM/YYYY'), moment(dataFinal, 'YYYY/MM/DD').format('DD/MM/YYYY')]);

  // Consultas faturamentos, regioes e generos
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const regiao = params.get('regiao_selecionada');
    const regiaoCorrigida = regiao ? decodeURIComponent(regiao) : '';

    const searchParams = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      regioes: regiaoCorrigida ? regiaoCorrigida : regiaoSelecionada.join(','),
      generos: generosSelecionados.join(',')
    });

    if (regiaoCorrigida) {
      setRegiaoSelecionada([regiaoCorrigida]);
      setNomeRegiao(regiaoCorrigida);
    } else {
      setRegiaoSelecionada([regiaoSelecionada[0]]);
    }

    async function fetchFaturamentosUpdate() {
      const dataCrescimentoGenero = await fetchCrescimentoGenero(dataInicial, dataFinal);
      const responseCancelamentosTotal = await fetchUpdateCancelamento(searchParams);
      const responseTotalCrescimento = await fetchUpdateCrescimento(searchParams);
      const responseContrato = await fetchUpdateAssinaturaContrato(searchParams);
      const responseAssinaturaTotal = await fetchUpdateAssinatura(searchParams);
      const responseGenero = await fetchUpdateFaturamentosGenero(searchParams);
      const responseMotivo = await fetchUpdateCancelamentoMotivo(searchParams);
      const responseTotal = await fetchUpdateFaturamentos(searchParams);

      setDataCancelamento(responseCancelamentosTotal);
      setDataCrescimentoGenero(dataCrescimentoGenero);
      setDataCrescimento(responseTotalCrescimento);
      setDataAssinaturaContrato(responseContrato);
      setDataAssinatura(responseAssinaturaTotal);
      setDataCancelamentoMotivo(responseMotivo);
      setDataFaturamentoGenero(responseGenero);
      setDataFaturamento(responseTotal);

      setPeriodoSelecionado([startDate, endDate]);
    }

    fetchFaturamentosUpdate();
  }, []);


  useEffect(() => {
    const { totalFaturamento } = calcularFaturamento(dataFaturamento);
    setTotalFaturamento(totalFaturamento);

    const totalOcorrenciaCancelamento = calcularOcorrencia(dataCancelamento).totalOcorrencia;
    setTotalCancelamento(totalOcorrenciaCancelamento.toString());

    const totalOcorrenciaAssinatura = calcularOcorrencia(dataAssinatura).totalOcorrencia;
    setTotalAssinatura(totalOcorrenciaAssinatura.toString());

    const { melhorContratoNome, melhorContratoValor } = consultarMelhorContrato(dataAssinaturaContrato);
    setMelhorContrato(melhorContratoNome);
    setMelhorContratoValor(melhorContratoValor.toString());

    const { principalMotivoNome, principalMotivoQuantidade } = consultarPrincipalMotivo(dataCancelamentoMotivo);
    setPrincipalMotivo(principalMotivoNome);
    setPrincipalMotivoValor(principalMotivoQuantidade.toString());

    const { porcentagemCrescimento } = calcularCrescimento(dataCrescimento);
    setTotalCrescimento(porcentagemCrescimento);

    setPeriodoSelecionado([startDate, endDate]);

  }, [dataFaturamento, dataAssinaturaContrato, dataAssinatura, dataCancelamento, dataCancelamentoMotivo, dataCrescimento]);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      regioes: regiaoSelecionada.join(','),
      generos: generosSelecionados.join(','),
    });

    async function fetchFaturamentosUpdate() {
      const responseTotal = await fetchUpdateFaturamentos(searchParams);
      const responseGenero = await fetchUpdateFaturamentosGenero(searchParams);
      const responseCancelamentosTotal = await fetchUpdateCancelamento(searchParams);
      const responseAssinaturaTotal = await fetchUpdateAssinatura(searchParams);
      const responseContrato = await fetchUpdateAssinaturaContrato(searchParams);
      const responseMotivo = await fetchUpdateCancelamentoMotivo(searchParams);
      const responseTotalCrescimento = await fetchUpdateCrescimento(searchParams);

      setDataCancelamento(responseCancelamentosTotal);
      setDataCrescimento(responseTotalCrescimento);
      setDataAssinaturaContrato(responseContrato);
      setDataAssinatura(responseAssinaturaTotal);
      setDataCancelamentoMotivo(responseMotivo);
      setDataFaturamentoGenero(responseGenero);
      setDataFaturamento(responseTotal);

      setPeriodoSelecionado([startDate, endDate]);

      setNomeRegiao(regiaoSelecionada[0]);
    }

    fetchFaturamentosUpdate();
  };

  const campos = [
    {
      label: 'Faturamento total:',
      valor: `${totalFaturamento}`,
    },
    {
      label: 'Novas assinaturas:',
      valor: `${totalAssiantura}`,
    },
    {
      label: 'Melhor plano:',
      valor: `${melhorContrato} (${melhorContratoValor} novas assinaturas)`,
    },
    {
      label: 'Cancelamentos:',
      valor: `${totalCancelamento}`,
    },
    {
      label: 'Motivo com mais cancelamentos:',
      valor: `${principalMotivo} (${principalMotivoValor} cancelamentos)`,
    },
    {
      label: 'Taxa de desempenho:',
      valor: <span style={{ fontWeight: 'bold' }}>{`${totalCrescimento}%`}</span>,
      cor: Number(totalCrescimento) >= 0 ? 'rgba(82,221,95,1.00)' : 'rgba(255,99,99,1.00)',
    }

  ];

  return (
    <LayoutBaseDePagina titulo={nomeRegiao?.toString()}>

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
                    min: '2021-01-01',
                    max: '2022-12-31'
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Select
                    labelId="regioes-label"
                    id="regioes-select"
                    multiple={false}
                    value={regiaoSelecionada}
                    onChange={e => {
                      const newValue = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
                      setRegiaoSelecionada(newValue);
                    }}
                    input={<Input />}
                    renderValue={selected => 'Região selecionada'}
                    displayEmpty={true}
                  >
                    {['Aguas Claras', 'Taguatinga', 'Samambaia', 'Ceilandia', 'Sol Nascente', 'Arniqueiras', 'Outros'].map(regiao => (
                      <MenuItem key={regiao} value={regiao}>
                        <Checkbox checked={regiaoSelecionada.includes(regiao)} />
                        <ListItemText primary={regiao} />
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
      <Box width="100%" display="flex" justifyContent="center">

        <Grid container margin={1}>

          <Grid item container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
              <Card style={{ backgroundColor: fundoColor, borderRadius: '10px' }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h5" gutterBottom>
                        Resumo geral ({(moment(periodoSelecionado[0], 'YYYY/MM/DD').format('DD/MM/YYYY') + ' a ' + moment(periodoSelecionado[1], 'YYYY/MM/DD').format('DD/MM/YYYY')) || 'Carregando...'})
                      </Typography>
                    </Grid>
                    {campos.map((campo, index) => (
                      <Grid item xs={12} sm={12} key={index}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          style={{
                            backgroundColor: linhaColor,
                            borderRadius: '5px',
                            padding: '10px',
                            marginBottom: '10px',
                          }}
                        >
                          <Typography variant="body1">{campo.label}</Typography>
                          <Typography variant="body1" style={{ color: campo.cor }}>{campo.valor}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={6} spacing={2}>

              <Card style={{ backgroundColor: fundoColor, borderRadius: '10px' }}>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={200} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                    <Typography variant="subtitle2" fontSize={12}>Distribuição do faturamento por gêneros</Typography>
                    {dataFaturamentoGenero ? (
                      <PieChart data={dataFaturamentoGenero} />
                    ) : (
                      <Typography variant="h5">Carregando dados...</Typography>
                    )}

                  </Box>
                </CardContent>
              </Card>

              <Box mt={2} mb={2} />

              <Card style={{ backgroundColor: fundoColor, borderRadius: '10px' }}>
                <CardContent sx={{ height: '100%' }}>
                  <Box height={200} display="flex" flexDirection={'column'} justifyContent="center" alignItems="center">

                    <Typography variant="subtitle2" fontSize={12}>Distribuição do desempenho por gêneros</Typography>
                    {dataCrescimentoGenero ? (
                      <PieChartGenero data={dataCrescimentoGenero} />
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

                    <Typography variant="subtitle2" fontSize={12}>Índice de desempenho mensal</Typography>
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

                    <Typography variant="subtitle2" fontSize={12}>Índice de crescimento mensal</Typography>
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

                    <Typography variant="subtitle2" fontSize={12}>Índice de faturamento mensal</Typography>
                    {dataFaturamento ? (
                      <LineChartFaturamento data={dataFaturamento} />
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

                    <Typography variant="subtitle2" fontSize={12}>Motivos dos cancelamentos</Typography>
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