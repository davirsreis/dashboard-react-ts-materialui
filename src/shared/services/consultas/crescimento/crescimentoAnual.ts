import axios from 'axios';

export async function fetchCrescimento(dataInicial: String, dataFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/total?start_date=${dataInicial}&end_date=${dataFinal}`);
  return response.data;
}

export async function fetchCrescimentoRegiao(dataInicial: String, dataFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/regiao?start_date=${dataInicial}&end_date=${dataFinal}`);
  return response.data;
}

export async function fetchCrescimentoGenero(dataInicial: String, dataFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/genero?start_date=${dataInicial}&end_date=${dataFinal}`);
  return response.data;
}

export async function fetchCrescimentoMotivo(dataInicial: String, dataFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/motivo?start_date=${dataInicial}&end_date=${dataFinal}`);
  return response.data;
}

// Para atualizar o gráfico
export async function fetchUpdateCrescimento(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/total?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCrescimentoRegiao(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/regiao?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCrescimentoGenero(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/genero?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCrescimentoMotivo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/motivo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}