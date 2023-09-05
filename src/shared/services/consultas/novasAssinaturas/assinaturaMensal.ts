import axios from 'axios';

export async function fetchAssinaturaMensal(mesSelecionado: String, anoSelecionado: String) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/total/mensal?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`);
  return response.data;
}

export async function fetchAssinaturaRegiaoMensal(mesSelecionado: String, anoSelecionado: String) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/regiao/mensal?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`);
  return response.data;
}

export async function fetchAssinaturaGeneroMensal(mesSelecionado: String, anoSelecionado: String) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/genero/mensal?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`);
  return response.data;
}

export async function fetchAssinaturaContratoMensal(mesSelecionado: String, anoSelecionado: String) {
  const response = await axios.get(`http://localhost:3001/api/assinaturas/contrato/mensal?mes_selecionado=${mesSelecionado}&ano_selecionado=${anoSelecionado}`);
  return response.data;
}

// Para atualizar o gráfico
export async function fetchUpdateAssinaturaMensal(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/total/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateAssinaturaRegiaoMensal(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/regiao/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateAssinaturaGeneroMensal(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/genero/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}

export async function fetchUpdateAssinaturaContratoMensal(params: URLSearchParams) {
  const url = `http://localhost:3001/api/assinaturas/contrato/mensal?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
}
