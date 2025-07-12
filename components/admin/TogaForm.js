// components/admin/TogaForm.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

export default function TogaForm() {
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = Boolean(id);
  const supabase = createSupabaseBrowserClient();

  const [formData, setFormData] = useState({
    nama: '',
    namaLatin: '',
    deskripsiSingkat: '',
    manfaat: '',
    caraPengolahan: '',
    gambar: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  // Jika mode edit, ambil data awal
  useEffect(() => {
    if (isEditMode) {
      const fetchTanamanData = async () => {
        const { data, error: fetchError } = await supabase
          .from('tanaman')
          .select('*')
          .eq('id', id)
          .single();
        
        if (fetchError) {
          setError('Gagal memuat data tanaman untuk diedit.');
        } else {
          setFormData(data);
        }
        setInitialLoading(false);
      };
      fetchTanamanData();
    }
  }, [id, isEditMode, supabase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validasi ukuran file (misal: 1MB)
      if (file.size > 1 * 1024 * 1024) {
          setError('Ukuran file tidak boleh melebihi 1 MB.');
          e.target.value = null; // Reset input file
          return;
      }
      setImageFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let imageUrl = formData.gambar;

    if (imageFile) {
      const fileName = `${Date.now()}_${imageFile.name.replace(/\s/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gambar-tanaman')
        .upload(fileName, imageFile, { upsert: isEditMode }); // Gunakan upsert jika mungkin perlu menimpa

      if (uploadError) {
        setError(`Gagal mengunggah gambar: ${uploadError.message}`);
        setLoading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('gambar-tanaman').getPublicUrl(fileName);
      imageUrl = publicUrl;
    }

    const finalData = { ...formData, gambar: imageUrl };

    const apiUrl = isEditMode ? `/api/tanaman/${id}` : '/api/tanaman';
    const apiMethod = isEditMode ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(apiUrl, {
        method: apiMethod,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Terjadi kesalahan saat menyimpan data.');
      }
      router.push('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <p>Memuat data form...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <h2>{isEditMode ? 'Edit Tanaman' : 'Tambah Tanaman Baru'}</h2>
      {error && <p className="alert-danger">{error}</p>}
      
      <div className="form-group">
        <label htmlFor="nama">Nama Tanaman</label>
        <input type="text" id="nama" name="nama" value={formData.nama} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="namaLatin">Nama Latin</label>
        <input type="text" id="namaLatin" name="namaLatin" value={formData.namaLatin} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="deskripsiSingkat">Deskripsi Singkat</label>
        <textarea id="deskripsiSingkat" name="deskripsiSingkat" rows="3" value={formData.deskripsiSingkat} onChange={handleChange} required></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="manfaat">Manfaat & Khasiat</label>
        <textarea id="manfaat" name="manfaat" rows="5" value={formData.manfaat} onChange={handleChange} required></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="caraPengolahan">Cara Pengolahan</label>
        <textarea id="caraPengolahan" name="caraPengolahan" rows="5" value={formData.caraPengolahan} onChange={handleChange} required></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="gambar">Gambar (Maks. 1 MB)</label>
        {formData.gambar && !imageFile && (
          <div style={{ marginBottom: '10px' }}>
            <p>Gambar saat ini:</p>
            <img src={formData.gambar} alt="Gambar saat ini" className="form-current-img"/>
          </div>
        )}
        <input type="file" id="gambar-input" name="gambar" accept="image/*" onChange={handleImageChange} />
      </div>

      <div className="form-actions">
        <Link href="/admin" className="btn-cancel">Batal</Link>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}