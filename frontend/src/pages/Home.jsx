import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Code, Cpu, ShieldAlert, ArrowRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-fade-in relative z-10">

            {/* Background decorations */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse z-[-1]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse delay-1000 z-[-1]"></div>

            <div className="space-y-6 max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-slide-up">
                    Developer Productivity Pattern Analyzer
                </h1>
                <p className="text-xl text-muted leading-relaxed max-w-2xl mx-auto animate-slide-up delay-150">
                    Move beyond raw lines of code. Leverage Machine Learning to identify true work patterns, classify productivity types, and detect anomalous behavior.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4 animate-slide-up delay-300">
                <FeatureCard
                    icon={<Code className="w-8 h-8 text-primary" />}
                    title="Pattern Recognition"
                    description="Identify Developer Types: Rapid Coder, Deep Worker, Refactor Specialist, and more."
                />
                <FeatureCard
                    icon={<ShieldAlert className="w-8 h-8 text-danger" />}
                    title="Anomaly Detection"
                    description="Automatically spot unusual commit spikes or dead periods using Isolation Forests."
                />
                <FeatureCard
                    icon={<Cpu className="w-8 h-8 text-accent" />}
                    title="Data-Driven Insights"
                    description="Utilize K-Means clustering for robust, bias-free categorization."
                />
            </div>

            <div className="pt-8 animate-slide-up delay-500">
                <Link
                    to="/upload"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-primary rounded-full overflow-hidden transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]"
                >
                    <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                    <span className="relative flex items-center gap-2">
                        Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                </Link>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-surface/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
        <div className="bg-white/5 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-text mb-3">{title}</h3>
        <p className="text-muted leading-relaxed">{description}</p>
    </div>
);

export default Home;
