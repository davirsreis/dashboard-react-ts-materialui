import axios from 'axios';

export async function fetchFaturamentoMensal(mesSelecionado: String, anoSelecionado: String) {
  const response = await axios.get(`http://localhost:3001/api/faturamentos/total/mensal?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`);
  return response.data;
}

export async function fetchFaturamentoRegiaoMensal(mesSelecionado: String, anoSelecionado: String) {
  const response = await axios.get(`http://localhost:3001/api/faturamentos/regiao/mensal?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`);
  return response.data;
}

export async function fetchFaturamentoGeneroMensal(mesSelecionado: String, anoSelecionado: String) {
  const response = await axios.get(`http://localhost:3001/api/faturamentos/genero/mensal?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`);
  return response.data;
}

// Para atualizar o gráfico
export async function fetchUpdateFaturamentosMensal(params: URLSearchParams) {
  const url = `http://localhost:3001/api/faturamentos/total/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateFaturamentosRegiaoMensal(params: URLSearchParams) {
  const url = `http://localhost:3001/api/faturamentos/regiao/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateFaturamentosGeneroMensal(params: URLSearchParams) {
  const url = `http://localhost:3001/api/faturamentos/genero/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}