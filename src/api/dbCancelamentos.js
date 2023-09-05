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


// Motivos estão dando problemas
// LineChart - Cancelamentos
async function selectTotalCancelamento(startDate, endDate, regioesSelecionadas, generosSelecionados, motivosSelecionados) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT COUNT(*) as total_ocorrencias, YEAR(dataCancelamento) AS ano, MONTH(dataCancelamento) AS mes FROM dbempresa.cancelamentos WHERE dataCancelamento BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) GROUP BY ano, mes;", [startDate, endDate, regioesSelecionadas, generosSelecionados, motivosSelecionados]);

  const resultado = {};

  rows.forEach(row => {
    const { total_ocorrencias, mes, ano } = row;

    if (!resultado[ano]) {
      resultado[ano] = {};
    }

    if (!resultado[ano][mes]) {
      resultado[ano][mes] = {
        total_ocorrencias: 0,
      };
    }

    resultado[ano][mes].total_ocorrencias += parseFloat(total_ocorrencias);
  });

  // Inicializa os meses sem ocorrências com valor zero
  for (let ano in resultado) {
    for (let mes = 1; mes <= 12; mes++) {
      if (!resultado[ano][mes]) {
        resultado[ano][mes] = {
          total_ocorrencias: 0,
        };
      }
    }
  }

  return resultado;
}

// BarChart (Regiões) - Cancelamentos
async function selectRegiaoCancelamento(startDate, endDate, regioesSelecionadas, generosSelecionados, motivosSelecionados) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT regiaoCliente, COUNT(*) as total_ocorrencias FROM dbempresa.cancelamentos WHERE dataCancelamento BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) GROUP BY regiaoCliente ORDER BY total_ocorrencias DESC;", [startDate, endDate, regioesSelecionadas, generosSelecionados, motivosSelecionados]);

  const data = {};

  rows.forEach(row => {
    const { regiaoCliente, total_ocorrencias } = row;

    data[regiaoCliente] = { total_ocorrencias };
  });

  return data;
}

// BarChart (Motivos) - Cancelamentos
async function selectMotivoCancelamento(startDate, endDate, regioesSelecionadas, generosSelecionados, motivosSelecionados) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT motivo, COUNT(*) as total_ocorrencias FROM dbempresa.cancelamentos WHERE dataCancelamento BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) GROUP BY motivo ORDER BY total_ocorrencias DESC;", [startDate, endDate, regioesSelecionadas, generosSelecionados, motivosSelecionados]);

  const data = {};

  rows.forEach(row => {
    const { motivo, total_ocorrencias } = row;

    data[motivo] = { total_ocorrencias };
  });

  return data;
}

// PieChart - Cancelamentos
const generoNomes = {
  'F': 'Feminino',
  'M': 'Masculino',
  '': 'Indefinido'
};

async function selectGeneroCancelamento(startDate, endDate, regioesSelecionadas, generosSelecionados, motivosSelecionados) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT generoCliente, COUNT(*) as total_ocorrencias FROM dbempresa.cancelamentos WHERE dataCancelamento BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) GROUP BY generoCliente;", [startDate, endDate, regioesSelecionadas, generosSelecionados, motivosSelecionados]);

  const data = rows.map(row => ({
    generoCliente: generoNomes[row.generoCliente] || row.generoCliente,
    total_ocorrencias: row.total_ocorrencias
  }));
  return data;
}

// Cancelamento Mensal
// LineChart
async function selectCancelamentoMensal(regioesSelecionadas, generosSelecionados, motivosSelecionados, anoSelecionado, mesSelecionado) {
  const conn = await connect();
  const resultado = {};
  for (let dia = 1; dia <= 31; dia++) {
    resultado[dia] = {
      total_ocorrencias: 0,
    };
  }

  const [rows, fields] = await conn.query("SELECT COUNT(*) as total_ocorrencias, DAY(dataCancelamento) AS dia FROM dbempresa.cancelamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) AND YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ? GROUP BY dia;", [regioesSelecionadas, generosSelecionados, motivosSelecionados, anoSelecionado, mesSelecionado]);

  rows.forEach(row => {
    const { total_ocorrencias, dia } = row;
    resultado[dia] = {
      total_ocorrencias: parseFloat(total_ocorrencias),
    };

  });

  return resultado;
}

// BarChart (Região) - Cancelamentos
async function selectRegiaoCancelamentoMensal(regioesSelecionadas, generosSelecionados, motivosSelecionados, anoSelecionado, mesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT regiaoCliente, COUNT(*) as total_ocorrencias FROM dbempresa.cancelamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) AND YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ? GROUP BY regiaoCliente ORDER BY total_ocorrencias DESC;", [regioesSelecionadas, generosSelecionados, motivosSelecionados, anoSelecionado, mesSelecionado]);

  const data = {};

  rows.forEach(row => {
    const { regiaoCliente, total_ocorrencias } = row;

    data[regiaoCliente] = { total_ocorrencias };
  });

  return data;
}

// BarChart (Motivos) - Cancelamentos
async function selectMotivoCancelamentoMensal(regioesSelecionadas, generosSelecionados, motivosSelecionados, anoSelecionado, mesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT motivo, COUNT(*) as total_ocorrencias FROM dbempresa.cancelamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) AND YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ? GROUP BY motivo ORDER BY total_ocorrencias DESC;", [regioesSelecionadas, generosSelecionados, motivosSelecionados, anoSelecionado, mesSelecionado]);

  const data = {};

  rows.forEach(row => {
    const { motivo, total_ocorrencias } = row;

    data[motivo] = { total_ocorrencias };
  });

  return data;
}

// PieChart - Cancelamentos
async function selectGeneroCancelamentoMensal(regioesSelecionadas, generosSelecionados, motivosSelecionados, anoSelecionado, mesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT generoCliente, COUNT(*) as total_ocorrencias FROM dbempresa.cancelamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) AND YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ? GROUP BY generoCliente;", [regioesSelecionadas, generosSelecionados, motivosSelecionados, anoSelecionado, mesSelecionado]);

  const data = rows.map(row => ({
    generoCliente: generoNomes[row.generoCliente] || row.generoCliente,
    total_ocorrencias: row.total_ocorrencias
  }));
  return data;
}

// Comparativos
// LineChart
async function selectTotalCancelamentoComparativo(regioesSelecionadas, generosSelecionados, motivosSelecionados, periodoInicial, periodoFinal, ano1, ano2) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT COUNT(*) AS total_ocorrencias, YEAR(dataCancelamento) AS ano, MONTH(dataCancelamento) AS mes FROM dbempresa.cancelamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) AND ( (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) BETWEEN ? AND ?) OR (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) BETWEEN ? AND ?) ) GROUP BY ano, mes;", [regioesSelecionadas, generosSelecionados, motivosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal]);
  const resultado = {};

  rows.forEach(row => {
    const { total_ocorrencias, mes, ano } = row;

    if (!resultado[ano]) {
      resultado[ano] = {};
    }

    if (!resultado[ano][mes]) {
      resultado[ano][mes] = {
        total_ocorrencias: 0,
      };
    }

    resultado[ano][mes].total_ocorrencias += parseFloat(total_ocorrencias);

    for (let ano in resultado) {
      for (let mes = 1; mes <= 12; mes++) {
        if (!resultado[ano][mes]) {
          resultado[ano][mes] = {
            total_ocorrencias: 0,
          };
        }
      }
    }

  });
  return resultado;
}

// BarChart (Região) - Cancelamentos
async function selectRegiaoCancelamentoComparativo(regioesSelecionadas, generosSelecionados, motivosSelecionados, periodoInicial, periodoFinal, ano1, ano2) {
  const conn = await connect();
  motivosSelecionados = 'Contratou outro provedor';
  const [rows, fields] = await conn.query("SELECT regiaoCliente, YEAR(dataCancelamento) as ano, COUNT(*) as total_ocorrencias FROM dbempresa.cancelamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) AND ( (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) BETWEEN ? AND ?) OR (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) BETWEEN ? AND ?) ) GROUP BY regiaoCliente, ano ORDER BY total_ocorrencias DESC;", [regioesSelecionadas, generosSelecionados, motivosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal]);
  const data = {};

  rows.forEach(row => {
    const { regiaoCliente, ano, total_ocorrencias } = row;

    if (!data[regiaoCliente]) {
      data[regiaoCliente] = {};
    }

    data[regiaoCliente][ano] = {
      total_ocorrencias,
    };
  });

  const anosDesejados = [ano1, ano2];

  for (let regiao in data) {
    for (let ano of anosDesejados) {
      if (!data[regiao][ano]) {
        data[regiao][ano] = {
          total_ocorrencias: 0,
        };
      }
    }
  }

  for (let regiao in data) {
    for (let ano in data[regiao]) {
      let total = 0;
      for (let prop in data[regiao][ano]) {
        if (prop === 'total_ocorrencias') {
          total += parseFloat(data[regiao][ano][prop]);
        }
      }
    }
  }

  return data;
}

// BarChart (Motivos) - Cancelamentos
async function selectMotivoCancelamentoComparativo(regioesSelecionadas, generosSelecionados, motivosSelecionados, periodoInicial, periodoFinal, ano1, ano2) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT motivo, YEAR(dataCancelamento) as ano, COUNT(*) as total_ocorrencias FROM dbempresa.cancelamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) AND ( (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) BETWEEN ? AND ?) OR (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) BETWEEN ? AND ?) ) GROUP BY motivo, ano ORDER BY total_ocorrencias DESC;", [regioesSelecionadas, generosSelecionados, motivosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal]);
  const data = {};

  rows.forEach(row => {
    const { motivo, ano, total_ocorrencias } = row;

    if (!data[motivo]) {
      data[motivo] = {};
    }

    data[motivo][ano] = {
      total_ocorrencias: total_ocorrencias || 0,
    };
  });

  const anosDesejados = [ano1, ano2];

  for (let motivo in data) {
    for (let ano of anosDesejados) {
      if (!data[motivo][ano]) {
        data[motivo][ano] = {
          total_ocorrencias: 0,
        };
      }
    }
  }

  for (let motivo in data) {
    for (let ano in data[motivo]) {
      let total = 0;
      for (let prop in data[motivo][ano]) {
        if (prop === 'total_ocorrencias') {
          total += parseFloat(data[motivo][ano][prop]);
        }
      }
    }
  }

  return data;
}

// PieChart - Cancelamentos
async function selectGeneroCancelamentoComparativo(regioesSelecionadas, generosSelecionados, motivosSelecionados, periodoInicial, periodoFinal, ano1, ano2) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT generoCliente, COUNT(*) as total_ocorrencias, YEAR(dataCancelamento) as ano FROM dbempresa.cancelamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) AND ( (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) BETWEEN ? AND ?) OR (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) BETWEEN ? AND ?) ) GROUP BY generoCliente, ano ORDER BY ano ASC;", [regioesSelecionadas, generosSelecionados, motivosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal]);
  const data = {};

  rows.forEach(row => {
    const genero = generoNomes[row.generoCliente] || row.generoCliente;
    const ano = row.ano.toString();

    if (!data[genero]) {
      data[genero] = {};
    }

    data[genero][ano] = {
      total_ocorrencias: row.total_ocorrencias,
    };
  });

  return data;
}

// Cancelamento Mensal Comparativo
// LineChart
async function selectCancelamentoDComparativo(regioesSelecionadas, generosSelecionados, motivosSelecionados, primeiroMesSelecionado, segundoMesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT COUNT(*) AS total_ocorrencias, YEAR(dataCancelamento) AS ano, MONTH(dataCancelamento) AS mes, DAY(dataCancelamento) AS dia FROM dbempresa.cancelamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) AND ((YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ?) OR (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ?)) GROUP BY ano, mes, dia;", [regioesSelecionadas, generosSelecionados, motivosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0], segundoMesSelecionado[1], segundoMesSelecionado[0]]);

  const resultado = {};

  const primeiroMesChave = `${primeiroMesSelecionado[1]}-${primeiroMesSelecionado[0].toString().padStart(2, '0')}`;
  const segundoMesChave = `${segundoMesSelecionado[1]}-${segundoMesSelecionado[0].toString().padStart(2, '0')}`;

  resultado[primeiroMesChave] = {};
  resultado[segundoMesChave] = {};

  const diasNoMes = 31;

  for (let dia = 1; dia <= diasNoMes; dia++) {
    resultado[primeiroMesChave][dia] = {
      total_ocorrencias: 0,
    };

    resultado[segundoMesChave][dia] = {
      total_ocorrencias: 0,
    };
  }

  rows.forEach(row => {
    const { total_ocorrencias, ano, mes, dia } = row;
    const chave = `${ano}-${mes.toString().padStart(2, '0')}`;

    if (chave === primeiroMesChave || chave === segundoMesChave) {
      resultado[chave][dia] = {
        total_ocorrencias: parseFloat(total_ocorrencias),
      };
    }
  });

  return resultado;
}

// BarChart (Região) - Cancelamentos
async function selectRegiaoCancelamentoDComparativo(regioesSelecionadas, generosSelecionados, motivosSelecionados, primeiroMesSelecionado, segundoMesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT regiaoCliente, YEAR(dataCancelamento) as ano, MONTH(dataCancelamento) as mes, COUNT(*) as total_ocorrencias FROM dbempresa.cancelamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) AND ((YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ?) OR (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ?)) GROUP BY regiaoCliente, ano, mes ORDER BY ano, mes DESC;", [regioesSelecionadas, generosSelecionados, motivosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0], segundoMesSelecionado[1], segundoMesSelecionado[0]]);

  const data = {};

  regioesSelecionadas.forEach(regiao => {
    data[regiao] = {};

    const mesesSelecionados = [primeiroMesSelecionado, segundoMesSelecionado];
    mesesSelecionados.forEach(([mes, ano]) => {
      const chave = `${ano}-${mes.toString().padStart(2, '0')}`;

      data[regiao][chave] = {
        total_ocorrencias: 0,
      };
    });
  });

  rows.forEach(row => {
    const { regiaoCliente, ano, mes, total_ocorrencias } = row;
    const chave = `${ano}-${mes.toString().padStart(2, '0')}`;

    data[regiaoCliente][chave] = {
      total_ocorrencias,
    };
  });
  
  return data;
}

// BarChart (Motivos) - Cancelamentos
async function selectMotivoCancelamentoDComparativo(regioesSelecionadas, generosSelecionados, motivosSelecionados, primeiroMesSelecionado, segundoMesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query("SELECT motivo, YEAR(dataCancelamento) as ano, MONTH(dataCancelamento) as mes, COUNT(*) as total_ocorrencias FROM dbempresa.cancelamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) AND ((YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ?) OR (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ?)) GROUP BY motivo, ano, mes ORDER BY ano, mes DESC;", [regioesSelecionadas, generosSelecionados, motivosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0], segundoMesSelecionado[1], segundoMesSelecionado[0]]);
  const data = {};

  motivosSelecionados.forEach(motivo => {
    data[motivo] = {};

    const mesesSelecionados = [primeiroMesSelecionado, segundoMesSelecionado];
    mesesSelecionados.forEach(([mes, ano]) => {
      const chave = `${ano}-${mes.toString().padStart(2, '0')}`;

      data[motivo][chave] = {
        total_ocorrencias: 0,
      };
    });
  });

  rows.forEach(row => {
    const { motivo, ano, mes, total_ocorrencias } = row;
    const chave = `${ano}-${mes.toString().padStart(2, '0')}`;

    if (!data[motivo]) {
      data[motivo] = {};
    }

    data[motivo][chave] = {
      total_ocorrencias: total_ocorrencias || 0,
    };
  })

  for (let regiao in data) {
    for (let ano in data[regiao]) {
      let total = 0;
      for (let prop in data[regiao][ano]) {
        if (prop === 'total_ocorrencias') {
          total += parseFloat(data[regiao][ano][prop]);
        }
      }
    }
  }

  return data;
}

// PieChart - Cancelamentos
async function selectGeneroCancelamentoDComparativo(regioesSelecionadas, generosSelecionados, motivosSelecionados, primeiroMesSelecionado, segundoMesSelecionado) {
  const conn = await connect();

  const [rows1, fields1] = await conn.query("SELECT generoCliente, COUNT(*) as total_ocorrencias FROM dbempresa.cancelamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) AND YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ? GROUP BY generoCliente;", [regioesSelecionadas, generosSelecionados, motivosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0]]);
  const [rows2, fields2] = await conn.query("SELECT generoCliente, COUNT(*) as total_ocorrencias FROM dbempresa.cancelamentos WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND motivo IN (?) AND YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ? GROUP BY generoCliente;", [regioesSelecionadas, generosSelecionados, motivosSelecionados, segundoMesSelecionado[1], segundoMesSelecionado[0]]);

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


module.exports = { selectTotalCancelamento, selectRegiaoCancelamento, selectMotivoCancelamento, selectGeneroCancelamento, selectCancelamentoMensal, selectRegiaoCancelamentoMensal, selectMotivoCancelamentoMensal, selectGeneroCancelamentoMensal, selectTotalCancelamentoComparativo, selectRegiaoCancelamentoComparativo, selectMotivoCancelamentoComparativo, selectGeneroCancelamentoComparativo, selectCancelamentoDComparativo, selectRegiaoCancelamentoDComparativo, selectMotivoCancelamentoDComparativo, selectGeneroCancelamentoDComparativo };