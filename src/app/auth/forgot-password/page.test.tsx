import { render, screen } from '@testing-library/react';
import ForgotPasswordPage from './page';

// TODO: Skipped due to Firebase/auth issues. Revisit and fix these tests later.
describe('ForgotPasswordPage', () => {
  test.skip('should render forgot password page', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Reset Link/i })).toBeInTheDocument();
  });
}); 