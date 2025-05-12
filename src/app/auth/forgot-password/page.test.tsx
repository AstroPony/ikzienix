// TODO: Skipped due to Firebase/auth issues. Revisit and fix these tests later.
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordPage from '../page';

describe('ForgotPasswordPage', () => {
  test.skip('renders the forgot password page correctly', () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
  });

  test.skip('handles form submission', async () => {
    render(<ForgotPasswordPage />);
    
    const emailInput = screen.getByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    const submitButton = screen.getByRole('button', { name: 'Reset Password' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Check your email for reset instructions')).toBeInTheDocument();
    });
  });
}); 