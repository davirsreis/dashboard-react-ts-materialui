import axios from 'axios';

export async function fetchFaturamentosComparativo(periodoInicial: String, periodoFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/faturamentos/total/comparativo?periodo_inicial=${periodoInicial}&periodo_final=${periodoFinal}`);
  return response.data;
}

export async function fetchUpdateFaturamentosComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/faturamentos/total/comparativo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchFaturamentosRegiaoComparativo(periodoInicial: String, periodoFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/faturamentos/regiao/comparativo?periodo_inicial=${periodoInicial}&periodo_final=${periodoFinal}`);
  return response.data;
}

// Para atualizar os gráficos
export async function fetchUpdateFaturamentosRegiaoComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/faturamentos/regiao/comparativo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchFaturamentosGeneroComparativo(periodoInicial: String, periodoFinal: String) {
  const response = await axios.get(`http://localhost:3001/api/faturamentos/genero/comparativo?periodo_inicial=${periodoInicial}&periodo_final=${periodoFinal}`);
  return response.data;
}

export async function fetchUpdateFaturamentosGeneroComparativo(params: URLSearchParams) {
  const url = `http://localhost:3001/api/faturamentos/genero/comparativo?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}