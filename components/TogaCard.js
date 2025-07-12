// components/TogaCard.js
import Link from 'next/link';
import Image from 'next/image';

export default function TogaCard({ tanaman }) {
  return (
    <Link href={`/tanaman/${tanaman.id}`} className="toga-card">
      <Image
        src={tanaman.gambar || '/placeholder.png'} // Gunakan placeholder jika gambar tidak ada
        alt={`Gambar ${tanaman.nama}`}
        width={300}
        height={180}
        style={{ objectFit: 'cover' }}
      />
      <div className="toga-card-content">
        <h3>{tanaman.nama}</h3>
        <p>{tanaman.deskripsiSingkat}</p>
      </div>
    </Link>
  );
}