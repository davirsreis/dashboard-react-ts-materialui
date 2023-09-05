import { Box, Grid, Button, Card, CardActions, CardContent, Typography } from '@mui/material';

import { Chart, ArcElement, registerables } from 'chart.js';
Chart.register(...registerables, ArcElement);

import { LayoutBaseDePagina } from '../shared/layouts';
import '../style.css';

export const PaginaInicial = () => {

  return (
    <LayoutBaseDePagina
      titulo='Página inicial'
    >
      <Box width="100%" display="flex">

        <Grid container margin={10}>
          <Grid item container spacing={2} columnSpacing={0}>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card sx={{ minWidth: 275, minHeight: 300 }} variant="outlined" className="card-container">
                <CardContent>
                  <Typography variant="h5" component="div">
                    Desempenho
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    índice de desempenho da empresa
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'justify' }}>
                    Acompanhe o andamento da empresa em relação ao porcentual de desempenho (novas assinaturas - cancelamentos), ao longo de um período de tempo. Sendo possível filtrar os dados através do <b>período</b>, <b>região</b> e <b>gênero</b> desejado.
                  </Typography>
                </CardContent>
                <CardActions sx={{ position: 'absolute', bottom: 0 }}>
                  <Button size="small" href="desempenho">Acompanhar</Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3} >
              <Card sx={{ minWidth: 275, minHeight: 300 }} variant="outlined" className="card-container">
                <CardContent>
                  <Typography variant="h5" component="div">
                    Faturamentos
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Valor líquido recebido pela empresa
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'justify' }}>
                    Acompanhe o andamento da empresa em relação aos valores líquidos recebidos através dos pagamentos mensais realizados pelos clientes através de gráficos interativos. Sendo possível filtrar os dados através do <b>período</b>, <b>região</b> e <b>gênero</b> desejado.
                  </Typography>
                </CardContent>
                <CardActions sx={{ position: 'absolute', bottom: 0 }}>
                  <Button size="small" href="/faturamentos">Acompanhar</Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3} >
              <Card sx={{ minWidth: 275, minHeight: 300 }} variant="outlined" className="card-container">
                <CardContent>
                  <Typography variant="h5" component="div">
                    Novas assinaturas
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Número de novas assinaturas efetuadas
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'justify' }}>
                    Acompanhe o andamento da empresa em relação aos valores recebidos através da ativação de novos contratos realizados pelos clientes através de gráficos interativos. Sendo possível filtrar os dados através do <b>período</b>, <b>região</b>, <b>gênero</b> e <b>plano de internet</b> desejado.
                  </Typography>
                </CardContent>
                <CardActions sx={{ position: 'absolute', bottom: 0 }}>
                  <Button size="small" href="assinaturas">Acompanhar</Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
              <Card sx={{ minWidth: 275, minHeight: 300 }} variant="outlined" className="card-container">
                <CardContent>
                  <Typography variant="h5" component="div">
                    Cancelamentos
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Número de cancelamentos efetuados
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'justify' }}>
                    Acompanhe o andamento da empresa em relação aos números de cancelamentos realizados, assim como os motivos através de gráficos interativos. Sendo possível filtrar os dados através do <b>período</b>, <b>região</b>, <b>gênero</b> e <b>motivo</b> desejado.
                  </Typography>
                </CardContent>
                <CardActions sx={{ position: 'absolute', bottom: 0 }}>
                  <Button size="small" href="cancelamentos">Acompanhar</Button>
                </CardActions>
              </Card>
            </Grid>

          </Grid>
        </Grid>


      </Box>
    </LayoutBaseDePagina>
  );
};