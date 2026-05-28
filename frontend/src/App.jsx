import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import StudyRoom from './components/StudyRoom';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('userInfo')) || null);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' });
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? 'register' : 'login';
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-dark px-4">
        <form onSubmit={handleAuth} className="w-full max-w-md space-y-4 rounded-2xl bg-brand-panel p-8 shadow-xl border border-slate-700/50">
          <h2 className="text-3xl font-extrabold text-center tracking-tight bg-linear-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              className="w-full rounded-lg bg-slate-900 p-3 text-sm border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-lg bg-slate-900 p-3 text-sm border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg bg-slate-900 p-3 text-sm border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
            required
          />
          <button className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 transition-colors cursor-pointer">
            {isRegister ? 'Sign Up' : 'Sign In'}
          </button>
          <p className="text-center text-xs text-slate-400 cursor-pointer" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      {activeRoomId ? (
        <StudyRoom roomId={activeRoomId} user={user} leaveRoom={() => setActiveRoomId(null)} />
      ) : (
        <Dashboard user={user} selectRoom={setActiveRoomId} logout={() => { localStorage.clear(); setUser(null); }} />
      )}
    </div>
  );
}

export default App;