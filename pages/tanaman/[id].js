// pages/tanaman/[id].js
import { createClient } from '@supabase/supabase-js';
import Layout from '../../components/Layout';
import Image from 'next/image';
import Link from 'next/link'; // 

export default function DetailTanaman({ tanaman }) {
  if (!tanaman) {
    return (
      <Layout title="Tanaman Tidak Ditemukan">
        <div className="detail-container">
          <h2>Tanaman tidak ditemukan</h2>
          <p>Maaf, data untuk tanaman ini tidak dapat ditemukan.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${tanaman.nama} - Database TOGA`}>
      <div className="detail-container">
        <div style={{ marginBottom: '1.5rem' }}>
              <Link href="/" className="btn-back">
                  &larr; Kembali ke Daftar
              </Link>
        </div>
        <Image
          src={tanaman.gambar || '/placeholder.png'}
          alt={tanaman.nama}
          width={800}
          height={300}
          className="detail-img"
          style={{ objectFit: 'cover' }}
        />
        <h2>{tanaman.nama}</h2>
        <p><i>{tanaman.namaLatin}</i></p>

        <h4>Deskripsi</h4>
        <p>{tanaman.deskripsiSingkat}</p>

        <h4>Manfaat & Khasiat</h4>
        <p>{tanaman.manfaat}</p>

        <h4>Cara Pengolahan</h4>
        <p>{tanaman.caraPengolahan}</p>
      </div>
    </Layout>
  );
}

// Fungsi ini berjalan di server saat build time untuk membuat daftar path
export async function getStaticPaths() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase.from('tanaman').select('id');
  
  const paths = data.map(tanaman => ({
    params: { id: tanaman.id.toString() },
  }));

  return { paths, fallback: 'blocking' }; // 'blocking' akan men-generate halaman jika diakses tapi belum ada
}

// Fungsi ini berjalan di server untuk setiap path yang didefinisikan di atas
export async function getStaticProps({ params }) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase
    .from('tanaman')
    .select('*')
    .eq('id', params.id)
    .single();

  return {
    props: {
      tanaman: data,
    },
    revalidate: 3600,
  };
}