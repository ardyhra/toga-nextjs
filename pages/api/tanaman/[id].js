// pages/api/tanaman/[id].js
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export default async function handler(req, res) {
  const supabase = createSupabaseServerClient(req, res);
  const { id } = req.query;

  // --- Cek Sesi Pengguna untuk Rute yang Dilindungi ---
  const { data: { session } } = await supabase.auth.getSession();

  // --- METHOD: GET (Publik) ---
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('tanaman')
      .select('*')
      .eq('id', id)
      .single(); // Mengharapkan satu hasil

    if (error) {
      return res.status(404).json({ error: 'Tanaman tidak ditemukan.' });
    }
    return res.status(200).json(data);
  }

  // --- METHOD: PUT (Dilindungi) ---
  if (req.method === 'PUT') {
    if (!session) {
      return res.status(401).json({ error: 'Akses ditolak. Silakan login.' });
    }

    const { nama, namaLatin, deskripsiSingkat, manfaat, caraPengolahan, gambar } = req.body;
    if (!nama || !manfaat) {
        return res.status(400).json({ error: 'Nama dan Manfaat wajib diisi.' });
    }

    const { data, error } = await supabase
      .from('tanaman')
      .update({ nama, namaLatin, deskripsiSingkat, manfaat, caraPengolahan, gambar })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }

  // --- METHOD: DELETE (Dilindungi) ---
  if (req.method === 'DELETE') {
    if (!session) {
      return res.status(401).json({ error: 'Akses ditolak. Silakan login.' });
    }

    const { error } = await supabase
      .from('tanaman')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ message: `Tanaman dengan ID ${id} berhasil dihapus.` });
  }

  // Jika metode lain, tolak
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}