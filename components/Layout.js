// components/Layout.js
import Link from 'next/link';
import Head from 'next/head';

export default function Layout({ children, title = 'Database TOGA Sambiroto' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Ensiklopedia Tanaman Obat Keluarga Kelurahan Sambiroto" />
      </Head>

      <header>
        <h1>Database TOGA Sambiroto</h1>
        <Link href="/admin" className="admin-login-btn">
          Login Admin
        </Link>
      </header>

      <main>{children}</main>

      <footer>
        <p>&copy; {new Date().getFullYear()} KKN-T 118 UNDIP & Kelurahan Sambiroto</p>
      </footer>
    </>
  );
}