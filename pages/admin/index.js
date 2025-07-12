// pages/admin/index.js
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [tanamanList, setTanamanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTanaman = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tanaman');
      if (!res.ok) throw new Error('Gagal mengambil data');
      const data = await res.json();
      setTanamanList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTanaman();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus tanaman ini?')) {
      try {
        const res = await fetch(`/api/tanaman/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Gagal menghapus data');
        // Refresh data setelah berhasil dihapus
        fetchTanaman(); 
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-actions">
        <h2>Manajemen Tanaman Obat</h2>
        <Link href="/admin/form" className="btn-add">
          Tambah Tanaman Baru
        </Link>
      </div>

      {error && <p className="alert-danger">{error}</p>}
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Gambar</th>
              <th>Nama</th>
              <th>Nama Latin</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">Memuat data...</td></tr>
            ) : (
              tanamanList.map(tanaman => (
                <tr key={tanaman.id}>
                  <td>{tanaman.id}</td>
                  <td>
                    <img 
                      src={tanaman.gambar || '/placeholder.png'} 
                      alt={tanaman.nama} 
                      className="table-img"
                    />
                  </td>
                  <td>{tanaman.nama}</td>
                  <td>{tanaman.namaLatin}</td>
                  <td>
                    <div className="action-buttons">
                      <Link href={`/admin/form?id=${tanaman.id}`} className="btn-edit">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(tanaman.id)} className="btn-delete">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}