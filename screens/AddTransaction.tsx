
import React, { useState, useRef, useEffect } from 'react';
import { Responsible, TransactionType, PaymentMethod, Transaction, TransactionStatus, UserRole } from '../types';
import { CATEGORIES, COLORS } from '../constants';

interface AddTransactionProps {
  userRole: UserRole;
  onSave: (data: Omit<Transaction, 'id'>) => Promise<void>;
  onCancel: () => void;
}

enum EntryMode {
  GASTO = 'Gasto',
  FIXO = 'Fixo',
  RECEITA = 'Receita'
}

const AddTransaction: React.FC<AddTransactionProps> = ({ userRole, onSave, onCancel }) => {
  const [mode, setMode] = useState<EntryMode>(EntryMode.GASTO);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('0,00'); 
  const [responsible, setResponsible] = useState<Responsible>(
    userRole === UserRole.USER ? Responsible.TRICK : Responsible.CASA
  );
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [dueDay, setDueDay] = useState('10');
  const [idealDay, setIdealDay] = useState('05');
  const [isRecurring, setIsRecurring] = useState(true);
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.PIX);
  const [installments, setInstallments] = useState('1');
  
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { 
    const timer = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(timer);
  }, [mode]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\D/g, ''); 
    if (!rawValue) {
      setValue('0,00');
      return;
    }
    const numericValue = parseInt(rawValue, 10) / 100;
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
    setValue(formatted);
    setErrors(prev => prev.filter(f => f !== 'value'));
  };

  const handleSave = async () => {
    const rawValue = parseFloat(value.replace(/\./g, '').replace(',', '.'));
    if (isNaN(rawValue) || rawValue <= 0) {
      setErrors(['value']);
      return;
    }
    if (!description.trim()) {
      setErrors(['description']);
      return;
    }

    setIsSaving(true);
    const isIncome = mode === EntryMode.RECEITA;
    const isFixed = mode === EntryMode.FIXO;

    let finalDate = date;
    let finalIdealDate = undefined;

    if (isFixed) {
      const today = new Date();
      const d = new Date(today.getFullYear(), today.getMonth(), parseInt(dueDay));
      const i = new Date(today.getFullYear(), today.getMonth(), parseInt(idealDay));
      finalDate = d.toISOString();
      finalIdealDate = i.toISOString();
    } else {
       finalIdealDate = new Date(date).toISOString();
    }

    const nInstallments = parseInt(installments);
    const totalInstallments = isIncome ? 1 : (isFixed ? (isRecurring ? 1 : nInstallments) : (paymentMethod === PaymentMethod.CARD ? nInstallments : 1));
    const totalValue = rawValue * totalInstallments;

    try {
      await onSave({
        date: finalDate, idealPaymentDate: finalIdealDate,
        description, totalValue: totalValue, installmentValue: rawValue,
        currentInstallment: 1, totalInstallments: totalInstallments,
        category: isIncome ? 'Salário' : category,
        responsible: isIncome ? Responsible.CASA : responsible,
        status: TransactionStatus.PENDENTE, type: isIncome ? TransactionType.INCOME : TransactionType.EXPENSE,
        paymentMethod: isFixed ? PaymentMethod.PIX : paymentMethod,
        bankId: 'none', isFixed: isFixed, isRecurring: isFixed && isRecurring
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-10 duration-500 max-w-sm mx-auto">
      <div className="flex justify-between items-center px-1 pt-2">
        <h2 className="text-3xl font-[900] text-slate-800 tracking-tighter">Lançamento</h2>
        <button onClick={onCancel} className="bg-slate-100 text-slate-400 p-3 rounded-2xl active:scale-90 transition-all">
           <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      <div className="flex p-1.5 bg-slate-200/40 rounded-2xl gap-1">
        {[EntryMode.GASTO, EntryMode.FIXO, EntryMode.RECEITA].filter(m => userRole === UserRole.ADMIN || m === EntryMode.GASTO).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
              mode === m ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 opacity-60'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className={`bg-white rounded-[32px] p-10 text-center border-2 shadow-xl shadow-slate-200/50 transition-all ${errors.includes('value') ? 'border-rose-400 bg-rose-50/50' : 'border-slate-50'}`}>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 opacity-60">
          {mode === EntryMode.FIXO ? 'Custo Mensal' : 'Total do Gasto'}
        </span>
        <div className="flex items-center justify-center gap-1.5">
           <span className="text-3xl font-black text-slate-300">R$</span>
           <input 
            ref={inputRef} type="text" inputMode="decimal"
            value={value} onChange={handleValueChange}
            className="bg-transparent text-6xl font-black text-slate-800 w-full max-w-[220px] text-center outline-none tracking-tighter"
            placeholder="0,00"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Descrição do Lançamento</label>
          <input 
            type="text" value={description} onChange={e => setDescription(e.target.value)}
            className={`w-full bg-white border-2 rounded-[22px] p-5 text-base font-bold shadow-sm focus:border-indigo-500 transition-all ${errors.includes('description') ? 'border-rose-300 bg-rose-50/30' : 'border-slate-100'}`}
            placeholder="Ex: Supermercado Semanal..."
          />
        </div>

        {mode !== EntryMode.RECEITA && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Responsável</label>
              <div className="flex gap-2.5">
                {[Responsible.BRYANNE, Responsible.TRICK, Responsible.CASA].map(r => (
                  <button key={r} onClick={() => setResponsible(r)} className={`flex-1 py-4.5 py-4 rounded-[18px] border-2 text-[10px] font-[900] uppercase tracking-wider transition-all shadow-sm ${responsible === r ? COLORS[r] + ' border-current scale-105' : 'bg-white text-slate-300 border-slate-50 opacity-40'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {mode === EntryMode.GASTO ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Método</label>
                    <div className="flex p-1.5 bg-slate-100/60 rounded-[20px] h-[64px] border border-slate-200/50">
                      <button onClick={() => setPaymentMethod(PaymentMethod.PIX)} className={`flex-1 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === PaymentMethod.PIX ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>PIX</button>
                      <button onClick={() => setPaymentMethod(PaymentMethod.CARD)} className={`flex-1 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === PaymentMethod.CARD ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Card</button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Categoria</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full h-[64px] bg-white border-2 border-slate-100 rounded-[20px] px-5 text-sm font-bold appearance-none shadow-sm focus:border-indigo-400 transition-all">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                {paymentMethod === PaymentMethod.CARD && (
                  <div className="bg-indigo-600/5 p-6 rounded-[28px] border border-indigo-100 space-y-4 shadow-inner">
                    <div className="flex justify-between items-center"><span className="text-[11px] font-black text-indigo-900 uppercase tracking-widest">Parcelamento</span><span className="text-sm font-black text-indigo-600 bg-white px-3 py-1 rounded-full shadow-sm">{installments}x</span></div>
                    <input type="range" min="1" max="24" value={installments} onChange={e => setInstallments(e.target.value)} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>
                )}
                <div className="space-y-3"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Data da Transação</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-white border-2 border-slate-50 rounded-[22px] p-5 text-base font-bold shadow-sm focus:border-indigo-400 transition-all" />
                </div>
              </>
            ) : (
              <div className="space-y-6 bg-slate-900/5 p-7 rounded-[32px] border border-slate-200/50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 text-center block">Vencimento</label>
                    <input type="number" min="1" max="31" value={dueDay} onChange={e => setDueDay(e.target.value)} className="w-full bg-white border-2 border-slate-100 rounded-[20px] p-5 text-center text-lg font-[900] shadow-sm" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 text-center block">Dia Ideal</label>
                    <input type="number" min="1" max="31" value={idealDay} onChange={e => setIdealDay(e.target.value)} className="w-full bg-white border-2 border-slate-100 rounded-[20px] p-5 text-center text-lg font-[900] shadow-sm" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Duração do Compromisso</label>
                  <div className="flex p-1.5 bg-white border border-slate-200/60 rounded-[22px]">
                    <button onClick={() => setIsRecurring(true)} className={`flex-1 py-3.5 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all ${isRecurring ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>Contínuo</button>
                    <button onClick={() => setIsRecurring(false)} className={`flex-1 py-3.5 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all ${!isRecurring ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400'}`}>Finito</button>
                  </div>
                </div>
                {!isRecurring && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center"><span className="text-[11px] font-black text-indigo-900 uppercase">Qtd Meses</span><span className="text-sm font-black text-indigo-600 bg-white px-3 py-1 rounded-full shadow-sm">{installments}x</span></div>
                    <input type="range" min="2" max="48" value={installments} onChange={e => setInstallments(e.target.value)} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <button onClick={handleSave} disabled={isSaving} className="w-full text-white font-[900] py-6 rounded-[28px] bg-indigo-600 shadow-2xl shadow-indigo-200 active:scale-95 active:shadow-indigo-100 transition-all text-[13px] uppercase tracking-[0.2em] mt-4 flex items-center justify-center gap-3">
          {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
            <>
              Confirmar Lançamento
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddTransaction;
