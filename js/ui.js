export function attachEventListeners(navigateTo, onMetricChange) {
    document.querySelectorAll('[data-page]').forEach(button => {
        button.addEventListener('click', function() {
            navigateTo(this.dataset.page);
        });
    });

    const metricSelector = document.getElementById('metric-selector');
    if (metricSelector) {
        metricSelector.addEventListener('change', function(e) {
            onMetricChange(e.target.value);
        });
    }
}

export function updateCurrentDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('pt-PT', options);
}

export function renderKpis(medidas) {
    document.getElementById('kpi-entregas').textContent = medidas.totalEntregas;
    document.getElementById('kpi-faturacao').textContent = `€${formatarNumero(medidas.faturacaoTotal)}`;
    document.getElementById('kpi-margem').textContent = `€${formatarNumero(medidas.margemLucro)}`;
    document.getElementById('kpi-atrasos').textContent = `${medidas.percentagemAtrasos}%`;
}

export function renderPerformanceMatrix(preparedData) {
    const tabela = document.getElementById('matriz-performance');
    const motoristas = preparedData.motoristas;
    const regioes = preparedData.regioes;
    const entregasPorMotoristaPorRegiao = preparedData.entregasPorMotoristaPorRegiao;
    const entregasPorRegiao = preparedData.entregasPorRegiao;

    let thead = '<tr><th>Região</th>';
    motoristas.forEach(m => {
        thead += `<th>${m.nome}</th>`;
    });
    thead += '<th>Total</th></tr>';
    tabela.querySelector('thead').innerHTML = thead;

    let tbody = '';
    regioes.forEach(regiao => {
        tbody += `<tr><td><strong>${regiao}</strong></td>`;
        motoristas.forEach(motorista => {
            const entregas = (entregasPorMotoristaPorRegiao[regiao] || {})[motorista.idMotorista] || 0;
            tbody += `<td>${entregas}</td>`;
        });
        const totalRegiao = entregasPorRegiao[regiao] || 0;
        tbody += `<td><strong>${totalRegiao}</strong></td>`;
        tbody += '</tr>';
    });
    tabela.querySelector('tbody').innerHTML = tbody;
}

export function renderFrotaTable(preparedData) {
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

export function formatarNumero(numero) {
    return new Intl.NumberFormat('pt-PT', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numero);
}

export function hideTooltip() {
    const customTooltip = document.getElementById('custom-tooltip');
    if (customTooltip) {
        customTooltip.classList.add('tooltip-hidden');
    }
}

export function updateTooltip(dataPoint, caretX, caretY) {
    const tooltip = document.getElementById('custom-tooltip');
    if (!tooltip) return;

    tooltip.classList.remove('tooltip-hidden');
    tooltip.style.left = '0px';
    tooltip.style.top = '0px';
    tooltip.style.visibility = 'hidden';

    document.getElementById('tooltip-entregas').textContent = dataPoint.raw;
    document.getElementById('tooltip-detail').textContent = `Motorista: ${dataPoint.label}`;

    const rect = tooltip.getBoundingClientRect();
    const margin = 12;
    let left = caretX + margin;
    let top = caretY - rect.height - margin;

    if (left + rect.width > window.innerWidth - margin) {
        left = window.innerWidth - rect.width - margin;
    }
    if (left < margin) {
        left = margin;
    }
    if (top < margin) {
        top = caretY + margin;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.visibility = 'visible';
}
