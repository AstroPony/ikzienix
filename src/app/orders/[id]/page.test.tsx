import { render, screen } from '@testing-library/react';
import OrderDetailsPage from './page';

describe('OrderDetailsPage', () => {
  it('renders the order details heading and order ID', () => {
    render(<OrderDetailsPage params={{ id: 'test123' }} />);
    expect(screen.getByText('Order Details')).toBeInTheDocument();
    expect(screen.getByText(/Order ID:.*test123/)).toBeInTheDocument();
  });
}); 