
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency, getMonthYear } from '../utils/formatters';
import { MONTHS, COLORS } from '../constants';

interface ProjectionsProps {
  transactions: Transaction[];
  currentMonth: Date;
}

interface MonthProjection {
  monthKey: string;
  monthDate: Date;
  total: number;
  items: Transaction[];
}

const Projections: React.FC<ProjectionsProps> = ({ transactions, currentMonth }) => {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  const projections = useMemo(() => {
    const list: MonthProjection[] = [];
    for (let i = 0; i < 12; i++) {
      const targetDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + i, 1);
      const monthKey = getMonthYear(targetDate);
      
      const monthItems = transactions.filter(t => 
        getMonthYear(new Date(t.date)) === monthKey && 
        t.type === TransactionType.EXPENSE
      );

      if (monthItems.length > 0) {
        list.push({
          monthKey,
          monthDate: targetDate,
          total: monthItems.reduce((acc, t) => acc + t.installmentValue, 0),
          items: monthItems.sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate())
        });
      }
    }
    return list;
  }, [transactions, currentMonth]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center py-4">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Visão Mensal</h2>
        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-1">Gastos Previstos</p>
      </div>

      <div className="space-y-3">
        {projections.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100 shadow-sm">
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-relaxed">
               Nenhum gasto futuro detectado.
             </p>
          </div>
        ) : (
          projections.map((proj) => (
            <div key={proj.monthKey} className="overflow-hidden">
              <button
                onClick={() => setExpandedMonth(expandedMonth === proj.monthKey ? null : proj.monthKey)}
                className={`w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-300 ${
                  expandedMonth === proj.monthKey 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                    : 'bg-white border-slate-100 text-slate-800 shadow-sm'
                }`}
              >
                <div className="text-left">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 block ${expandedMonth === proj.monthKey ? 'text-indigo-400' : 'text-slate-400'}`}>
                    {MONTHS[proj.monthDate.getMonth()]} {proj.monthDate.getFullYear()}
                  </span>
                  <h5 className="text-2xl font-black tracking-tighter">{formatCurrency(proj.total)}</h5>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-500 ${expandedMonth === proj.monthKey ? 'rotate-180 bg-white/10' : 'bg-slate-50'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </button>

              <div 
                className={`grid transition-all duration-500 ease-in-out ${
                  expandedMonth === proj.monthKey ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden space-y-2">
                  {proj.items.map((item) => (
                    <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs border bg-white ${COLORS[item.responsible]}`}>
                            {item.responsible.charAt(0)}
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-800 truncate max-w-[150px]">{item.description}</p>
                            <div className="flex gap-3">
                              <span className="text-[9px] font-black text-slate-300 uppercase">Dia {new Date(item.date).getDate()}</span>
                              {item.totalInstallments > 0 && (
                                <span className="text-[9px] font-black text-orange-500 uppercase">{item.currentInstallment}/{item.totalInstallments}</span>
                              )}
                              {item.isFixed && (
                                <span className="text-[9px] font-black text-indigo-400 uppercase">{item.totalInstallments === 0 ? 'Recorrente' : 'Fixo'}</span>
                              )}
                            </div>
                         </div>
                      </div>
                      <span className="text-sm font-black text-slate-900">{formatCurrency(item.installmentValue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projections;
