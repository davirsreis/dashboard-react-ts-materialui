import axios from 'axios';

export async function fetchCrescimentoMensal(mesSelecionado: String, anoSelecionado: String) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/total/mensal?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`);
  return response.data;
}

export async function fetchCrescimentoRegiaoMensal(mesSelecionado: String, anoSelecionado: String) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/regiao/mensal?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`);
  return response.data;
}

export async function fetchCrescimentoGeneroMensal(mesSelecionado: String, anoSelecionado: String) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/genero/mensal?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`);
  return response.data;
}

export async function fetchCrescimentoMotivoMensal(mesSelecionado: String, anoSelecionado: String) {
  const response = await axios.get(`http://localhost:3001/api/crescimento/motivo/mensal?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`);
  return response.data;
}

// Para atualizar o gráfico
export async function fetchUpdateCrescimentoMensal(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/total/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCrescimentoRegiaoMensal(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/regiao/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCrescimentoGeneroMensal(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/genero/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateCrescimentoMotivoMensal(params: URLSearchParams) {
  const url = `http://localhost:3001/api/crescimento/motivo/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}
