
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, Responsible, TransactionStatus, TransactionType, MonthlyStats, PaymentMethod, User, UserRole } from './types';
import { formatCurrency, getMonthYear } from './utils/formatters';
import { BANKS } from './constants';
import { supabase } from './lib/supabase';
import Dashboard from './screens/Dashboard';
import AddTransaction from './screens/AddTransaction';
import FixedDebts from './screens/FixedDebts';
import Analytics from './screens/Analytics';
import Projections from './screens/Projections';
import Settlement from './screens/Settlement';
import Reconciliation from './screens/Reconciliation';
import Login from './screens/Login';

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" x2="12" y1="12" y2="12"/><line x1="3" x2="18" y1="18" y2="18"/></svg>
);
const PieIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
);
const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M12 12h.01"/><path d="M16 5v14"/></svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
);

enum Tab {
  HOME,
  FIXED,
  ANALYTICS,
  PROJECTIONS,
  ADD,
  SETTLEMENT,
  RECONCILIATION
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('finance_user_session');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankBalances, setBankBalances] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    BANKS.forEach(b => initial[b.id] = 0);
    return initial;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.HOME);
  const [currentViewMonth, setCurrentViewMonth] = useState(new Date());

  useEffect(() => {
    if (user) {
      localStorage.setItem('finance_user_session', JSON.stringify(user));
      loadData();
      const channel = supabase.channel('db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => loadData())
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  async function loadData() {
    try {
      const { data: transData, error: transError } = await supabase.from('transactions').select('*');
      if (transError) throw transError;
      const { data: balanceData } = await supabase.from('bank_balances').select('*');
      if (transData) setTransactions(transData);
      if (balanceData) {
        const balances: Record<string, number> = {};
        BANKS.forEach(b => balances[b.id] = 0);
        balanceData.forEach(row => { balances[row.id] = row.balance; });
        setBankBalances(balances);
      }
      setDbError(null);
    } catch (err: any) {
      console.error('Erro Supabase:', err);
      setDbError("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredTransactions = useMemo(() => {
    if (!user) return [];
    if (user.role === UserRole.ADMIN) return transactions;
    return transactions.filter(t => t.responsible === Responsible.TRICK || t.responsible === Responsible.CASA);
  }, [transactions, user]);

  const stats = useMemo<MonthlyStats>(() => {
    const currentMonthStr = getMonthYear(currentViewMonth);
    const monthTransactions = filteredTransactions.filter(t => getMonthYear(new Date(t.date)) === currentMonthStr);
    let income = 0, bInd = 0, tInd = 0, casaTotal = 0, fixedRemaining = 0, pixTotal = 0, cardTotal = 0;

    monthTransactions.forEach(t => {
      const val = t.installmentValue;
      if (t.type === TransactionType.INCOME) {
        income += val;
      } else {
        if (t.paymentMethod === PaymentMethod.PIX) pixTotal += val;
        if (t.paymentMethod === PaymentMethod.CARD) cardTotal += val;
        
        if (t.responsible === Responsible.BRYANNE) bInd += val;
        if (t.responsible === Responsible.TRICK) tInd += val;
        if (t.responsible === Responsible.CASA) casaTotal += val;
        
        if (t.isFixed && t.status === TransactionStatus.PENDENTE) {
          if (user?.role === UserRole.ADMIN) {
             if (t.responsible === Responsible.BRYANNE || t.responsible === Responsible.CASA) fixedRemaining += val;
          } else {
             if (t.responsible === Responsible.TRICK || t.responsible === Responsible.CASA) fixedRemaining += val;
          }
        }
      }
    });

    const bryanneShare = bInd + (casaTotal * (2/3));
    const trickShare = tInd + (casaTotal * (1/3));
    const relevantExpenses = user?.role === UserRole.ADMIN ? bryanneShare : trickShare;

    return {
      income, expenses: relevantExpenses, netResult: income - relevantExpenses,
      pixTotal, cardTotal, bryanneTotal: bryanneShare, trickTotal: trickShare,
      casaTotal, fixedRemaining, totalTrick: tInd, totalCasa: casaTotal,
      trickToMari: tInd + (casaTotal * (1/3))
    };
  }, [filteredTransactions, currentViewMonth, user]);

  const addTransaction = async (data: Omit<Transaction, 'id'>) => {
    if (!user) return;
    try {
      const isFixedRecurring = data.isFixed && data.isRecurring;
      const repeatCount = isFixedRecurring ? 24 : data.totalInstallments;
      const groupId = repeatCount > 1 ? crypto.randomUUID() : null;
      const items = [];
      for (let i = 0; i < repeatCount; i++) {
        const date = new Date(data.date);
        date.setMonth(date.getMonth() + i);
        let idealPaymentDate = null;
        if (data.idealPaymentDate) {
          const idDate = new Date(data.idealPaymentDate);
          idDate.setMonth(idDate.getMonth() + i);
          idealPaymentDate = idDate.toISOString();
        }
        items.push({ 
          date: date.toISOString(), idealPaymentDate: idealPaymentDate,
          description: data.description, totalValue: data.totalValue,
          installmentValue: data.installmentValue, currentInstallment: isFixedRecurring ? 0 : i + 1, 
          totalInstallments: isFixedRecurring ? 0 : data.totalInstallments,
          category: data.category, responsible: data.responsible,
          status: data.status, type: data.type, paymentMethod: data.paymentMethod,
          bankId: data.bankId || 'none', isFixed: data.isFixed || false,
          isRecurring: data.isRecurring || false, receivableFrom: data.receivableFrom || null,
          groupId: groupId
        });
      }
      const { error } = await supabase.from('transactions').insert(items);
      if (error) throw error;
      await loadData();
      setCurrentTab(Tab.HOME);
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    }
  };

  const handleManualBalanceUpdate = async (bankId: string, newValue: number) => {
    try {
      await supabase.from('bank_balances').upsert({ id: bankId, balance: newValue });
      await loadData();
    } catch (err) { console.error(err); }
  };

  const toggleStatus = async (id: string, bankId?: string) => {
    try {
      const t = transactions.find(x => x.id === id);
      if (!t) return;
      const newStatus = t.status === TransactionStatus.PENDENTE ? TransactionStatus.PAGO : TransactionStatus.PENDENTE;
      const { error } = await supabase.from('transactions').update({ status: newStatus, bankId: bankId || 'none' }).eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (err) { console.error(err); }
  };

  const deleteTransaction = async (id: string) => {
    if (!window.confirm("Excluir?")) return;
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (err) { console.error(err); }
  };

  if (!user) return <Login onLogin={setUser} />;
  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;

  const isAdmin = user.role === UserRole.ADMIN;
  const totalAppBalance = Object.values(bankBalances).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-slate-50 relative overflow-hidden">
      {dbError && <div className="fixed top-0 left-0 right-0 bg-rose-600 text-white text-[10px] font-black uppercase text-center py-2 z-[60]">{dbError}</div>}

      <header className="px-6 pt-4 pb-3 sticky top-0 glass z-40 border-b border-slate-100/50 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white shadow-lg ${isAdmin ? 'bg-rose-500' : 'bg-indigo-600'}`}>{user.name[0]}</div>
          <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Membro</p><h1 className="text-sm font-extrabold text-slate-900 leading-none">{user.name}</h1></div>
        </div>
        <div className="flex gap-2">
           {isAdmin && (
             <>
               <button onClick={() => setCurrentTab(Tab.RECONCILIATION)} className={`p-2.5 rounded-xl transition-all ${currentTab === Tab.RECONCILIATION ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}><WalletIcon /></button>
               <button onClick={() => setCurrentTab(Tab.SETTLEMENT)} className={`p-2.5 rounded-xl transition-all ${currentTab === Tab.SETTLEMENT ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-50 text-indigo-500'}`}><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></button>
             </>
           )}
           <button onClick={() => { localStorage.removeItem('finance_user_session'); setUser(null); }} className="p-2.5 bg-slate-100 text-slate-500 rounded-xl"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg></button>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 overflow-y-auto hide-scrollbar pb-32">
        {currentTab === Tab.HOME && <Dashboard stats={stats} transactions={filteredTransactions} currentMonth={currentViewMonth} onMonthChange={setCurrentViewMonth} onToggle={toggleStatus} onDelete={deleteTransaction} />}
        {currentTab === Tab.FIXED && isAdmin && <FixedDebts transactions={filteredTransactions} currentMonth={currentViewMonth} onToggle={toggleStatus} onDelete={deleteTransaction} stats={stats} onAddFixed={() => setCurrentTab(Tab.ADD)} />}
        {currentTab === Tab.ANALYTICS && isAdmin && <Analytics stats={stats} transactions={filteredTransactions} currentMonth={currentViewMonth} bankBalances={bankBalances} />}
        {currentTab === Tab.PROJECTIONS && isAdmin && <Projections transactions={filteredTransactions} currentMonth={currentViewMonth} />}
        {currentTab === Tab.SETTLEMENT && isAdmin && <Settlement stats={stats} onClear={() => {}} />}
        {currentTab === Tab.RECONCILIATION && isAdmin && <Reconciliation appBalance={totalAppBalance} bankBalance={{ current: bankBalances['nubank'] || 0, lastUpdate: new Date().toISOString() }} onUpdateBankBalance={(val) => handleManualBalanceUpdate('nubank', val)} onAddAdjustment={() => {}} />}
        {currentTab === Tab.ADD && <AddTransaction userRole={user.role} onSave={addTransaction} onCancel={() => setCurrentTab(Tab.HOME)} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass border-t border-slate-100/50 flex justify-around items-center h-[76px] safe-bottom z-50 px-2 rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
        <button onClick={() => setCurrentTab(Tab.HOME)} className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${currentTab === Tab.HOME ? 'text-indigo-600 scale-110' : 'text-slate-300'}`}><HomeIcon /><span className="text-[9px] font-black uppercase tracking-widest">Início</span></button>
        {isAdmin && <button onClick={() => setCurrentTab(Tab.FIXED)} className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${currentTab === Tab.FIXED ? 'text-indigo-600 scale-110' : 'text-slate-300'}`}><ListIcon /><span className="text-[9px] font-black uppercase tracking-widest">Dívidas</span></button>}
        <button onClick={() => setCurrentTab(Tab.ADD)} className="flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-[22px] shadow-2xl shadow-indigo-200 -translate-y-6 active:scale-90 transition-all mx-2 ring-4 ring-white"><PlusIcon /></button>
        {isAdmin && <button onClick={() => setCurrentTab(Tab.ANALYTICS)} className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${currentTab === Tab.ANALYTICS ? 'text-indigo-600 scale-110' : 'text-slate-300'}`}><PieIcon /><span className="text-[9px] font-black uppercase tracking-widest">Geral</span></button>}
        {isAdmin && <button onClick={() => setCurrentTab(Tab.PROJECTIONS)} className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all ${currentTab === Tab.PROJECTIONS ? 'text-indigo-600 scale-110' : 'text-slate-300'}`}><CalendarIcon /><span className="text-[9px] font-black uppercase tracking-widest">Futuro</span></button>}
      </nav>
    </div>
  );
};

export default App;
