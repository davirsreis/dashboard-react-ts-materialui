const connectDB = require('../shared/environment/connectDB.js');

async function connect() {
  if (global.connection && global.connection.state !== 'disconnected')
    return global.connection;

  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection(`mysql://root:${connectDB.password}@localhost:3306/dbempresa`);
  console.log("Conectou no MySQL!");
  global.connection = connection;
  return connection;
}
connect();

// LineChart - Faturamentos
async function selectTotalFaturamento(startDate, endDate, regioesSelecionadas, generosSelecionados) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT SUM(valor) AS total, YEAR(pagamento) AS ano, MONTH(pagamento) AS mes FROM dbempresa.faturamentos WHERE pagamento BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?) GROUP BY ano, mes;", [startDate, endDate, regioesSelecionadas, generosSelecionados]);

  const resultado = {};

  rows.forEach(row => {
    const { total, mes, ano } = row;

    if (!resultado[ano]) {
      resultado[ano] = {};
    }

    if (!resultado[ano][mes]) {
      resultado[ano][mes] = {
        total: 0,
      };
    }

    resultado[ano][mes].total += parseFloat(total);
  });
  return resultado;
}

// BarChart - Faturamentos
async function selectRegiaoFaturamento(startDate, endDate, regioesSelecionadas, generosSelecionados) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT regiaoCliente, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.faturamentos WHERE pagamento BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?) GROUP BY regiaoCliente ORDER BY total_valor DESC;", [startDate, endDate, regioesSelecionadas, generosSelecionados]);

  const data = {};

  rows.forEach(row => {
    const { regiaoCliente, total_ocorrencias, total_valor } = row;

    data[regiaoCliente] = { total_ocorrencias, total_valor };
  });

  return data;
}

// PieChart - Faturamentos
const generoNomes = {
  'F': 'Feminino',
  'M': 'Masculino',
  '': 'Indefinido'
};

async function selectGeneroFaturamento(startDate, endDate, regioesSelecionadas, generosSelecionados) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT generoCliente, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.faturamentos WHERE pagamento BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?) GROUP BY generoCliente;", [startDate, endDate, regioesSelecionadas, generosSelecionados]);

  const data = rows.map(row => ({
    generoCliente: generoNomes[row.generoCliente] || row.generoCliente,
    total_ocorrencias: row.total_ocorrencias,
    total_valor: row.total_valor
  }));
  return data;
}

// Comparativos
// LineChart
async function selectTotalFaturamentoComparativo(regioesSelecionadas, generosSelecionados, periodoInicial, periodoFinal, ano1, ano2) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT SUM(valor) AS total, YEAR(pagamento) AS ano, MONTH(pagamento) AS mes FROM dbempresa.faturamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ( (YEAR(pagamento) = ? AND MONTH(pagamento) BETWEEN ? AND ?) OR (YEAR(pagamento) = ? AND MONTH(pagamento) BETWEEN ? AND ?) ) GROUP BY ano, mes ORDER BY ano ASC, mes ASC;", [regioesSelecionadas, generosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal]);
  const resultado = {};
  rows.forEach(row => {
    const { total, mes, ano } = row;

    if (!resultado[ano]) {
      resultado[ano] = {};
    }

    if (!resultado[ano][mes]) {
      resultado[ano][mes] = {
        total: 0,
      };
    }

    resultado[ano][mes].total += parseFloat(total);
  });
  return resultado;
}

// BarChart - Faturamentos
async function selectRegiaoFaturamentoComparativo(regioesSelecionadas, generosSelecionados, periodoInicial, periodoFinal, ano1, ano2) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT regiaoCliente, YEAR(pagamento) as ano, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.faturamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ( (YEAR(pagamento) = ? AND MONTH(pagamento) BETWEEN ? AND ?) OR (YEAR(pagamento) = ? AND MONTH(pagamento) BETWEEN ? AND ?) ) GROUP BY regiaoCliente, ano ORDER BY total_valor DESC;", [regioesSelecionadas, generosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal]);
  const data = {};

  rows.forEach(row => {
    const { regiaoCliente, ano, total_ocorrencias, total_valor } = row;

    if (!data[regiaoCliente]) {
      data[regiaoCliente] = {};
    }

    data[regiaoCliente][ano] = {
      total_ocorrencias,
      total_valor,
    };
  });

  const anosDesejados = [ano1, ano2];

  for (let regiao in data) {
    for (let ano of anosDesejados) {
      if (!data[regiao][ano]) {
        data[regiao][ano] = {
          total_ocorrencias: 0,
          total_valor: 0
        };
      }
    }
  }

  for (let regiao in data) {
    for (let ano in data[regiao]) {
      let total = 0;
      for (let prop in data[regiao][ano]) {
        if (prop === 'total_valor') {
          total += parseFloat(data[regiao][ano][prop]);
        }
      }
    }
  }

  return data;
}

// PieChart - Faturamentos
async function selectGeneroFaturamentoComparativo(regioesSelecionadas, generosSelecionados, periodoInicial, periodoFinal, ano1, ano2) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT generoCliente, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor, YEAR(pagamento) as ano FROM dbempresa.faturamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ( (YEAR(pagamento) = ? AND MONTH(pagamento) BETWEEN ? AND ?) OR (YEAR(pagamento) = ? AND MONTH(pagamento) BETWEEN ? AND ?) ) GROUP BY generoCliente, ano ORDER BY ano ASC;", [regioesSelecionadas, generosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal]);

  const data = {};

  rows.forEach(row => {
    const genero = generoNomes[row.generoCliente] || row.generoCliente;
    const ano = row.ano.toString();

    if (!data[genero]) {
      data[genero] = {};
    }

    data[genero][ano] = {
      total_ocorrencias: row.total_ocorrencias,
      total_valor: row.total_valor
    };
  });

  return data;
}

// Faturamento Mensal
// LineChart
async function selectFaturamentoMensal(regioesSelecionadas, generosSelecionados, anoSelecionado, mesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT SUM(valor) AS total, DAY(pagamento) AS dia FROM dbempresa.faturamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND YEAR(pagamento) = ? AND MONTH(pagamento) = ? GROUP BY dia;", [regioesSelecionadas, generosSelecionados, anoSelecionado, mesSelecionado]);
  const resultado = {};
  rows.forEach(row => {
    const { total, dia } = row;

    resultado[dia] = {
      total: parseFloat(total),
    };
  });
  return resultado;
}

// BarChart - Faturamentos
async function selectRegiaoFaturamentoMensal(regioesSelecionadas, generosSelecionados, anoSelecionado, mesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT regiaoCliente, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.faturamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND YEAR(pagamento) = ? AND MONTH(pagamento) = ? GROUP BY regiaoCliente ORDER BY total_valor DESC;", [regioesSelecionadas, generosSelecionados, anoSelecionado, mesSelecionado]);

  const data = {};

  rows.forEach(row => {
    const { regiaoCliente, total_ocorrencias, total_valor } = row;

    data[regiaoCliente] = { total_ocorrencias, total_valor };
  });

  return data;
}

// PieChart - Faturamentos
async function selectGeneroFaturamentoMensal(regioesSelecionadas, generosSelecionados, anoSelecionado, mesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT generoCliente, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.faturamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND YEAR(pagamento) = ? AND MONTH(pagamento) = ? GROUP BY generoCliente;", [regioesSelecionadas, generosSelecionados, anoSelecionado, mesSelecionado]);

  const data = rows.map(row => ({
    generoCliente: generoNomes[row.generoCliente] || row.generoCliente,
    total_ocorrencias: row.total_ocorrencias,
    total_valor: row.total_valor
  }));
  return data;
}

// Faturamento Mensal Comparativo
// LineChart
async function selectFaturamentoDComparativo(regioesSelecionadas, generosSelecionados, primeiroMesSelecionado, segundoMesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT SUM(valor) AS total, YEAR(pagamento) AS ano, MONTH(pagamento) AS mes, DAY(pagamento) AS dia FROM dbempresa.faturamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ((YEAR(pagamento) = ? AND MONTH(pagamento) = ?) OR (YEAR(pagamento) = ? AND MONTH(pagamento) = ?)) GROUP BY ano, mes, dia;", [regioesSelecionadas, generosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0], segundoMesSelecionado[1], segundoMesSelecionado[0]]);

  const resultado = {};

  const primeiroMesChave = `${primeiroMesSelecionado[1]}-${primeiroMesSelecionado[0].toString().padStart(2, '0')}`;
  const segundoMesChave = `${segundoMesSelecionado[1]}-${segundoMesSelecionado[0].toString().padStart(2, '0')}`;

  resultado[primeiroMesChave] = {};
  resultado[segundoMesChave] = {};

  const diasNoMes = 31;

  for (let dia = 1; dia <= diasNoMes; dia++) {
    resultado[primeiroMesChave][dia] = {
      total: 0,
    };

    resultado[segundoMesChave][dia] = {
      total: 0,
    };
  }

  rows.forEach(row => {
    const { total, ano, mes, dia } = row;
    const chave = `${ano}-${mes.toString().padStart(2, '0')}`;

    if (chave === primeiroMesChave || chave === segundoMesChave) {
      resultado[chave][dia] = {
        total: parseFloat(total),
      };
    }
  });

  return resultado;
}

// BarChart - Faturamentos
async function selectRegiaoFaturamentoDComparativo(regioesSelecionadas, generosSelecionados, primeiroMesSelecionado, segundoMesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT regiaoCliente, YEAR(pagamento) as ano, MONTH(pagamento) as mes, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.faturamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ((YEAR(pagamento) = ? AND MONTH(pagamento) = ?) OR (YEAR(pagamento) = ? AND MONTH(pagamento) = ?)) GROUP BY regiaoCliente, ano, mes ORDER BY ano, mes, total_valor DESC;", [regioesSelecionadas, generosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0], segundoMesSelecionado[1], segundoMesSelecionado[0]]);
  const data = {};

  rows.forEach(row => {
    const { regiaoCliente, ano, mes, total_ocorrencias, total_valor } = row;
    const chave = `${ano}-${mes.toString().padStart(2, '0')}`;

    if (!data[regiaoCliente]) {
      data[regiaoCliente] = {};
    }

    data[regiaoCliente][chave] = {
      total_ocorrencias,
      total_valor,
    };
  })

  const regioes = regioesSelecionadas;

  const meses = [primeiroMesSelecionado, segundoMesSelecionado];
  for (let regiao of regioes) {
    if (!data[regiao]) {
      data[regiao] = {};
    }
    for (let mes of meses) {
      const chave = `${mes[1]}-${mes[0].toString().padStart(2, '0')}`;
      if (!data[regiao][chave]) {
        data[regiao][chave] = {
          total_ocorrencias: 0,
          total_valor: 0
        };
      }
    }
  }


  for (let regiao in data) {
    for (let ano in data[regiao]) {
      let total = 0;
      for (let prop in data[regiao][ano]) {
        if (prop === 'total_valor') {
          total += parseFloat(data[regiao][ano][prop]);
        }
      }
    }
  }

  return data;
}

// PieChart - Faturamentos
async function selectGeneroFaturamentoDComparativo(regioesSelecionadas, generosSelecionados, primeiroMesSelecionado, segundoMesSelecionado) {
  const conn = await connect();

  const [rows1, fields1] = await conn.query("SELECT generoCliente, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.faturamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND YEAR(pagamento) = ? AND MONTH(pagamento) = ? GROUP BY generoCliente;", [regioesSelecionadas, generosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0]]);
  const [rows2, fields2] = await conn.query("SELECT generoCliente, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.faturamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND YEAR(pagamento) = ? AND MONTH(pagamento) = ? GROUP BY generoCliente;", [regioesSelecionadas, generosSelecionados, segundoMesSelecionado[1], segundoMesSelecionado[0]]);

  const data = {};
  
  generosSelecionados.forEach(genero => {
    data[genero] = {};
    const primeiroMes = `${primeiroMesSelecionado[0]}-${primeiroMesSelecionado[1]}`;
    const segundoMes = `${segundoMesSelecionado[0]}-${segundoMesSelecionado[1]}`;
    data[genero][primeiroMes] = { total_ocorrencias: 0, total_valor: 0 };
    data[genero][segundoMes] = { total_ocorrencias: 0, total_valor: 0 };
  });

  rows1.forEach(row => {
    const genero = generoNomes[row.generoCliente] || row.generoCliente;
    const periodo = `${primeiroMesSelecionado[0]}-${primeiroMesSelecionado[1]}`;
    data[genero][periodo].total_ocorrencias = row.total_ocorrencias;
    data[genero][periodo].total_valor = row.total_valor;
  });

  rows2.forEach(row => {
    const genero = generoNomes[row.generoCliente] || row.generoCliente;
    const periodo = `${segundoMesSelecionado[0]}-${segundoMesSelecionado[1]}`;
    data[genero][periodo].total_ocorrencias = row.total_ocorrencias;
    data[genero][periodo].total_valor = row.total_valor;
  });

  return data;
}

module.exports = { selectTotalFaturamento, selectRegiaoFaturamento, selectGeneroFaturamento, selectTotalFaturamentoComparativo, selectRegiaoFaturamentoComparativo, selectGeneroFaturamentoComparativo, selectFaturamentoMensal, selectRegiaoFaturamentoMensal, selectGeneroFaturamentoMensal, selectFaturamentoDComparativo, selectRegiaoFaturamentoDComparativo, selectGeneroFaturamentoDComparativo };