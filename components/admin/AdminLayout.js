// components/admin/AdminLayout.js
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

export default function AdminLayout({ children, title }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jika loading selesai dan tidak ada user, redirect ke login
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Tampilkan loading screen sederhana
  if (loading || !user) {
    return (
        <div className="loading-screen">
            <p>Memuat...</p>
        </div>
    );
  }

  // Jika sudah login, tampilkan layout admin
  return (
    <>
      <Head>
        <title>{title} - Admin Panel</title>
      </Head>
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <nav>
          <span>Halo, {user.email}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </nav>
      </header>
      <main className="admin-dashboard">
        {children}
      </main>
    </>
  );
}