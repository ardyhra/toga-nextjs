// pages/admin/form.js
import AdminLayout from '@/components/admin/AdminLayout';
import TogaForm from '@/components/admin/TogaForm'; // Impor komponen form yang baru
import { useRouter } from 'next/router';

export default function FormPage() {
    const router = useRouter();
    const { id } = router.query;
    const isEditMode = Boolean(id);
    
    const title = isEditMode ? 'Edit Tanaman' : 'Tambah Tanaman';

    return (
        <AdminLayout title={title}>
            <TogaForm />
        </AdminLayout>
    );
}