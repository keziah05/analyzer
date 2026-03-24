import React, { useEffect, useState, useMemo } from 'react';
import { getResults } from '../services/api';
import DataTable from '../components/DataTable';
import { Loader2, AlertCircle, BarChart3, PieChart } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Pie, Scatter } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const results = await getResults();
                setData(results);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch dashboard data:", err);
                setError("Failed to load dashboard data. Are the backend and database running?");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    // Compute metrics
    const totalDevs = data.length;
    const totalAnomalies = data.filter(d => d.analysis?.is_anomaly).length;

    // Prepare Chart Data
    const typeCounts = useMemo(() => {
        const counts = {};
        data.forEach(d => {
            const type = d.analysis?.type || 'Unknown';
            counts[type] = (counts[type] || 0) + 1;
        });
        return counts;
    }, [data]);

    const pieChartData = {
        labels: Object.keys(typeCounts),
        datasets: [
            {
                data: Object.values(typeCounts),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)', // primary
                    'rgba(16, 185, 129, 0.8)', // secondary
                    'rgba(139, 92, 246, 0.8)', // accent
                    'rgba(239, 68, 68, 0.8)',  // danger
                    'rgba(245, 158, 11, 0.8)', // warning
                    'rgba(148, 163, 184, 0.8)', // unknown
                ],
                borderColor: '#1e293b',
                borderWidth: 2,
            },
        ],
    };

    const barChartData = {
        labels: data.slice(0, 15).map(d => d.name), // Show top 15 for readability
        datasets: [
            {
                label: 'Commits',
                data: data.slice(0, 15).map(d => d.commits),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
            {
                label: 'Lines of Code',
                data: data.slice(0, 15).map(d => d.loc),
                backgroundColor: 'rgba(139, 92, 246, 0.8)',
            }
        ]
    };

    const scatterData = {
        datasets: [
            {
                label: 'Normal',
                data: data.filter(d => !d.analysis?.is_anomaly).map(d => ({ x: d.commits, y: d.loc })),
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
            },
            {
                label: 'Anomaly',
                data: data.filter(d => d.analysis?.is_anomaly).map(d => ({ x: d.commits, y: d.loc })),
                backgroundColor: 'rgba(239, 68, 68, 1)',
                pointRadius: 6,
                pointHoverRadius: 8,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#f8fafc' } }
        },
        scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#f8fafc' } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#f8fafc' } }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right', labels: { color: '#f8fafc' } }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-xl text-muted animate-pulse">Loading dashboard data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <AlertCircle className="w-16 h-16 text-danger mb-4" />
                <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
                <p className="text-muted text-center max-w-md">{error}</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h2 className="text-3xl font-bold mb-4">No Data Analyzed Yet</h2>
                <p className="text-muted text-lg mb-8 max-w-md">Head over to the Upload page to submit a dataset for ML analysis.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Analysis Dashboard</h1>
                    <p className="text-muted">Review ML clustering and anomaly detection results.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-surface p-4 rounded-xl border border-white/5 shadow-lg min-w-[150px]">
                        <p className="text-sm text-muted font-medium mb-1">Total Developers</p>
                        <p className="text-3xl font-bold text-primary">{totalDevs}</p>
                    </div>
                    <div className="bg-surface p-4 rounded-xl border border-white/5 shadow-lg border-b-2 border-b-danger min-w-[150px]">
                        <p className="text-sm text-muted font-medium mb-1">Anomalies Detected</p>
                        <p className="text-3xl font-bold text-danger">{totalAnomalies}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pie Chart */}
                <div className="bg-surface/80 p-6 rounded-2xl border border-white/5 shadow-xl glass">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-accent" />
                        Developer Types (K-Means)
                    </h3>
                    <div className="h-64">
                        <Pie data={pieChartData} options={pieOptions} />
                    </div>
                </div>

                {/* Scatter Plot */}
                <div className="bg-surface/80 p-6 rounded-2xl border border-white/5 shadow-xl glass">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-danger" />
                        Anomaly Distribution (Isolation Forest)
                    </h3>
                    <div className="h-64">
                        <Scatter data={scatterData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, tooltip: { callbacks: { label: (ctx) => `Commits: ${ctx.raw.x}, LOC: ${ctx.raw.y}` } } } }} />
                    </div>
                    <p className="text-xs text-muted mt-2 text-center">X: Commits | Y: Lines of Code</p>
                </div>

                {/* Bar Chart */}
                <div className="bg-surface/80 p-6 rounded-2xl border border-white/5 shadow-xl glass lg:col-span-2">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Metrics Overview (Sample)
                    </h3>
                    <div className="h-72">
                        <Bar data={barChartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-surface/80 rounded-2xl border border-white/5 shadow-xl glass overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <h3 className="text-xl font-bold">Detailed Results</h3>
                </div>
                <DataTable data={data} />
            </div>
        </div>
    );
};

export default Dashboard;
