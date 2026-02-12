
import { createClient } from '@supabase/supabase-js';

// No deploy da Vercel, estas variáveis devem ser configuradas no painel administrativo.
// Caso não estejam definidas (ambiente local), usamos os valores padrão como fallback.
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://micbpccbpezwhunthpeh.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_-a3bN-sxhbO5TDOs8o01lw_s1BBm3nf';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
