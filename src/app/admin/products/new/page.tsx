import AdminNav from '@/components/admin/AdminNav';
import NewProductForm from '@/components/admin/NewProductForm';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'New Product' };

export default function NewProductPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <AdminNav />
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          {'// new product'}
        </p>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '2rem', color: '#f5f5f5' }}>
          Create product
        </h1>
        <NewProductForm />
      </div>
    </div>
  );
}
