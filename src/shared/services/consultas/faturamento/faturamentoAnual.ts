import axios from 'axios';

export async function fetchFaturamentos(dataInicial: String, dataFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/faturamentos/total?start_date=${dataInicial}&end_date=${dataFinal}`);
  return response.data;
}

export async function fetchFaturamentosRegiao(dataInicial: String, dataFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/faturamentos/regiao?start_date=${dataInicial}&end_date=${dataFinal}`);
  return response.data;
}

export async function fetchFaturamentosGenero(dataInicial: String, dataFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/faturamentos/genero?start_date=${dataInicial}&end_date=${dataFinal}`);
  return response.data;
}

// Para atualizar o gráfico
export async function fetchUpdateFaturamentos(params: URLSearchParams) {
  const url = `http://localhost:3001/api/faturamentos/total?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateFaturamentosRegiao(params: URLSearchParams) {
  const url = `http://localhost:3001/api/faturamentos/regiao?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateFaturamentosGenero(params: URLSearchParams) {
  const url = `http://localhost:3001/api/faturamentos/genero?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}