import { render, screen } from '@testing-library/react';
import AdminOrdersPage from './page';

describe('AdminOrdersPage', () => {
  it('renders the admin orders heading and text', () => {
    render(<AdminOrdersPage />);
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load orders')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
  });
}); 