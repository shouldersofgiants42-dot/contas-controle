
import React, { useState } from 'react';
import { BankBalance } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface ReconciliationProps {
  appBalance: number;
  bankBalance: BankBalance;
  onUpdateBankBalance: (value: number) => void;
  onAddAdjustment: (diff: number) => void;
}

const Reconciliation: React.FC<ReconciliationProps> = ({ appBalance, bankBalance, onUpdateBankBalance, onAddAdjustment }) => {
  const [inputValue, setInputValue] = useState('');
  const difference = bankBalance.current - appBalance;

  const handleUpdate = () => {
    const val = parseFloat(inputValue.replace(',', '.'));
    if (isNaN(val)) return;
    onUpdateBankBalance(val);
    setInputValue('');
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-slate-800">Conciliação Bancária</h2>
        <p className="text-sm text-slate-500 font-medium">Sincronize o app com seu saldo real</p>
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-[10px] uppercase font-bold opacity-60">Saldo em Carteira (App)</p>
          <span className="font-bold text-indigo-400">{formatCurrency(appBalance)}</span>
        </div>
        <div className="h-px bg-white/10"></div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px] uppercase font-bold opacity-60">Último Saldo Bancário</p>
            <p className="text-[10px] opacity-40 italic">{formatDate(bankBalance.lastUpdate)}</p>
          </div>
          <span className="text-2xl font-black text-white">{formatCurrency(bankBalance.current)}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Atualizar Saldo Bancário</label>
          <div className="flex gap-2">
            <input 
              type="text"
              inputMode="decimal"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-4 text-lg font-black text-slate-800"
              placeholder="0,00"
            />
            <button 
              onClick={handleUpdate}
              className="bg-indigo-600 text-white px-6 rounded-xl font-bold active:scale-95 transition-all"
            >
              OK
            </button>
          </div>
        </div>

        {Math.abs(difference) > 0.01 && (
          <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 text-white p-2 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div className="flex-1">
                <h4 className="text-amber-900 font-bold text-sm">Diferença Encontrada</h4>
                <p className="text-amber-700 text-xs font-medium mt-1">
                  Seu saldo no banco é <strong>{formatCurrency(Math.abs(difference))}</strong> {difference > 0 ? 'MAIOR' : 'MENOR'} que o registrado no app.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => onAddAdjustment(difference)}
              className="w-full bg-amber-600 text-white font-black py-4 rounded-xl shadow-lg shadow-amber-100 active:scale-95 transition-all"
            >
              CRIAR AJUSTE AUTOMÁTICO
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reconciliation;
