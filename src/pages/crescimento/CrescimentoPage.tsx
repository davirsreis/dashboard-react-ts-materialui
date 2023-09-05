import { Box, Grid, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Chart, ArcElement, registerables } from 'chart.js';
Chart.register(...registerables, ArcElement);

import { LayoutBaseDePagina } from '../../shared/layouts';
import '../../style.css';

export const CrescimentoPage = () => {
  const theme = useTheme();

  const cardContainerStyle = {
    [theme.breakpoints.up('xs')]: {
      minWidth: 150,
      minHeight: 200,
    },
    [theme.breakpoints.up('md')]: {
      minWidth: 200,
      minHeight: 250,
    },
    [theme.breakpoints.up('lg')]: {
      minWidth: 200,
      minHeight: 250,
    },
  };

  return (
    <LayoutBaseDePagina
      titulo='Desempenho da empresa'
    >
      <Box width="100%" display="flex">

        <Grid container margin={10}>
          <Grid item container spacing={2} columnSpacing={0}>

            <Grid item xs={12} sm={12} md={6} lg={4}>
              <Card sx={{...cardContainerStyle}} variant="outlined" className="card-container">
                <CardContent>
                  <Typography variant="h5" component="div">
                    Desempenho mensal
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    2020-2022
                  </Typography>
                  <Typography variant="body2">
                    Acompanhe o índice de desempenho mensal da empresa ao longo dos anos.
                  </Typography>
                </CardContent>
                <CardActions className="centered-button">
                  <Button size="small" href="/desempenho/desempenho-mensal">Acompanhar</Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={4} >
              <Card sx={{...cardContainerStyle}} variant="outlined" className="card-container">
                <CardContent>
                  <Typography variant="h5" component="div">
                    Comparar diferentes anos
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    2020-2022
                  </Typography>
                  <Typography variant="body2">
                    Compare os índices de desempenhos da empresa em diferentes anos
                  </Typography>
                </CardContent>
                <CardActions className="centered-button">
                  <Button size="small" href="/desempenho/comparativo-anual">Acompanhar</Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={4}>
              <Card sx={{...cardContainerStyle}} variant="outlined" className="card-container">
                <CardContent>
                  <Typography variant="h5" component="div">
                    Comparar diferentes meses
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    2020-2022
                  </Typography>
                  <Typography variant="body2">
                    Compare os índices de desempenhos da empresa em diferentes meses
                  </Typography>
                </CardContent>
                <CardActions className="centered-button">
                  <Button size="small" href="/desempenho/comparativo-mensal">Acompanhar</Button>
                </CardActions>
              </Card>
            </Grid>


          </Grid>
        </Grid>


      </Box>
    </LayoutBaseDePagina>
  );
};