
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const PASSWORDS: Record<string, string> = {
  'mari': 'mari123',
  'trick': 'trick123'
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileSelect = (user: User) => {
    setSelectedProfile(user);
    setError(false);
    setPassword('');
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedProfile) return;

    setIsSubmitting(true);
    
    // Simulação de delay para UX
    await new Promise(resolve => setTimeout(resolve, 600));

    if (password === PASSWORDS[selectedProfile.id]) {
      onLogin(selectedProfile);
    } else {
      setError(true);
      setIsSubmitting(false);
      // Feedback visual temporário
      const timer = setTimeout(() => setError(false), 2000);
      return () => clearTimeout(timer);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-8 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-sm space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-3xl mx-auto flex items-center justify-center shadow-[0_20px_50px_rgba(79,70,229,0.3)] transform -rotate-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m17 19-5 3-5-3"/><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tighter">Finanças</h1>
            <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.4em]">Mari & Trick • Private</p>
          </div>
        </div>

        {!selectedProfile ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-6">Selecione seu acesso</p>
            
            <button 
              onClick={() => handleProfileSelect({ id: 'mari', name: 'Mariane', role: UserRole.ADMIN })}
              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 p-6 rounded-[2.5rem] flex items-center justify-between group transition-all active:scale-95 backdrop-blur-sm"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">M</div>
                <div className="text-left">
                  <span className="block text-white font-black text-xl">Mariane</span>
                  <span className="text-[10px] text-rose-400 font-black uppercase tracking-wider">Administradora</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white group-hover:bg-indigo-500 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </button>

            <button 
              onClick={() => handleProfileSelect({ id: 'trick', name: 'Trick', role: UserRole.USER })}
              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 p-6 rounded-[2.5rem] flex items-center justify-between group transition-all active:scale-95 backdrop-blur-sm"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">T</div>
                <div className="text-left">
                  <span className="block text-white font-black text-xl">Trick</span>
                  <span className="text-[10px] text-indigo-400 font-black uppercase tracking-wider">Usuário Padrão</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white group-hover:bg-indigo-500 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-4 mb-8">
              <button 
                type="button"
                onClick={() => setSelectedProfile(null)}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white ${selectedProfile.id === 'mari' ? 'bg-rose-500' : 'bg-indigo-500'}`}>
                  {selectedProfile.name[0]}
                </div>
                <span className="text-white font-bold text-sm">Acessar como {selectedProfile.name}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <input 
                  type="password"
                  autoFocus
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="Sua senha secreta"
                  className={`w-full bg-white/5 border ${error ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/10 group-hover:border-white/20'} p-6 rounded-[2rem] text-white text-center font-bold tracking-widest placeholder:tracking-normal placeholder:font-medium placeholder:text-slate-600 focus:bg-white/10 focus:border-indigo-500/50 transition-all outline-none`}
                />
                {error && (
                  <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-center mt-3 animate-bounce">Senha Incorreta</p>
                )}
              </div>

              <button 
                type="submit"
                disabled={!password || isSubmitting}
                className={`w-full p-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                  isSubmitting || !password 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20 active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Entrar agora</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest opacity-50">Sincronizado com Nuvem Supabase</p>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse delay-75"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
