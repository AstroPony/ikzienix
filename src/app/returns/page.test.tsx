import { render, screen } from '@testing-library/react';
import ReturnsPage from './page';

describe('ReturnsPage', () => {
  it('renders the returns heading and text', () => {
    render(<ReturnsPage />);
    expect(screen.getByText('Returns & Refunds')).toBeInTheDocument();
    expect(screen.getByText(/Information about returns/i)).toBeInTheDocument();
  });
}); 