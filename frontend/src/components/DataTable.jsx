import React from 'react';
import { AlertTriangle, Code, Cpu, Activity, UserCog } from 'lucide-react';

const DataTable = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="p-8 text-center text-muted">
                No developer data available.
            </div>
        );
    }

    const getDeveloperIcon = (type) => {
        switch (type) {
            case 'Rapid Coder': return <Activity className="w-4 h-4 text-primary" />;
            case 'Debug Specialist': return <AlertTriangle className="w-4 h-4 text-warning" />;
            case 'Deep Worker': return <Cpu className="w-4 h-4 text-accent" />;
            case 'Refactor Specialist': return <Code className="w-4 h-4 text-secondary" />;
            default: return <UserCog className="w-4 h-4 text-muted" />;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-surface border-b border-surface/50 text-muted text-sm uppercase tracking-wider">
                        <th className="p-4 font-semibold">Developer</th>
                        <th className="p-4 font-semibold">Commits</th>
                        <th className="p-4 font-semibold">LOC</th>
                        <th className="p-4 font-semibold">Type</th>
                        <th className="p-4 font-semibold">Anomaly</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-surface/30">
                    {data.map((dev) => (
                        <tr
                            key={dev._id}
                            className={`hover:bg-white/[0.02] transition-colors ${dev.analysis?.is_anomaly ? 'bg-danger/5 hover:bg-danger/10' : ''}`}
                        >
                            <td className="p-4">
                                <div className="font-medium text-text">{dev.name}</div>
                                <div className="text-xs text-muted font-mono">{dev._id}</div>
                            </td>
                            <td className="p-4 text-text">{dev.commits}</td>
                            <td className="p-4 text-text">{dev.loc}</td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    {getDeveloperIcon(dev.analysis?.type)}
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${dev.analysis?.type === 'Rapid Coder' ? 'bg-primary/10 text-primary border-primary/20' : ''}
                    ${dev.analysis?.type === 'Debug Specialist' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}
                    ${dev.analysis?.type === 'Deep Worker' ? 'bg-accent/10 text-accent border-accent/20' : ''}
                    ${dev.analysis?.type === 'Refactor Specialist' ? 'bg-secondary/10 text-secondary border-secondary/20' : ''}
                    ${dev.analysis?.type === 'Anomaly' ? 'bg-danger/10 text-danger border-danger/20' : ''}
                    ${!dev.analysis ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : ''}
                  `}>
                                        {dev.analysis?.type || 'Uncategorized'}
                                    </span>
                                </div>
                            </td>
                            <td className="p-4">
                                {dev.analysis?.is_anomaly ? (
                                    <span className="inline-flex items-center gap-1 text-danger text-sm font-semibold">
                                        <AlertTriangle className="w-4 h-4" /> Yes
                                    </span>
                                ) : (
                                    <span className="text-muted text-sm">No</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
