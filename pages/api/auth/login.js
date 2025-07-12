// pages/api/auth/login.js
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const supabase = createSupabaseServerClient(req, res);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password dibutuhkan.' });
  }

  // Gunakan Supabase Auth untuk login
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    // Memberikan pesan error yang lebih umum untuk keamanan
    return res.status(401).json({ error: 'Email atau password salah.' });
  }

  return res.status(200).json({ user: data.user, message: 'Login berhasil!' });
}