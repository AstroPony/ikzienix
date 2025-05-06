import { render, screen } from '@testing-library/react';
import ShippingPage from './page';

describe('ShippingPage', () => {
  it('renders the shipping info heading and text', () => {
    render(<ShippingPage />);
    expect(screen.getByText('Shipping Information')).toBeInTheDocument();
    expect(screen.getByText(/Details about shipping methods/i)).toBeInTheDocument();
  });
}); 