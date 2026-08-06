/* ======= Configurações ======= */
let currentPage = 'landing-page';
let currentMetric = 'total_entregas';
let charts = {};
let preparedData = {};

const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#ffffff'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#b0b0b0'
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        },
        y: {
            ticks: {
                color: '#b0b0b0'
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        }
    }
};

/* ======= Navegação ======= */
function navigateTo(pageId) {
    document.getElementById(currentPage).classList.remove('active');

    const customTooltip = document.getElementById('custom-tooltip');
    if (customTooltip) {
        customTooltip.classList.add('tooltip-hidden');
    }
    
    document.getElementById(pageId).classList.add('active');
    currentPage = pageId;
    
    switch(pageId) {
        case 'analise-financeira':
            updateAnaliseFinanceira();
            break;
        case 'produtos-motoristas':
            updateProdutosMotoristas();
            break;
        case 'simulacao':
            updateSimulacao();
            break;
    }
    
    window.scrollTo(0, 0);
}

/* ======= Eventos ======= */
function attachEventListeners() {
    document.querySelectorAll('[data-page]').forEach(button => {
        button.addEventListener('click', function() {
            navigateTo(this.dataset.page);
        });
    });

    const metricSelector = document.getElementById('metric-selector');
    if (metricSelector) {
        metricSelector.addEventListener('change', function(e) {
            currentMetric = e.target.value;
            updateSimulacao();
        });
    }
}

/* ======= Utilitários de Gráfico ======= */
function createChart(ctx, config) {
    return new Chart(ctx, {
        type: config.type,
        data: config.data,
        options: {
            ...defaultChartOptions,
            ...(config.options || {}),
            plugins: {
                ...defaultChartOptions.plugins,
                ...(config.options?.plugins || {})
            },
            scales: {
                ...defaultChartOptions.scales,
                ...(config.options?.scales || {})
            }
        }
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    attachEventListeners();
    initializeDashboard();
    updateCurrentDate();
});

function initializeDashboard() {
    prepareData();
    navigateTo('landing-page');
}

function updateCurrentDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('pt-PT', options);
}

// Preparação de Dados (Fase 1: Modelação e Limpeza)
function prepareData() {
    const calendario = criarCalendario();
    const entregasProcessadas = processarEntregas();
    const frota = window.dadosFrota || [];
    const motoristas = window.dadosMotoristas || [];
    const agregacoes = precomputeAggregations(entregasProcessadas, motoristas);

    preparedData = {
        calendario,
        entregas: entregasProcessadas,
        frota,
        motoristas,
        ...agregacoes,
        medidas: calcularMedidas(entregasProcessadas, agregacoes)
    };
}

function precomputeAggregations(entregas, motoristas) {
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

function criarCalendario() {
    const calendario = [];
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    // Criar calendário para 2024
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

function processarEntregas() {
    // Simular processamento de entregas (substituir com dados reais)
    return window.dadosEntregas || gerarDadosSimulados();
}

function gerarDadosSimulados() {
    const entregas = [];
    const veiculos = ['V001', 'V002', 'V003', 'V004', 'V005'];
    const motoristas = ['M001', 'M002', 'M003', 'M004', 'M005'];
    const status = ['Entregue', 'Atrasado'];
    
    // Gerar 500 entregas aleatórias
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

function calcularMedidas(entregas, agregacoes) {
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

// Atualização das Páginas
function updateAnaliseFinanceira() {
    const medidas = preparedData.medidas;
    
    // Atualizar KPIs
    document.getElementById('kpi-entregas').textContent = medidas.totalEntregas;
    document.getElementById('kpi-faturacao').textContent = `€${formatarNumero(medidas.faturacaoTotal)}`;
    document.getElementById('kpi-margem').textContent = `€${formatarNumero(medidas.margemLucro)}`;
    document.getElementById('kpi-atrasos').textContent = `${medidas.percentagemAtrasos}%`;
    
    // Criar gráfico financeiro
    criarGraficoFinanceiro();
    
    // Criar matriz de performance
    criarMatrizPerformance();
}

function criarGraficoFinanceiro() {
    const ctx = document.getElementById('chart-financeiro').getContext('2d');

    if (charts.financeiro) {
        charts.financeiro.destroy();
    }

    const meses = preparedData.calendario.map(c => c.mesNome);
    const faturacaoPorMes = preparedData.faturacaoPorMes;
    const custoPorMes = preparedData.custoPorMes;

    charts.financeiro = createChart(ctx, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: 'Faturação Total',
                data: faturacaoPorMes,
                backgroundColor: 'rgba(76, 175, 80, 0.8)',
                borderColor: '#4CAF50',
                borderWidth: 1
            }, {
                label: 'Custo Total',
                data: custoPorMes,
                backgroundColor: 'rgba(244, 67, 54, 0.8)',
                borderColor: '#F44336',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: €${formatarNumero(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + formatarNumero(value);
                        }
                    }
                }
            }
        }
    });
}

function criarMatrizPerformance() {
    const tabela = document.getElementById('matriz-performance');
    const motoristas = preparedData.motoristas;
    const regioes = preparedData.regioes;
    const entregasPorRegiao = preparedData.entregasPorMotoristaPorRegiao;

    let thead = '<tr><th>Região</th>';
    motoristas.forEach(m => {
        thead += `<th>${m.nome}</th>`;
    });
    thead += '</tr>';
    tabela.querySelector('thead').innerHTML = thead;

    let tbody = '';
    regioes.forEach(regiao => {
        tbody += `<tr><td><strong>${regiao}</strong></td>`;
        motoristas.forEach(motorista => {
            const entregas = (entregasPorRegiao[regiao] || {})[motorista.idMotorista] || 0;
            tbody += `<td>${entregas}</td>`;
        });
        tbody += '</tr>';
    });
    tabela.querySelector('tbody').innerHTML = tbody;
}

function updateProdutosMotoristas() {
    criarGraficoRanking();
    criarTabelaFrota();
}

function criarGraficoRanking() {
    const ctx = document.getElementById('chart-ranking').getContext('2d');

    if (charts.ranking) {
        charts.ranking.destroy();
    }

    const ranking = preparedData.medidas.rankingMotoristas.slice(0, 5);
    const nomes = ranking.map(r => {
        const motorista = preparedData.motoristas.find(m => m.idMotorista === r.idMotorista);
        return motorista ? motorista.nome : r.idMotorista;
    });
    const entregas = ranking.map(r => r.entregas);

    charts.ranking = createChart(ctx, {
        type: 'bar',
        data: {
            labels: nomes,
            datasets: [{
                label: 'Total de Entregas',
                data: entregas,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    external: customTooltipHandler
                }
            }
        }
    });
}

function criarTabelaFrota() {
    const tabela = document.getElementById('tabela-frota').querySelector('tbody');
    const entregasPorVeiculo = preparedData.entregasPorVeiculo;
    const maxEntregas = Math.max(...preparedData.frota.map(v => entregasPorVeiculo[v.idVeiculo] || 0));

    let html = '';
    preparedData.frota.forEach(veiculo => {
        const entregas = entregasPorVeiculo[veiculo.idVeiculo] || 0;
        const percentagem = maxEntregas > 0 ? ((entregas / maxEntregas) * 100).toFixed(0) : 0;

        html += `
            <tr>
                <td>${veiculo.idVeiculo}</td>
                <td>${veiculo.modelo}</td>
                <td>${veiculo.capacidadeCarga}</td>
                <td>${entregas}</td>
                <td>
                    <div class="data-bar-container">
                        <div class="data-bar" style="width: ${percentagem}%"></div>
                    </div>
                </td>
            </tr>
        `;
    });

    tabela.innerHTML = html;
}

function updateSimulacao() {
    criarGraficoSimulacao();
    criarTabelaSimulacao();
}

function criarGraficoSimulacao() {
    const ctx = document.getElementById('chart-simulacao').getContext('2d');

    if (charts.simulacao) {
        charts.simulacao.destroy();
    }

    const meses = preparedData.calendario.map(c => c.mesNome);
    let dados = [];
    let titulo = '';

    if (currentMetric === 'total_entregas') {
        titulo = 'Evolução Mensal - Total de Entregas';
        dados = preparedData.entregasPorMes;
    } else {
        titulo = 'Evolução Mensal - Faturação Total';
        dados = preparedData.faturacaoPorMes;
    }

    document.getElementById('chart-title-simulacao').textContent = titulo;

    charts.simulacao = createChart(ctx, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: currentMetric === 'total_entregas' ? 'Total de Entregas' : 'Faturação Total',
                data: dados,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: '#667eea',
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (currentMetric === 'total_entregas') {
                                return `Entregas: ${context.raw}`;
                            } else {
                                return `Faturação: €${formatarNumero(context.raw)}`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            if (currentMetric === 'faturacao_total') {
                                return '€' + formatarNumero(value);
                            }
                            return value;
                        }
                    }
                }
            }
        }
    });
}

function criarTabelaSimulacao() {
    const tabela = document.getElementById('tabela-simulacao').querySelector('tbody');
    const meses = preparedData.calendario;

    const dadosMensais = meses.map((mes, index) => {
        const totalEntregas = preparedData.entregasPorMes[mes.mes - 1] || 0;
        const faturacaoTotal = preparedData.faturacaoPorMes[mes.mes - 1] || 0;
        const custoTotal = preparedData.custoPorMes[mes.mes - 1] || 0;
        const margem = faturacaoTotal - custoTotal;

        const anterior = index > 0 ? (preparedData.faturacaoPorMes[index - 1] || 0) : 0;
        const variacao = anterior > 0 ? ((faturacaoTotal - anterior) / anterior * 100) : 0;

        return {
            mes: mes.mesNome,
            totalEntregas,
            faturacaoTotal,
            custoTotal,
            margem,
            variacao
        };
    });

    let html = '';
    dadosMensais.forEach(dados => {
        const variacaoClass = dados.variacao >= 0 ? 'positive' : 'negative';
        const variacaoIcon = dados.variacao >= 0 ? '↑' : '↓';

        html += `
            <tr>
                <td><strong>${dados.mes}</strong></td>
                <td>${dados.totalEntregas}</td>
                <td>€${formatarNumero(dados.faturacaoTotal)}</td>
                <td>€${formatarNumero(dados.custoTotal)}</td>
                <td>€${formatarNumero(dados.margem)}</td>
                <td class="${variacaoClass}">${variacaoIcon} ${Math.abs(dados.variacao).toFixed(1)}%</td>
            </tr>
        `;
    });

    tabela.innerHTML = html;
}

// Tooltip Personalizada (Fase 3.3 e 3.4)
function customTooltipHandler(context) {
    const tooltip = document.getElementById('custom-tooltip');
    if (!tooltip) return;

    if (context.tooltip.opacity === 0) {
        tooltip.classList.add('tooltip-hidden');
        return;
    }

    const dataPoint = context.tooltip.dataPoints && context.tooltip.dataPoints[0];
    if (dataPoint) {
        tooltip.classList.remove('tooltip-hidden');
        tooltip.style.left = '0px';
        tooltip.style.top = '0px';
        tooltip.style.visibility = 'hidden';
        tooltip.classList.remove('tooltip-hidden');

        document.getElementById('tooltip-entregas').textContent = dataPoint.raw;
        document.getElementById('tooltip-detail').textContent =
            `Motorista: ${dataPoint.label}`;

        const rect = tooltip.getBoundingClientRect();
        const margin = 12;
        let left = context.tooltip.caretX + margin;
        let top = context.tooltip.caretY - rect.height - margin;

        if (left + rect.width > window.innerWidth - margin) {
            left = window.innerWidth - rect.width - margin;
        }
        if (left < margin) {
            left = margin;
        }
        if (top < margin) {
            top = context.tooltip.caretY + margin;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.visibility = 'visible';
    }
}

// Utilitários
function formatarNumero(numero) {
    return new Intl.NumberFormat('pt-PT', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numero);
}

// Inicialização dos gráficos com resize handler
window.addEventListener('resize', function() {
    Object.values(charts).forEach(chart => {
        if (chart && chart.resize) {
            chart.resize();
        }
    });
});