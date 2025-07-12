// lib/supabaseServer.js
import { createServerClient } from '@supabase/auth-helpers-nextjs';

// Fungsi ini membuat klien Supabase yang sudah terotentikasi di sisi server
// dengan mengambil cookie dari request yang masuk.
export const createSupabaseServerClient = (req, res) => {
  return createServerClient(
    { req, res },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  );
};