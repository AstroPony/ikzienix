import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Admin — ikzienix', template: '%s — Admin' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#f5f5f5' }}>
      {children}
    </div>
  );
}
