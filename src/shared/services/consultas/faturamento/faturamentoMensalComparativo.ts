import axios from 'axios';

export async function fetchFaturamentosDComparativo(primeiroMesSelecionado: String[], segundoMesSelecionado: String[]) {
  const response = await axios.get(`http://localhost:3001/api/faturamentos/total/comparativo/mensal?primeiro_mes=${primeiroMesSelecionado}&segundo_mes=${segundoMesSelecionado}`);
  return response.data;
}

export async function fetchUpdateFaturamentosDComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/faturamentos/total/comparativo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchFaturamentosRegiaoDComparativo(primeiroMesSelecionado: String[], segundoMesSelecionado: String[]) {
  const response = await axios.get(`http://localhost:3001/api/faturamentos/regiao/comparativo/mensal?primeiro_mes=${primeiroMesSelecionado}&segundo_mes=${segundoMesSelecionado}`);
  return response.data;
}

// Para atualizar os gráficos
export async function fetchUpdateFaturamentosRegiaoDComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/faturamentos/regiao/comparativo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchFaturamentosGeneroDComparativo(primeiroMesSelecionado: String[], segundoMesSelecionado: String[]) {
  const response = await axios.get(`http://localhost:3001/api/faturamentos/genero/comparativo/mensal?primeiro_mes=${primeiroMesSelecionado}&segundo_mes=${segundoMesSelecionado}`);
  return response.data;
}

export async function fetchUpdateFaturamentosGeneroDComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/faturamentos/genero/comparativo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}