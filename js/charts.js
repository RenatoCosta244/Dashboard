export const defaultChartOptions = {
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

export function createChart(ctx, config) {
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
