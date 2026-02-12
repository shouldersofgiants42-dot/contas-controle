
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://micbpccbpezwhunthpeh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-a3bN-sxhbO5TDOs8o01lw_s1BBm3nf';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
