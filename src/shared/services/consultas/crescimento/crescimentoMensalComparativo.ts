import axios from 'axios';

export async function fetchCrescimentoDComparativo(primeiroMesSelecionado: String[], segundoMesSelecionado: String[]) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/total/comparativo/mensal?primeiro_mes=${primeiroMesSelecionado}&segundo_mes=${segundoMesSelecionado}`);
  return response.data;
}

export async function fetchCrescimentoRegiaoDComparativo(primeiroMesSelecionado: String[], segundoMesSelecionado: String[]) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/regiao/comparativo/mensal?primeiro_mes=${primeiroMesSelecionado}&segundo_mes=${segundoMesSelecionado}`);
  return response.data;
}

export async function fetchCrescimentoGeneroDComparativo(primeiroMesSelecionado: String[], segundoMesSelecionado: String[]) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/genero/comparativo/mensal?primeiro_mes=${primeiroMesSelecionado}&segundo_mes=${segundoMesSelecionado}`);
  return response.data;
}

export async function fetchCrescimentoMotivoDComparativo(primeiroMesSelecionado: String[], segundoMesSelecionado: String[]) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/motivo/comparativo/mensal?primeiro_mes=${primeiroMesSelecionado}&segundo_mes=${segundoMesSelecionado}`);
  return response.data;
}

// Para atualizar os gráficos
export async function fetchUpdateCrescimentoDComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/total/comparativo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCrescimentoRegiaoDComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/regiao/comparativo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCrescimentoGeneroDComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/genero/comparativo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCrescimentoMotivoDComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/motivo/comparativo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}
