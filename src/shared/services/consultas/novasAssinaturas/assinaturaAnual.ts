import axios from 'axios';

export async function fetchAssinatura(dataInicial: String, dataFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/total?start_date=${dataInicial}&end_date=${dataFinal}`);
  return response.data;
}

export async function fetchAssinaturaRegiao(dataInicial: String, dataFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/regiao?start_date=${dataInicial}&end_date=${dataFinal}`);
  return response.data;
}

export async function fetchAssinaturaGenero(dataInicial: String, dataFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/genero?start_date=${dataInicial}&end_date=${dataFinal}`);
  return response.data;
}

export async function fetchAssinaturaContrato(dataInicial: String, dataFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/contrato?start_date=${dataInicial}&end_date=${dataFinal}`);
  return response.data;
}

// Para atualizar o gráfico
export async function fetchUpdateAssinatura(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/total?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateAssinaturaRegiao(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/regiao?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateAssinaturaGenero(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/genero?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateAssinaturaContrato(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/contrato?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}