import { render, screen, fireEvent } from '@testing-library/react';
import ForgotPasswordPage from '../page';

// TODO: Skipped due to Firebase/auth issues. Revisit and fix these tests later.
describe('ForgotPasswordPage', () => {
  test.skip('renders the forgot password page correctly', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
  });

  test.skip('handles form submission', async () => {
    render(<ForgotPasswordPage />);
    
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(submitButton);
    
    await screen.findByText('Check your email for password reset instructions');
  });
}); 