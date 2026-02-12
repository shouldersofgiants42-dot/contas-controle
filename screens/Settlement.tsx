
import React from 'react';
import { MonthlyStats } from '../types';
import { formatCurrency } from '../utils/formatters';

interface SettlementProps {
  stats: MonthlyStats;
  onClear: () => void;
}

const Settlement: React.FC<SettlementProps> = ({ stats, onClear }) => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-1.5 pt-2">
        <h2 className="text-2xl font-[900] text-slate-800 tracking-tighter uppercase">Fechamento</h2>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Conciliação Mensal Mari & Trick</p>
      </div>

      <div className="bg-indigo-600 rounded-[40px] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden ring-8 ring-indigo-50">
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-white opacity-5 rounded-full blur-xl"></div>

        <div className="relative z-10 text-center space-y-3">
          <p className="text-[10px] uppercase font-black tracking-[0.25em] opacity-60">Acerto Trick → Mari</p>
          <h3 className="text-5xl font-black tracking-tighter">{formatCurrency(stats.trickToMari)}</h3>
          <div className="pt-4 flex justify-center">
             <div className="bg-black/10 backdrop-blur-md px-5 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-tight border border-white/5 shadow-inner">
               Rateio Casa: 2 Mari • 1 Trick
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[11px] font-[900] text-slate-400 uppercase tracking-widest px-2 opacity-60">Detalhamento do Débito</h4>
        
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter">Individuais Trick</span>
              <p className="text-[9px] text-slate-300 font-bold uppercase">Pagos integralmente pela Mari</p>
            </div>
            <span className="font-black text-slate-800 text-xl tracking-tight">{formatCurrency(stats.totalTrick)}</span>
          </div>
          <div className="h-px bg-slate-100/50"></div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter block">Quota Casa (33%)</span>
              <span className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">Base Casa: {formatCurrency(stats.totalCasa)}</span>
            </div>
            <span className="font-black text-slate-800 text-xl tracking-tight">{formatCurrency(stats.totalCasa / 3)}</span>
          </div>
        </div>

        <div className="bg-emerald-50/50 border-2 border-emerald-100/50 rounded-[32px] p-8 text-center space-y-6 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p className="text-[10px] font-[900] text-emerald-800 leading-relaxed uppercase tracking-tighter px-6 opacity-70">
            A liquidação encerra todas as pendências financeiras registradas neste período.
          </p>
          <button 
            onClick={onClear}
            className="w-full bg-emerald-600 text-white font-[900] py-6 rounded-[24px] shadow-xl shadow-emerald-100 active:scale-[0.98] transition-all text-xs uppercase tracking-[0.25em]"
          >
            Liquidar Agora
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settlement;
