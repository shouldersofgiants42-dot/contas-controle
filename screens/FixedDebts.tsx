
import React, { useState } from 'react';
import { Transaction, TransactionStatus, MonthlyStats } from '../types';
import { formatCurrency, getMonthYear } from '../utils/formatters';
import { COLORS, BANKS } from '../constants';

interface FixedDebtsProps {
  transactions: Transaction[];
  currentMonth: Date;
  onToggle: (id: string, bankId?: string) => void;
  onDelete: (id: string) => void;
  stats: MonthlyStats;
  onAddFixed: () => void;
}

const FixedDebts: React.FC<FixedDebtsProps> = ({ transactions, currentMonth, onToggle, onDelete, stats, onAddFixed }) => {
  const monthStr = getMonthYear(currentMonth);
  const fixed = transactions.filter(t => t.isFixed && getMonthYear(new Date(t.date)) === monthStr);
  const receivables = transactions.filter(t => t.receivableFrom && getMonthYear(new Date(t.date)) === monthStr);
  
  const [payingId, setPayingId] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="3" x2="21" y1="10" y2="10"/><line x1="7" x2="7" y1="22" y2="4"/><line x1="17" x2="17" y1="22" y2="4"/></svg>
        </div>
        <p className="text-[10px] font-bold opacity-50 uppercase tracking-[0.2em] mb-1">Restante a Pagar</p>
        <h2 className="text-4xl font-black tracking-tight">{formatCurrency(stats.fixedRemaining)}</h2>
        <button 
          onClick={onAddFixed}
          className="mt-6 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Nova Conta Fixa
        </button>
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Contas do Mês</h3>
          <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full uppercase">{fixed.length} Itens</span>
        </div>
        
        {fixed.length === 0 ? (
          <div className="py-12 bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-2"><path d="M11 15h2"/><path d="M12 9v11"/><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 3c-4.97 0-9 4.03-9 9 0 4.97 4.03 9 9 9 4.97 0 9-4.03 9-9 0-4.97-4.03-9-9-9Z"/></svg>
            <p className="text-xs font-bold uppercase tracking-widest">Sem contas recorrentes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fixed.map(t => (
              <div key={t.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border ${COLORS[t.responsible]}`}>
                  {t.responsible.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-black text-slate-800 truncate">{t.description}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Dia {new Date(t.date).getDate()}</span>
                    <span className="text-[10px] font-bold text-slate-300">•</span>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase">{t.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">{formatCurrency(t.installmentValue)}</p>
                  
                  {t.status === TransactionStatus.PENDENTE ? (
                    <button 
                      onClick={() => setPayingId(payingId === t.id ? null : t.id)}
                      className="text-[10px] font-black text-indigo-600 uppercase mt-1 bg-indigo-50 px-2 py-1 rounded-lg"
                    >
                      Pagar
                    </button>
                  ) : (
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Liquidado</span>
                    </div>
                  )}
                </div>

                {payingId === t.id && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-4 z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Pagar com qual banco?</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {BANKS.map(bank => (
                        <button 
                          key={bank.id}
                          onClick={() => {
                            onToggle(t.id, bank.id);
                            setPayingId(null);
                          }}
                          className={`px-3 py-2 rounded-xl text-[10px] font-black text-white ${bank.color} active:scale-90 transition-transform`}
                        >
                          {bank.name}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setPayingId(null)} className="mt-4 text-[10px] font-black text-slate-300 uppercase underline">Cancelar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">A Receber</h3>
        {receivables.length === 0 ? (
          <p className="text-center py-6 text-slate-400 text-[10px] font-bold uppercase italic">Nada a receber este mês</p>
        ) : (
          <div className="space-y-3">
            {receivables.map(t => (
              <div key={t.id} className="bg-emerald-50/50 p-5 rounded-3xl border border-emerald-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-emerald-900">{t.description}</h4>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">De: {t.receivableFrom}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-700">{formatCurrency(t.installmentValue)}</p>
                  <button 
                    onClick={() => onToggle(t.id)}
                    className={`text-[9px] font-black uppercase mt-1 px-2 py-1 rounded-lg ${t.status === TransactionStatus.PAGO ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'}`}
                  >
                    {t.status === TransactionStatus.PAGO ? 'Recebido' : 'Marcar Recebido'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default FixedDebts;
