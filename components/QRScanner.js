// components/QRScanner.js
import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/router';

export default function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isScanning) return;

    const html5QrCode = new Html5Qrcode('qr-reader');
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      console.log(`Scan berhasil: ${decodedText}`);
      html5QrCode.stop().then(() => {
        setIsScanning(false);
      }).catch(err => console.error("Gagal menghentikan scanner.", err));
      
      // Validasi dan navigasi
      try {
        const url = new URL(decodedText);
        if (url.pathname.startsWith('/tanaman/')) {
          router.push(url.pathname);
        } else {
          alert("QR Code tidak valid atau bukan untuk halaman tanaman.");
        }
      } catch (e) {
        alert("Format QR Code tidak valid.");
      }
    };
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    html5QrCode.start({ facingMode: 'environment' }, config, qrCodeSuccessCallback)
      .catch(err => console.error("Gagal memulai scanner", err));

    // Cleanup function untuk menghentikan scanner saat komponen unmount
    return () => {
      html5QrCode.stop().catch(err => {});
    };
  }, [isScanning, router]);

  return (
    <div className="scan-section">
      <button onClick={() => setIsScanning(prev => !prev)} className="btn-add">
        {isScanning ? 'Tutup Scanner' : 'Scan QR Code Tanaman'}
      </button>
      <div id="qr-reader" style={{ display: isScanning ? 'block' : 'none' }}></div>
    </div>
  );
}