import axios from 'axios';

export async function fetchCancelamento(dataInicial: String, dataFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/total?start_date=${dataInicial}&end_date=${dataFinal}`);
  return response.data;
}

export async function fetchCancelamentoRegiao(dataInicial: String, dataFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/regiao?start_date=${dataInicial}&end_date=${dataFinal}`);
  return response.data;
}

export async function fetchCancelamentoGenero(dataInicial: String, dataFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/genero?start_date=${dataInicial}&end_date=${dataFinal}`);
  return response.data;
}

export async function fetchCancelamentoMotivo(dataInicial: String, dataFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/motivo?start_date=${dataInicial}&end_date=${dataFinal}`);
  return response.data;
}

// Para atualizar o gráfico
export async function fetchUpdateCancelamento(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/total?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCancelamentoRegiao(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/regiao?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCancelamentoGenero(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/genero?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCancelamentoMotivo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/motivo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}