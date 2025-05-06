import { useRouter } from 'next/navigation';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  return (
    <div className="container py-5">
      <h1 className="display-4 mb-4">Order Details</h1>
      <p className="lead">Order ID: <strong>{id}</strong></p>
      <p>Order details and tracking info will be shown here.</p>
      <button className="btn btn-secondary mt-3" onClick={() => router.push('/orders')}>
        Back to Orders
      </button>
    </div>
  );
} 