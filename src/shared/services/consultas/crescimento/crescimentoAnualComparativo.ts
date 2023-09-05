import axios from 'axios';

export async function fetchCrescimentoComparativo(periodoInicial: String, periodoFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/total/comparativo?periodo_inicial=${periodoInicial}&periodo_final=${periodoFinal}`);
  return response.data;
}


export async function fetchCrescimentoRegiaoComparativo(periodoInicial: String, periodoFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/regiao/comparativo?periodo_inicial=${periodoInicial}&periodo_final=${periodoFinal}`);
  return response.data;
}

export async function fetchCrescimentoGeneroComparativo(periodoInicial: String, periodoFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/genero/comparativo?periodo_inicial=${periodoInicial}&periodo_final=${periodoFinal}`);
  return response.data;
}

export async function fetchCrescimentoMotivoComparativo(periodoInicial: String, periodoFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/motivo/comparativo?periodo_inicial=${periodoInicial}&periodo_final=${periodoFinal}`);
  return response.data;
}

// Para atualizar os gráficos
export async function fetchUpdateCrescimentoRegiaoComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/regiao/comparativo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCrescimentoComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/total/comparativo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCrescimentoGeneroComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/genero/comparativo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCrescimentoMotivoComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/motivo/comparativo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}