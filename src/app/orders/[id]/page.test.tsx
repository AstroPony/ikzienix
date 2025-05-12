import { render, screen } from '@testing-library/react';
import OrderDetailsPage from './page';

describe('OrderDetailsPage', () => {
  it('renders the order details heading and order ID', () => {
    render(<OrderDetailsPage params={{ id: 'test123' }} />);
    expect(screen.getByText('Order Details')).toBeInTheDocument();
    expect(screen.getByText('test123')).toBeInTheDocument();
    expect(screen.getByText('Order details and tracking info will be shown here.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to Orders/i })).toBeInTheDocument();
  });
}); 