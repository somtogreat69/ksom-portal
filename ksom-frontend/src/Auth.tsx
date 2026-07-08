import React, { useState } from 'react';
import { LogIn, UserPlus, Loader2, AlertCircle } from 'lucide-react';

interface AuthProps {
    onSuccess: (user: { name: string }) => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
        const payload = isLogin ? { email, password } : { full_name: fullName, email, password };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                onSuccess(data.user);
            } else {
                setError(data.message || 'Authentication failed.');
            }
        } catch (err) {
            console.error("🚨 THE REAL ERROR:", err);
            setError('Network error. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-[#171717] rounded-2xl shadow-2xl overflow-hidden border border-white/5">
            <div className="flex border-b border-white/5">
                <button 
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center space-x-2 transition-colors ${isLogin ? 'text-[#e3e3e3] border-b-2 border-[#e3e3e3] bg-white/5' : 'text-white/40 hover:text-white/70'}`}
                >
                    <LogIn className="w-4 h-4" /> <span>Sign In</span>
                </button>
                <button 
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center space-x-2 transition-colors ${!isLogin ? 'text-[#e3e3e3] border-b-2 border-[#e3e3e3] bg-white/5' : 'text-white/40 hover:text-white/70'}`}
                >
                    <UserPlus className="w-4 h-4" /> <span>Register</span>
                </button>
            </div>

            <div className="p-8">
                <h2 className="text-2xl font-extrabold text-[#e3e3e3] mb-6 text-center">
                    {isLogin ? 'Portal Access' : 'Create an Account'}
                </h2>

                {error && (
                    <div className="mb-6 flex items-start space-x-3 bg-red-950/40 border border-red-900/50 p-3 rounded-lg text-red-400 text-sm font-medium">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-semibold text-white/70 mb-1">Full Name</label>
                            <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/10 text-[#e3e3e3] placeholder-white/20 focus:outline-none focus:border-[#e3e3e3] transition-all"
                                placeholder="John Doe" />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-semibold text-white/70 mb-1">Email Address</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/10 text-[#e3e3e3] placeholder-white/20 focus:outline-none focus:border-[#e3e3e3] transition-all"
                            placeholder="student@ksom.edu" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-white/70 mb-1">Password</label>
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/10 text-[#e3e3e3] placeholder-white/20 focus:outline-none focus:border-[#e3e3e3] transition-all"
                            placeholder="••••••••" />
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-4 mt-2 rounded-xl font-bold text-lg text-[#0f0f0f] bg-[#e3e3e3] hover:bg-white focus:ring-4 focus:ring-white/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{isLogin ? 'Sign In' : 'Create Account'}</span>}
                    </button>
                </form>
            </div>
        </div>
    );
};