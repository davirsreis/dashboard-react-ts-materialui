const calcularFaturamento = (dataFaturamento: any) => {
  let valorTotalFaturamento = 0;
  let numMeses = 0;

  if (Object.keys(dataFaturamento).length > 0) {
    Object.keys(dataFaturamento).forEach((ano) => {
      Object.keys(dataFaturamento[ano]).forEach((mes) => {
        valorTotalFaturamento += dataFaturamento[ano][mes].total;
        numMeses++;
      });
    });

    const valorTotalFaturamentoFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valorTotalFaturamento);

    const mediaFaturamento = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valorTotalFaturamento / numMeses);

    return {
      totalFaturamento: valorTotalFaturamentoFormatado,
      mediaFaturamento,
      numMesesConsiderados: numMeses,
    };
  } else {
    return {
      totalFaturamento: '',
      mediaFaturamento: '',
      numMesesConsiderados: 0,
    };
  }
};

const calcularFaturamentoMensal = (dataFaturamento: any) => {
  let valorTotalFaturamento = 0;
  let numDias = 0;

  if (Object.keys(dataFaturamento).length > 0) {
    Object.keys(dataFaturamento).forEach((mes) => {
      valorTotalFaturamento += dataFaturamento[mes].total;
      numDias++;
    });

    const valorTotalFaturamentoFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valorTotalFaturamento);

    const mediaFaturamento = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valorTotalFaturamento / numDias);

    return {
      totalFaturamento: valorTotalFaturamentoFormatado,
      mediaFaturamento,
      numDiasConsiderados: numDias,
    };
  } else {
    return {
      totalFaturamento: '',
      mediaFaturamento: '',
      numDiasConsiderados: 0,
    };
  }
};


const calcularOcorrencia = (dataOcorrencia: any) => {
  let valorTotalOcorrencia = 0;
  let numMeses = 0;

  if (Object.keys(dataOcorrencia).length > 0) {
    Object.keys(dataOcorrencia).forEach((ano) => {
      Object.keys(dataOcorrencia[ano]).forEach((mes) => {
        valorTotalOcorrencia += dataOcorrencia[ano][mes].total_ocorrencias;
        numMeses++;
      });
    });

    const mediaOcorrencia = (valorTotalOcorrencia / numMeses).toFixed(2);

    return {
      totalOcorrencia: valorTotalOcorrencia,
      mediaOcorrencia,
      numMesesConsiderados: numMeses,
    };
  } else {
    return {
      totalOcorrencia: '',
      mediaOcorrencia: '',
      numMesesConsiderados: 0,
    };
  }
};

const calcularOcorrenciaMensal = (dataOcorrencia: any) => {
  let valorTotalOcorrencia = 0;
  let numDias = 0;

  if (Object.keys(dataOcorrencia).length > 0) {
    Object.keys(dataOcorrencia).forEach((mes) => {
      valorTotalOcorrencia += dataOcorrencia[mes].total_ocorrencias;
      numDias++;
    });

    const mediaOcorrencia = (valorTotalOcorrencia / numDias).toFixed(2);

    return {
      totalOcorrencia: valorTotalOcorrencia,
      mediaOcorrencia,
      numDiasConsiderados: numDias,
    };
  } else {
    return {
      totalOcorrencia: '',
      mediaOcorrencia: '',
      numDiasConsiderados: 0,
    };
  }
};

// Comparativos
const calcularComparativoFaturamento = (dataFaturamento: any) => {
  let faturamentoPeriodo1 = 0;
  let faturamentoPeriodo2 = 0;
  const periodos = Object.keys(dataFaturamento);

  if (periodos.length === 2) {
    for (const mes in dataFaturamento[periodos[0]]) {
      faturamentoPeriodo1 += dataFaturamento[periodos[0]][mes].total;
    }
    for (const mes in dataFaturamento[periodos[1]]) {
      faturamentoPeriodo2 += dataFaturamento[periodos[1]][mes].total;
    }

    const valorTotalPeriodo1 = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(faturamentoPeriodo1);

    const valorTotalPeriodo2 = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(faturamentoPeriodo2);

    const diferencaPercentual = ((faturamentoPeriodo2 - faturamentoPeriodo1) / faturamentoPeriodo1) * 100;
    return {
      totalFaturamentoPeriodo1: valorTotalPeriodo1,
      totalFaturamentoPeriodo2: valorTotalPeriodo2,
      comparativoAnual: diferencaPercentual.toFixed(2),
    };
  } else {
    return {
      totalFaturamentoPeriodo1: '',
      totalFaturamentoPeriodo2: '',
      comparativoAnual: '',
    };
  }
};

const calcularComparativoFaturamentoMensal = (dataFaturamento: any) => {
  let faturamentoPeriodo1 = 0;
  let faturamentoPeriodo2 = 0;
  const periodos = Object.keys(dataFaturamento);

  if (periodos.length === 2) {
    for (const mes in dataFaturamento[periodos[0]]) {
      faturamentoPeriodo1 += dataFaturamento[periodos[0]][mes].total;
    }
    for (const mes in dataFaturamento[periodos[1]]) {
      faturamentoPeriodo2 += dataFaturamento[periodos[1]][mes].total;
    }

    const valorTotalPeriodo1 = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(faturamentoPeriodo1);

    const valorTotalPeriodo2 = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(faturamentoPeriodo2);

    const diferencaPercentual = ((faturamentoPeriodo2 - faturamentoPeriodo1) / faturamentoPeriodo1) * 100;
    return {
      totalFaturamentoPeriodo1: valorTotalPeriodo1,
      totalFaturamentoPeriodo2: valorTotalPeriodo2,
      comparativoAnual: diferencaPercentual.toFixed(2),
    };
  } else {
    return {
      totalFaturamentoPeriodo1: '',
      totalFaturamentoPeriodo2: '',
      comparativoAnual: '',
    };
  }
};

// Ocorrências

const calcularComparativoOcorrencia = (dataFaturamento: any) => {
  let ocorrenciaPeriodo1 = 0;
  let ocorrenciaPeriodo2 = 0;
  const periodos = Object.keys(dataFaturamento);

  if (periodos.length === 2) {
    for (const mes in dataFaturamento[periodos[0]]) {
      ocorrenciaPeriodo1 += dataFaturamento[periodos[0]][mes].total_ocorrencias;
    }
    for (const mes in dataFaturamento[periodos[1]]) {
      ocorrenciaPeriodo2 += dataFaturamento[periodos[1]][mes].total_ocorrencias;
    }

    const diferencaPercentual = ((ocorrenciaPeriodo2 - ocorrenciaPeriodo1) / ocorrenciaPeriodo1) * 100;
    return {
      totalOcorrenciaPeriodo1: ocorrenciaPeriodo1.toString(),
      totalOcorrenciaPeriodo2: ocorrenciaPeriodo2.toString(),
      comparativoAnual: diferencaPercentual.toFixed(2),
    };
  } else {
    return {
      totalOcorrenciaPeriodo1: '',
      totalOcorrenciaPeriodo2: '',
      comparativoAnual: '',
    };
  }
};

const calcularComparativoOcorrenciaMensal = (dataFaturamento: any) => {
  let ocorrenciaPeriodo1 = 0;
  let ocorrenciaPeriodo2 = 0;
  const periodos = Object.keys(dataFaturamento);

  if (periodos.length === 2) {
    for (const mes in dataFaturamento[periodos[0]]) {
      ocorrenciaPeriodo1 += dataFaturamento[periodos[0]][mes].total_ocorrencias;
    }
    for (const mes in dataFaturamento[periodos[1]]) {
      ocorrenciaPeriodo2 += dataFaturamento[periodos[1]][mes].total_ocorrencias;
    }

    const diferencaPercentual = ((ocorrenciaPeriodo2 - ocorrenciaPeriodo1) / ocorrenciaPeriodo1) * 100;
    return {
      totalOcorrenciaPeriodo1: ocorrenciaPeriodo1.toString(),
      totalOcorrenciaPeriodo2: ocorrenciaPeriodo2.toString(),
      comparativoAnual: diferencaPercentual.toFixed(2),
    };
  } else {
    return {
      totalOcorrenciaPeriodo1: '',
      totalOcorrenciaPeriodo2: '',
      comparativoAnual: '',
    };
  }
};

// Crescimento
const calcularCrescimento = (dataFaturamento: any) => {
  let totalAssinaturas = 0;
  let totalCancelamentos = 0;
  let numMeses = 0;

  if (Object.keys(dataFaturamento).length > 0) {
    Object.values(dataFaturamento).forEach((ano: any) => {
      Object.values(ano).forEach((mes: any) => {
        totalAssinaturas += mes.assinaturas;
        totalCancelamentos += mes.cancelamentos;
        numMeses++;
      });
    });

    const porcentagemCrescimentoTotal = ((totalAssinaturas - totalCancelamentos) / totalCancelamentos) * 100;
    const mediaPorcentagemCrescimento = (porcentagemCrescimentoTotal / numMeses);

    return {
      porcentagemCrescimento: porcentagemCrescimentoTotal.toFixed(2),
      mediaCrescimento: mediaPorcentagemCrescimento.toFixed(2),
      totalAssinaturas: totalAssinaturas,
      totalCancelamentos: totalCancelamentos,
      totalMesesConsiderados: numMeses,
    };
  } else {
    return {
      porcentagemCrescimento: '',
      mediaCrescimento: '',
      totalAssinaturas: '',
      totalCancelamentos: '',
      totalMesesConsiderados: 0,
    };
  }
};

const calcularCrescimentoMensal = (dataFaturamento: any) => {
  let totalAssinaturas = 0;
  let totalCancelamentos = 0;
  let numMeses = 0;

  if (Object.keys(dataFaturamento).length > 0) {
    Object.values(dataFaturamento).forEach((dia: any) => {
      totalAssinaturas += dia.assinaturas;
      totalCancelamentos += dia.cancelamentos;
      numMeses++;
    });

    const porcentagemCrescimentoTotal = ((totalAssinaturas - totalCancelamentos) / totalCancelamentos) * 100;
    const mediaPorcentagemCrescimento = (porcentagemCrescimentoTotal / numMeses);

    return {
      porcentagemCrescimento: porcentagemCrescimentoTotal.toFixed(2),
      mediaCrescimento: mediaPorcentagemCrescimento.toFixed(2),
      totalAssinaturas: totalAssinaturas,
      totalCancelamentos: totalCancelamentos,
    };
  } else {
    return {
      porcentagemCrescimento: '',
      mediaCrescimento: '',
      totalAssinaturas: '',
      totalCancelamentos: '',
    };
  }
};

// Diferença
const calcularComparativoCrescimento = (dataFaturamento: any) => {
  let totalAssinaturasPeriodo1 = 0;
  let totalCancelamentosPeriodo1 = 0;
  let totalAssinaturasPeriodo2 = 0;
  let totalCancelamentosPeriodo2 = 0;
  const periodos = Object.keys(dataFaturamento);

  if (periodos.length === 2) {
    for (const mes in dataFaturamento[periodos[0]]) {
      totalAssinaturasPeriodo1 += dataFaturamento[periodos[0]][mes].assinaturas;
      totalCancelamentosPeriodo1 += dataFaturamento[periodos[0]][mes].cancelamentos;
    }
    for (const mes in dataFaturamento[periodos[1]]) {
      totalAssinaturasPeriodo2 += dataFaturamento[periodos[1]][mes].assinaturas;
      totalCancelamentosPeriodo2 += dataFaturamento[periodos[1]][mes].cancelamentos;
    }

    const crescimentoPeriodo1 = ((totalAssinaturasPeriodo1 - totalCancelamentosPeriodo1) / totalCancelamentosPeriodo1) * 100;
    const crescimentoPeriodo2 = ((totalAssinaturasPeriodo2 - totalCancelamentosPeriodo2) / totalCancelamentosPeriodo2) * 100;
    const diferencaPercentual = ((crescimentoPeriodo2 - crescimentoPeriodo1) / crescimentoPeriodo1) * 100;

    return {
      totalCrescimentoPeriodo1: crescimentoPeriodo1.toFixed(2),
      totalCrescimentoPeriodo2: crescimentoPeriodo2.toFixed(2),
      comparativoAnual: diferencaPercentual.toFixed(2),
    };
  } else {
    return {
      totalCrescimentoPeriodo1: '',
      totalCrescimentoPeriodo2: '',
      comparativoAnual: '',
    };
  }
};

const calcularComparativoCrescimentoMensal = (dataFaturamento: any) => {
  let totalAssinaturasPeriodo1 = 0;
  let totalCancelamentosPeriodo1 = 0;
  let totalAssinaturasPeriodo2 = 0;
  let totalCancelamentosPeriodo2 = 0;
  const periodos = Object.keys(dataFaturamento);

  if (periodos.length === 2) {
    for (const mes in dataFaturamento[periodos[0]]) {
      totalAssinaturasPeriodo1 += dataFaturamento[periodos[0]][mes].assinaturas;
      totalCancelamentosPeriodo1 += dataFaturamento[periodos[0]][mes].cancelamentos;
    }
    for (const mes in dataFaturamento[periodos[1]]) {
      totalAssinaturasPeriodo2 += dataFaturamento[periodos[1]][mes].assinaturas;
      totalCancelamentosPeriodo2 += dataFaturamento[periodos[1]][mes].cancelamentos;
    }

    const crescimentoPeriodo1 = ((totalAssinaturasPeriodo1 - totalCancelamentosPeriodo1) / totalCancelamentosPeriodo1) * 100;
    const crescimentoPeriodo2 = ((totalAssinaturasPeriodo2 - totalCancelamentosPeriodo2) / totalCancelamentosPeriodo2) * 100;
    const diferencaPercentual = ((crescimentoPeriodo2 - crescimentoPeriodo1) / crescimentoPeriodo1) * 100;

    return {
      totalCrescimentoPeriodo1: crescimentoPeriodo1.toFixed(2),
      totalCrescimentoPeriodo2: crescimentoPeriodo2.toFixed(2),
      comparativoAnual: diferencaPercentual.toFixed(2),
    };
  } else {
    return {
      totalCrescimentoPeriodo1: '',
      totalCrescimentoPeriodo2: '',
      comparativoAnual: '',
    };
  }
};


function consultarMelhorContrato(dataAssinaturaContrato: any) {
  if (dataAssinaturaContrato) {
    let melhorContrato = '';
    let valorTotal = 0;

    if (Object.keys(dataAssinaturaContrato).length > 0) {
      Object.entries(dataAssinaturaContrato).forEach(([contrato, dados]: [string, any]) => {
        const valorContrato = parseFloat(dados.total_ocorrencias);

        if (valorContrato > valorTotal) {
          melhorContrato = contrato;
          valorTotal = valorContrato;
        }
      });
    }

    return {
      melhorContratoNome: melhorContrato,
      melhorContratoValor: valorTotal,
    };
  } else {
    return {
      melhorContratoNome: '',
      melhorContratoValor: 0,
    };
  }
}

function consultarPrincipalMotivo(dataCancelamentoMotivo: any) {
  if (dataCancelamentoMotivo) {
    let principalMotivo = '';
    let valorTotal = 0;

    if (Object.keys(dataCancelamentoMotivo).length > 0) {
      Object.entries(dataCancelamentoMotivo).forEach(([motivo, dados]: [string, any]) => {
        const motivoOcorrencias = parseFloat(dados.total_ocorrencias);

        if (motivoOcorrencias > valorTotal) {
          principalMotivo = motivo;
          valorTotal = motivoOcorrencias;
        }
      });
    }

    return {
      principalMotivoNome: principalMotivo,
      principalMotivoQuantidade: valorTotal,
    };
  } else {
    return {
      principalMotivoNome: '',
      principalMotivoQuantidade: 0,
    };
  }
}

function obterMelhorEPiorMesFaturamento(dados: any) {
  let melhorMes = null;
  let piorMes = null;
  let melhorTotal = Number.NEGATIVE_INFINITY;
  let piorTotal = Number.POSITIVE_INFINITY;
  const melhorMesTotal = Number.NEGATIVE_INFINITY;
  const piorMesTotal = Number.POSITIVE_INFINITY;

  if (dados) {
    for (const ano in dados) {
      const meses = dados[ano];

      for (const mes in meses) {
        const mesDados = meses[mes];

        if (mesDados.total > melhorTotal) {
          if (Number(mes) <= 9) {
            melhorMes = `0${mes}/${ano}`;
          } else {
            melhorMes = `${mes}/${ano}`;
          }
          melhorTotal = mesDados.total;
        }

        if (mesDados.total < piorTotal) {
          if (Number(mes) <= 9) {
            piorMes = `0${mes}/${ano}`;
          } else {
            piorMes = `${mes}/${ano}`;
          }
          piorTotal = mesDados.total;
        }
      }
    }

    const melhorMesTotalFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(melhorTotal);

    const piorMesTotalFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(piorTotal);

    return { melhorMes, melhorMesTotal: melhorMesTotalFormatado, piorMes, piorMesTotal: piorMesTotalFormatado };
  } else {
    return {
      melhorMes: '',
      melhorMesTotal: '',
      piorMes: '',
      piorMesTotal: '',
    };
  }
}

function obterMelhorEPiorDiaFaturamento(dados: any) {
  let melhorDia = null;
  let piorDia = null;
  let melhorTotal = Number.NEGATIVE_INFINITY;
  let piorTotal = Number.POSITIVE_INFINITY;
  const melhorDiaTotal = Number.NEGATIVE_INFINITY;
  const piorDiaTotal = Number.POSITIVE_INFINITY;

  if (dados) {
    for (const dia in dados) {
      const diaDados = dados[dia];

      if (diaDados.total > melhorTotal) {
        melhorDia = dia;
        melhorTotal = diaDados.total;
      }

      if (diaDados.total < piorTotal) {
        piorDia = dia;
        piorTotal = diaDados.total;
      }
    }

    const melhorDiaTotalFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(melhorTotal);

    const piorDiaTotalFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(piorTotal);

    return { melhorDia, melhorDiaTotal: melhorDiaTotalFormatado, piorDia, piorDiaTotal: piorDiaTotalFormatado };
  } else {
    return {
      melhorDia: '',
      melhorDiaTotal: '',
      piorDia: '',
      piorDiaTotal: '',
    };
  }
}

function obterMelhorEPiorMesOcorrencia(dados: any) {
  let melhorMes = null;
  let piorMes = null;
  let melhorTotal = Number.NEGATIVE_INFINITY;
  let piorTotal = Number.POSITIVE_INFINITY;
  const melhorMesTotal = Number.NEGATIVE_INFINITY;
  const piorMesTotal = Number.POSITIVE_INFINITY;

  if (dados) {
    for (const ano in dados) {
      const meses = dados[ano];

      for (const mes in meses) {
        const mesDados = meses[mes];

        if (mesDados.total_ocorrencias > melhorTotal) {
          if (Number(mes) <= 9) {
            melhorMes = `0${mes}/${ano}`;
          } else {
            melhorMes = `${mes}/${ano}`;
          }
          melhorTotal = mesDados.total_ocorrencias;
        }

        if (mesDados.total_ocorrencias < piorTotal) {
          if (Number(mes) <= 9) {
            piorMes = `0${mes}/${ano}`;
          } else {
            piorMes = `${mes}/${ano}`;
          }
          piorTotal = mesDados.total_ocorrencias;
        }
      }
    }

    return { melhorMes, melhorMesTotal: melhorTotal.toString(), piorMes, piorMesTotal: piorTotal.toString() };
  } else {
    return {
      melhorMes: '',
      melhorMesTotal: '',
      piorMes: '',
      piorMesTotal: '',
    };
  }
}

function obterMelhorEPiorDiaOcorrencia(dados: any) {
  let melhorDia = null;
  let piorDia = null;
  let melhorTotal = Number.NEGATIVE_INFINITY;
  let piorTotal = Number.POSITIVE_INFINITY;
  const melhorDiaTotal = Number.NEGATIVE_INFINITY;
  const piorDiaTotal = Number.POSITIVE_INFINITY;

  if (dados) {
    for (const dia in dados) {
      const diaDados = dados[dia];

      if (diaDados.total_ocorrencias > melhorTotal) {
        melhorDia = dia;
        melhorTotal = diaDados.total_ocorrencias;
      }

      if (diaDados.total_ocorrencias < piorTotal) {
        piorDia = dia;
        piorTotal = diaDados.total_ocorrencias;
      }
    }

    return { melhorDia, melhorDiaTotal: melhorTotal.toString(), piorDia, piorDiaTotal: piorTotal.toString() };
  } else {
    return {
      melhorDia: '',
      melhorDiaTotal: '',
      piorDia: '',
      piorDiaTotal: '',
    };
  }
}

export { calcularFaturamento, calcularFaturamentoMensal, calcularOcorrencia, calcularOcorrenciaMensal, calcularComparativoFaturamento, calcularComparativoFaturamentoMensal, calcularComparativoOcorrencia, calcularComparativoOcorrenciaMensal, calcularCrescimento, calcularCrescimentoMensal, calcularComparativoCrescimento, calcularComparativoCrescimentoMensal, consultarMelhorContrato, consultarPrincipalMotivo, obterMelhorEPiorMesFaturamento, obterMelhorEPiorDiaFaturamento, obterMelhorEPiorMesOcorrencia, obterMelhorEPiorDiaOcorrencia };