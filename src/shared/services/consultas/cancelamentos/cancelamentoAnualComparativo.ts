import axios from 'axios';

export async function fetchCancelamentoComparativo(periodoInicial: String, periodoFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/total/comparativo?periodo_inicial=${periodoInicial}&periodo_final=${periodoFinal}`);
  return response.data;
}


export async function fetchCancelamentoRegiaoComparativo(periodoInicial: String, periodoFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/regiao/comparativo?periodo_inicial=${periodoInicial}&periodo_final=${periodoFinal}`);
  return response.data;
}

export async function fetchCancelamentoGeneroComparativo(periodoInicial: String, periodoFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/genero/comparativo?periodo_inicial=${periodoInicial}&periodo_final=${periodoFinal}`);
  return response.data;
}

export async function fetchCancelamentoMotivoComparativo(periodoInicial: String, periodoFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/motivo/comparativo?periodo_inicial=${periodoInicial}&periodo_final=${periodoFinal}`);
  return response.data;
}

// Para atualizar os gráficos
export async function fetchUpdateCancelamentoRegiaoComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/regiao/comparativo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCancelamentoComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/total/comparativo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCancelamentoGeneroComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/genero/comparativo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCancelamentoMotivoComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/motivo/comparativo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}