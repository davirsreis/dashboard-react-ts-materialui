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

// LineChart - Assinaturas
async function selectTotalAssinatura(startDate, endDate, regioesSelecionadas, generosSelecionados, contratosSelecionados) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT COUNT(*) as total_ocorrencias, SUM(valor) AS total, YEAR(dataAtivacao) AS ano, MONTH(dataAtivacao) AS mes FROM dbempresa.assinaturas WHERE dataAtivacao BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) GROUP BY ano, mes;", [startDate, endDate, regioesSelecionadas, generosSelecionados, contratosSelecionados]);

  const resultado = {};

  rows.forEach(row => {
    const { total, total_ocorrencias, mes, ano } = row;

    if (!resultado[ano]) {
      resultado[ano] = {};
    }

    if (!resultado[ano][mes]) {
      resultado[ano][mes] = {
        total: 0,
        total_ocorrencias: 0,
      };
    }

    resultado[ano][mes].total += parseFloat(total);
    resultado[ano][mes].total_ocorrencias += parseFloat(total_ocorrencias);
  });
  return resultado;
}

// BarChart (Regiões) - Assinaturas
async function selectRegiaoAssinatura(startDate, endDate, regioesSelecionadas, generosSelecionados, contratosSelecionados) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT regiaoCliente, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.assinaturas WHERE dataAtivacao BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) GROUP BY regiaoCliente ORDER BY total_valor DESC;", [startDate, endDate, regioesSelecionadas, generosSelecionados, contratosSelecionados]);

  const data = {};

  rows.forEach(row => {
    const { regiaoCliente, total_ocorrencias, total_valor } = row;

    data[regiaoCliente] = { total_ocorrencias, total_valor };
  });

  return data;
}

// BarChart (Contratos) - Assinaturas
async function selectContratoAssinatura(startDate, endDate, regioesSelecionadas, generosSelecionados, contratosSelecionados) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT contrato, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.assinaturas WHERE dataAtivacao BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) GROUP BY contrato ORDER BY total_valor DESC;", [startDate, endDate, regioesSelecionadas, generosSelecionados, contratosSelecionados]);

  const data = {};

  rows.forEach(row => {
    const { contrato, total_ocorrencias, total_valor } = row;

    data[contrato] = { total_ocorrencias, total_valor };
  });

  return data;
}

// PieChart - Assinaturas
const generoNomes = {
  'F': 'Feminino',
  'M': 'Masculino',
  '': 'Indefinido'
};

async function selectGeneroAssinatura(startDate, endDate, regioesSelecionadas, generosSelecionados, contratosSelecionados) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT generoCliente, COUNT(*) as total_ocorrencias FROM dbempresa.assinaturas WHERE dataAtivacao BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) GROUP BY generoCliente;", [startDate, endDate, regioesSelecionadas, generosSelecionados, contratosSelecionados]);

  const data = rows.map(row => ({
    generoCliente: generoNomes[row.generoCliente] || row.generoCliente,
    total_ocorrencias: row.total_ocorrencias
  }));
  return data;
}

// Assinatura Mensal
// LineChart
async function selectAssinaturaMensal(regioesSelecionadas, generosSelecionados, contratosSelecionados, anoSelecionado, mesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT COUNT(*) as total_ocorrencias, SUM(valor) AS total, DAY(dataAtivacao) AS dia FROM dbempresa.assinaturas WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) AND YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ? GROUP BY dia;", [regioesSelecionadas, generosSelecionados, contratosSelecionados, anoSelecionado, mesSelecionado]);
  const resultado = {};
  rows.forEach(row => {
    const { total, total_ocorrencias, dia } = row;

    resultado[dia] = {
      total: parseFloat(total),
      total_ocorrencias: parseFloat(total_ocorrencias),
    };
  });
  return resultado;
}

// BarChart (Região) - Assinaturas
async function selectRegiaoAssinaturaMensal(regioesSelecionadas, generosSelecionados, contratosSelecionados, anoSelecionado, mesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT regiaoCliente, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.assinaturas WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) AND YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ? GROUP BY regiaoCliente ORDER BY total_valor DESC;", [regioesSelecionadas, generosSelecionados, contratosSelecionados, anoSelecionado, mesSelecionado]);

  const data = {};

  rows.forEach(row => {
    const { regiaoCliente, total_ocorrencias, total_valor } = row;

    data[regiaoCliente] = { total_ocorrencias, total_valor };
  });

  return data;
}

// BarChart (Contratos) - Assinaturas
async function selectContratoAssinaturaMensal(regioesSelecionadas, generosSelecionados, contratosSelecionados, anoSelecionado, mesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT contrato, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.assinaturas WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) AND YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ? GROUP BY contrato ORDER BY total_valor DESC;", [regioesSelecionadas, generosSelecionados, contratosSelecionados, anoSelecionado, mesSelecionado]);

  const data = {};

  rows.forEach(row => {
    const { contrato, total_ocorrencias, total_valor } = row;

    data[contrato] = { total_ocorrencias, total_valor };
  });

  return data;
}

// PieChart - Assinaturas
async function selectGeneroAssinaturaMensal(regioesSelecionadas, generosSelecionados, contratosSelecionados, anoSelecionado, mesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT generoCliente, COUNT(*) as total_ocorrencias FROM dbempresa.assinaturas WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) AND YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ? GROUP BY generoCliente;", [regioesSelecionadas, generosSelecionados, contratosSelecionados, anoSelecionado, mesSelecionado]);

  const data = rows.map(row => ({
    generoCliente: generoNomes[row.generoCliente] || row.generoCliente,
    total_ocorrencias: row.total_ocorrencias
  }));
  return data;
}

// Comparativos
// LineChart
async function selectTotalAssinaturaComparativo(regioesSelecionadas, generosSelecionados, contratosSelecionados, periodoInicial, periodoFinal, ano1, ano2) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT COUNT(*) as total_ocorrencias, SUM(valor) AS total, YEAR(dataAtivacao) AS ano, MONTH(dataAtivacao) AS mes FROM dbempresa.assinaturas WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) AND ( (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) BETWEEN ? AND ?) OR (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) BETWEEN ? AND ?) ) GROUP BY ano, mes;", [regioesSelecionadas, generosSelecionados, contratosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal]);
  const resultado = {};

  rows.forEach(row => {
    const { total, total_ocorrencias, mes, ano } = row;

    if (!resultado[ano]) {
      resultado[ano] = {};
    }

    if (!resultado[ano][mes]) {
      resultado[ano][mes] = {
        total: 0,
        total_ocorrencias: 0,
      };
    }

    resultado[ano][mes].total += parseFloat(total);
    resultado[ano][mes].total_ocorrencias += parseFloat(total_ocorrencias);
  });
  return resultado;
}

// BarChart (Região) - Assinaturas
async function selectRegiaoAssinaturaComparativo(regioesSelecionadas, generosSelecionados, contratosSelecionados, periodoInicial, periodoFinal, ano1, ano2) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT regiaoCliente, YEAR(dataAtivacao) as ano, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.assinaturas WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) AND ( (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) BETWEEN ? AND ?) OR (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) BETWEEN ? AND ?) ) GROUP BY regiaoCliente, ano ORDER BY total_valor DESC;", [regioesSelecionadas, generosSelecionados, contratosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal]);
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

// BarChart (Contratos) - Assinaturas
async function selectContratoAssinaturaComparativo(regioesSelecionadas, generosSelecionados, contratosSelecionados, periodoInicial, periodoFinal, ano1, ano2) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT contrato, YEAR(dataAtivacao) as ano, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.assinaturas WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) AND ( (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) BETWEEN ? AND ?) OR (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) BETWEEN ? AND ?) ) GROUP BY contrato, ano ORDER BY total_valor DESC;", [regioesSelecionadas, generosSelecionados, contratosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal]);
  const data = {};

  rows.forEach(row => {
    const { contrato, ano, total_ocorrencias, total_valor } = row;

    if (!data[contrato]) {
      data[contrato] = {};
    }

    data[contrato][ano] = {
      total_ocorrencias: total_ocorrencias || 0,
      total_valor: total_valor || 0,
    };
  });

  const anosDesejados = [ano1, ano2];

  for (let contrato in data) {
    for (let ano of anosDesejados) {
      if (!data[contrato][ano]) {
        data[contrato][ano] = {
          total_ocorrencias: 0,
          total_valor: 0
        };
      }
    }
  }

  for (let contrato in data) {
    for (let ano in data[contrato]) {
      let total = 0;
      for (let prop in data[contrato][ano]) {
        if (prop === 'total_valor') {
          total += parseFloat(data[contrato][ano][prop]);
        }
      }
    }
  }

  return data;
}

// PieChart - Assinaturas
async function selectGeneroAssinaturaComparativo(regioesSelecionadas, generosSelecionados, contratosSelecionados, periodoInicial, periodoFinal, ano1, ano2) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT generoCliente, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor, YEAR(dataAtivacao) as ano FROM dbempresa.assinaturas WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) AND ( (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) BETWEEN ? AND ?) OR (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) BETWEEN ? AND ?) ) GROUP BY generoCliente, ano ORDER BY ano ASC;", [regioesSelecionadas, generosSelecionados, contratosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal]);
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

// Assinatura Mensal Comparativo
// LineChart
async function selectAssinaturaDComparativo(regioesSelecionadas, generosSelecionados, contratosSelecionados, primeiroMesSelecionado, segundoMesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT COUNT(*) as total_ocorrencias, SUM(valor) AS total, YEAR(dataAtivacao) AS ano, MONTH(dataAtivacao) AS mes, DAY(dataAtivacao) AS dia FROM dbempresa.assinaturas WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) AND ((YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ?) OR (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ?)) GROUP BY ano, mes, dia;", [regioesSelecionadas, generosSelecionados, contratosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0], segundoMesSelecionado[1], segundoMesSelecionado[0]]);

  const resultado = {};

  const primeiroMesChave = `${primeiroMesSelecionado[1]}-${primeiroMesSelecionado[0].toString().padStart(2, '0')}`;
  const segundoMesChave = `${segundoMesSelecionado[1]}-${segundoMesSelecionado[0].toString().padStart(2, '0')}`;

  resultado[primeiroMesChave] = {};
  resultado[segundoMesChave] = {};

  const diasNoMes = 31;

  for (let dia = 1; dia <= diasNoMes; dia++) {
    resultado[primeiroMesChave][dia] = {
      total: 0,
      total_ocorrencias: 0,
    };

    resultado[segundoMesChave][dia] = {
      total: 0,
      total_ocorrencias: 0,
    };
  }

  rows.forEach(row => {
    const { total, total_ocorrencias, ano, mes, dia } = row;
    const chave = `${ano}-${mes.toString().padStart(2, '0')}`;

    if (chave === primeiroMesChave || chave === segundoMesChave) {
      resultado[chave][dia] = {
        total: parseFloat(total),
        total_ocorrencias: parseFloat(total_ocorrencias),
      };
    }
  });

  return resultado;
}



// BarChart (Região) - Assinaturas
async function selectRegiaoAssinaturaDComparativo(regioesSelecionadas, generosSelecionados, contratosSelecionados, primeiroMesSelecionado, segundoMesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT regiaoCliente, YEAR(dataAtivacao) as ano, MONTH(dataAtivacao) as mes, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.assinaturas WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) AND ((YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ?) OR (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ?)) GROUP BY regiaoCliente, ano, mes ORDER BY ano, mes, total_valor DESC;", [regioesSelecionadas, generosSelecionados, contratosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0], segundoMesSelecionado[1], segundoMesSelecionado[0]]);

  const data = {};

  regioesSelecionadas.forEach(regiao => {
    data[regiao] = {};

    const mesesSelecionados = [primeiroMesSelecionado, segundoMesSelecionado];
    mesesSelecionados.forEach(([mes, ano]) => {
      const chave = `${ano}-${mes.toString().padStart(2, '0')}`;

      data[regiao][chave] = {
        total_ocorrencias: 0,
        total_valor: '0',
      };
    });
  });

  rows.forEach(row => {
    const { regiaoCliente, ano, mes, total_ocorrencias, total_valor } = row;
    const chave = `${ano}-${mes.toString().padStart(2, '0')}`;

    data[regiaoCliente][chave] = {
      total_ocorrencias,
      total_valor,
    };
  });

  return data;
}


// BarChart (Contratos) - Assinaturas
async function selectContratoAssinaturaDComparativo(regioesSelecionadas, generosSelecionados, contratosSelecionados, primeiroMesSelecionado, segundoMesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT contrato, YEAR(dataAtivacao) as ano, MONTH(dataAtivacao) as mes, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.assinaturas WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) AND ((YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ?) OR (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ?)) GROUP BY contrato, ano, mes ORDER BY ano, mes, total_valor DESC;", [regioesSelecionadas, generosSelecionados, contratosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0], segundoMesSelecionado[1], segundoMesSelecionado[0]]);
  const data = {};

  contratosSelecionados.forEach(contrato => {
    data[contrato] = {};

    const mesesSelecionados = [primeiroMesSelecionado, segundoMesSelecionado];
    mesesSelecionados.forEach(([mes, ano]) => {
      const chave = `${ano}-${mes.toString().padStart(2, '0')}`;

      data[contrato][chave] = {
        total_ocorrencias: 0,
        total_valor: '0',
      };
    });
  });

  rows.forEach(row => {
    const { contrato, ano, mes, total_ocorrencias, total_valor } = row;
    const chave = `${ano}-${mes.toString().padStart(2, '0')}`;

    if (!data[contrato]) {
      data[contrato] = {};
    }

    data[contrato][chave] = {
      total_ocorrencias: total_ocorrencias || 0,
      total_valor: total_valor || 0,
    };
  })

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

// PieChart - Assinaturas
async function selectGeneroAssinaturaDComparativo(regioesSelecionadas, generosSelecionados, contratosSelecionados, primeiroMesSelecionado, segundoMesSelecionado) {
  const conn = await connect();

  const [rows1, fields1] = await conn.query("SELECT generoCliente, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.assinaturas WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) AND YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ? GROUP BY generoCliente;", [regioesSelecionadas, generosSelecionados, contratosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0]]);
  const [rows2, fields2] = await conn.query("SELECT generoCliente, COUNT(*) as total_ocorrencias, SUM(valor) as total_valor FROM dbempresa.assinaturas WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND contrato IN (?) AND YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ? GROUP BY generoCliente;", [regioesSelecionadas, generosSelecionados, contratosSelecionados, segundoMesSelecionado[1], segundoMesSelecionado[0]]);

  const data = {};
  
  generosSelecionados.forEach(genero => {
    data[genero] = {};
    const primeiroMes = `${primeiroMesSelecionado[0]}-${primeiroMesSelecionado[1]}`;
    const segundoMes = `${segundoMesSelecionado[0]}-${segundoMesSelecionado[1]}`;
    data[genero][primeiroMes] = { total_ocorrencias: 0 };
    data[genero][segundoMes] = { total_ocorrencias: 0 };
  });

  rows1.forEach(row => {
    const genero = generoNomes[row.generoCliente] || row.generoCliente;
    const periodo = `${primeiroMesSelecionado[0]}-${primeiroMesSelecionado[1]}`;
    data[genero][periodo].total_ocorrencias = row.total_ocorrencias;
  });

  rows2.forEach(row => {
    const genero = generoNomes[row.generoCliente] || row.generoCliente;
    const periodo = `${segundoMesSelecionado[0]}-${segundoMesSelecionado[1]}`;
    data[genero][periodo].total_ocorrencias = row.total_ocorrencias;
  });

  return data;
}

module.exports = { selectTotalAssinatura, selectRegiaoAssinatura, selectContratoAssinatura, selectGeneroAssinatura, selectAssinaturaMensal, selectRegiaoAssinaturaMensal, selectContratoAssinaturaMensal, selectGeneroAssinaturaMensal, selectTotalAssinaturaComparativo, selectRegiaoAssinaturaComparativo, selectContratoAssinaturaComparativo, selectGeneroAssinaturaComparativo, selectAssinaturaDComparativo, selectRegiaoAssinaturaDComparativo, selectContratoAssinaturaDComparativo, selectGeneroAssinaturaDComparativo };