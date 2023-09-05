import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import InsightsIcon from '@mui/icons-material/Insights';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useEffect, useContext, useState } from 'react';

import { useDrawerContext } from '../shared/contexts';
import { FaturamentoMensal, ComparativoAnual, FaturamentoDiario, ComparativoMensal, FaturamentoPage, PaginaInicial, AssinaturaMensal, AssinaturaPage, AssinaturaDiaria, CancelamentoPage, RegioesPage, EstimativaMensal } from '../pages';
import { AssinaturaComparativoAnual } from '../pages/assinaturas/comparativoAnual/AssinaturaComparativoAnual';
import { AssinaturaComparativoMensal } from '../pages/assinaturas/comparativoMensal/AssinaturaComparativoMensal';
import { CancelamentoMensal } from '../pages/cancelamentos/cancelamentoMensal/CancelamentoMensal';
import { CancelamentoDiaria } from '../pages/cancelamentos/cancelamentoDiario/CancelamentoDiaria';
import { CancelamentoComparativoAnual } from '../pages/cancelamentos/comparativoAnual/CancelamentoComparativoAnual';
import { CancelamentoComparativoMensal } from '../pages/cancelamentos/comparativoMensal/CancelamentoComparativoMensal';
import { CrescimentoMensal } from '../pages/crescimento/crescimentoMensal/CrescimentoMensal';
import { CrescimentoDiaria } from '../pages/crescimento/crescimentoDiario/CrescimentoDiaria';
import { CrescimentoComparativoAnual } from '../pages/crescimento/comparativoAnual/CrescimentoComparativoAnual';
import { CrescimentoComparativoMensal } from '../pages/crescimento/comparativoMensal/CrescimentoComparativoMensal';
import { CrescimentoPage } from '../pages/crescimento/CrescimentoPage';

export const AppRoutes = () => {

  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {
    setDrawerOptions([
      {
        icon: 'home',
        path: '/pagina-inicial',
        label: 'Página inicial',
      },
      {
        icon: <InsightsIcon />,
        path: '/desempenho',
        label: 'Desempenho',
      },
      {
        icon: <AttachMoneyIcon />,
        path: '/faturamentos',
        label: 'Faturamentos',
      },
      {
        icon: <TrendingUpIcon />,
        path: '/assinaturas',
        label: 'Novas assinaturas',
      },
      {
        icon: <TrendingDownIcon />,
        path: '/cancelamentos',
        label: 'Cancelamentos',
      },
    ]);
  }, [setDrawerOptions]);

  return (
    <Routes>

      <Route path='/faturamentos' element={<FaturamentoPage />} />
      <Route path='/assinaturas' element={<AssinaturaPage />} />
      <Route path='/cancelamentos' element={<CancelamentoPage />} />
      <Route path='/desempenho' element={<CrescimentoPage />} />

      <Route path='/faturamento/faturamento-mensal' element={<FaturamentoMensal />} />
      <Route path='/faturamento/comparativo-anual' element={<ComparativoAnual />} />
      <Route path='/faturamento/comparativo-mensal' element={<ComparativoMensal />} />
      <Route path='/faturamento/mes' element={<FaturamentoDiario />} />
      <Route path='/faturamento/estimativa' element={<EstimativaMensal />} />

      <Route path='/assinatura/assinatura-mensal' element={<AssinaturaMensal />} />
      <Route path='/assinatura/mes' element={<AssinaturaDiaria />} />
      <Route path='/assinatura/comparativo-anual' element={<AssinaturaComparativoAnual />} />
      <Route path='/assinatura/comparativo-mensal' element={<AssinaturaComparativoMensal />} />

      <Route path='/cancelamento/cancelamento-mensal' element={<CancelamentoMensal />} />
      <Route path='/cancelamento/mes' element={<CancelamentoDiaria />} />
      <Route path='/cancelamento/comparativo-anual' element={<CancelamentoComparativoAnual />} />
      <Route path='/cancelamento/comparativo-mensal' element={<CancelamentoComparativoMensal />} />

      <Route path='/desempenho/desempenho-mensal' element={<CrescimentoMensal />} />
      <Route path='/desempenho/mes' element={<CrescimentoDiaria />} />
      <Route path='/desempenho/comparativo-anual' element={<CrescimentoComparativoAnual />} />
      <Route path='/desempenho/comparativo-mensal' element={<CrescimentoComparativoMensal />} />


      <Route path='/regioes' element={<RegioesPage />} />

      <Route path='*' element={<PaginaInicial />} />

    </Routes>
  );
};