import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-background flex flex-col font-sans">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/upload" element={<Upload />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
