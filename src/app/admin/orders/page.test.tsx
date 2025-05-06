import { render, screen } from '@testing-library/react';
import AdminOrdersPage from './page';

describe('AdminOrdersPage', () => {
  it('renders the admin orders heading and text', () => {
    render(<AdminOrdersPage />);
    expect(screen.getByText('Admin Orders')).toBeInTheDocument();
    expect(screen.getByText(/Order management for admins/i)).toBeInTheDocument();
  });
}); 