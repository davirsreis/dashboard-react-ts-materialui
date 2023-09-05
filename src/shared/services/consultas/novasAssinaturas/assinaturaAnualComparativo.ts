import axios from 'axios';

export async function fetchAssinaturaComparativo(periodoInicial: String, periodoFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/total/comparativo?periodo_inicial=${periodoInicial}&periodo_final=${periodoFinal}`);
  return response.data;
}


export async function fetchAssinaturaRegiaoComparativo(periodoInicial: String, periodoFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/regiao/comparativo?periodo_inicial=${periodoInicial}&periodo_final=${periodoFinal}`);
  return response.data;
}

export async function fetchAssinaturaGeneroComparativo(periodoInicial: String, periodoFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/genero/comparativo?periodo_inicial=${periodoInicial}&periodo_final=${periodoFinal}`);
  return response.data;
}

export async function fetchAssinaturaContratoComparativo(periodoInicial: String, periodoFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/contrato/comparativo?periodo_inicial=${periodoInicial}&periodo_final=${periodoFinal}`);
  return response.data;
}

// Para atualizar os gráficos
export async function fetchUpdateAssinaturaRegiaoComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/regiao/comparativo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateAssinaturaComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/total/comparativo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateAssinaturaGeneroComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/genero/comparativo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateAssinaturaContratoComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/contrato/comparativo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}