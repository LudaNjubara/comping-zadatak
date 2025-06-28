import { ChartConfiguration } from "chart.js";

export const CHART_WIDGET_OPTIONS: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            position: 'top'
        },
        title: {
            display: false
        }
    },
    scales: {
        x: {
            display: true,
            grid: {
                display: true
            }
        },
        y: {
            display: true,
            grid: {
                display: true
            }
        }
    }
};