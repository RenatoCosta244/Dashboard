import { criarCalendario, processarEntregas, precomputeAggregations, calcularMedidas } from './data.js';
import { attachEventListeners, updateCurrentDate, renderKpis, renderPerformanceMatrix, renderFrotaTable, formatarNumero, hideTooltip, updateTooltip } from './ui.js';
import { createChart } from './charts.js';

let currentPage = 'landing-page';
let currentMetric = 'total_entregas';
let charts = {};
let preparedData = {};

function navigateTo(pageId) {
    document.getElementById(currentPage).classList.remove('active');
    hideTooltip();
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

function initializeDashboard() {
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

    navigateTo('landing-page');
}

function updateAnaliseFinanceira() {
    renderKpis(preparedData.medidas);
    criarGraficoFinanceiro();
    renderPerformanceMatrix(preparedData);
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

function updateProdutosMotoristas() {
    criarGraficoRanking();
    renderFrotaTable(preparedData);
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
                    external: function(context) {
                        if (context.tooltip.opacity === 0) {
                            hideTooltip();
                            return;
                        }

                        const dataPoint = context.tooltip.dataPoints && context.tooltip.dataPoints[0];
                        if (dataPoint) {
                            updateTooltip(dataPoint, context.tooltip.caretX, context.tooltip.caretY);
                        }
                    }
                }
            }
        }
    });
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
    const dados = currentMetric === 'total_entregas'
        ? preparedData.entregasPorMes
        : preparedData.faturacaoPorMes;

    document.getElementById('chart-title-simulacao').textContent =
        currentMetric === 'total_entregas'
            ? 'Evolução Mensal - Total de Entregas'
            : 'Evolução Mensal - Faturação Total';

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
                            return currentMetric === 'total_entregas'
                                ? `Entregas: ${context.raw}`
                                : `Faturação: €${formatarNumero(context.raw)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return currentMetric === 'faturacao_total'
                                ? '€' + formatarNumero(value)
                                : value;
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

    let html = '';

    meses.forEach((mes, index) => {
        const totalEntregas = preparedData.entregasPorMes[index] || 0;
        const faturacaoTotal = preparedData.faturacaoPorMes[index] || 0;
        const custoTotal = preparedData.custoPorMes[index] || 0;
        const margem = faturacaoTotal - custoTotal;
        const anterior = index > 0 ? preparedData.faturacaoPorMes[index - 1] || 0 : 0;
        const variacao = anterior > 0 ? ((faturacaoTotal - anterior) / anterior * 100) : 0;
        const variacaoClass = variacao >= 0 ? 'positive' : 'negative';
        const variacaoIcon = variacao >= 0 ? '↑' : '↓';

        html += `
            <tr>
                <td><strong>${mes.mesNome}</strong></td>
                <td>${totalEntregas}</td>
                <td>€${formatarNumero(faturacaoTotal)}</td>
                <td>€${formatarNumero(custoTotal)}</td>
                <td>€${formatarNumero(margem)}</td>
                <td class="${variacaoClass}">${variacaoIcon} ${Math.abs(variacao).toFixed(1)}%</td>
            </tr>
        `;
    });

    tabela.innerHTML = html;
}

function updateMetric(value) {
    currentMetric = value;
    updateSimulacao();
}

window.addEventListener('DOMContentLoaded', function() {
    attachEventListeners(navigateTo, updateMetric);
    updateCurrentDate();
    initializeDashboard();
});

window.addEventListener('resize', function() {
    Object.values(charts).forEach(chart => {
        if (chart && chart.resize) {
            chart.resize();
        }
    });
});
