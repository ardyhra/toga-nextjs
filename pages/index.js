// pages/index.js
import { useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import Layout from '../components/Layout';
import TogaCard from '../components/TogaCard';
import QRScanner from '../components/QRScanner';

export default function Home({ initialTanaman }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Gunakan useMemo untuk efisiensi, agar filtering & sorting tidak berjalan di setiap render
  const filteredAndSortedData = useMemo(() => {
    return initialTanaman
      .filter(t => t.nama.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.nama.localeCompare(b.nama);
        } else {
          return b.nama.localeCompare(a.nama);
        }
      });
  }, [initialTanaman, searchTerm, sortOrder]);

  // Kalkulasi untuk pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Layout>
      <section className="hero">
        <h2>Ensiklopedia Tanaman Obat Keluarga</h2>
        <p>Temukan manfaat dan cara pengolahan TOGA di sekitar Anda.</p>
      </section>

      <section className="search-container">
        <input
          type="text"
          id="search-input"
          placeholder="Cari nama tanaman, contoh: Jahe..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset ke halaman pertama saat mencari
          }}
        />
      </section>

      <QRScanner />

      <section className="controls-container">
        <div className="sort-container">
          <label>Urutkan:</label>
          <button onClick={() => setSortOrder('asc')} className={`sort-btn ${sortOrder === 'asc' ? 'active' : ''}`}>A-Z</button>
          <button onClick={() => setSortOrder('desc')} className={`sort-btn ${sortOrder === 'desc' ? 'active' : ''}`}>Z-A</button>
        </div>
        <div className="per-page-container">
          <label htmlFor="items-per-page">Item per halaman:</label>
          <select id="items-per-page" value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))}>
            <option value="6">6</option>
            <option value="12">12</option>
            <option value="18">18</option>
          </select>
        </div>
      </section>

      <section className="toga-grid">
        {paginatedData.length > 0 ? (
          paginatedData.map(tanaman => <TogaCard key={tanaman.id} tanaman={tanaman} />)
        ) : (
          <p className="no-data">Tanaman tidak ditemukan.</p>
        )}
      </section>

      <nav className="pagination-container">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button key={page} onClick={() => setCurrentPage(page)} className={`page-btn ${currentPage === page ? 'active' : ''}`}>
            {page}
          </button>
        ))}
      </nav>
    </Layout>
  );
}

// Fungsi ini berjalan di server saat build time
export async function getStaticProps() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase.from('tanaman').select('*').order('nama', { ascending: true });

  if (error) {
    console.error('Error fetching data from Supabase:', error);
    return { props: { initialTanaman: [] } };
  }

  return {
    props: {
      initialTanaman: data,
    },
    revalidate: 3600, // Regenerate halaman setiap 1 jam jika ada perubahan data
  };
}