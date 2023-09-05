const connectDB = require('./shared/environment/connectDB.js');
const db = require("./api/dbFaturamento");
const express = require('express');
const session = require('express-session');
const port = 3001;

const app = express();
app.use(express.json());

app.use(
  session({
    secret: 'segredo',
    resave: false,
    saveUninitialized: false,
  })
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Erro de servidor' });
});


const querystring = require('querystring');
const router = express.Router();
const cors = require('cors');
app.use(cors());

async function connect() {
  if (global.connection && global.connection.state !== 'disconnected')
    return global.connection;

  const mysql = require('mysql2/promise');
  const connection = await mysql.createConnection(`mysql://root:${connectDB.password}@localhost:3306/dbempresa`);
  console.log('Conectou no MySQL!');
  global.connection = connection;
  return connection;
}

const motivosIniciais = ['Mudança de endereço', 'Inadimplência', 'Outros motivos', 'Contratou outro provedor', 'Insatisfacao'];
const cidadesIniciais = ['Aguas Claras', 'Taguatinga', 'Samambaia', 'Ceilandia', 'Sol Nascente', 'Arniqueiras'];
const contratosIniciais = ['200_MEGA', '20_MEGA', '60_MEGA', '50_MEGA', '10_MEGA', '100_MEGA', '300_MEGA'];
const generosIniciais = ['Masculino', 'Feminino'];
const dataInicial1 = ['2020', '01', '01'];
const dataInicial2 = ['2022', '12', '31'];
const primeiroMes = ['11', '2022']
const segundoMes = ['12', '2022']
const primeiroAno = ['2021']
const segundoAno = ['2022']

router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const conn = await connect();
  try {
    const [rows, fields] = await conn.query('SELECT * FROM usuarios WHERE username = ? AND password = ? LIMIT 1', [username, password]);

    if (rows.length === 1) {
      req.session.userId = username.id;

      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Usuário ou senha incorretos' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Erro de servidor' });
  }
});

// const api = createAuthenticatedInstance();

// LineChart - Faturamentos
router.get('/api/faturamentos/total', async (req, res) => {
  const db = require("./api/dbFaturamento");
  const params = querystring.parse(req.url.split('?')[1]);
  const startDateArray = params.start_date ? params.start_date.split('-').map(e => parseInt(e)) : dataInicial1;
  const startDate = startDateArray[0] + '/' + startDateArray[1] + '/' + startDateArray[2];
  const endDateArray = params.end_date ? params.end_date.split('-').map(e => parseInt(e)) : dataInicial2;
  const endDate = endDateArray[0] + '/' + endDateArray[1] + '/' + endDateArray[2];
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const faturamentos = await db.selectTotalFaturamento(startDate, endDate, regioes, generos);
  res.json(faturamentos);
});

// BarChart - Faturamentos
router.get('/api/faturamentos/regiao', async (req, res) => {
  const db = require("./api/dbFaturamento");
  const params = querystring.parse(req.url.split('?')[1]);
  const startDateArray = params.start_date ? params.start_date.split('-').map(e => parseInt(e)) : dataInicial1;
  const startDate = startDateArray[0] + '/' + startDateArray[1] + '/' + startDateArray[2];
  const endDateArray = params.end_date ? params.end_date.split('-').map(e => parseInt(e)) : dataInicial2;
  const endDate = endDateArray[0] + '/' + endDateArray[1] + '/' + endDateArray[2];
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const result = await db.selectRegiaoFaturamento(startDate, endDate, regioes, generos);
  res.json(result);
});

// PieChart - Faturamentos
router.get('/api/faturamentos/genero', async (req, res) => {
  const db = require("./api/dbFaturamento");
  const params = querystring.parse(req.url.split('?')[1]);
  const startDateArray = params.start_date ? params.start_date.split('-').map(e => parseInt(e)) : dataInicial1;
  const startDate = startDateArray[0] + '/' + startDateArray[1] + '/' + startDateArray[2];
  const endDateArray = params.end_date ? params.end_date.split('-').map(e => parseInt(e)) : dataInicial2;
  const endDate = endDateArray[0] + '/' + endDateArray[1] + '/' + endDateArray[2];
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const result = await db.selectGeneroFaturamento(startDate, endDate, regioes, generos);
  res.json(result);
});

// Comparativos
// LineChart - Faturamentos
router.get('/api/faturamentos/total/comparativo', async (req, res) => {
  const db = require("./api/dbFaturamento");
  const params = querystring.parse(req.url.split('?')[1]);
  const mesInicial = params.periodo_inicial ?? 1;
  const mesFinal = params.periodo_final ?? 12;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const ano1 = params.primeiro_ano ?? primeiroAno;
  const ano2 = params.segundo_ano ?? segundoAno;
  const result = await db.selectTotalFaturamentoComparativo(regioes, generos, mesInicial, mesFinal, ano1, ano2);
  res.json(result);
});

// BarChart - Faturamentos
router.get('/api/faturamentos/regiao/comparativo', async (req, res) => {
  const db = require("./api/dbFaturamento");
  const params = querystring.parse(req.url.split('?')[1]);
  const mesInicial = params.periodo_inicial ?? 1;
  const mesFinal = params.periodo_final ?? 12;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const ano1 = params.primeiro_ano ?? primeiroAno;
  const ano2 = params.segundo_ano ?? segundoAno;
  const result = await db.selectRegiaoFaturamentoComparativo(regioes, generos, mesInicial, mesFinal, ano1, ano2);
  res.json(result);
});

// PieChart - Faturamentos
router.get('/api/faturamentos/genero/comparativo', async (req, res) => {
  const db = require("./api/dbFaturamento");
  const params = querystring.parse(req.url.split('?')[1]);
  const mesInicial = params.periodo_inicial ?? 1;
  const mesFinal = params.periodo_final ?? 12;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const ano1 = params.primeiro_ano ?? primeiroAno;
  const ano2 = params.segundo_ano ?? segundoAno;
  const result = await db.selectGeneroFaturamentoComparativo(regioes, generos, mesInicial, mesFinal, ano1, ano2);
  res.json(result);
});

// LineChart - Faturamento Mensal
router.get('/api/faturamentos/total/mensal', async (req, res) => {
  const db = require("./api/dbFaturamento");
  const params = querystring.parse(req.url.split('?')[1]);
  const mes = params.mes_selecionado ?? '1';
  const ano = params.ano_selecionado ?? '2022';
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const faturamentos = await db.selectFaturamentoMensal(regioes, generos, ano, mes);
  res.json(faturamentos);
});

// BarChart - Faturamentos Mensal
router.get('/api/faturamentos/regiao/mensal', async (req, res) => {
  const db = require("./api/dbFaturamento");
  const params = querystring.parse(req.url.split('?')[1]);
  const mes = params.mes_selecionado ?? '1';
  const ano = params.ano_selecionado ?? '2022';
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const result = await db.selectRegiaoFaturamentoMensal(regioes, generos, ano, mes);
  res.json(result);
});

// PieChart - Faturamentos Mensal
router.get('/api/faturamentos/genero/mensal', async (req, res) => {
  const db = require("./api/dbFaturamento");
  const params = querystring.parse(req.url.split('?')[1]);
  const mes = params.mes_selecionado ?? '1';
  const ano = params.ano_selecionado ?? '2022';
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const result = await db.selectGeneroFaturamentoMensal(regioes, generos, ano, mes);
  res.json(result);
});

// Comparativos Mensais
// LineChart - Faturamentos
router.get('/api/faturamentos/total/comparativo/mensal', async (req, res) => {
  const db = require("./api/dbFaturamento");
  const params = querystring.parse(req.url.split('?')[1]);
  const primeiroMesSelecionadoArray = params.primeiro_mes;
  const primeiroMesSelecionado = primeiroMesSelecionadoArray ? primeiroMesSelecionadoArray.split(',') : primeiroMes;
  const segundoMesSelecionadoArray = params.segundo_mes;
  const segundoMesSelecionado = segundoMesSelecionadoArray ? segundoMesSelecionadoArray.split(',') : segundoMes;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const result = await db.selectFaturamentoDComparativo(regioes, generos, primeiroMesSelecionado, segundoMesSelecionado);
  res.json(result);
});

router.get('/api/faturamentos/regiao/comparativo/mensal', async (req, res) => {
  const db = require("./api/dbFaturamento");
  const params = querystring.parse(req.url.split('?')[1]);
  const primeiroMesSelecionadoArray = params.primeiro_mes;
  const primeiroMesSelecionado = primeiroMesSelecionadoArray ? primeiroMesSelecionadoArray.split(',') : primeiroMes;
  const segundoMesSelecionadoArray = params.segundo_mes;
  const segundoMesSelecionado = segundoMesSelecionadoArray ? segundoMesSelecionadoArray.split(',') : segundoMes;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const result = await db.selectRegiaoFaturamentoDComparativo(regioes, generos, primeiroMesSelecionado, segundoMesSelecionado);
  res.json(result);
});

// PieChart - Faturamentos
router.get('/api/faturamentos/genero/comparativo/mensal', async (req, res) => {
  const db = require("./api/dbFaturamento");
  const params = querystring.parse(req.url.split('?')[1]);
  const primeiroMesSelecionadoArray = params.primeiro_mes;
  const primeiroMesSelecionado = primeiroMesSelecionadoArray ? primeiroMesSelecionadoArray.split(',') : primeiroMes;
  const segundoMesSelecionadoArray = params.segundo_mes;
  const segundoMesSelecionado = segundoMesSelecionadoArray ? segundoMesSelecionadoArray.split(',') : segundoMes;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const result = await db.selectGeneroFaturamentoDComparativo(regioes, generos, primeiroMesSelecionado, segundoMesSelecionado);
  res.json(result);
});



// #####################################
// Assinaturas
// LineChart - Assinaturas
router.get('/api/assinaturas/total', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const startDateArray = params.start_date ? params.start_date.split('-').map(e => parseInt(e)) : dataInicial1;
  const startDate = startDateArray[0] + '/' + startDateArray[1] + '/' + startDateArray[2];
  const endDateArray = params.end_date ? params.end_date.split('-').map(e => parseInt(e)) : dataInicial2;
  const endDate = endDateArray[0] + '/' + endDateArray[1] + '/' + endDateArray[2];
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const assinaturas = await dbAssinaturas.selectTotalAssinatura(startDate, endDate, regioes, generos, contratos);
  res.json(assinaturas);
});

// BarChart (Regiao) - Assinaturas
router.get('/api/assinaturas/regiao', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const startDateArray = params.start_date ? params.start_date.split('-').map(e => parseInt(e)) : dataInicial1;
  const startDate = startDateArray[0] + '/' + startDateArray[1] + '/' + startDateArray[2];
  const endDateArray = params.end_date ? params.end_date.split('-').map(e => parseInt(e)) : dataInicial2;
  const endDate = endDateArray[0] + '/' + endDateArray[1] + '/' + endDateArray[2];
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const result = await dbAssinaturas.selectRegiaoAssinatura(startDate, endDate, regioes, generos, contratos);
  res.json(result);
});

// BarChart (Contrato) - Assinaturas
router.get('/api/assinaturas/contrato', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const startDateArray = params.start_date ? params.start_date.split('-').map(e => parseInt(e)) : dataInicial1;
  const startDate = startDateArray[0] + '/' + startDateArray[1] + '/' + startDateArray[2];
  const endDateArray = params.end_date ? params.end_date.split('-').map(e => parseInt(e)) : dataInicial2;
  const endDate = endDateArray[0] + '/' + endDateArray[1] + '/' + endDateArray[2];
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const result = await dbAssinaturas.selectContratoAssinatura(startDate, endDate, regioes, generos, contratos);
  res.json(result);
});

// PieChart - Assianturas
router.get('/api/assinaturas/genero', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const startDateArray = params.start_date ? params.start_date.split('-').map(e => parseInt(e)) : dataInicial1;
  const startDate = startDateArray[0] + '/' + startDateArray[1] + '/' + startDateArray[2];
  const endDateArray = params.end_date ? params.end_date.split('-').map(e => parseInt(e)) : dataInicial2;
  const endDate = endDateArray[0] + '/' + endDateArray[1] + '/' + endDateArray[2];
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const result = await dbAssinaturas.selectGeneroAssinatura(startDate, endDate, regioes, generos, contratos);
  res.json(result);
});

// LineChart - Assinatura Mensal
router.get('/api/assinaturas/total/mensal', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const mes = params.mes_selecionado ?? '1';
  const ano = params.ano_selecionado ?? '2022';
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const assinaturas = await dbAssinaturas.selectAssinaturaMensal(regioes, generos, contratos, ano, mes);
  res.json(assinaturas);
});

// BarChart (Região) - Assinaturas Mensal
router.get('/api/assinaturas/regiao/mensal', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const mes = params.mes_selecionado ?? '1';
  const ano = params.ano_selecionado ?? '2022';
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const result = await dbAssinaturas.selectRegiaoAssinaturaMensal(regioes, generos, contratos, ano, mes);
  res.json(result);
});

// BarChart (Contratos) - Assinaturas Mensal
router.get('/api/assinaturas/contrato/mensal', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const mes = params.mes_selecionado ?? '1';
  const ano = params.ano_selecionado ?? '2022';
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const result = await dbAssinaturas.selectContratoAssinaturaMensal(regioes, generos, contratos, ano, mes);
  res.json(result);
});

// PieChart - Assinaturas Mensal
router.get('/api/assinaturas/genero/mensal', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const mes = params.mes_selecionado ?? '1';
  const ano = params.ano_selecionado ?? '2022';
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const result = await dbAssinaturas.selectGeneroAssinaturaMensal(regioes, generos, contratos, ano, mes);
  res.json(result);
});

// Comparativos
// LineChart - Assinaturas
router.get('/api/assinaturas/total/comparativo', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const mesInicial = params.periodo_inicial ?? 1;
  const mesFinal = params.periodo_final ?? 12;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const ano1 = params.primeiro_ano ?? primeiroAno;
  const ano2 = params.segundo_ano ?? segundoAno;
  const result = await dbAssinaturas.selectTotalAssinaturaComparativo(regioes, generos, contratos, mesInicial, mesFinal, ano1, ano2);
  res.json(result);
});

// BarChart (Região) - Assinaturas
router.get('/api/assinaturas/regiao/comparativo', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const mesInicial = params.periodo_inicial ?? 1;
  const mesFinal = params.periodo_final ?? 12;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const ano1 = params.primeiro_ano ?? primeiroAno;
  const ano2 = params.segundo_ano ?? segundoAno;
  const result = await dbAssinaturas.selectRegiaoAssinaturaComparativo(regioes, generos, contratos, mesInicial, mesFinal, ano1, ano2);
  res.json(result);
});

// BarChart (Contratos) - Assinaturas
router.get('/api/assinaturas/contrato/comparativo', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const mesInicial = params.periodo_inicial ?? 1;
  const mesFinal = params.periodo_final ?? 12;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const ano1 = params.primeiro_ano ?? primeiroAno;
  const ano2 = params.segundo_ano ?? segundoAno;
  const result = await dbAssinaturas.selectContratoAssinaturaComparativo(regioes, generos, contratos, mesInicial, mesFinal, ano1, ano2);
  res.json(result);
});

// PieChart - Assinaturas
router.get('/api/assinaturas/genero/comparativo', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const mesInicial = params.periodo_inicial ?? 1;
  const mesFinal = params.periodo_final ?? 12;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const ano1 = params.primeiro_ano ?? primeiroAno;
  const ano2 = params.segundo_ano ?? segundoAno;
  const result = await dbAssinaturas.selectGeneroAssinaturaComparativo(regioes, generos, contratos, mesInicial, mesFinal, ano1, ano2);
  res.json(result);
});

// Comparativos Mensais
// LineChart - Assinaturas
router.get('/api/assinaturas/total/comparativo/mensal', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const primeiroMesSelecionadoArray = params.primeiro_mes;
  const primeiroMesSelecionado = primeiroMesSelecionadoArray ? primeiroMesSelecionadoArray.split(',') : primeiroMes;
  const segundoMesSelecionadoArray = params.segundo_mes;
  const segundoMesSelecionado = segundoMesSelecionadoArray ? segundoMesSelecionadoArray.split(',') : segundoMes;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const result = await dbAssinaturas.selectAssinaturaDComparativo(regioes, generos, contratos, primeiroMesSelecionado, segundoMesSelecionado);
  res.json(result);
});

// BarChart (Região) - Assinaturas
router.get('/api/assinaturas/regiao/comparativo/mensal', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const primeiroMesSelecionadoArray = params.primeiro_mes;
  const primeiroMesSelecionado = primeiroMesSelecionadoArray ? primeiroMesSelecionadoArray.split(',') : primeiroMes;
  const segundoMesSelecionadoArray = params.segundo_mes;
  const segundoMesSelecionado = segundoMesSelecionadoArray ? segundoMesSelecionadoArray.split(',') : segundoMes;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const result = await dbAssinaturas.selectRegiaoAssinaturaDComparativo(regioes, generos, contratos, primeiroMesSelecionado, segundoMesSelecionado);
  res.json(result);
});

// BarChart (Contratos) - Assinaturas
router.get('/api/assinaturas/contrato/comparativo/mensal', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const primeiroMesSelecionadoArray = params.primeiro_mes;
  const primeiroMesSelecionado = primeiroMesSelecionadoArray ? primeiroMesSelecionadoArray.split(',') : primeiroMes;
  const segundoMesSelecionadoArray = params.segundo_mes;
  const segundoMesSelecionado = segundoMesSelecionadoArray ? segundoMesSelecionadoArray.split(',') : segundoMes;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const result = await dbAssinaturas.selectContratoAssinaturaDComparativo(regioes, generos, contratos, primeiroMesSelecionado, segundoMesSelecionado);
  res.json(result);
});

// PieChart - Assinaturas
router.get('/api/assinaturas/genero/comparativo/mensal', async (req, res) => {
  const dbAssinaturas = require("./api/dbAssinaturas");
  const params = querystring.parse(req.url.split('?')[1]);
  const primeiroMesSelecionadoArray = params.primeiro_mes;
  const primeiroMesSelecionado = primeiroMesSelecionadoArray ? primeiroMesSelecionadoArray.split(',') : primeiroMes;
  const segundoMesSelecionadoArray = params.segundo_mes;
  const segundoMesSelecionado = segundoMesSelecionadoArray ? segundoMesSelecionadoArray.split(',') : segundoMes;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const contratosArray = params.contratos;
  const contratos = contratosArray ? contratosArray.split(',') : contratosIniciais;
  const result = await dbAssinaturas.selectGeneroAssinaturaDComparativo(regioes, generos, contratos, primeiroMesSelecionado, segundoMesSelecionado);
  res.json(result);
});


// #####################################
// Cancelamentos
// LineChart - Cancelamentos
router.get('/api/cancelamentos/total', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const startDateArray = params.start_date ? params.start_date.split('-').map(e => parseInt(e)) : dataInicial1;
  const startDate = startDateArray[0] + '/' + startDateArray[1] + '/' + startDateArray[2];
  const endDateArray = params.end_date ? params.end_date.split('-').map(e => parseInt(e)) : dataInicial2;
  const endDate = endDateArray[0] + '/' + endDateArray[1] + '/' + endDateArray[2];
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const cancelamentos = await dbCancelamentos.selectTotalCancelamento(startDate, endDate, regioes, generos, motivos);
  res.json(cancelamentos);
});

// BarChart (Regiao) - Cancelamentos
router.get('/api/cancelamentos/regiao', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const startDateArray = params.start_date ? params.start_date.split('-').map(e => parseInt(e)) : dataInicial1;
  const startDate = startDateArray[0] + '/' + startDateArray[1] + '/' + startDateArray[2];
  const endDateArray = params.end_date ? params.end_date.split('-').map(e => parseInt(e)) : dataInicial2;
  const endDate = endDateArray[0] + '/' + endDateArray[1] + '/' + endDateArray[2];
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const result = await dbCancelamentos.selectRegiaoCancelamento(startDate, endDate, regioes, generos, motivos);
  res.json(result);
});

// BarChart (Motivo) - Cancelamentos
router.get('/api/cancelamentos/motivo', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const startDateArray = params.start_date ? params.start_date.split('-').map(e => parseInt(e)) : dataInicial1;
  const startDate = startDateArray[0] + '/' + startDateArray[1] + '/' + startDateArray[2];
  const endDateArray = params.end_date ? params.end_date.split('-').map(e => parseInt(e)) : dataInicial2;
  const endDate = endDateArray[0] + '/' + endDateArray[1] + '/' + endDateArray[2];
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const result = await dbCancelamentos.selectMotivoCancelamento(startDate, endDate, regioes, generos, motivos);
  res.json(result);
});

// PieChart - Assianturas
router.get('/api/cancelamentos/genero', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const startDateArray = params.start_date ? params.start_date.split('-').map(e => parseInt(e)) : dataInicial1;
  const startDate = startDateArray[0] + '/' + startDateArray[1] + '/' + startDateArray[2];
  const endDateArray = params.end_date ? params.end_date.split('-').map(e => parseInt(e)) : dataInicial2;
  const endDate = endDateArray[0] + '/' + endDateArray[1] + '/' + endDateArray[2];
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const result = await dbCancelamentos.selectGeneroCancelamento(startDate, endDate, regioes, generos, motivos);
  res.json(result);
});

// LineChart - Cancelamento Mensal
router.get('/api/cancelamentos/total/mensal', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const mes = params.mes_selecionado ?? '1';
  const ano = params.ano_selecionado ?? '2022';
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const cancelamentos = await dbCancelamentos.selectCancelamentoMensal(regioes, generos, motivos, ano, mes);
  res.json(cancelamentos);
});

// BarChart (Região) - Cancelamentos Mensal
router.get('/api/cancelamentos/regiao/mensal', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const mes = params.mes_selecionado ?? '1';
  const ano = params.ano_selecionado ?? '2022';
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const result = await dbCancelamentos.selectRegiaoCancelamentoMensal(regioes, generos, motivos, ano, mes);
  res.json(result);
});

// BarChart (Motivos) - Cancelamentos Mensal
router.get('/api/cancelamentos/motivo/mensal', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const mes = params.mes_selecionado ?? '1';
  const ano = params.ano_selecionado ?? '2022';
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const result = await dbCancelamentos.selectMotivoCancelamentoMensal(regioes, generos, motivos, ano, mes);
  res.json(result);
});

// PieChart - Cancelamentos Mensal
router.get('/api/cancelamentos/genero/mensal', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const mes = params.mes_selecionado ?? '1';
  const ano = params.ano_selecionado ?? '2022';
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const result = await dbCancelamentos.selectGeneroCancelamentoMensal(regioes, generos, motivos, ano, mes);
  res.json(result);
});

// Comparativos
// LineChart - Cancelamentos
router.get('/api/cancelamentos/total/comparativo', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const mesInicial = params.periodo_inicial ?? 1;
  const mesFinal = params.periodo_final ?? 12;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const ano1 = params.primeiro_ano ?? primeiroAno;
  const ano2 = params.segundo_ano ?? segundoAno;
  const result = await dbCancelamentos.selectTotalCancelamentoComparativo(regioes, generos, motivos, mesInicial, mesFinal, ano1, ano2);
  res.json(result);
});

// BarChart (Região) - Cancelamentos
router.get('/api/cancelamentos/regiao/comparativo', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const mesInicial = params.periodo_inicial ?? 1;
  const mesFinal = params.periodo_final ?? 12;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const ano1 = params.primeiro_ano ?? primeiroAno;
  const ano2 = params.segundo_ano ?? segundoAno;
  const result = await dbCancelamentos.selectRegiaoCancelamentoComparativo(regioes, generos, motivos, mesInicial, mesFinal, ano1, ano2);
  res.json(result);
});

// BarChart (Motivos) - Cancelamentos
router.get('/api/cancelamentos/motivo/comparativo', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const mesInicial = params.periodo_inicial ?? 1;
  const mesFinal = params.periodo_final ?? 12;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const ano1 = params.primeiro_ano ?? primeiroAno;
  const ano2 = params.segundo_ano ?? segundoAno;
  const result = await dbCancelamentos.selectMotivoCancelamentoComparativo(regioes, generos, motivos, mesInicial, mesFinal, ano1, ano2);
  res.json(result);
});

// PieChart - Cancelamentos
router.get('/api/cancelamentos/genero/comparativo', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const mesInicial = params.periodo_inicial ?? 1;
  const mesFinal = params.periodo_final ?? 12;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const ano1 = params.primeiro_ano ?? primeiroAno;
  const ano2 = params.segundo_ano ?? segundoAno;
  const result = await dbCancelamentos.selectGeneroCancelamentoComparativo(regioes, generos, motivos, mesInicial, mesFinal, ano1, ano2);
  res.json(result);
});

// Comparativos Mensais
// LineChart - Cancelamentos
router.get('/api/cancelamentos/total/comparativo/mensal', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const primeiroMesSelecionadoArray = params.primeiro_mes;
  const primeiroMesSelecionado = primeiroMesSelecionadoArray ? primeiroMesSelecionadoArray.split(',') : primeiroMes;
  const segundoMesSelecionadoArray = params.segundo_mes;
  const segundoMesSelecionado = segundoMesSelecionadoArray ? segundoMesSelecionadoArray.split(',') : segundoMes;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const result = await dbCancelamentos.selectCancelamentoDComparativo(regioes, generos, motivos, primeiroMesSelecionado, segundoMesSelecionado);
  res.json(result);
});

// BarChart (Região) - Cancelamentos
router.get('/api/cancelamentos/regiao/comparativo/mensal', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const primeiroMesSelecionadoArray = params.primeiro_mes;
  const primeiroMesSelecionado = primeiroMesSelecionadoArray ? primeiroMesSelecionadoArray.split(',') : primeiroMes;
  const segundoMesSelecionadoArray = params.segundo_mes;
  const segundoMesSelecionado = segundoMesSelecionadoArray ? segundoMesSelecionadoArray.split(',') : segundoMes;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const result = await dbCancelamentos.selectRegiaoCancelamentoDComparativo(regioes, generos, motivos, primeiroMesSelecionado, segundoMesSelecionado);
  res.json(result);
});

// BarChart (Motivos) - Cancelamentos
router.get('/api/cancelamentos/motivo/comparativo/mensal', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const primeiroMesSelecionadoArray = params.primeiro_mes;
  const primeiroMesSelecionado = primeiroMesSelecionadoArray ? primeiroMesSelecionadoArray.split(',') : primeiroMes;
  const segundoMesSelecionadoArray = params.segundo_mes;
  const segundoMesSelecionado = segundoMesSelecionadoArray ? segundoMesSelecionadoArray.split(',') : segundoMes;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const result = await dbCancelamentos.selectMotivoCancelamentoDComparativo(regioes, generos, motivos, primeiroMesSelecionado, segundoMesSelecionado);
  res.json(result);
});

// PieChart - Cancelamentos
router.get('/api/cancelamentos/genero/comparativo/mensal', async (req, res) => {
  const dbCancelamentos = require("./api/dbCancelamentos");
  const params = querystring.parse(req.url.split('?')[1]);
  const primeiroMesSelecionadoArray = params.primeiro_mes;
  const primeiroMesSelecionado = primeiroMesSelecionadoArray ? primeiroMesSelecionadoArray.split(',') : primeiroMes;
  const segundoMesSelecionadoArray = params.segundo_mes;
  const segundoMesSelecionado = segundoMesSelecionadoArray ? segundoMesSelecionadoArray.split(',') : segundoMes;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const motivosArray = params.motivos;
  const motivos = motivosArray ? motivosArray.split(',') : motivosIniciais;
  const result = await dbCancelamentos.selectGeneroCancelamentoDComparativo(regioes, generos, motivos, primeiroMesSelecionado, segundoMesSelecionado);
  res.json(result);
});

// #############################
// Crescimentos

// LineChart - Crescimento
router.get('/api/crescimento/total', async (req, res) => {
  const dbCrescimento = require("./api/dbCrescimento");
  const params = querystring.parse(req.url.split('?')[1]);
  const startDateArray = params.start_date ? params.start_date.split('-').map(e => parseInt(e)) : dataInicial1;
  const startDate = startDateArray[0] + '/' + startDateArray[1] + '/' + startDateArray[2];
  const endDateArray = params.end_date ? params.end_date.split('-').map(e => parseInt(e)) : dataInicial2;
  const endDate = endDateArray[0] + '/' + endDateArray[1] + '/' + endDateArray[2];
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const crescimento = await dbCrescimento.selectTotalCrescimento(startDate, endDate, regioes, generos);
  res.json(crescimento);
});

// BarChart - Crescimento
router.get('/api/crescimento/regiao', async (req, res) => {
  const dbCrescimento = require("./api/dbCrescimento");
  const params = querystring.parse(req.url.split('?')[1]);
  const startDateArray = params.start_date ? params.start_date.split('-').map(e => parseInt(e)) : dataInicial1;
  const startDate = startDateArray[0] + '/' + startDateArray[1] + '/' + startDateArray[2];
  const endDateArray = params.end_date ? params.end_date.split('-').map(e => parseInt(e)) : dataInicial2;
  const endDate = endDateArray[0] + '/' + endDateArray[1] + '/' + endDateArray[2];
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const crescimento = await dbCrescimento.selectRegiaoCrescimento(startDate, endDate, regioes, generos);
  res.json(crescimento);
});

// PieChart - Crescimento
router.get('/api/crescimento/genero', async (req, res) => {
  const dbCrescimento = require("./api/dbCrescimento");
  const params = querystring.parse(req.url.split('?')[1]);
  const startDateArray = params.start_date ? params.start_date.split('-').map(e => parseInt(e)) : dataInicial1;
  const startDate = startDateArray[0] + '/' + startDateArray[1] + '/' + startDateArray[2];
  const endDateArray = params.end_date ? params.end_date.split('-').map(e => parseInt(e)) : dataInicial2;
  const endDate = endDateArray[0] + '/' + endDateArray[1] + '/' + endDateArray[2];
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const crescimento = await dbCrescimento.selectGeneroCrescimento(startDate, endDate, regioes, generos);
  res.json(crescimento);
});

// Mensal
// LineChart - Crescimento
router.get('/api/crescimento/total/mensal', async (req, res) => {
  const dbCrescimento = require("./api/dbCrescimento");
  const params = querystring.parse(req.url.split('?')[1]);
  const mes = params.mes_selecionado ?? '1';
  const ano = params.ano_selecionado ?? '2022';
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const crescimento = await dbCrescimento.selectCrescimentoMensal(regioes, generos, ano, mes);
  res.json(crescimento);
});

// BarChart - Crescimento
router.get('/api/crescimento/regiao/mensal', async (req, res) => {
  const dbCrescimento = require("./api/dbCrescimento");
  const params = querystring.parse(req.url.split('?')[1]);
  const mes = params.mes_selecionado ?? '1';
  const ano = params.ano_selecionado ?? '2022';
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const crescimento = await dbCrescimento.selectRegiaoCrescimentoMensal(regioes, generos, ano, mes);
  res.json(crescimento);
});

// PieChart - Crescimento
router.get('/api/crescimento/genero/mensal', async (req, res) => {
  const dbCrescimento = require("./api/dbCrescimento");
  const params = querystring.parse(req.url.split('?')[1]);
  const mes = params.mes_selecionado ?? '1';
  const ano = params.ano_selecionado ?? '2022';
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const crescimento = await dbCrescimento.selectGeneroCrescimentoMensal(regioes, generos, ano, mes);
  res.json(crescimento);
});

// Comparativos
// LineChart - Crescimento
router.get('/api/crescimento/total/comparativo', async (req, res) => {
  const dbCrescimento = require("./api/dbCrescimento");
  const params = querystring.parse(req.url.split('?')[1]);
  const mesInicial = params.periodo_inicial ?? 1;
  const mesFinal = params.periodo_final ?? 12;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const ano1 = params.primeiro_ano ?? primeiroAno;
  const ano2 = params.segundo_ano ?? segundoAno;
  const crescimento = await dbCrescimento.selectTotalCrescimentoComparativo(regioes, generos, mesInicial, mesFinal, ano1, ano2);
  res.json(crescimento);
});

router.get('/api/crescimento/regiao/comparativo', async (req, res) => {
  const dbCrescimento = require("./api/dbCrescimento");
  const params = querystring.parse(req.url.split('?')[1]);
  const mesInicial = params.periodo_inicial ?? 1;
  const mesFinal = params.periodo_final ?? 12;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const ano1 = params.primeiro_ano ?? primeiroAno;
  const ano2 = params.segundo_ano ?? segundoAno;
  const crescimento = await dbCrescimento.selectRegiaoCrescimentoComparativo(regioes, generos, mesInicial, mesFinal, ano1, ano2);
  res.json(crescimento);
});

router.get('/api/crescimento/genero/comparativo', async (req, res) => {
  const dbCrescimento = require("./api/dbCrescimento");
  const params = querystring.parse(req.url.split('?')[1]);
  const mesInicial = params.periodo_inicial ?? 1;
  const mesFinal = params.periodo_final ?? 12;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const ano1 = params.primeiro_ano ?? primeiroAno;
  const ano2 = params.segundo_ano ?? segundoAno;
  const crescimento = await dbCrescimento.selectGeneroCrescimentoComparativo(regioes, generos, mesInicial, mesFinal, ano1, ano2);
  res.json(crescimento);
});

// Comparativos Mensais
// LineChart - Cancelamentos
router.get('/api/crescimento/total/comparativo/mensal', async (req, res) => {
  const dbCrescimento = require("./api/dbCrescimento");
  const params = querystring.parse(req.url.split('?')[1]);
  const primeiroMesSelecionadoArray = params.primeiro_mes;
  const primeiroMesSelecionado = primeiroMesSelecionadoArray ? primeiroMesSelecionadoArray.split(',') : primeiroMes;
  const segundoMesSelecionadoArray = params.segundo_mes;
  const segundoMesSelecionado = segundoMesSelecionadoArray ? segundoMesSelecionadoArray.split(',') : segundoMes;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const result = await dbCrescimento.selectCrescimentoDComparativo(regioes, generos, primeiroMesSelecionado, segundoMesSelecionado);
  res.json(result);
});

// BarChart (Região) - Crescimento
router.get('/api/crescimento/regiao/comparativo/mensal', async (req, res) => {
  const dbCrescimento = require("./api/dbCrescimento");
  const params = querystring.parse(req.url.split('?')[1]);
  const primeiroMesSelecionadoArray = params.primeiro_mes;
  const primeiroMesSelecionado = primeiroMesSelecionadoArray ? primeiroMesSelecionadoArray.split(',') : primeiroMes;
  const segundoMesSelecionadoArray = params.segundo_mes;
  const segundoMesSelecionado = segundoMesSelecionadoArray ? segundoMesSelecionadoArray.split(',') : segundoMes;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const result = await dbCrescimento.selectRegiaoCrescimentoDComparativo(regioes, generos, primeiroMesSelecionado, segundoMesSelecionado);
  res.json(result);
});

// PieChart - Crescimento
router.get('/api/crescimento/genero/comparativo/mensal', async (req, res) => {
  const dbCrescimento = require("./api/dbCrescimento");
  const params = querystring.parse(req.url.split('?')[1]);
  const primeiroMesSelecionadoArray = params.primeiro_mes;
  const primeiroMesSelecionado = primeiroMesSelecionadoArray ? primeiroMesSelecionadoArray.split(',') : primeiroMes;
  const segundoMesSelecionadoArray = params.segundo_mes;
  const segundoMesSelecionado = segundoMesSelecionadoArray ? segundoMesSelecionadoArray.split(',') : segundoMes;
  const regioesArray = params.regioes;
  const regioes = regioesArray ? regioesArray.split(',') : cidadesIniciais;
  const generosArray = params.generos;
  const generos = generosArray ? generosArray.split(',') : generosIniciais;
  const result = await dbCrescimento.selectGeneroCrescimentoDComparativo(regioes, generos, primeiroMesSelecionado, segundoMesSelecionado);
  res.json(result);
});

app.use(router);
app.listen(port);
console.log('Server listening...');