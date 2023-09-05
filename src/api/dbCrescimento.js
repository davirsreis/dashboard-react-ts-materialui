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

// LineChart - Crescimentos
async function selectTotalCrescimento(startDate, endDate, regioesSelecionadas, generosSelecionados) {
  const conn = await connect();
  const [rows, fields] = await conn.query(`
    SELECT 'assinaturas' as tipo, COUNT(*) as total, YEAR(dataAtivacao) AS ano, MONTH(dataAtivacao) AS mes
    FROM dbempresa.assinaturas
    WHERE dataAtivacao BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?)
    GROUP BY tipo, ano, mes
    UNION ALL
    SELECT 'cancelamentos' as tipo, COUNT(*) as total, YEAR(dataCancelamento) AS ano, MONTH(dataCancelamento) AS mes
    FROM dbempresa.cancelamentos
    WHERE dataCancelamento BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?)
    GROUP BY tipo, ano, mes
  `, [startDate, endDate, regioesSelecionadas, generosSelecionados, startDate, endDate, regioesSelecionadas, generosSelecionados]);

  const resultado = {};

  rows.forEach(row => {
    const { tipo, total, mes, ano } = row;

    if (!resultado[ano]) {
      resultado[ano] = {};
    }

    if (!resultado[ano][mes]) {
      resultado[ano][mes] = {
        assinaturas: 0,
        cancelamentos: 0,
        crescimento: 0,
      };
    }

    resultado[ano][mes][tipo] += parseFloat(total);
    resultado[ano][mes].crescimento = resultado[ano][mes].assinaturas - resultado[ano][mes].cancelamentos;
  });

  return resultado;
}

// BarChart (Regiões) - Crescimentos
async function selectRegiaoCrescimento(startDate, endDate, regioesSelecionadas, generosSelecionados) {
  const conn = await connect();

  const [rows, fields] = await conn.query(`
    SELECT 'assinaturas' as tipo, regiaoCliente, COUNT(*) as total_ocorrencias
    FROM dbempresa.assinaturas
    WHERE dataAtivacao BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?)
    GROUP BY tipo, regiaoCliente
    UNION ALL
    SELECT 'cancelamentos' as tipo, regiaoCliente, COUNT(*) as total_ocorrencias
    FROM dbempresa.cancelamentos
    WHERE dataCancelamento BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?)
    GROUP BY tipo, regiaoCliente 
    ORDER BY regiaoCliente;
  `, [startDate, endDate, regioesSelecionadas, generosSelecionados, startDate, endDate, regioesSelecionadas, generosSelecionados]);

  const data = {};

  rows.forEach(row => {
    const { tipo, regiaoCliente, total_ocorrencias } = row;

    if (!data[regiaoCliente]) {
      data[regiaoCliente] = { assinaturas: 0, cancelamentos: 0 };
    }

    data[regiaoCliente][tipo] = total_ocorrencias;
  });

  for (const chave in data) {
    const { assinaturas, cancelamentos } = data[chave];
    data[chave].crescimento = assinaturas - cancelamentos;
  }

  return data;
}

// PieChart - Crescimentos
const generoNomes = {
  'F': 'Feminino',
  'M': 'Masculino',
  '': 'Indefinido'
};

async function selectGeneroCrescimento(startDate, endDate, regioesSelecionadas, generosSelecionados) {
  const conn = await connect();

  const [rows, fields] = await conn.query(`
    SELECT 'assinaturas' as tipo, generoCliente, COUNT(*) as total_ocorrencias
    FROM dbempresa.assinaturas
    WHERE dataAtivacao BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?)
    GROUP BY tipo, generoCliente
    UNION ALL
    SELECT 'cancelamentos' as tipo, generoCliente, COUNT(*) as total_ocorrencias
    FROM dbempresa.cancelamentos
    WHERE dataCancelamento BETWEEN ? AND ? AND regiaoCliente IN (?) AND generoCliente IN (?)
    GROUP BY tipo, generoCliente 
    ORDER BY generoCliente;
  `, [startDate, endDate, regioesSelecionadas, generosSelecionados, startDate, endDate, regioesSelecionadas, generosSelecionados]);

  const data = {};

  rows.forEach(row => {
    const { tipo, generoCliente, total_ocorrencias } = row;

    if (!data[generoCliente]) {
      data[generoCliente] = { assinaturas: 0, cancelamentos: 0 };
    }

    data[generoCliente][tipo] = total_ocorrencias;
  });

  for (const chave in data) {
    const { assinaturas, cancelamentos } = data[chave];
    data[chave].crescimento = assinaturas - cancelamentos;
  }

  return data;
}

// Crescimento Mensal
// LineChart
async function selectCrescimentoMensal(regioesSelecionadas, generosSelecionados, anoSelecionado, mesSelecionado) {
  const conn = await connect();

  const resultado = {};
  for (let dia = 1; dia <= 31; dia++) {
    resultado[dia] = {
      assinaturas: 0,
      cancelamentos: 0,
      crescimento: 0,
    };
  }

  const [rows, fields] = await conn.query(`
    SELECT 'assinaturas' as tipo, COUNT(*) as total, DAY(dataAtivacao) AS dia
    FROM dbempresa.assinaturas
    WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ?
    GROUP BY dia, tipo
    UNION ALL
    SELECT 'cancelamentos' as tipo, COUNT(*) as total, DAY(dataCancelamento) AS dia
    FROM dbempresa.cancelamentos
    WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ?
    GROUP BY dia, tipo
  `, [regioesSelecionadas, generosSelecionados, anoSelecionado, mesSelecionado, regioesSelecionadas, generosSelecionados, anoSelecionado, mesSelecionado]);

  rows.forEach(row => {
    const { tipo, dia } = row;

    resultado[dia][tipo] += parseFloat(row.total);
    resultado[dia].crescimento = resultado[dia].assinaturas - resultado[dia].cancelamentos;
  });

  return resultado;
}

// BarChart (Região) - Crescimentos
async function selectRegiaoCrescimentoMensal(regioesSelecionadas, generosSelecionados, anoSelecionado, mesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query(`
    SELECT 'assinaturas' as tipo, regiaoCliente, COUNT(*) as total_ocorrencias
    FROM dbempresa.assinaturas
    WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ?
    GROUP BY tipo, regiaoCliente
    UNION ALL
    SELECT 'cancelamentos' as tipo, regiaoCliente, COUNT(*) as total_ocorrencias
    FROM dbempresa.cancelamentos
    WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ?
    GROUP BY tipo, regiaoCliente
    ORDER BY regiaoCliente;
  `, [regioesSelecionadas, generosSelecionados, anoSelecionado, mesSelecionado, regioesSelecionadas, generosSelecionados, anoSelecionado, mesSelecionado]);
  const data = {};

  rows.forEach(row => {
    const { tipo, regiaoCliente, total_ocorrencias } = row;

    if (!data[regiaoCliente]) {
      data[regiaoCliente] = { assinaturas: 0, cancelamentos: 0 };
    }

    data[regiaoCliente][tipo] = total_ocorrencias;
  });

  for (const chave in data) {
    const { assinaturas, cancelamentos } = data[chave];
    data[chave].crescimento = assinaturas - cancelamentos;
  }

  return data;
}

// PieChart - Crescimentos
async function selectGeneroCrescimentoMensal(regioesSelecionadas, generosSelecionados, anoSelecionado, mesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query(`
    SELECT 'assinaturas' as tipo, generoCliente, COUNT(*) as total_ocorrencias
    FROM dbempresa.assinaturas
    WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ?
    GROUP BY tipo, generoCliente
    UNION ALL
    SELECT 'cancelamentos' as tipo, generoCliente, COUNT(*) as total_ocorrencias
    FROM dbempresa.cancelamentos
    WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ?
    GROUP BY tipo, generoCliente
    ORDER BY generoCliente;
  `, [regioesSelecionadas, generosSelecionados, anoSelecionado, mesSelecionado, regioesSelecionadas, generosSelecionados, anoSelecionado, mesSelecionado]);
  const data = {};

  rows.forEach(row => {
    const { tipo, generoCliente, total_ocorrencias } = row;

    if (!data[generoCliente]) {
      data[generoCliente] = { assinaturas: 0, cancelamentos: 0 };
    }

    data[generoCliente][tipo] = total_ocorrencias;
  });

  for (const chave in data) {
    const { assinaturas, cancelamentos } = data[chave];
    data[chave].crescimento = assinaturas - cancelamentos;
  }

  return data;
}

// Comparativos
// LineChart
async function selectTotalCrescimentoComparativo(regioesSelecionadas, generosSelecionados, periodoInicial, periodoFinal, ano1, ano2) {
  const conn = await connect();
  const [rows, fields] = await conn.query(`
  SELECT 'assinaturas' as tipo, COUNT(*) as total_ocorrencias, YEAR(dataAtivacao) AS ano, MONTH(dataAtivacao) AS mes
  FROM dbempresa.assinaturas
  WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ( (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) BETWEEN ? AND ?) OR (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) BETWEEN ? AND ?) )
  GROUP BY tipo, ano, mes
  UNION ALL
  SELECT 'cancelamentos' as tipo, COUNT(*) as total_ocorrencias, YEAR(dataCancelamento) AS ano, MONTH(dataCancelamento) AS mes
  FROM dbempresa.cancelamentos
  WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ( (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) BETWEEN ? AND ?) OR (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) BETWEEN ? AND ?) )
  GROUP BY tipo, ano, mes
`, [regioesSelecionadas, generosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal, regioesSelecionadas, generosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal]);

  const resultado = {};

  rows.forEach(row => {
    const { tipo, total_ocorrencias, mes, ano } = row;

    if (!resultado[ano]) {
      resultado[ano] = {};
    }

    if (!resultado[ano][mes]) {
      resultado[ano][mes] = {
        assinaturas: 0,
        cancelamentos: 0,
        crescimento: 0,
      };
    }

    resultado[ano][mes][tipo] += parseFloat(total_ocorrencias);
    resultado[ano][mes].crescimento = resultado[ano][mes].assinaturas - resultado[ano][mes].cancelamentos;
  });
  return resultado;
}

// BarChart (Região) - Crescimentos
async function selectRegiaoCrescimentoComparativo(regioesSelecionadas, generosSelecionados, periodoInicial, periodoFinal, ano1, ano2) {
  const conn = await connect();
  const [rows, fields] = await conn.query(`
  SELECT 'assinaturas' as tipo, regiaoCliente, COUNT(*) as total_ocorrencias, YEAR(dataAtivacao) as ano
  FROM dbempresa.assinaturas
  WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ( (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) BETWEEN ? AND ?) OR (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) BETWEEN ? AND ?) )
  GROUP BY regiaoCliente, tipo, ano
  UNION ALL
  SELECT 'cancelamentos' as tipo, regiaoCliente, COUNT(*) as total_ocorrencias, YEAR(dataCancelamento) as ano
  FROM dbempresa.cancelamentos
  WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ( (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) BETWEEN ? AND ?) OR (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) BETWEEN ? AND ?) )
  GROUP BY regiaoCliente, tipo, ano
`, [regioesSelecionadas, generosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal, regioesSelecionadas, generosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal]);

  const data = {};

  rows.forEach(row => {
    const { tipo, regiaoCliente, ano, total_ocorrencias } = row;

    if (!data[regiaoCliente]) {
      data[regiaoCliente] = {};
    }

    const anosDesejados = [ano1, ano2];

    for (let regiao in data) {
      for (let ano of anosDesejados) {
        if (!data[regiao][ano]) {
          data[regiao][ano] = {
            assinaturas: 0,
            cancelamentos: 0,
            crescimento: 0
          };
        }
      }
    }

    data[regiaoCliente][ano][tipo] = total_ocorrencias;
  });


  for (let regiao in data) {
    for (let ano in data[regiao]) {
      let assinaturas = 0;
      let cancelamentos = 0;
      let crescimento = 0;

      for (let tipo in data[regiao][ano]) {
        if (tipo === 'assinaturas') {
          assinaturas += parseFloat(data[regiao][ano][tipo]);
        }
        else if (tipo === 'cancelamentos') {
          cancelamentos += parseFloat(data[regiao][ano][tipo]);
        }
      }
      crescimento = assinaturas - cancelamentos;

      data[regiao][ano].assinaturas = assinaturas;
      data[regiao][ano].cancelamentos = cancelamentos;
      data[regiao][ano].crescimento = crescimento;
    }
  }

  return data;
}

// PieChart - Crescimentos
async function selectGeneroCrescimentoComparativo(regioesSelecionadas, generosSelecionados, periodoInicial, periodoFinal, ano1, ano2) {
  const conn = await connect();
  const [rows, fields] = await conn.query(`
  SELECT 'assinaturas' as tipo, generoCliente, COUNT(*) as total_ocorrencias, YEAR(dataAtivacao) as ano
  FROM dbempresa.assinaturas
  WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ( (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) BETWEEN ? AND ?) OR (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) BETWEEN ? AND ?) )
  GROUP BY generoCliente, tipo, ano
  UNION ALL
  SELECT 'cancelamentos' as tipo, generoCliente, COUNT(*) as total_ocorrencias, YEAR(dataCancelamento) as ano
  FROM dbempresa.cancelamentos
  WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ( (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) BETWEEN ? AND ?) OR (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) BETWEEN ? AND ?) )
  GROUP BY generoCliente, tipo, ano
`, [regioesSelecionadas, generosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal, regioesSelecionadas, generosSelecionados, ano1, periodoInicial, periodoFinal, ano2, periodoInicial, periodoFinal]);
  const data = {};

  rows.forEach(row => {
    const { tipo, generoCliente, total_ocorrencias, ano } = row;

    if (!data[generoCliente]) {
      data[generoCliente] = {};
    }

    if (!data[generoCliente][ano]) {
      data[generoCliente][ano] = { assinaturas: 0, cancelamentos: 0 };
    }

    data[generoCliente][ano][tipo] = total_ocorrencias;
  });

  for (const genero in data) {
    for (const ano in data[genero]) {
      const { assinaturas = 0, cancelamentos = 0 } = data[genero][ano];
      data[genero][ano].crescimento = assinaturas - cancelamentos;
    }
  }

  return data;
}

// Crescimento Mensal Comparativo
// LineChart
async function selectCrescimentoDComparativo(regioesSelecionadas, generosSelecionados, primeiroMesSelecionado, segundoMesSelecionado) {
  const conn = await connect();

  const [rows, fields] = await conn.query(`
  SELECT 'assinaturas' as tipo, COUNT(*) as total_ocorrencias, YEAR(dataAtivacao) AS ano, MONTH(dataAtivacao) AS mes, DAY(dataAtivacao) AS dia
  FROM dbempresa.assinaturas
  WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ((YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ?) OR (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ?)) 
  GROUP BY ano, mes, dia, tipo
  UNION ALL
  SELECT 'cancelamentos' as tipo, COUNT(*) as total_ocorrencias, YEAR(dataCancelamento) AS ano, MONTH(dataCancelamento) AS mes, DAY(dataCancelamento) AS dia
  FROM dbempresa.cancelamentos
  WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ((YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ?) OR (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ?)) 
  GROUP BY ano, mes, dia, tipo
`, [regioesSelecionadas, generosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0], segundoMesSelecionado[1], segundoMesSelecionado[0], regioesSelecionadas, generosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0], segundoMesSelecionado[1], segundoMesSelecionado[0]]);

  const diasNoMes = 31;
  const resultado = {};

  const mesesSelecionados = [
    `${primeiroMesSelecionado[1]}-${primeiroMesSelecionado[0]}`,
    `${segundoMesSelecionado[1]}-${segundoMesSelecionado[0]}`
  ];

  mesesSelecionados.forEach(chave => {
    resultado[chave] = {};

    for (let dia = 1; dia <= diasNoMes; dia++) {
      resultado[chave][dia] = {
        assinaturas: 0,
        cancelamentos: 0,
        crescimento: 0,
      };
    }
  });

  rows.forEach(row => {
    const { tipo, total_ocorrencias, ano, mes, dia } = row;
    const chave = `${ano}-${mes.toString().padStart(2, '0')}`.replace('-0', '-');

    if (resultado[chave] && resultado[chave][dia]) {
      if (tipo === 'assinaturas') {
        resultado[chave][dia].assinaturas = total_ocorrencias;
      } else {
        resultado[chave][dia].cancelamentos = total_ocorrencias;
      }

      resultado[chave][dia].crescimento = resultado[chave][dia].assinaturas - resultado[chave][dia].cancelamentos;
    }
  });

  return resultado;

}

// BarChart (Região) - Crescimentos
async function selectRegiaoCrescimentoDComparativo(regioesSelecionadas, generosSelecionados, primeiroMesSelecionado, segundoMesSelecionado) {
  const conn = await connect();
  const [rows, fields] = await conn.query(`
  SELECT 'assinaturas' as tipo, regiaoCliente, COUNT(*) as total_ocorrencias, YEAR(dataAtivacao) AS ano, MONTH(dataAtivacao) AS mes
  FROM dbempresa.assinaturas
  WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ((YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ?) OR (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ?)) 
  GROUP BY ano, mes, regiaoCliente, tipo
  UNION ALL
  SELECT 'cancelamentos' as tipo, regiaoCliente, COUNT(*) as total_ocorrencias, YEAR(dataCancelamento) AS ano, MONTH(dataCancelamento) AS mes
  FROM dbempresa.cancelamentos
  WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ((YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ?) OR (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ?)) 
  GROUP BY ano, mes, regiaoCliente, tipo
`, [regioesSelecionadas, generosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0], segundoMesSelecionado[1], segundoMesSelecionado[0], regioesSelecionadas, generosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0], segundoMesSelecionado[1], segundoMesSelecionado[0]]);

  const data = {};

  regioesSelecionadas.forEach(regiao => {
    data[regiao] = {};

    const primeiroMes = `${primeiroMesSelecionado[1]}-${primeiroMesSelecionado[0]}`;
    const segundoMes = `${segundoMesSelecionado[1]}-${segundoMesSelecionado[0]}`;

    const mesesSelecionados = [primeiroMes, segundoMes];

    mesesSelecionados.forEach(chave => {
      data[regiao][chave] = {
        assinaturas: 0,
        cancelamentos: 0,
        crescimento: 0,
      };
    });
  });

  rows.forEach(row => {
    const { tipo, regiaoCliente, total_ocorrencias, ano, mes } = row;
    const chave = `${ano}-${mes.toString().padStart(2, '0')}`.replace('-0', '-');

    if (data[regiaoCliente] && data[regiaoCliente][chave]) {
      if (tipo === 'assinaturas') {
        data[regiaoCliente][chave].assinaturas = total_ocorrencias;
      } else {
        data[regiaoCliente][chave].cancelamentos = total_ocorrencias;
      }

      data[regiaoCliente][chave].crescimento =
        data[regiaoCliente][chave].assinaturas - data[regiaoCliente][chave].cancelamentos;
    }
  });

  return data;
}

// PieChart - Crescimentos
async function selectGeneroCrescimentoDComparativo(regioesSelecionadas, generosSelecionados, primeiroMesSelecionado, segundoMesSelecionado) {
  const conn = await connect();

  const [rows, fields] = await conn.query(`
  SELECT 'assinaturas' as tipo, generoCliente, COUNT(*) as total_ocorrencias, YEAR(dataAtivacao) AS ano, MONTH(dataAtivacao) AS mes
  FROM dbempresa.assinaturas
  WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ((YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ?) OR (YEAR(dataAtivacao) = ? AND MONTH(dataAtivacao) = ?)) 
  GROUP BY ano, mes, generoCliente, tipo
  UNION ALL
  SELECT 'cancelamentos' as tipo, generoCliente, COUNT(*) as total_ocorrencias, YEAR(dataCancelamento) AS ano, MONTH(dataCancelamento) AS mes
  FROM dbempresa.cancelamentos
  WHERE regiaoCliente IN (?) AND generoCliente IN (?) AND ((YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ?) OR (YEAR(dataCancelamento) = ? AND MONTH(dataCancelamento) = ?)) 
  GROUP BY ano, mes, generoCliente, tipo
`, [regioesSelecionadas, generosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0], segundoMesSelecionado[1], segundoMesSelecionado[0], regioesSelecionadas, generosSelecionados, primeiroMesSelecionado[1], primeiroMesSelecionado[0], segundoMesSelecionado[1], segundoMesSelecionado[0]]);

  const data = {};

  generosSelecionados.forEach(genero => {
    data[genero] = {};

    const primeiroMes = `${primeiroMesSelecionado[1]}-${primeiroMesSelecionado[0]}`;
    const segundoMes = `${segundoMesSelecionado[1]}-${segundoMesSelecionado[0]}`;

    const mesesSelecionados = [primeiroMes, segundoMes];

    mesesSelecionados.forEach(chave => {
      data[genero][chave] = {
        assinaturas: 0,
        cancelamentos: 0,
        crescimento: 0,
      };
    });
  });

  rows.forEach(row => {
    const { tipo, generoCliente, total_ocorrencias, ano, mes } = row;
    const chave = `${ano}-${mes.toString().padStart(2, '0')}`.replace('-0', '-');

    if (data[generoCliente] && data[generoCliente][chave]) {
      if (tipo === 'assinaturas') {
        data[generoCliente][chave].assinaturas = total_ocorrencias;
      } else {
        data[generoCliente][chave].cancelamentos = total_ocorrencias;
      }

      data[generoCliente][chave].crescimento = data[generoCliente][chave].assinaturas - data[generoCliente][chave].cancelamentos;
    }
  });

  return data;

}

module.exports = { selectTotalCrescimento, selectRegiaoCrescimento, selectGeneroCrescimento, selectCrescimentoMensal, selectRegiaoCrescimentoMensal, selectGeneroCrescimentoMensal, selectTotalCrescimentoComparativo, selectRegiaoCrescimentoComparativo, selectGeneroCrescimentoComparativo, selectCrescimentoDComparativo, selectRegiaoCrescimentoDComparativo, selectGeneroCrescimentoDComparativo };