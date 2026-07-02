// Supabase 서버 클라이언트: 서버 컴포넌트와 라우트 핸들러에서 쓰는 공개 anon-key 클라이언트입니다.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
