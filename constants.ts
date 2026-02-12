
import { Responsible } from './types';

export const CATEGORIES = [
  'Alimentação',
  'Lazer',
  'Saúde',
  'Transporte',
  'Moradia',
  'Educação',
  'Assinaturas',
  'Ajuste',
  'Salário',
  'Outros'
];

export const BANKS = [
  { id: 'nubank', name: 'NuBank', color: 'bg-purple-600' },
  { id: 'inter', name: 'Inter', color: 'bg-orange-500' },
  { id: 'bradesco', name: 'Bradesco', color: 'bg-red-600' },
  { id: 'caixa', name: 'Caixa', color: 'bg-blue-600' }
];

export const COLORS = {
  [Responsible.BRYANNE]: 'bg-rose-100 text-rose-700 border-rose-200',
  [Responsible.TRICK]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  [Responsible.CASA]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
