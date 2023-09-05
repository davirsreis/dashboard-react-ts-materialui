import axios from 'axios';

export async function fetchAssinaturaDComparativo(primeiroMesSelecionado: String[], segundoMesSelecionado: String[]) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/total/comparativo/mensal?primeiro_mes=${primeiroMesSelecionado}&segundo_mes=${segundoMesSelecionado}`);
  return response.data;
}

export async function fetchAssinaturaRegiaoDComparativo(primeiroMesSelecionado: String[], segundoMesSelecionado: String[]) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/regiao/comparativo/mensal?primeiro_mes=${primeiroMesSelecionado}&segundo_mes=${segundoMesSelecionado}`);
  return response.data;
}

export async function fetchAssinaturaGeneroDComparativo(primeiroMesSelecionado: String[], segundoMesSelecionado: String[]) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/genero/comparativo/mensal?primeiro_mes=${primeiroMesSelecionado}&segundo_mes=${segundoMesSelecionado}`);
  return response.data;
}

export async function fetchAssinaturaContratoDComparativo(primeiroMesSelecionado: String[], segundoMesSelecionado: String[]) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/contrato/comparativo/mensal?primeiro_mes=${primeiroMesSelecionado}&segundo_mes=${segundoMesSelecionado}`);
  return response.data;
}

// Para atualizar os gráficos

export async function fetchUpdateAssinaturaDComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/total/comparativo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}
export async function fetchUpdateAssinaturaRegiaoDComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/regiao/comparativo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateAssinaturaGeneroDComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/genero/comparativo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateAssinaturaContratoDComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/contrato/comparativo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}