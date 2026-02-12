
import React from 'react';
import { MonthlyStats, Transaction, Responsible, TransactionType, PaymentMethod } from '../types';
import { formatCurrency } from '../utils/formatters';
import { BANKS, COLORS } from '../constants';

interface AnalyticsProps {
  stats: MonthlyStats;
  transactions: Transaction[];
  currentMonth: Date;
  bankBalances: Record<string, number>;
}

const Analytics: React.FC<AnalyticsProps> = ({ stats, transactions, currentMonth, bankBalances }) => {
  return (
    <div className="space-y-8 pb-12">
      <div className="text-center py-2">
        <h2 className="text-2xl font-black text-slate-800">Controle Geral</h2>
        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-1">Fechamento Mensal</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Entradas</p>
          <h4 className="text-lg font-black text-emerald-500">{formatCurrency(stats.income)}</h4>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Saídas</p>
          <h4 className="text-lg font-black text-rose-500">{formatCurrency(stats.expenses)}</h4>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rateio Responsabilidade</h4>
            <div className="bg-indigo-50 px-2 py-0.5 rounded text-[8px] font-black text-indigo-600 uppercase">Proporção 2:1</div>
          </div>
          
          <div className="space-y-5">
            <div className="flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-black text-sm">B</div>
                <div>
                  <span className="text-sm font-black text-slate-800 block">Bryanne Total</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Indiv. + 66.6% Casa</span>
                </div>
              </div>
              <span className="font-black text-slate-900 text-lg">{formatCurrency(stats.bryanneTotal)}</span>
            </div>

            <div className="flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm">T</div>
                <div>
                  <span className="text-sm font-black text-slate-800 block">Trick Total</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Indiv. + 33.3% Casa</span>
                </div>
              </div>
              <span className="font-black text-slate-900 text-lg">{formatCurrency(stats.trickTotal)}</span>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-50 flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-black uppercase tracking-widest">Total Casa (Rateado)</span>
              <span className="text-sm font-bold">{formatCurrency(stats.casaTotal)}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100"></div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Métodos de Pagamento</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Via PIX</span>
              <span className="font-black text-slate-800">{formatCurrency(stats.pixTotal)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">Cartão</span>
              <span className="font-black text-slate-800">{formatCurrency(stats.cardTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-6 shadow-2xl">
        <h4 className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] px-1">Saldos Bancários</h4>
        <div className="grid grid-cols-1 gap-4">
          {BANKS.map(bank => (
            <div key={bank.id} className="bg-white/5 border border-white/5 p-4 rounded-3xl flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${bank.color} shadow-lg shadow-white/10`}></div>
                <span className="text-xs font-black uppercase opacity-70 tracking-widest">{bank.name}</span>
              </div>
              <p className="text-lg font-black tracking-tighter">{formatCurrency(bankBalances[bank.id] || 0)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
