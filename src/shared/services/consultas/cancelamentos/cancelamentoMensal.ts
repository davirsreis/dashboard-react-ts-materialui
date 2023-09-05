import axios from 'axios';

export async function fetchCancelamentoMensal(mesSelecionado: String, anoSelecionado: String) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/total/mensal?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`);
  return response.data;
}

export async function fetchCancelamentoRegiaoMensal(mesSelecionado: String, anoSelecionado: String) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/regiao/mensal?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`);
  return response.data;
}

export async function fetchCancelamentoGeneroMensal(mesSelecionado: String, anoSelecionado: String) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/genero/mensal?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`);
  return response.data;
}

export async function fetchCancelamentoMotivoMensal(mesSelecionado: String, anoSelecionado: String) {
  const response = await axios.get(`http://localhost:3001/api/cancelamentos/motivo/mensal?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`);
  return response.data;
}

// Para atualizar o gráfico
export async function fetchUpdateCancelamentoMensal(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/total/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCancelamentoRegiaoMensal(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/regiao/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCancelamentoGeneroMensal(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/genero/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCancelamentoMotivoMensal(params: URLSearchParams) {
  const url = `http://localhost:3001/api/cancelamentos/motivo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}
