import { render, screen } from '@testing-library/react';
import ForgotPasswordPage from './page';

describe('ForgotPasswordPage', () => {
  it('renders the forgot password heading and form', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Reset Link/i })).toBeInTheDocument();
  });
}); 