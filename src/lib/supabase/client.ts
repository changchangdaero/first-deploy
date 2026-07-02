// Supabase 브라우저 클라이언트: 브라우저 컴포넌트에서 Supabase 조회가 필요할 때 쓰는 공개 클라이언트입니다.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
