import { Box, Card, CardContent, Grid, Typography, Button, Checkbox, MenuItem, Select, FormControl, ListItemText, Input } from '@mui/material';
import { useEffect, useState } from 'react';

import { Chart, ArcElement, registerables } from 'chart.js';
Chart.register(...registerables, ArcElement);

import { fetchCrescimentoGeneroMensal, fetchCrescimentoMensal, fetchCrescimentoRegiaoMensal, fetchUpdateCrescimentoGeneroMensal, fetchUpdateCrescimentoMensal, fetchUpdateCrescimentoRegiaoMensal } from '../../../shared/services';
import { calcularCrescimentoMensal, calcularOcorrenciaMensal } from '../../../shared/services/utils';
import { LayoutBaseDePagina } from '../../../shared/layouts';
import LineChart from './LineChart';
import LineChart2 from './LineChart2';
import PieChart from './PieChart';
import BarChart from './BarChart';
import BarChart2 from './BarChart2';
import { Environment } from '../../../shared/environment';

export const CrescimentoDiaria = () => {
  const [dataCrescimento, setDataCrescimento] = useState<{ [ano: string]: { [mes: string]: { total: number } } }>({});
  const [dataCrescimentoRegiao, setDataCrescimentoRegiao] = useState<{ [ano: string]: { [regiao: string]: { total_valor: number } } }>({});
  const [regioesSelecionadas, setRegioesSelecionadas] = useState<string[]>(['Aguas Claras', 'Taguatinga', 'Samambaia', 'Ceilandia', 'Sol Nascente', 'Arniqueiras']);
  const [generosSelecionados, setGenerosSelecionados] = useState<string[]>(['Masculino', 'Feminino']);
  const [numDiasConsiderados, setNumDiasConsiderados] = useState<number>(0);
  const [dataCrescimentoGenero, setDataCrescimentoGenero] = useState([]);
  const [totalCrescimento, setTotalCrescimento] = useState<string>();
  const [mediaCrescimento, setMediaCrescimento] = useState<string>();
  const [totalAssinaturas, setTotalAssinaturas] = useState<string>();
  const [totalCancelamentos, setTotalCancelamentos] = useState<string>();

  const [mesSelecionado, setMesSelecionado] = useState<string[]>(['1', 'Janeiro']);
  const [anoSelecionado, setAnoSelecionado] = useState('2022');

  const [mesSelecionadoTexto, setMesSelecionadoTexto] = useState(mesSelecionado[1]);
  const [anoSelecionadoTexto, setAnoSelecionadoTexto] = useState(anoSelecionado);

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

        const responseRegiao = await fetchUpdateCrescimentoRegiaoMensal(searchParams);
        const responseGenero = await fetchUpdateCrescimentoGeneroMensal(searchParams);
        const responseTotal = await fetchUpdateCrescimentoMensal(searchParams);

        setDataCrescimentoGenero(responseGenero);
        setDataCrescimentoRegiao(responseRegiao);
        setDataCrescimento(responseTotal);
      } else {
        const dataCrescimento = await fetchCrescimentoMensal(mesSelecionado[0], anoSelecionado);
        setDataCrescimento(dataCrescimento);

        const dataCrescimentoRegiao = await fetchCrescimentoRegiaoMensal(mesSelecionado[0], anoSelecionado);
        setDataCrescimentoRegiao(dataCrescimentoRegiao);

        const dataCrescimentoGenero = await fetchCrescimentoGeneroMensal(mesSelecionado[0], anoSelecionado);
        setDataCrescimentoGenero(dataCrescimentoGenero);
      }
    }
    fetchData();

    setMesSelecionadoTexto(mesSelecionado[1]);
    setAnoSelecionadoTexto(anoSelecionado);

  }, []);

  // Calculo da media, total e número de meses considerados
  useEffect(() => {
    const { totalOcorrencia, mediaOcorrencia, numDiasConsiderados } = calcularOcorrenciaMensal(dataCrescimento);
    setNumDiasConsiderados(numDiasConsiderados);
    setTotalCrescimento(totalOcorrencia.toString());
    setMediaCrescimento(mediaOcorrencia.toString());
  }, [dataCrescimento]);
  // Calculo da porcentagem de crescimento, média e total de assinaturas e cancelamentos
  useEffect(() => {
    const { porcentagemCrescimento, mediaCrescimento, totalAssinaturas, totalCancelamentos } = calcularCrescimentoMensal(dataCrescimento);
    setTotalCrescimento(porcentagemCrescimento);
    setMediaCrescimento(mediaCrescimento.toString());
    setTotalAssinaturas(totalAssinaturas.toString());
    setTotalCancelamentos(totalCancelamentos.toString());
  }, [dataCrescimento]);

  // Atualizando consultas de faturamentos, regioes e generos
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      mes_selecionado: mesSelecionado[0],
      ano_selecionado: anoSelecionado,
      regioes: regioesSelecionadas.join(','),
      generos: generosSelecionados.join(','),
    });

    async function fetchCrescimentosUpdate() {
      const responseRegiao = await fetchUpdateCrescimentoRegiaoMensal(searchParams);
      const responseGenero = await fetchUpdateCrescimentoGeneroMensal(searchParams);
      const responseTotal = await fetchUpdateCrescimentoMensal(searchParams);

      setDataCrescimentoGenero(responseGenero);
      setDataCrescimentoRegiao(responseRegiao);
      setDataCrescimento(responseTotal);
    }

    fetchCrescimentosUpdate();

    setMesSelecionadoTexto(mesSelecionado[1]);
    setAnoSelecionadoTexto(anoSelecionado);
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
      titulo='índice de desempenho diário da empresa'
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
                    <Typography variant="subtitle1">{mesSelecionado[1] || 'Janeiro'} de {anoSelecionado || '2022'}</Typography>
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
                    <Typography variant="subtitle1">{numDiasConsiderados} dias considerados</Typography>
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

                    <Typography variant="subtitle2" fontSize={12}>Índice de desempenho mensal ({mesSelecionado[1]} de {anoSelecionado})</Typography>
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