export function criarCalendario() {
    const calendario = [];
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    for (let mes = 0; mes < 12; mes++) {
        const trimestre = Math.floor(mes / 3) + 1;
        calendario.push({
            mes: mes + 1,
            mesNome: meses[mes],
            ano: 2024,
            trimestre: `T${trimestre}`,
            mesAno: `${meses[mes].substring(0, 3)}/2024`
        });
    }

    return calendario;
}

export function processarEntregas() {
    return window.dadosEntregas || gerarDadosSimulados();
}

export function gerarDadosSimulados() {
    const entregas = [];
    const veiculos = ['V001', 'V002', 'V003', 'V004', 'V005'];
    const motoristas = ['M001', 'M002', 'M003', 'M004', 'M005'];
    const status = ['Entregue', 'Atrasado'];

    for (let i = 0; i < 500; i++) {
        const mes = Math.floor(Math.random() * 12);
        const distancia = Math.floor(Math.random() * 200) + 10;
        const custo = distancia * (Math.random() * 1.5 + 0.5);

        entregas.push({
            id: i,
            data: new Date(2024, mes, Math.floor(Math.random() * 28) + 1),
            idVeiculo: veiculos[Math.floor(Math.random() * veiculos.length)],
            idMotorista: motoristas[Math.floor(Math.random() * motoristas.length)],
            distanciaPercorrida: distancia,
            custoCombustivel: Math.round(custo * 100) / 100,
            valorEntrega: Math.round((custo * 2.5 + Math.random() * 200) * 100) / 100,
            status: status[Math.random() > 0.2 ? 0 : 1],
            mes: mes
        });
    }

    return entregas;
}

export function precomputeAggregations(entregas, motoristas) {
    const motoristasMap = Object.fromEntries(motoristas.map(m => [m.idMotorista, m]));
    const entregasPorMotorista = {};
    const entregasPorVeiculo = {};
    const entregasPorRegiao = {};
    const entregasPorMotoristaPorRegiao = {};
    const faturacaoPorMes = new Array(12).fill(0);
    const custoPorMes = new Array(12).fill(0);
    const entregasPorMes = new Array(12).fill(0);
    const statusCounts = { Entregue: 0, Atrasado: 0 };
    const rankingMotoristas = {};

    entregas.forEach(e => {
        entregasPorMotorista[e.idMotorista] = (entregasPorMotorista[e.idMotorista] || 0) + 1;
        entregasPorVeiculo[e.idVeiculo] = (entregasPorVeiculo[e.idVeiculo] || 0) + 1;
        faturacaoPorMes[e.mes] += e.valorEntrega;
        custoPorMes[e.mes] += e.custoCombustivel;
        entregasPorMes[e.mes] += 1;

        const regiao = (motoristasMap[e.idMotorista] || {}).regiao || 'Desconhecida';
        entregasPorRegiao[regiao] = (entregasPorRegiao[regiao] || 0) + 1;

        entregasPorMotoristaPorRegiao[regiao] = entregasPorMotoristaPorRegiao[regiao] || {};
        entregasPorMotoristaPorRegiao[regiao][e.idMotorista] =
            (entregasPorMotoristaPorRegiao[regiao][e.idMotorista] || 0) + 1;

        statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
        rankingMotoristas[e.idMotorista] = (rankingMotoristas[e.idMotorista] || 0) + 1;
    });

    const rankingMotoristasArray = Object.entries(rankingMotoristas)
        .map(([id, count]) => ({ idMotorista: id, entregas: count }))
        .sort((a, b) => b.entregas - a.entregas);

    return {
        entregasPorMotorista,
        entregasPorVeiculo,
        entregasPorRegiao,
        entregasPorMotoristaPorRegiao,
        faturacaoPorMes,
        custoPorMes,
        entregasPorMes,
        statusCounts,
        rankingMotoristas: rankingMotoristasArray,
        regioes: [...new Set(motoristas.map(m => m.regiao))]
    };
}

export function calcularMedidas(entregas, agregacoes) {
    const totalEntregas = entregas.length;
    const custoTotal = agregacoes.custoPorMes.reduce((sum, value) => sum + value, 0);
    const faturacaoTotal = agregacoes.faturacaoPorMes.reduce((sum, value) => sum + value, 0);
    const margemLucro = faturacaoTotal - custoTotal;

    const totalAtrasos = agregacoes.statusCounts.Atrasado || 0;
    const percentagemAtrasos = totalEntregas > 0
        ? ((totalAtrasos / totalEntregas) * 100).toFixed(1)
        : '0.0';

    return {
        totalEntregas,
        custoTotal,
        faturacaoTotal,
        margemLucro,
        percentagemAtrasos,
        faturacaoPorMes: agregacoes.faturacaoPorMes,
        rankingMotoristas: agregacoes.rankingMotoristas
    };
}
