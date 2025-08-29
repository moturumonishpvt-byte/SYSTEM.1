import React, { useState } from 'react';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'Monish' && password === 'Monish@07') {
            onLoginSuccess();
        } else {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="min-h-screen bg-system-black flex items-center justify-center font-sans text-white">
            <div className="system-panel w-full max-w-md">
                <div className="text-center border-b-2 border-system-blue/30 pb-4 mb-6">
                    <div className="system-header-box mb-2">
                        <h2 className="text-2xl font-display goal-text-style">SYSTEM LOGIN</h2>
                    </div>
                    <h1 className="text-4xl font-display goal-text-style animate-pulse">S.Y.S.T.E.M</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2" htmlFor="username">
                            USERNAME
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-system-gray p-3 rounded border border-system-purple/50 focus:outline-none focus:ring-2 focus:ring-system-purple font-sans"
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2" htmlFor="password">
                            PASSWORD
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-system-gray p-3 rounded border border-system-purple/50 focus:outline-none focus:ring-2 focus:ring-system-purple font-sans"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-center p-2 border border-system-red/50 bg-red-900/20 rounded-lg">
                            <p className="text-system-red">{error}</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg font-display text-xl transition-all duration-300 bg-system-blue text-black hover:bg-system-blue-light hover:shadow-glow-blue"
                        >
                            ACCESS
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;