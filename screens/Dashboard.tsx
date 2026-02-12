
import React from 'react';
import { Transaction, MonthlyStats, TransactionType } from '../types';
import { formatCurrency, getMonthYear, formatDate } from '../utils/formatters';
import { MONTHS, COLORS } from '../constants';

interface DashboardProps {
  stats: MonthlyStats;
  transactions: Transaction[];
  currentMonth: Date;
  onMonthChange: (d: Date) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, transactions, currentMonth, onMonthChange, onDelete }) => {
  const monthStr = getMonthYear(currentMonth);
  const recent = transactions
    .filter(t => getMonthYear(new Date(t.date)) === monthStr)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 15);

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded-2xl border border-slate-100 shadow-sm">
        <button onClick={() => {
          const newDate = new Date(currentMonth);
          newDate.setMonth(newDate.getMonth() - 1);
          onMonthChange(newDate);
        }} className="p-3 text-slate-400 active:bg-slate-50 rounded-xl transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <span className="font-black text-slate-800 uppercase tracking-[0.15em] text-[11px]">{MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
        <button onClick={() => {
          const newDate = new Date(currentMonth);
          newDate.setMonth(newDate.getMonth() + 1);
          onMonthChange(newDate);
        }} className="p-3 text-slate-400 active:bg-slate-50 rounded-xl transition-all"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[32px] shadow-2xl shadow-slate-200 space-y-5">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resultado Líquido</span>
            <span className={`text-3xl font-black tracking-tighter ${stats.netResult >= 0 ? 'text-indigo-400' : 'text-rose-400'}`}>
              {formatCurrency(stats.netResult)}
            </span>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-full border border-white/5">
             <span className="text-[9px] font-black text-white/60 uppercase tracking-tighter">Sua Quota</span>
          </div>
        </div>
        <div className="h-px bg-white/5"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider block">Receita Total</span>
            <span className="text-lg font-black text-white tracking-tight">{formatCurrency(stats.income)}</span>
          </div>
          <div className="space-y-0.5 text-right">
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider block">Suas Saídas</span>
            <span className="text-lg font-black text-rose-400 tracking-tight">{formatCurrency(stats.expenses)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Movimentações Recentes</h3>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded-full">{recent.length} Itens</span>
        </div>
        
        {recent.length === 0 ? (
          <div className="bg-white p-12 rounded-[28px] border border-dashed border-slate-200 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" className="mb-2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">Vazio este mês</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recent.map(t => (
              <div key={t.id} className="bg-white p-4 rounded-[24px] border border-slate-100/50 flex items-center gap-3 shadow-sm active:bg-slate-50 active:scale-[0.98] transition-all">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-[11px] border-2 shadow-sm ${COLORS[t.responsible]}`}>
                  {t.responsible.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-black text-slate-800 truncate leading-tight">{t.description}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                    {formatDate(t.date)} • {t.category}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-[14px] font-black tracking-tight ${t.type === TransactionType.INCOME ? 'text-emerald-500' : 'text-slate-900'}`}>
                    {t.type === TransactionType.INCOME ? '+' : ''}{formatCurrency(t.installmentValue)}
                  </span>
                  <button onClick={() => onDelete(t.id)} className="block text-[8px] font-black text-slate-200 hover:text-rose-400 uppercase mt-1.5 ml-auto tracking-widest">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
