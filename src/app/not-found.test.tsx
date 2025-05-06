import { render, screen } from '@testing-library/react';
import NotFoundPage from './not-found';

describe('NotFoundPage', () => {
  it('renders the 404 heading and Go Home button', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Go Home/i })).toBeInTheDocument();
  });
}); 