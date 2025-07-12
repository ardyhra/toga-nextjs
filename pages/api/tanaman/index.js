// pages/api/tanaman/index.js
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export default async function handler(req, res) {
  const supabase = createSupabaseServerClient(req, res);

  // --- Cek Sesi Pengguna untuk Rute yang Dilindungi ---
  const { data: { session } } = await supabase.auth.getSession();

  // --- METHOD: GET (Publik) ---
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('tanaman')
      .select('*')
      .order('id', { ascending: true }); // Mengurutkan berdasarkan ID

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }

  // --- METHOD: POST (Dilindungi) ---
  if (req.method === 'POST') {
    // Jika tidak ada sesi/login, tolak akses
    if (!session) {
      return res.status(401).json({ error: 'Akses ditolak. Silakan login.' });
    }

    const { nama, namaLatin, deskripsiSingkat, manfaat, caraPengolahan, gambar } = req.body;
    
    // Validasi input sederhana
    if (!nama || !manfaat) {
        return res.status(400).json({ error: 'Nama dan Manfaat wajib diisi.' });
    }

    const { data, error } = await supabase
      .from('tanaman')
      .insert([{ nama, namaLatin, deskripsiSingkat, manfaat, caraPengolahan, gambar }])
      .select() // Mengembalikan data yang baru saja dimasukkan
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  }

  // Jika metode lain, tolak
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}