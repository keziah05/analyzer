import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadDevelopers, runAnalysis } from '../services/api';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('idle'); // idle, parsing, ready, uploading, analyzing, success, error
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setStatus('parsing');

        Papa.parse(selectedFile, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => {
                setData(results.data);
                setStatus('ready');
                setMessage(`Successfully parsed ${results.data.length} records.`);
            },
            error: (err) => {
                setStatus('error');
                setMessage(`Error parsing CSV: ${err.message}`);
            }
        });
    };

    const handleProcess = async () => {
        if (data.length === 0) return;

        try {
            setStatus('uploading');
            setMessage('Uploading data to database...');
            await uploadDevelopers(data);

            setStatus('analyzing');
            setMessage('Running Machine Learning Analysis (K-Means & Isolation Forest)...');
            await runAnalysis();

            setStatus('success');
            setMessage('Analysis complete! Redirecting to Dashboard...');

            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (err) {
            console.error(err);
            setStatus('error');
            setMessage(err.response?.data?.error || err.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-12 animate-fade-in relative z-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse z-[-1]"></div>

            <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <UploadCloud className="text-secondary w-8 h-8" />
                    Upload Dataset
                </h2>
                <p className="text-muted mb-8 text-lg">Upload your developer activity CSV to begin analysis.</p>

                <div className="border-2 border-dashed border-slate-600 rounded-2xl p-12 text-center hover:border-secondary hover:bg-secondary/5 transition-all group relative overflow-hidden">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                        <div className="bg-slate-800 p-4 rounded-full mb-4 group-hover:scale-110 group-hover:bg-secondary/20 transition-all duration-300">
                            <FileText className={`w-10 h-10 ${file ? 'text-secondary' : 'text-slate-400'}`} />
                        </div>
                        <p className="text-xl font-semibold mb-2 text-text">
                            {file ? file.name : "Drag & Drop or Click to Upload"}
                        </p>
                        <p className="text-muted text-sm">Supports .csv files only</p>
                    </div>
                </div>

                {status !== 'idle' && (
                    <div className={`mt-8 p-5 rounded-xl border flex items-start gap-4 transition-all animate-slide-up ${status === 'error' ? 'bg-danger/10 border-danger/30 text-danger-200' :
                            status === 'success' ? 'bg-secondary/10 border-secondary/30 text-secondary-200' :
                                'bg-primary/10 border-primary/30 text-primary-200'
                        }`}>
                        {status === 'error' ? <AlertCircle className="w-6 h-6 mt-0.5 text-danger flex-shrink-0" /> :
                            status === 'success' ? <CheckCircle className="w-6 h-6 mt-0.5 text-secondary flex-shrink-0" /> :
                                <Loader2 className="w-6 h-6 mt-0.5 animate-spin flex-shrink-0 text-primary" />}
                        <div>
                            <p className="font-semibold">{message}</p>
                            {status === 'ready' && (
                                <button
                                    onClick={handleProcess}
                                    className="mt-4 bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
                                >
                                    Run Production Analysis
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Upload;
