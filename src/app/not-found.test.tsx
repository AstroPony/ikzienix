import { render, screen } from '@testing-library/react';
import NotFoundPage from './not-found';

describe('NotFoundPage', () => {
  it('renders the 404 heading and Go Home button', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Sorry, the page you are looking for does not exist or has been moved.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Go Home/i })).toHaveAttribute('href', '/');
  });
}); 