import axios from 'axios';

export async function fetchCancelamentoDComparativo(primeiroMesSelecionado: String[], segundoMesSelecionado: String[]) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/total/comparativo/mensal?primeiro_mes=${primeiroMesSelecionado}&segundo_mes=${segundoMesSelecionado}`);
  return response.data;
}

export async function fetchCancelamentoRegiaoDComparativo(primeiroMesSelecionado: String[], segundoMesSelecionado: String[]) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/regiao/comparativo/mensal?primeiro_mes=${primeiroMesSelecionado}&segundo_mes=${segundoMesSelecionado}`);
  return response.data;
}

export async function fetchCancelamentoGeneroDComparativo(primeiroMesSelecionado: String[], segundoMesSelecionado: String[]) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/genero/comparativo/mensal?primeiro_mes=${primeiroMesSelecionado}&segundo_mes=${segundoMesSelecionado}`);
  return response.data;
}

export async function fetchCancelamentoMotivoDComparativo(primeiroMesSelecionado: String[], segundoMesSelecionado: String[]) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/motivo/comparativo/mensal?primeiro_mes=${primeiroMesSelecionado}&segundo_mes=${segundoMesSelecionado}`);
  return response.data;
}

// Para atualizar os gráficos
export async function fetchUpdateCancelamentoDComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/total/comparativo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCancelamentoRegiaoDComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/regiao/comparativo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCancelamentoGeneroDComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/genero/comparativo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCancelamentoMotivoDComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/motivo/comparativo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}
